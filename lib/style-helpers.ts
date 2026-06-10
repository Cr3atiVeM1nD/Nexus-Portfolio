import { GAUGE_THRESHOLDS, STATUS_STYLES } from "@/lib/constants";

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
  if (value > GAUGE_THRESHOLDS.high) return GAUGE_THRESHOLDS.highColor;
  if (value > GAUGE_THRESHOLDS.medium) return GAUGE_THRESHOLDS.mediumColor;
  return GAUGE_THRESHOLDS.lowColor;
}

export { STATUS_STYLES } from "@/lib/constants";
