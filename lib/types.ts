export type NodeType = "core" | "skill" | "project" | "concept";
export type ProjectStatus = "production" | "development" | "experiment" | "concept" | "archived";
export type SkillCategory =
  | "ai-systems"
  | "automation"
  | "research-engines"
  | "trading-systems"
  | "game-experiments"
  | "visual-interfaces"
  | "business-tools"
  | "future-concepts";

export interface BaseNode {
  id: string;
  type: NodeType;
  label: string;
  description: string;
}

export interface CoreNode extends BaseNode {
  type: "core";
  subtitle: string;
  mission: string;
}

export interface SkillNode extends BaseNode {
  type: "skill";
  category: SkillCategory;
  icon: string;
  proficiency: number;
  technologies: string[];
}

export interface ProjectNode extends BaseNode {
  type: "project";
  status: ProjectStatus;
  year: number;
  url?: string;
  repo?: string;
  skills: string[];
  technologies: string[];
  highlights: string[];
  thumbnail?: string;
}

export interface ConceptNode extends BaseNode {
  type: "concept";
  status: "concept";
  feasibility: number;
  relatedSkills: string[];
}

export type NexusNode = CoreNode | SkillNode | ProjectNode | ConceptNode;

export interface Edge {
  id: string;
  source: string;
  target: string;
  relation: "powers" | "contains" | "related-to" | "evolves-into";
  strength: number;
}

export interface NexusData {
  nodes: NexusNode[];
  edges: Edge[];
  meta: {
    version: string;
    lastUpdated: string;
  };
}

export interface RelatedNode {
  node: NexusNode;
  relation: string;
  strength: number;
}

export interface ProjectDetail {
  id: string;
  title: string;
  tagline: string;
  description: string;
  longDescription: string;
  features: string[];
  techStack: { name: string; role: string }[];
  screenshots: string[];
  links: { label: string; url: string }[];
  timeline: { start: string; end?: string };
}
