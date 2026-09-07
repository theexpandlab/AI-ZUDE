import * as React from "react";

/**
 * Illustrated, faceless flat-character avatars for the team, drawn as inline SVG
 * so there are no photographs of the team on the site (deliberate choice) and no
 * external image dependencies. On-brand with the "blueprints among the stars"
 * palette. Swap for professionally illustrated characters any time by replacing
 * these variants.
 */
export type AvatarVariant = "edielynne" | "jhon" | "lisa" | "bench";

type Look = { bg: string; accent: string; skin: string; hair: string; clothes: string };

const LOOKS: Record<Exclude<AvatarVariant, "bench">, Look> = {
  edielynne: { bg: "#12224e", accent: "#6C8FFF", skin: "#E7C6A6", hair: "#33263f", clothes: "#2E5AE0" },
  jhon: { bg: "#122a4e", accent: "#5B84FF", skin: "#C98E63", hair: "#1d212b", clothes: "#3B6BFF" },
  lisa: { bg: "#2f2340", accent: "#E8A87C", skin: "#EAD0B4", hair: "#5a3b24", clothes: "#C77F53" },
};

function Person({ variant, look }: { variant: "edielynne" | "jhon" | "lisa"; look: Look }) {
  return (
    <>
      {/* shoulders / clothing */}
      <path d="M18 120 C18 96 40 86 60 86 C80 86 102 96 102 120 Z" fill={look.clothes} />
      {/* neck */}
      <rect x="52" y="70" width="16" height="18" rx="6" fill={look.skin} />
      {/* head */}
      <circle cx="60" cy="52" r="23" fill={look.skin} />
      {/* hair, per variant */}
      {variant === "jhon" && (
        <path d="M37 50 C37 33 51 27 60 27 C69 27 83 33 83 50 C83 42 74 38 60 38 C46 38 37 42 37 50 Z" fill={look.hair} />
      )}
      {variant === "edielynne" && (
        <>
          <path d="M35 56 C33 34 49 26 60 26 C71 26 87 34 85 56 C85 46 82 40 82 40 C82 40 80 36 60 36 C40 36 38 40 38 40 C38 40 35 46 35 56 Z" fill={look.hair} />
          <path d="M35 52 C31 66 33 78 36 84 L44 84 C40 74 40 62 41 54 Z" fill={look.hair} />
          <path d="M85 52 C89 66 87 78 84 84 L76 84 C80 74 80 62 79 54 Z" fill={look.hair} />
        </>
      )}
      {variant === "lisa" && (
        <>
          {/* bun */}
          <circle cx="60" cy="24" r="9" fill={look.hair} />
          <path d="M38 50 C38 33 51 30 60 30 C69 30 82 33 82 50 C82 43 73 40 60 40 C47 40 38 43 38 50 Z" fill={look.hair} />
        </>
      )}
    </>
  );
}

export function Avatar({ variant, size = 72 }: { variant: AvatarVariant; size?: number }) {
  const accent =
    variant === "bench" ? "#8EA6FF" : LOOKS[variant].accent;
  const bg = variant === "bench" ? "#122048" : LOOKS[variant].bg;
  const id = React.useId();
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      role="img"
      aria-label={variant === "bench" ? "Specialist contractor bench" : `Illustrated avatar`}
      style={{ display: "block", borderRadius: "50%", boxShadow: `0 0 24px -8px ${accent}` }}
    >
      <defs>
        <radialGradient id={`g-${id}`} cx="50%" cy="34%" r="80%">
          <stop offset="0%" stopColor={bg} />
          <stop offset="100%" stopColor="#0a1230" />
        </radialGradient>
        <clipPath id={`c-${id}`}>
          <circle cx="60" cy="60" r="60" />
        </clipPath>
      </defs>
      <g clipPath={`url(#c-${id})`}>
        <rect width="120" height="120" fill={`url(#g-${id})`} />
        {/* faint blueprint grid */}
        <g stroke="rgba(124,150,232,0.14)" strokeWidth="1">
          <path d="M30 0V120M60 0V120M90 0V120M0 30H120M0 60H120M0 90H120" />
        </g>
        {variant === "bench" ? (
          // A small constellation of specialists rather than one person.
          <g>
            <line x1="42" y1="52" x2="72" y2="40" stroke={accent} strokeWidth="1.5" opacity="0.6" />
            <line x1="72" y1="40" x2="80" y2="74" stroke={accent} strokeWidth="1.5" opacity="0.6" />
            <line x1="80" y1="74" x2="42" y2="52" stroke={accent} strokeWidth="1.5" opacity="0.6" />
            <line x1="80" y1="74" x2="52" y2="86" stroke={accent} strokeWidth="1.5" opacity="0.6" />
            {[
              [42, 52, 7],
              [72, 40, 9],
              [80, 74, 7],
              [52, 86, 6],
            ].map(([cx, cy, r], i) => (
              <circle key={i} cx={cx} cy={cy} r={r} fill={accent} />
            ))}
          </g>
        ) : (
          <Person variant={variant} look={LOOKS[variant]} />
        )}
      </g>
      <circle cx="60" cy="60" r="59" fill="none" stroke={accent} strokeOpacity="0.45" strokeWidth="1.5" />
    </svg>
  );
}
