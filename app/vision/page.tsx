"use client";

import { useEffect, useMemo, useState } from "react";
import PageHeader from "@/components/PageHeader";
import { useLocal, STORAGE_KEYS } from "@/lib/storage";
import { GOAL_CATEGORIES, type Pillar, type VisionItem } from "@/lib/types";
import { uid } from "@/lib/id";
import { detectVisionType, visionItemThumbnailHint } from "@/lib/vision-url";

type CategoryKey = Pillar | "finance" | "all";

const FILTERS: { key: CategoryKey; label: string; color?: string }[] = [
  { key: "all", label: "All" },
  ...GOAL_CATEGORIES.filter((c) => c.key !== "other").map((c) => ({
    key: c.key as CategoryKey,
    label: c.label,
    color: c.color,
  })),
];

export default function VisionPage() {
  const [items, setItems] = useLocal<VisionItem[]>(STORAGE_KEYS.vision, []);
  const [filter, setFilter] = useState<CategoryKey>("all");
  const [adding, setAdding] = useState(false);
  const [reelIndex, setReelIndex] = useState<number | null>(null);
  const [helpOpen, setHelpOpen] = useState(false);

  const filtered = useMemo(() => {
    if (filter === "all") return items;
    return items.filter((it) => it.pillar === filter);
  }, [items, filter]);

  function addItem(partial: Omit<VisionItem, "id" | "createdAt">) {
    setItems((prev) => [
      { ...partial, id: uid(), createdAt: new Date().toISOString() },
      ...prev,
    ]);
  }

  function deleteItem(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function startReel(idx: number) {
    setReelIndex(idx);
  }

  return (
    <div>
      <PageHeader
        eyebrow="Dream vision board"
        title="See the life you're walking toward."
        subtitle="Curate the images and clips of your dream life. Play them back full-screen as an ambient reel whenever you need to remember."
        right={
          filtered.length > 0 ? (
            <button onClick={() => startReel(0)} className="btn-primary">
              Play full screen
            </button>
          ) : null
        }
      />

      <section className="card mb-6">
        <button
          type="button"
          onClick={() => setHelpOpen((h) => !h)}
          className="w-full flex items-center justify-between"
        >
          <div className="text-left">
            <div className="label">How to put yourself in the vision</div>
            <div className="text-xs text-muted mt-0.5">
              Generate AI clips with your face → paste the URL here
            </div>
          </div>
          <span className="text-muted text-xs">{helpOpen ? "Hide" : "Show"}</span>
        </button>
        {helpOpen && (
          <div className="mt-4 space-y-3 text-sm text-ink/90">
            <p className="text-muted">
              The app holds your vision. For clips that include <em>you</em>, generate
              them with an AI video tool and paste the result here. A starting list:
            </p>
            <ul className="grid sm:grid-cols-2 gap-2 text-sm">
              {[
                { name: "Pika", url: "https://pika.art", note: "Free tier · stylized video gen" },
                { name: "Runway", url: "https://runwayml.com", note: "Pro-grade · Gen-3 video" },
                { name: "Sora", url: "https://sora.com", note: "OpenAI text/image-to-video" },
                { name: "HeyGen", url: "https://heygen.com", note: "AI avatars in scenes" },
                { name: "Google Veo", url: "https://deepmind.google/technologies/veo/", note: "Long, cinematic clips" },
                { name: "Kling AI", url: "https://kling.kuaishou.com/", note: "Photo + reference video" },
              ].map((t) => (
                <li key={t.name}>
                  <a
                    href={t.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between border border-white/[.08] bg-white/[.02] rounded-xl px-3 py-2 hover:bg-white/[.06] transition"
                  >
                    <span>
                      <span className="font-medium text-ink">{t.name}</span>
                      <span className="text-muted text-xs block">{t.note}</span>
                    </span>
                    <span className="text-muted text-xs">Open ↗</span>
                  </a>
                </li>
              ))}
            </ul>
            <p className="text-muted text-xs">
              For dreamy stock footage without yourself:{" "}
              <a
                href="https://www.pexels.com/videos/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                Pexels
              </a>
              ,{" "}
              <a
                href="https://unsplash.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                Unsplash
              </a>
              ,{" "}
              <a
                href="https://pixabay.com/videos/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                Pixabay
              </a>
              . Open a clip, right-click → copy video URL, paste below.
            </p>
            <div className="text-muted text-xs">
              Tip: for any video you generate, host it somewhere with a direct URL
              (Vimeo unlisted is great), then paste the share link.
            </div>
          </div>
        )}
      </section>

      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <div className="flex gap-1.5 flex-wrap">
          {FILTERS.map((f) => {
            const active = filter === f.key;
            return (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={
                  "px-3 py-1.5 rounded-full text-xs transition border flex items-center gap-2 " +
                  (active
                    ? "bg-ink/90 text-canvas border-ink"
                    : "bg-white/[.03] border-white/[.08] text-ink/80 hover:bg-white/[.07]")
                }
              >
                {f.color && (
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: f.color }}
                  />
                )}
                {f.label}
              </button>
            );
          })}
        </div>
        <button
          onClick={() => setAdding(true)}
          className="btn-primary"
        >
          + Add to vision
        </button>
      </div>

      {adding && <AddForm onAdd={addItem} onClose={() => setAdding(false)} />}

      {filtered.length === 0 ? (
        <EmptyState onAdd={() => setAdding(true)} hasAny={items.length > 0} />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {filtered.map((it, idx) => (
            <Tile
              key={it.id}
              item={it}
              onOpen={() => startReel(idx)}
              onDelete={() => deleteItem(it.id)}
            />
          ))}
        </div>
      )}

      {reelIndex !== null && (
        <Reel
          items={filtered}
          startIndex={reelIndex}
          onClose={() => setReelIndex(null)}
        />
      )}
    </div>
  );
}

