"use client";

import React, { useState } from 'react';
import { NexusNode } from '@/lib/types';

interface GraphNodeProps {
  node: NexusNode;
  x: number;
  y: number;
  isSelected: boolean;
  isHighlighted: boolean;
  isCore: boolean;
  scanHighlighted?: boolean;
  scanModeActive?: boolean;
  onPointerDown: (e: React.PointerEvent) => void;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
}

export function GraphNode({
  node,
  x,
  y,
  isSelected,
  isHighlighted,
  isCore,
  scanHighlighted,
  scanModeActive,
  onPointerDown,
  onPointerEnter,
  onPointerLeave,
}: GraphNodeProps) {
  const [isDragging, setIsDragging] = useState(false);
  const radiusByType: Record<string, number> = {
    core: 32,
    skill: 20,
    project: 18,
    concept: 22,
  };
  const fillByType: Record<string, string> = {
    core: 'rgb(34, 211, 238)',
    skill: 'rgb(96, 165, 250)',
    project: 'rgb(251, 191, 36)',
    concept: 'rgb(192, 132, 252)',
  };
  const r = radiusByType[node.type] || 18;
  const fill = fillByType[node.type] || 'rgb(192, 132, 252)';

  let opacity: number;
  if (scanModeActive && !scanHighlighted) {
    opacity = 0.3;
  } else if (scanHighlighted) {
    opacity = 1;
  } else if (isHighlighted || isCore) {
    opacity = 1;
  } else if (isSelected) {
    opacity = 0.9;
  } else {
    opacity = 0.5;
  }

  const label = node.label || '';
  const truncatedLabel =
    label.length > 16 ? label.slice(0, 16) + '…' : label;

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    onPointerDown(e);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  return (
    <g
      transform={`translate(${x},${y})`}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    >
      <circle
        r={r}
        fill={fill}
        opacity={opacity}
        stroke={scanHighlighted ? '#22d3ee' : isSelected ? 'white' : 'transparent'}
        strokeWidth={scanHighlighted ? 3 : 2}
        className={"transition-all duration-200" + (scanHighlighted ? " animate-pulse-glow" : "")}
      />
      <text
        y={r + 14}
        textAnchor="middle"
        fill="white"
        style={{ fontSize: 11 }}
        pointerEvents="none"
      >
        {truncatedLabel}
      </text>
    </g>
  );
}
