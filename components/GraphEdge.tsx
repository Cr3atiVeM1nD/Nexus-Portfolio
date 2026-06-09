import React from "react";

interface GraphEdgeProps {
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  relation: "powers" | "contains" | "related-to" | "evolves-into";
  strength: number;
  highlighted: boolean;
}

const colorMap: Record<GraphEdgeProps["relation"], string> = {
  powers: "rgb(34, 211, 238)",
  contains: "rgb(115, 115, 115)",
  "related-to": "rgb(74, 222, 128)",
  "evolves-into": "rgb(168, 85, 247)",
};

export const GraphEdge: React.FC<GraphEdgeProps> = ({
  sourceX,
  sourceY,
  targetX,
  targetY,
  relation,
  strength,
  highlighted,
}) => {
  const strokeColor = colorMap[relation];
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
