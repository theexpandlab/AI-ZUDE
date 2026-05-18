"use client";

import { useRef, useState } from "react";
import PageHeader from "@/components/PageHeader";
import { toText, toSrt, toVtt, type TranscriptChunk } from "@/lib/formats";

const MODELS = [
  {
    id: "Xenova/whisper-tiny",
    label: "Tiny — ~150MB · fastest · multilingual",
  },
  {
    id: "Xenova/whisper-base",
    label: "Base — ~290MB · balanced · multilingual",
  },
  {
    id: "Xenova/whisper-small",
    label: "Small — ~970MB · slowest · best accuracy · multilingual",
  },
];

const MAX_BYTES = 10 * 1024 * 1024 * 1024; // 10GB hard cap

async function decodeToMono16k(
  file: File,
  onStatus: (s: string) => void
): Promise<Float32Array> {
  onStatus("Reading file into memory");
  const buf = await file.arrayBuffer();

  onStatus("Decoding audio");
  const AC: typeof AudioContext =
    (window as any).AudioContext || (window as any).webkitAudioContext;
  const tmpCtx = new AC();
  let decoded: AudioBuffer;
  try {
    decoded = await tmpCtx.decodeAudioData(buf);
  } finally {
    tmpCtx.close();
  }

  onStatus("Resampling to 16kHz mono");
  const targetRate = 16000;
  const length = Math.max(1, Math.ceil(decoded.duration * targetRate));
  const offline = new OfflineAudioContext(1, length, targetRate);
  const src = offline.createBufferSource();
  src.buffer = decoded;
  src.connect(offline.destination); // multi-channel auto-downmixes to mono
  src.start(0);
  const rendered = await offline.startRendering();
  return rendered.getChannelData(0);
}