function EmptyState({
  onAdd,
  hasAny,
}: {
  onAdd: () => void;
  hasAny: boolean;
}) {
  return (
    <div className="card text-center py-12">
      <div className="font-serif text-xl mb-2 text-ink">
        {hasAny ? "Nothing in this pillar yet." : "Your dream is a blank canvas."}
      </div>
      <p className="text-sm text-muted max-w-md mx-auto mb-5">
        {hasAny
          ? "Switch filters above, or add a new piece of vision for this pillar."
          : "Paste a video or image URL — a sunrise, a kitchen, a stage, a body, a moment you're walking toward."}
      </p>
      <button onClick={onAdd} className="btn-primary">
        + Add first piece
      </button>
    </div>
  );
}

function Tile({
  item,
  onOpen,
  onDelete,
}: {
  item: VisionItem;
  onOpen: () => void;
  onDelete: () => void;
}) {
  const pillarColor = GOAL_CATEGORIES.find((c) => c.key === item.pillar)?.color;
  const thumb = visionItemThumbnailHint(item);
  return (
    <div className="relative group rounded-xl2 overflow-hidden border border-white/[.08] bg-black/40 aspect-[4/5] cursor-pointer shadow-soft">
      <button onClick={onOpen} className="absolute inset-0">
        {item.type === "image" && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.url}
            alt={item.title || ""}
            className="absolute inset-0 w-full h-full object-cover transition group-hover:scale-[1.03]"
            loading="lazy"
          />
        )}
        {item.type === "video" && (
          <video
            src={item.url}
            className="absolute inset-0 w-full h-full object-cover"
            muted
            loop
            playsInline
            preload="metadata"
            onMouseEnter={(e) => e.currentTarget.play().catch(() => {})}
            onMouseLeave={(e) => {
              e.currentTarget.pause();
              e.currentTarget.currentTime = 0;
            }}
          />
        )}
        {(item.type === "youtube" || item.type === "vimeo") && thumb ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumb}
            alt={item.title || ""}
            className="absolute inset-0 w-full h-full object-cover transition group-hover:scale-[1.03]"
            loading="lazy"
          />
        ) : (item.type === "youtube" || item.type === "vimeo") ? (
          <div className="absolute inset-0 flex items-center justify-center text-muted text-xs">
            {item.type === "youtube" ? "YouTube clip" : "Vimeo clip"}
          </div>
        ) : null}

        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/85 to-transparent">
          {item.pillar && pillarColor && (
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-white/80 mb-1">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: pillarColor, boxShadow: `0 0 8px ${pillarColor}` }}
              />
              {GOAL_CATEGORIES.find((c) => c.key === item.pillar)?.label}
            </div>
          )}
          {item.title && (
            <div className="text-sm text-white drop-shadow truncate">{item.title}</div>
          )}
        </div>
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          if (confirm("Remove from vision?")) onDelete();
        }}
        className="absolute top-2 right-2 h-7 w-7 rounded-full bg-black/60 border border-white/20 text-white/80 text-xs opacity-0 group-hover:opacity-100 transition hover:bg-black/80"
        aria-label="Remove"
      >
        ×
      </button>
    </div>
  );
}

function AddForm({
  onAdd,
  onClose,
}: {
  onAdd: (partial: Omit<VisionItem, "id" | "createdAt">) => void;
  onClose: () => void;
}) {
  const [rawUrl, setRawUrl] = useState("");
  const [title, setTitle] = useState("");
  const [pillar, setPillar] = useState<Pillar | "finance" | "">("");
  const [error, setError] = useState<string | null>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const detected = detectVisionType(rawUrl);
    if (!detected) {
      setError(
        "Couldn't detect that URL. Use a direct image / video URL (.jpg, .mp4, .webm) or a YouTube / Vimeo link."
      );
      return;
    }
    onAdd({
      type: detected.type,
      url: detected.url,
      rawUrl: rawUrl.trim(),
      title: title.trim() || undefined,
      pillar: pillar || undefined,
    });
    setRawUrl("");
    setTitle("");
    setPillar("");
    onClose();
  }

  return (
    <form onSubmit={submit} className="card mb-5 space-y-3">
      <div className="label">Add to your vision</div>
      <input
        className="field"
        value={rawUrl}
        onChange={(e) => setRawUrl(e.target.value)}
        placeholder="Paste a URL — image, .mp4, YouTube, Vimeo, Pexels…"
        autoFocus
      />
      <div className="grid sm:grid-cols-[1fr_auto_auto] gap-2">
        <input
          className="field"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Caption (optional) — e.g. 'mornings in Lisbon'"
        />
        <select
          className="field sm:w-44"
          value={pillar}
          onChange={(e) => setPillar(e.target.value as Pillar | "finance" | "")}
        >
          <option value="">No pillar</option>
          {GOAL_CATEGORIES.filter((c) => c.key !== "other").map((c) => (
            <option key={c.key} value={c.key}>
              {c.label}
            </option>
          ))}
        </select>
        <div className="flex gap-2 sm:justify-end">
          <button type="button" onClick={onClose} className="btn">
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            Add
          </button>
        </div>
      </div>
      {error && <div className="text-xs text-rose">{error}</div>}
    </form>
  );
}

