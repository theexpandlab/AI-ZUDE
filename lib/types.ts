export type Pillar = "health" | "business" | "relationships" | "energy" | "fun";

export const PILLARS: { key: Pillar; label: string; color: string; hint: string }[] = [
  { key: "health", label: "Health", color: "#8FCAA9", hint: "Sleep, movement, nutrition" },
  { key: "business", label: "Business", color: "#5A8FCC", hint: "Output, clarity, alignment" },
  { key: "relationships", label: "Relationships", color: "#E2A87E", hint: "Friends, dating, family" },
  { key: "energy", label: "Energy & Mood", color: "#E5C26B", hint: "How you feel" },
  { key: "fun", label: "Fun & Novelty", color: "#BCA1E8", hint: "Play, newness, spark" },
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
  deep: { label: "Deep Work / Build", color: "#5A8FCC", description: "Focus, building, output" },
  creative: { label: "Creative / Expansion", color: "#BCA1E8", description: "Ideation, exploration" },
  admin: { label: "Admin / Light Work", color: "#8B95B0", description: "Wrap-up, ops, light" },
  life: { label: "Life / Social / Novelty", color: "#E2A87E", description: "People, play, rest" },
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

export interface Profile {
  name: string;
  northStar: string;
}

// Dream Vision Board — curated images + video clips that represent the life you're building.
export type VisionItemType = "image" | "video" | "youtube" | "vimeo";

export interface VisionItem {
  id: string;
  type: VisionItemType;
  // Canonical URL used for rendering (e.g. YouTube embed URL)
  url: string;
  // Original URL pasted by the user (kept for reference)
  rawUrl: string;
  title?: string;
  pillar?: Pillar | "finance";
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
  // For practices: number of times per cadence period (e.g. 3 with cadence "weekly" = 3× per week).
  times?: number;
  // For practices: optional cadence hint ("daily", "weekly", "monthly", "adhoc")
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

// 12-week quarterly goals (Dyrdek-style). Goals can map to a Pillar
// or to extra categories like Finance.
export type GoalCategory = Pillar | "finance" | "other";

export const GOAL_CATEGORIES: { key: GoalCategory; label: string; color: string }[] = [
  { key: "health", label: "Health", color: "#8FCAA9" },
  { key: "business", label: "Business", color: "#5A8FCC" },
  { key: "relationships", label: "Relationships", color: "#E2A87E" },
  { key: "energy", label: "Energy", color: "#E5C26B" },
  { key: "fun", label: "Fun", color: "#BCA1E8" },
  { key: "finance", label: "Finance", color: "#C9A55C" },
  { key: "other", label: "Other", color: "#8B95B0" },
];

export interface QuarterConfig {
  label: string; // e.g. "Q2 2026"
  startISO: string; // Monday of week 1
}

export type GoalStatus = "on" | "risk" | "off";

export interface GoalCheckIn {
  weekStart: string;
  progress: number; // 0-100
  status: GoalStatus;
  note: string;
  createdAt: string;
}

export interface QuarterGoal {
  id: string;
  category: GoalCategory;
  title: string;
  target: string;
  why: string;
  progress: number; // 0-100 current
  microActions: { id: string; label: string; doneIds: string[] }[];
  checkIns: GoalCheckIn[];
  createdAt: string;
}