export default function TranscribePage() {
  const [file, setFile] = useState<File | null>(null);
  const [model, setModel] = useState(MODELS[0].id);
  const [status, setStatus] = useState<string>("");
  const [progress, setProgress] = useState<number>(0);
  const [busy, setBusy] = useState(false);
  const [chunks, setChunks] = useState<TranscriptChunk[] | null>(null);
  const [error, setError] = useState<string>("");
  const startedAt = useRef<number>(0);

  async function run() {
    if (!file) return;
    setBusy(true);
    setError("");
    setChunks(null);
    setProgress(0);
    startedAt.current = Date.now();

    try {
      const { pipeline, env } = await import("@xenova/transformers");
      env.allowLocalModels = false;

      setStatus("Loading model (first run downloads from Hugging Face CDN)");
      const pipe = await pipeline("automatic-speech-recognition", model, {
        progress_callback: (p: any) => {
          if (p?.status === "progress" && typeof p.progress === "number") {
            setProgress(p.progress);
            const file = p.file ? ` · ${p.file}` : "";
            setStatus(`Downloading model${file} · ${Math.round(p.progress)}%`);
          } else if (p?.status === "ready") {
            setStatus("Model ready");
            setProgress(0);
          }
        },
      });

      const audio = await decodeToMono16k(file, setStatus);
      const minutes = audio.length / 16000 / 60;
      setStatus(
        `Transcribing ${minutes.toFixed(1)} min of audio · this can take a while`
      );

      const result: any = await pipe(audio, {
        chunk_length_s: 30,
        stride_length_s: 5,
        return_timestamps: true,
      });

      const out = Array.isArray(result) ? result[0] : result;
      const outChunks: TranscriptChunk[] = out?.chunks?.length
        ? out.chunks
        : [{ text: out?.text ?? "", timestamp: [0, null] }];

      setChunks(outChunks);
      const elapsed = ((Date.now() - startedAt.current) / 1000).toFixed(0);
      setStatus(`Done in ${elapsed}s`);
    } catch (e: any) {
      console.error(e);
      const msg = e?.message ?? String(e);
      setError(
        msg.toLowerCase().includes("decode")
          ? `Couldn't decode audio from this file. Try converting it to mp3, wav, m4a, or ogg first. (${msg})`
          : msg
      );
      setStatus("Error");
    } finally {
      setBusy(false);
    }
  }

  function download(content: string, filename: string, mime: string) {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  const fileBase = file ? file.name.replace(/\.[^.]+$/, "") : "transcript";
  const sizeMb = file ? file.size / (1024 * 1024) : 0;

  return (
    <>
      <PageHeader
        eyebrow="Tools"
        title="Transcription"
        subtitle="Drop in an audio or video file, get a transcript back. Runs entirely in your browser — nothing uploaded, no API key, free."
      />

      <section className="card mb-6">
        <label className="label mb-2 block">Model</label>
        <select
          className="field mb-4"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          disabled={busy}
        >
          {MODELS.map((m) => (
            <option key={m.id} value={m.id}>
              {m.label}
            </option>
          ))}
        </select>

        <label className="label mb-2 block">Audio or video file</label>
        <input
          type="file"
          accept="audio/*,video/*"
          className="field"
          onChange={(e) => {
            const f = e.target.files?.[0] ?? null;
            setChunks(null);
            setError("");
            if (f && f.size > MAX_BYTES) {
              setFile(null);
              setError("File exceeds the 10 GB cap.");
              return;
            }
            setFile(f);
          }}
          disabled={busy}
        />

        {file && (
          <div className="text-xs text-muted mt-2 leading-relaxed">
            <span className="text-ink/90">{file.name}</span> ·{" "}
            {sizeMb < 1024
              ? `${sizeMb.toFixed(1)} MB`
              : `${(sizeMb / 1024).toFixed(2)} GB`}
            {sizeMb > 500 && (
              <span className="block text-amber-300/90 mt-1">
                Heads up — large files are limited by your browser&apos;s memory.
                In practice ~1–2 GB is the ceiling on most devices, even though
                the input accepts up to 10 GB. For multi-hour recordings, split
                the file first or use a desktop tool.
              </span>
            )}
          </div>
        )}

        <div className="mt-4 flex items-center gap-3 flex-wrap">
          <button
            className="btn-primary disabled:opacity-50"
            onClick={run}
            disabled={!file || busy}
          >
            {busy ? "Working…" : "Transcribe"}
          </button>
          {status && (
            <span className="text-xs text-muted">{status}</span>
          )}
        </div>

        {busy && progress > 0 && (
          <div className="mt-3 h-1.5 w-full rounded-full bg-white/[.06] overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-expandSoft to-expand transition-[width]"
              style={{ width: `${Math.min(100, progress)}%` }}
            />
          </div>
        )}

        {error && (
          <div className="mt-4 text-sm text-red-300/90 leading-relaxed">
            {error}
          </div>
        )}
      </section>

      {chunks && (
        <section className="card">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <button
              className="btn-primary"
              onClick={() =>
                download(toText(chunks), `${fileBase}.txt`, "text/plain")
              }
            >
              Download .txt
            </button>
            <button
              className="btn"
              onClick={() =>
                download(
                  toSrt(chunks),
                  `${fileBase}.srt`,
                  "application/x-subrip"
                )
              }
            >
              Download .srt
            </button>
            <button
              className="btn"
              onClick={() =>
                download(toVtt(chunks), `${fileBase}.vtt`, "text/vtt")
              }
            >
              Download .vtt
            </button>
          </div>
          <textarea
            className="field font-mono text-xs whitespace-pre-wrap"
            rows={20}
            readOnly
            value={toText(chunks)}
          />
        </section>
      )}

      <section className="text-xs text-muted/80 mt-6 leading-relaxed max-w-2xl">
        How it works: the audio is decoded in your browser, downsampled to 16
        kHz mono, then transcribed with an open-source Whisper model running
        locally via WebAssembly. The model downloads once (cached after that).
        Nothing leaves your device.
      </section>
    </>
  );
}
