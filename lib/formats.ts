export type TranscriptChunk = {
  text: string;
  timestamp: [number, number | null];
};

export function toText(chunks: TranscriptChunk[]): string {
  return chunks
    .map((c) => c.text.trim())
    .filter(Boolean)
    .join(" ");
}

function pad(n: number, len = 2): string {
  return String(Math.floor(n)).padStart(len, "0");
}

function srtTime(seconds: number): string {
  const total = Math.max(0, seconds);
  const ms = Math.round((total - Math.floor(total)) * 1000);
  const s = Math.floor(total) % 60;
  const m = Math.floor(total / 60) % 60;
  const h = Math.floor(total / 3600);
  return `${pad(h)}:${pad(m)}:${pad(s)},${pad(ms, 3)}`;
}

function vttTime(seconds: number): string {
  const total = Math.max(0, seconds);
  const ms = Math.round((total - Math.floor(total)) * 1000);
  const s = Math.floor(total) % 60;
  const m = Math.floor(total / 60) % 60;
  const h = Math.floor(total / 3600);
  return `${pad(h)}:${pad(m)}:${pad(s)}.${pad(ms, 3)}`;
}

export function toSrt(chunks: TranscriptChunk[]): string {
  return chunks
    .filter((c) => c.text.trim())
    .map((c, i) => {
      const start = c.timestamp[0] ?? 0;
      const end = c.timestamp[1] ?? start + 2;
      return `${i + 1}\n${srtTime(start)} --> ${srtTime(end)}\n${c.text.trim()}\n`;
    })
    .join("\n");
}

export function toVtt(chunks: TranscriptChunk[]): string {
  const body = chunks
    .filter((c) => c.text.trim())
    .map((c) => {
      const start = c.timestamp[0] ?? 0;
      const end = c.timestamp[1] ?? start + 2;
      return `${vttTime(start)} --> ${vttTime(end)}\n${c.text.trim()}\n`;
    })
    .join("\n");
  return `WEBVTT\n\n${body}`;
}
