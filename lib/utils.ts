import type { NexusData, NexusNode, Edge, ProjectDetail, RelatedNode } from "./types";
import nodesData from "../data/nodes.json";
import edgesData from "../data/edges.json";
import projectsData from "../data/projects.json";

const VALID_NODE_TYPES = ["core", "skill", "project", "concept"] as const;
const VALID_RELATIONS = ["powers", "contains", "related-to", "evolves-into"] as const;

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isNumber(value: unknown): value is number {
  return typeof value === "number" && !Number.isNaN(value);
}

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

export function validateNexusData(data: unknown): NexusData {
  assert(isObject(data), "validateNexusData: data must be an object");

  const obj = data as Record<string, unknown>;

  assert("nodes" in obj, "validateNexusData: data must have a 'nodes' property");
  assert("edges" in obj, "validateNexusData: data must have an 'edges' property");
  assert("meta" in obj, "validateNexusData: data must have a 'meta' property");

  const { nodes, edges, meta } = obj;

  assert(Array.isArray(nodes), "validateNexusData: 'nodes' must be an array");
  assert(Array.isArray(edges), "validateNexusData: 'edges' must be an array");
  assert(isObject(meta), "validateNexusData: 'meta' must be an object");

  const metaObj = meta as Record<string, unknown>;

  assert(
    "version" in metaObj && isString(metaObj.version),
    "validateNexusData: 'meta.version' must be a string"
  );
  assert(
    "lastUpdated" in metaObj && isString(metaObj.lastUpdated),
    "validateNexusData: 'meta.lastUpdated' must be a string"
  );

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    assert(isObject(node), `validateNexusData: nodes[${i}] must be an object`);
    const n = node as Record<string, unknown>;
    assert(
      "id" in n && isString(n.id),
      `validateNexusData: nodes[${i}].id must be a string`
    );
    assert(
      "type" in n && isString(n.type) && (VALID_NODE_TYPES as readonly string[]).includes(n.type),
      `validateNexusData: nodes[${i}].type must be one of ${VALID_NODE_TYPES.join(", ")}`
    );
    assert(
      "label" in n && isString(n.label),
      `validateNexusData: nodes[${i}].label must be a string`
    );
  }

  for (let i = 0; i < edges.length; i++) {
    const edge = edges[i];
    assert(isObject(edge), `validateNexusData: edges[${i}] must be an object`);
    const e = edge as Record<string, unknown>;
    assert(
      "id" in e && isString(e.id),
      `validateNexusData: edges[${i}].id must be a string`
    );
    assert(
      "source" in e && isString(e.source),
      `validateNexusData: edges[${i}].source must be a string`
    );
    assert(
      "target" in e && isString(e.target),
      `validateNexusData: edges[${i}].target must be a string`
    );
    assert(
      "relation" in e && isString(e.relation) && (VALID_RELATIONS as readonly string[]).includes(e.relation),
      `validateNexusData: edges[${i}].relation must be one of ${VALID_RELATIONS.join(", ")}`
    );
    assert(
      "strength" in e && isNumber(e.strength),
      `validateNexusData: edges[${i}].strength must be a number`
    );
  }

  return data as unknown as NexusData;
}

export function loadNexusData(): NexusData {
  const nodes = nodesData as unknown[];
  const edges = edgesData as unknown[];

  const data: NexusData = {
    nodes: nodes as NexusNode[],
    edges: edges as Edge[],
    meta: {
      version: "1.0.0",
      lastUpdated: new Date().toISOString().split("T")[0],
    },
  };

  return validateNexusData(data);
}

export function getNodeById(
  id: string,
  nodes: NexusNode[]
): NexusNode | undefined {
  const map = new Map<string, NexusNode>();
  for (const node of nodes) {
    map.set(node.id, node);
  }
  return map.get(id);
}

export function getRelatedNodes(
  nodeId: string,
  edges: Edge[],
  nodes: NexusNode[]
): NexusNode[] {
  const relatedIds = new Set<string>();

  for (const edge of edges) {
    if (edge.source === nodeId) {
      relatedIds.add(edge.target);
    }
    if (edge.target === nodeId) {
      relatedIds.add(edge.source);
    }
  }

  relatedIds.delete(nodeId);

  const nodeMap = new Map<string, NexusNode>();
  for (const n of nodes) {
    nodeMap.set(n.id, n);
  }

  return Array.from(relatedIds)
    .map((id) => nodeMap.get(id))
    .filter((n): n is NexusNode => n !== undefined);
}

export function getRelatedNodesWithEdges(
  nodeId: string,
  edges: Edge[],
  nodes: NexusNode[]
): RelatedNode[] {
  const relatedMap = new Map<string, RelatedNode>();

  for (const edge of edges) {
    let relatedNodeId: string | null = null;
    let relation: string = edge.relation;

    if (edge.source === nodeId) {
      relatedNodeId = edge.target;
    } else if (edge.target === nodeId) {
      relatedNodeId = edge.source;
      relation = `${edge.relation} (incoming)`;
    }

    if (relatedNodeId === null || relatedNodeId === nodeId) continue;

    const existing = relatedMap.get(relatedNodeId);
    if (!existing || edge.strength > existing.strength) {
      const node = nodes.find((n) => n.id === relatedNodeId);
      if (node) {
        relatedMap.set(relatedNodeId, { node, relation, strength: edge.strength });
      }
    }
  }

  return Array.from(relatedMap.values());
}

export function getProjectDetail(id: string): ProjectDetail | undefined {
  const projects = projectsData as ProjectDetail[];
  return projects.find((p) => p.id === id);
}
