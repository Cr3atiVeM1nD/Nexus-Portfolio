import React from "react";
import { EDGE_COLORS } from "@/lib/constants";

interface GraphEdgeProps {
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  relation: "powers" | "contains" | "related-to" | "evolves-into";
  strength: number;
  highlighted: boolean;
}


export const GraphEdge: React.FC<GraphEdgeProps> = ({
  sourceX,
  sourceY,
  targetX,
  targetY,
  relation,
  strength,
  highlighted,
}) => {
  const strokeColor = EDGE_COLORS[relation];
  const strokeWidth = Math.max(1, strength * 2.5);
  const opacity = highlighted ? 1 : 0.3;

  return (
    <line
      x1={sourceX}
      y1={sourceY}
      x2={targetX}
      y2={targetY}
      stroke={strokeColor}
      strokeWidth={strokeWidth}
      opacity={opacity}
      className="transition-all duration-200"
      strokeLinecap="round"
    />
  );
};
