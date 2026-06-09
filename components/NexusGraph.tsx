"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCenter,
  forceCollide,
  type SimulationNodeDatum,
  type SimulationLinkDatum,
  type Simulation,
} from "d3-force";
import type { NexusData } from "@/lib/types";
import { GraphNode } from "./GraphNode";
import { GraphEdge } from "./GraphEdge";

interface SimulationNode extends SimulationNodeDatum {
  id: string;
  type: string;
  label: string;
}
interface SimulationLink extends SimulationLinkDatum<SimulationNode> {
  id: string;
  relation: string;
  strength: number;
  sourceId: string;
  targetId: string;
}

interface PanState {
  active: boolean;
  lastX: number;
  lastY: number;
}
interface DragState {
  active: boolean;
  nodeId: string | null;
  startX: number;
  startY: number;
  wasDragged: boolean;
}

interface NexusGraphProps {
  data: NexusData;
  selectedNodeId: string | null;
  onSelectNode: (id: string) => void;
  filteredNodeIds?: string[];
  scanClusterCategory?: string;
  scanModeActive?: boolean;
}

export function NexusGraph({
  data,
  selectedNodeId,
  onSelectNode,
  filteredNodeIds,
  scanClusterCategory,
  scanModeActive,
}: NexusGraphProps) {
  const [simNodes, setSimNodes] = useState<SimulationNode[]>([]);
  const [simEdges, setSimEdges] = useState<
    {
      id: string;
      sourceId: string;
      targetId: string;
      sourceX: number;
      sourceY: number;
      targetX: number;
      targetY: number;
      relation: string;
      strength: number;
    }[]
  >([]);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [containerSize, setContainerSize] = useState<{
    width: number;
    height: number;
  }>({ width: 800, height: 600 });
  const [transform, setTransform] = useState<{
    x: number;
    y: number;
    scale: number;
  }>({ x: 0, y: 0, scale: 1 });

  const svgRef = useRef<SVGSVGElement | null>(null);
  const simulationRef = useRef<Simulation<SimulationNode, SimulationLink> | null>(null);
  const transformRef = useRef(transform);
  const dragRef = useRef<DragState>({
    active: false,
    nodeId: null,
    startX: 0,
    startY: 0,
    wasDragged: false,
  });
  const panRef = useRef<PanState | null>(null);
  const originalNodesRef = useRef<SimulationNode[]>([]);

  useEffect(() => {
    transformRef.current = transform;
  }, [transform]);

  // ResizeObserver
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const container = svg.parentElement;
    if (!container) return;

    const observe = () => {
      const rect = container.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setContainerSize({ width: rect.width, height: rect.height });
      }
    };
    observe();
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      setContainerSize({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      });
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // D3 simulation setup
  useEffect(() => {
    // stop old simulation
    if (simulationRef.current) {
      simulationRef.current.stop();
      simulationRef.current = null;
    }

    const width = containerSize.width || 800;
    const height = containerSize.height || 600;

    const nodes: SimulationNode[] = data.nodes.map((n) => ({
      id: n.id,
      type: n.type,
      label: n.label,
      x: width / 2 + (Math.random() - 0.5) * width * 0.5,
      y: height / 2 + (Math.random() - 0.5) * height * 0.5,
    }));

    // fix core node at centre
    const coreNode = nodes.find((n) => n.type === "core");
    if (coreNode) {
      coreNode.fx = width / 2;
      coreNode.fy = height / 2;
    }

    // Build links with string ids for d3, but keep original source/target strings
    const links = data.edges.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      relation: e.relation,
      strength: e.strength,
      sourceId: e.source,
      targetId: e.target,
    }));

    originalNodesRef.current = nodes;

    const sim = forceSimulation(nodes)
      .force(
        "link",
        forceLink(links)
          .id((d: any) => d.id)
          .distance(120)
      )
      .force("charge", forceManyBody().strength(-300))
      .force("center", forceCenter(width / 2, height / 2))
      .force(
        "collide",
        forceCollide().radius((d: any) => {
        switch (d.type) {
          case "core": return 42;
          case "skill": return 30;
          case "project": return 28;
          case "concept": return 32;
          default: return 30;
        }
      })
      )
      .alpha(1)
      .restart();

    simulationRef.current = sim;

    let rafId: number | null = null;
    sim.on("tick", () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        const updatedNodes = nodes.map((n) => ({ ...n }));
        const updatedEdges = links.map((l) => {
          const src = l.source as unknown as SimulationNode;
          const tgt = l.target as unknown as SimulationNode;
          return {
            id: l.id,
            sourceId: l.sourceId,
            targetId: l.targetId,
            sourceX: src.x ?? 0,
            sourceY: src.y ?? 0,
            targetX: tgt.x ?? 0,
            targetY: tgt.y ?? 0,
            relation: l.relation,
            strength: l.strength,
          };
        });
        setSimNodes(updatedNodes);
        setSimEdges(updatedEdges);
        rafId = null;
      });
    });

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      sim.stop();
      simulationRef.current = null;
    };
  }, [data, containerSize]);

  // Highlighted connections
  const connectedIds = useMemo(() => {
    if (!hoveredNodeId) return new Set<string>();
    const ids = new Set<string>();
    for (const edge of simEdges) {
      if (edge.sourceId === hoveredNodeId) ids.add(edge.targetId);
      if (edge.targetId === hoveredNodeId) ids.add(edge.sourceId);
    }
    return ids;
  }, [hoveredNodeId, simEdges]);

  // Scan cluster highlighted ids
  const scanHighlightedIds = useMemo(() => {
    if (!scanModeActive || !scanClusterCategory) return new Set<string>();
    const ids = new Set<string>();
    // Find all skill nodes in the current cluster
    const clusterSkillIds = data.nodes
      .filter(n => n.type === "skill" && 'category' in n && n.category === scanClusterCategory)
      .map(n => n.id);
    clusterSkillIds.forEach(id => ids.add(id));
    // Find all nodes connected to these skills
    for (const edge of data.edges) {
      if (clusterSkillIds.includes(edge.source)) ids.add(edge.target);
      if (clusterSkillIds.includes(edge.target)) ids.add(edge.source);
    }
    return ids;
  }, [scanModeActive, scanClusterCategory, data.nodes, data.edges]);

  // Filtering
  const visibleNodes = useMemo(() => {
    if (!filteredNodeIds) return simNodes;
    const coreIds = simNodes
      .filter((n) => n.type === "core")
      .map((n) => n.id);
    const set = new Set([...coreIds, ...filteredNodeIds]);
    return simNodes.filter((n) => set.has(n.id));
  }, [simNodes, filteredNodeIds]);

  const visibleEdges = useMemo(() => {
    if (!filteredNodeIds) return simEdges;
    const nodeIds = new Set(visibleNodes.map((n) => n.id));
    return simEdges.filter(
      (e) => nodeIds.has(e.sourceId) && nodeIds.has(e.targetId)
    );
  }, [simEdges, visibleNodes]);

  // Node pointer down handler (drag)
  const handleNodePointerDown = useCallback(
    (e: React.PointerEvent, nodeId: string) => {
      e.stopPropagation();
      const svg = svgRef.current;
      if (!svg) return;
      svg.setPointerCapture(e.pointerId);

      dragRef.current = {
        active: true,
        nodeId,
        startX: e.clientX,
        startY: e.clientY,
        wasDragged: false,
      };
    },
    []
  );

  // Pan / drag global event handlers
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      const drag = dragRef.current;
      if (drag.active && drag.nodeId) {
        const node = originalNodesRef.current.find(
          (n) => n.id === drag.nodeId
        );
        if (node) {
          const svg = svgRef.current;
          if (!svg) return;
          const rect = svg.getBoundingClientRect();
          const clientX = e.clientX - rect.left;
          const clientY = e.clientY - rect.top;
          const t = transformRef.current;
          const graphX = (clientX - t.x) / t.scale;
          const graphY = (clientY - t.y) / t.scale;
          node.fx = graphX;
          node.fy = graphY;
          drag.wasDragged = true;
          simulationRef.current?.alpha(0.3).restart();
        }
      } else if (panRef.current) {
        const dx = e.clientX - panRef.current.lastX;
        const dy = e.clientY - panRef.current.lastY;
        setTransform((prev) => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
        panRef.current.lastX = e.clientX;
        panRef.current.lastY = e.clientY;
      }
    };

    const handlePointerUp = (e: PointerEvent) => {
      const drag = dragRef.current;
      if (drag.active) {
        const { nodeId, wasDragged } = drag;
        if (nodeId) {
          const node = originalNodesRef.current.find(
            (n) => n.id === nodeId
          );
          if (node && wasDragged) {
            node.fx = null as any;
            node.fy = null as any;
            simulationRef.current?.alpha(0.3).restart();
          }
          if (!wasDragged) {
            onSelectNode(nodeId);
          }
        }
        dragRef.current = {
          active: false,
          nodeId: null,
          startX: 0,
          startY: 0,
          wasDragged: false,
        };
      }
      panRef.current = null;
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [onSelectNode]);

  // SVG background pointer down (start pan)
  const handleSvgPointerDown = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      panRef.current = {
        active: true,
        lastX: e.clientX,
        lastY: e.clientY,
      };
      (e.target as SVGSVGElement).setPointerCapture?.(e.pointerId);
    },
    []
  );

  // Wheel zoom
  const handleWheel = useCallback(
    (e: React.WheelEvent<SVGSVGElement>) => {
      e.preventDefault();
      const svg = svgRef.current;
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const t = transformRef.current;
      const factor = e.deltaY > 0 ? 0.9 : 1.1;
      const newScale = Math.max(0.2, Math.min(3, t.scale * factor));

      const newX = mouseX - (mouseX - t.x) * (newScale / t.scale);
      const newY = mouseY - (mouseY - t.y) * (newScale / t.scale);

      setTransform({ x: newX, y: newY, scale: newScale });
    },
    []
  );

  // Hover state update
  const handleNodePointerEnter = useCallback(
    (nodeId: string) => setHoveredNodeId(nodeId),
    []
  );
  const handleNodePointerLeave = useCallback(
    () => setHoveredNodeId(null),
    []
  );

  const transformString = `translate(${transform.x},${transform.y}) scale(${transform.scale})`;

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      style={{
        minHeight: 500,
        background: "#0a0a0a",
        display: "block",
        overflow: "hidden",
      }}
      onPointerDown={handleSvgPointerDown}
      onWheel={handleWheel}
    >
      <defs>
        <pattern
          id="grid"
          width="50"
          height="50"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="25" cy="25" r="1" fill="#262626" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
      <g transform={transformString}>
        {/* edges */}
        {visibleEdges.map((edge) => (
          <GraphEdge
            key={edge.id}
            sourceX={edge.sourceX}
            sourceY={edge.sourceY}
            targetX={edge.targetX}
            targetY={edge.targetY}
            relation={edge.relation as "powers" | "contains" | "related-to" | "evolves-into"}
            strength={edge.strength}
            highlighted={
              (scanModeActive ? (scanHighlightedIds.has(edge.sourceId) && scanHighlightedIds.has(edge.targetId)) : false) ||
              (hoveredNodeId !== null && (edge.sourceId === hoveredNodeId || edge.targetId === hoveredNodeId))
            }
          />
        ))}
        {/* nodes */}
        {visibleNodes.map((node) => {
          const realNode = data.nodes.find((n) => n.id === node.id);
          if (!realNode) return null;
          return (
            <GraphNode
              key={node.id}
              node={realNode}
              isCore={node.type === "core"}
              x={node.x ?? 0}
              y={node.y ?? 0}
              isSelected={selectedNodeId === node.id}
              isHighlighted={
                hoveredNodeId === node.id || connectedIds.has(node.id)
              }
              scanHighlighted={scanModeActive ? scanHighlightedIds.has(node.id) : false}
              scanModeActive={scanModeActive ?? false}
              onPointerDown={(e: React.PointerEvent) =>
                handleNodePointerDown(e, node.id)
              }
              onPointerEnter={() => handleNodePointerEnter(node.id)}
              onPointerLeave={handleNodePointerLeave}
            />
          );
        })}
      </g>
    </svg>
  );
}
