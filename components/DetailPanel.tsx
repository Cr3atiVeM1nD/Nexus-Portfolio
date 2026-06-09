"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import {
  type NexusNode,
  type NexusNode as NexusNodeType,
  type Edge,
  type SkillNode,
} from "@/lib/types";
import { getRelatedNodesWithEdges, getProjectDetail } from "@/lib/utils";
import { SkillDetail } from "./SkillDetail";
import { ProjectDetail } from "./ProjectDetail";
import { ConceptDetail } from "./ConceptDetail";
import { CoreDetail } from "./CoreDetail";

interface DetailPanelProps {
  node: NexusNode | null;
  allNodes: NexusNodeType[];
  allEdges: Edge[];
  onClose: () => void;
  onNavigate: (id: string) => void;
}


export function DetailPanel({
  node,
  allNodes,
  allEdges,
  onClose,
  onNavigate,
}: DetailPanelProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (node) {
      const timer = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(timer);
    } else {
      setVisible(false);
    }
  }, [node]);

  useEffect(() => {
    if (!node) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [node, onClose]);

  if (!node) return null;

  const relatedNodes = getRelatedNodesWithEdges(node.id, allEdges, allNodes);

  const renderContent = () => {
    switch (node.type) {
      case "skill":
        return (
          <SkillDetail
            node={node}
            relatedNodes={relatedNodes}
            onNavigate={onNavigate}
          />
        );
      case "project":
        return (
          <ProjectDetail
            node={node}
            detail={getProjectDetail(node.id)}
            skillNodes={allNodes.filter((n): n is import("@/lib/types").SkillNode => n.type === "skill" && node.skills?.includes(n.id))}
            relatedNodes={relatedNodes}
            onNavigate={onNavigate}
          />
        );
      case "concept":
        return (
          <ConceptDetail
            node={node}
            relatedNodes={relatedNodes}
            skillNodes={allNodes.filter((n): n is SkillNode => n.type === "skill")}
            onNavigate={onNavigate}
          />
        );
      case "core":
        const skillCount = allNodes.filter(n => n.type === "skill").length;
        const projectCount = allNodes.filter(n => n.type === "project").length;
        const conceptCount = allNodes.filter(n => n.type === "concept").length;
        return (
          <CoreDetail
            node={node}
            relatedNodes={relatedNodes}
            onNavigate={onNavigate}
            skillCount={skillCount}
            projectCount={projectCount}
            conceptCount={conceptCount}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-lg bg-neutral-950 border-l border-neutral-800 z-50 overflow-y-auto transition-all duration-300 ease-in-out ${
          visible ? "translate-x-0 scale-100 opacity-100" : "translate-x-full scale-95 opacity-0"
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        {renderContent()}
      </div>
    </>
  );
}
