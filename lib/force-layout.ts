import { COLLIDE_RADIUS } from "@/lib/constants";
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

export interface SimulationNode extends SimulationNodeDatum {
  id: string;
  type: string;
  label: string;
}

export interface SimulationLink extends SimulationLinkDatum<SimulationNode> {
  id: string;
  relation: string;
  strength: number;
  sourceId: string;
  targetId: string;
}

export function createSimulation(
  data: NexusData,
  width: number,
  height: number
): {
  sim: Simulation<SimulationNode, SimulationLink>;
  nodes: SimulationNode[];
  links: SimulationLink[];
} {
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
  const links: SimulationLink[] = data.edges.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    relation: e.relation,
    strength: e.strength,
    sourceId: e.source,
    targetId: e.target,
  }));

  const sim = forceSimulation(nodes)
    .force(
      "link",
      forceLink(links)
        .id((d) => (d as unknown as SimulationNode).id)
        .distance(120)
    )
    .force("charge", forceManyBody().strength(-300))
    .force("center", forceCenter(width / 2, height / 2))
    .force(
      "collide",
      forceCollide().radius((d) => {
          const node = d as unknown as SimulationNode;
          return COLLIDE_RADIUS[node.type] || 30;
        })
    )
    .alpha(1);

  return { sim, nodes, links };
}
