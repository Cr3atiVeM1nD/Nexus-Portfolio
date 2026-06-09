export function getRelationBadgeClasses(relation: string): string {
  const baseRelation = relation.replace(/ \(incoming\)$/, "");
  switch (baseRelation) {
    case "powers":
      return "bg-amber-500/20 text-amber-400";
    case "contains":
      return "bg-blue-500/20 text-blue-400";
    case "related-to":
      return "bg-green-500/20 text-green-400";
    case "evolves-into":
      return "bg-purple-500/20 text-purple-400";
    default:
      return "bg-gray-500/20 text-gray-400";
  }
}

export function getGaugeStrokeColor(value: number): string {
  if (value > 80) return "rgb(52 211 153)";
  if (value > 60) return "rgb(251 191 36)";
  return "rgb(248 113 113)";
}

export const STATUS_STYLES: Record<string, string> = {
  production: "bg-green-500/20 text-green-400",
  development: "bg-blue-500/20 text-blue-400",
  experiment: "bg-amber-500/20 text-amber-400",
  concept: "bg-purple-500/20 text-purple-400",
  archived: "bg-gray-500/20 text-gray-400",
};
