import type { VisionItem, VisionItemType } from "./types";

const IMAGE_EXT = /\.(jpe?g|png|gif|webp|avif|bmp|svg)(\?|#|$)/i;
const VIDEO_EXT = /\.(mp4|webm|mov|ogv|m4v)(\?|#|$)/i;

function youtubeId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname === "youtu.be") {
      return u.pathname.slice(1) || null;
    }
    if (u.hostname.endsWith("youtube.com") || u.hostname.endsWith("youtube-nocookie.com")) {
      const v = u.searchParams.get("v");
      if (v) return v;
      // /embed/ID, /shorts/ID, /live/ID
      const parts = u.pathname.split("/").filter(Boolean);
      const idx = parts.findIndex((p) => ["embed", "shorts", "live"].includes(p));
      if (idx >= 0 && parts[idx + 1]) return parts[idx + 1];
    }
  } catch {
    return null;
  }
  return null;
}

function vimeoId(url: string): string | null {
  try {
    const u = new URL(url);
    if (!u.hostname.includes("vimeo.com")) return null;
    const parts = u.pathname.split("/").filter(Boolean);
    // /123456 or /channels/x/123456 or /groups/x/videos/123456
    const id = parts.reverse().find((p) => /^\d+$/.test(p));
    return id ?? null;
  } catch {
    return null;
  }
}

export function detectVisionType(rawUrl: string): {
  type: VisionItemType;
  url: string;
} | null {
  const trimmed = rawUrl.trim();
  if (!trimmed) return null;

  const yid = youtubeId(trimmed);
  if (yid) {
    const embed = `https://www.youtube-nocookie.com/embed/${yid}?autoplay=1&mute=1&loop=1&playlist=${yid}&controls=0&modestbranding=1&rel=0&playsinline=1`;
    return { type: "youtube", url: embed };
  }

  const vid = vimeoId(trimmed);
  if (vid) {
    const embed = `https://player.vimeo.com/video/${vid}?autoplay=1&muted=1&loop=1&background=1`;
    return { type: "vimeo", url: embed };
  }

  if (VIDEO_EXT.test(trimmed)) {
    return { type: "video", url: trimmed };
  }
  if (IMAGE_EXT.test(trimmed)) {
    return { type: "image", url: trimmed };
  }
  // Heuristic: bare URL with no extension — try as image first if it looks like a cdn image, else video.
  try {
    const u = new URL(trimmed);
    if (u.hostname.includes("unsplash.com") || u.hostname.includes("imgur.com")) {
      return { type: "image", url: trimmed };
    }
    if (u.hostname.includes("videos.pexels.com") || u.hostname.includes("pexels.com/video")) {
      return { type: "video", url: trimmed };
    }
  } catch {
    return null;
  }
  return null;
}

export function visionItemThumbnailHint(item: VisionItem): string | null {
  // For YouTube, we can build a thumbnail URL.
  if (item.type === "youtube") {
    const yid = youtubeId(item.rawUrl);
    if (yid) return `https://i.ytimg.com/vi/${yid}/hqdefault.jpg`;
  }
  return null;
}