function Reel({
  items,
  startIndex,
  onClose,
}: {
  items: VisionItem[];
  startIndex: number;
  onClose: () => void;
}) {
  const [idx, setIdx] = useState(startIndex);
  const [paused, setPaused] = useState(false);
  const current = items[idx];
  const advanceMs = 7000;

  // Auto-advance for images and embeds (videos handle their own onEnded).
  useEffect(() => {
    if (paused) return;
    if (!current) return;
    if (current.type === "video") return; // video onEnded handles it
    const t = setTimeout(() => {
      setIdx((i) => (i + 1) % items.length);
    }, advanceMs);
    return () => clearTimeout(t);
  }, [idx, paused, current, items.length]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") setIdx((i) => (i + 1) % items.length);
      else if (e.key === "ArrowLeft") setIdx((i) => (i - 1 + items.length) % items.length);
      else if (e.key === " ") {
        e.preventDefault();
        setPaused((p) => !p);
      }
    }
    window.addEventListener("keydown", onKey);
    // Prevent scroll
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [items.length, onClose]);

  if (!current) return null;

  const pillarColor = GOAL_CATEGORIES.find((c) => c.key === current.pillar)?.color;

  return (
    <div className="fixed inset-0 z-50 bg-black">
      <div className="absolute inset-0 flex items-center justify-center">
        {current.type === "image" && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={current.url}
            alt={current.title || ""}
            className="max-w-full max-h-full object-contain"
            style={{ animation: "lod-fade-in 700ms ease-out both" }}
          />
        )}
        {current.type === "video" && (
          <video
            src={current.url}
            className="max-w-full max-h-full"
            autoPlay
            playsInline
            controls={false}
            muted
            onEnded={() => setIdx((i) => (i + 1) % items.length)}
            style={{ animation: "lod-fade-in 700ms ease-out both" }}
          />
        )}
        {(current.type === "youtube" || current.type === "vimeo") && (
          <iframe
            key={current.id + "-" + idx}
            src={current.url}
            title={current.title || "Vision clip"}
            className="w-full h-full"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            style={{ border: 0, animation: "lod-fade-in 700ms ease-out both" }}
          />
        )}
      </div>

      {/* Top bar */}
      <div className="absolute top-0 inset-x-0 p-4 sm:p-6 flex items-start justify-between gap-4 pointer-events-none">
        <div className="pointer-events-auto max-w-[70%]">
          {current.pillar && pillarColor && (
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.22em] text-white/80 mb-1">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: pillarColor, boxShadow: `0 0 10px ${pillarColor}` }}
              />
              {GOAL_CATEGORIES.find((c) => c.key === current.pillar)?.label}
            </div>
          )}
          {current.title && (
            <div className="font-serif text-lg sm:text-2xl text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
              {current.title}
            </div>
          )}
        </div>
        <div className="pointer-events-auto flex items-center gap-2">
          <button
            onClick={() => setPaused((p) => !p)}
            className="h-9 px-3 rounded-full bg-white/10 border border-white/20 text-white text-xs hover:bg-white/20 transition"
          >
            {paused ? "Play" : "Pause"}
          </button>
          <button
            onClick={onClose}
            className="h-9 w-9 rounded-full bg-white/10 border border-white/20 text-white text-base hover:bg-white/20 transition"
            aria-label="Close"
          >
            ×
          </button>
        </div>
      </div>

      {/* Dot indicators + navigation arrows */}
      <button
        onClick={() => setIdx((i) => (i - 1 + items.length) % items.length)}
        className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 h-12 w-12 items-center justify-center rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition"
        aria-label="Previous"
      >
        ‹
      </button>
      <button
        onClick={() => setIdx((i) => (i + 1) % items.length)}
        className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 h-12 w-12 items-center justify-center rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition"
        aria-label="Next"
      >
        ›
      </button>

      <div className="absolute bottom-5 inset-x-0 flex justify-center gap-1.5 px-4">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            className={
              "h-1.5 rounded-full transition-all " +
              (i === idx ? "w-6 bg-white" : "w-1.5 bg-white/40 hover:bg-white/70")
            }
            aria-label={`Go to ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
