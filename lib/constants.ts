// Node visualization constants
export const NODE_RADIUS: Record<string, number> = {
  core: 32,
  skill: 20,
  project: 18,
  concept: 22,
  contact: 22,
};

export const NODE_FILL: Record<string, string> = {
  core: "rgb(34, 211, 238)",
  skill: "rgb(96, 165, 250)",
  project: "rgb(251, 191, 36)",
  concept: "rgb(192, 132, 252)",
  contact: "rgb(34, 211, 238)",
};

export const COLLIDE_RADIUS: Record<string, number> = {
  core: 42,
  skill: 30,
  project: 28,
  concept: 32,
  contact: 32,
};

export const EDGE_COLORS: Record<string, string> = {
  powers: "rgb(34, 211, 238)",
  contains: "rgb(115, 115, 115)",
  "related-to": "rgb(74, 222, 128)",
  "evolves-into": "rgb(168, 85, 247)",
};

export const GAUGE_THRESHOLDS = {
  high: 80,
  medium: 60,
  highColor: "rgb(52 211 153)",
  mediumColor: "rgb(251 191 36)",
  lowColor: "rgb(248 113 113)",
};

export const GAUGE_RADIUS = 40;
export const GAUGE_CIRCUMFERENCE = 2 * Math.PI * GAUGE_RADIUS;

export const ANIMATION_DELAY_STEP = 80;

export const STATUS_STYLES: Record<string, string> = {
  production: "bg-green-500/20 text-green-400",
  development: "bg-blue-500/20 text-blue-400",
  experiment: "bg-amber-500/20 text-amber-400",
  concept: "bg-purple-500/20 text-purple-400",
  archived: "bg-gray-500/20 text-gray-400",
};
