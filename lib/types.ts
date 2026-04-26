export type Pillar = "health" | "business" | "relationships" | "energy" | "fun";

export const PILLARS: { key: Pillar; label: string; color: string; hint: string }[] = [
  { key: "health", label: "Health", color: "#6F8B6E", hint: "Sleep, movement, nutrition" },
  { key: "business", label: "Business", color: "#5A7B8E", hint: "Output, clarity, alignment" },
  { key: "relationships", label: "Relationships", color: "#C49B7C", hint: "Friends, dating, family" },
  { key: "energy", label: "Energy & Mood", color: "#D4A04C", hint: "How you feel" },
  { key: "fun", label: "Fun & Novelty", color: "#B07AAC", hint: "Play, newness, spark" },
];

export interface WeeklyAudit {
  weekStart: string; // ISO date (Monday)
  scores: Record<Pillar, number>;
  reflections: {
    energized: string;
    drained: string;
    aligned: string;
    forced: string;
  };
  decisions: {
    doubleDown: string;
    fixOrRemove: string;
    experiment: string;
  };
  updatedAt: string;
}

export interface DailyEntry {
  date: string; // ISO date YYYY-MM-DD
  morning: {
    moved: boolean | null;
    win: string;
  };
  midday: {
    deepWork: boolean | null;
    outcome: string;
  };
  evening: {
    disconnected: boolean | null;
    energy: number | null; // 1-10
  };
  notes: string;
  updatedAt: string;
}

export type EnergyTag = "energizing" | "neutral" | "draining";
export type EnergyKind = "activity" | "person" | "task";

export interface EnergyEntry {
  id: string;
  label: string;
  kind: EnergyKind;
  tag: EnergyTag;
  note?: string;
  createdAt: string;
}

export type DayType = "deep" | "creative" | "admin" | "life";

export const DAY_TYPES: Record<DayType, { label: string; color: string; description: string }> = {
  deep: { label: "Deep Work / Build", color: "#5A7B8E", description: "Focus, building, output" },
  creative: { label: "Creative / Expansion", color: "#B07AAC", description: "Ideation, exploration" },
  admin: { label: "Admin / Light Work", color: "#7B7E8A", description: "Wrap-up, ops, light" },
  life: { label: "Life / Social / Novelty", color: "#C49B7C", description: "People, play, rest" },
};

export const WEEKDAYS: { key: number; short: string; full: string; defaultType: DayType }[] = [
  { key: 1, short: "Mon", full: "Monday", defaultType: "deep" },
  { key: 2, short: "Tue", full: "Tuesday", defaultType: "deep" },
  { key: 3, short: "Wed", full: "Wednesday", defaultType: "deep" },
  { key: 4, short: "Thu", full: "Thursday", defaultType: "creative" },
  { key: 5, short: "Fri", full: "Friday", defaultType: "admin" },
  { key: 6, short: "Sat", full: "Saturday", defaultType: "life" },
  { key: 0, short: "Sun", full: "Sunday", defaultType: "life" },
];

export interface IdealWeekDay {
  type: DayType;
  intentions: string[];
}

export type IdealWeek = Record<number, IdealWeekDay>;

export interface FunEntry {
  weekStart: string; // ISO Monday
  newThing: { done: boolean; note: string };
  socialExpansion: { done: boolean; note: string };
  spontaneous: { done: boolean; note: string };
  updatedAt: string;
}

export interface RelationshipEntry {
  id: string;
  name: string;
  context: string;
  matchEnergy: boolean;
  alignValues: boolean;
  feelsLighter: boolean;
  notes?: string;
  createdAt: string;
}

export interface BusinessIdea {
  id: string;
  title: string;
  realProblem: boolean;
  movesToSale: boolean;
  systemizable: boolean;
  notes?: string;
  createdAt: string;
}

// Per-pillar curated items: small recurring "nurture" actions
// or larger bucket-list priorities (with optional target date).
export type PillarItemKind = "practice" | "priority";

export interface PillarItem {
  id: string;
  pillar: Pillar;
  kind: PillarItemKind;
  label: string;
  notes?: string;
  // For practices: optional cadence hint ("daily", "weekly", "ad-hoc")
  cadence?: "daily" | "weekly" | "monthly" | "adhoc";
  // For priorities: optional target month (YYYY-MM) or specific date (YYYY-MM-DD)
  targetDate?: string;
  done?: boolean;
  createdAt: string;
}

// Weekly commitment: which PillarItems am I committing to nurture this week.
export interface WeeklyCommitment {
  weekStart: string; // ISO Monday
  itemIds: string[];
  doneIds: string[];
  updatedAt: string;
}
