"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { type NexusData, type NodeType, type SkillCategory, type ProjectStatus, type ProjectNode } from "@/lib/types";
import { FilterBar } from "./FilterBar";
import { NodeCard } from "./NodeCard";
import { DetailPanel } from "./DetailPanel";
import { ProjectArchive } from "./ProjectArchive";
import { getProjectDetail } from "@/lib/utils";
import { Archive, MessageCircle } from "lucide-react";
import { ViewToggle } from "./ViewToggle";
import { NexusGraph } from "./NexusGraph";
import { ScanModeButton } from "./ScanModeButton";
import { SearchBar } from "./SearchBar";
import { searchNodes } from "@/lib/search";
import { ContactPanel } from "./ContactPanel";

interface NexusExplorerProps {
  data: NexusData;
}

export function NexusExplorer({ data }: NexusExplorerProps) {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [filterTypes, setFilterTypes] = useState<NodeType[]>(["skill", "project", "concept"]);
  const [filterCategory, setFilterCategory] = useState<SkillCategory | null>(null);
  const [filterStatus, setFilterStatus] = useState<ProjectStatus | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "graph">("graph");

  const filteredNodes = useMemo(() => {
    const typeFiltered = data.nodes.filter((node) => {
      if (node.type === "core") return false;
      if (!filterTypes.includes(node.type)) return false;
      if (node.type === "skill" && filterCategory !== null) {
        if (node.category !== filterCategory) return false;
      }
      if (node.type === "project" && filterStatus !== null) {
        if (node.status !== filterStatus) return false;
      }
      return true;
    });
    return searchNodes(searchQuery, typeFiltered);
  }, [data.nodes, filterTypes, filterCategory, filterStatus, searchQuery]);

  const selectedNode = useMemo(() => {
    if (!selectedNodeId) return null;
    // Contact node clicks open ContactPanel (via handleSelectNode), not DetailPanel
    if (selectedNodeId === "contact") return null;
    return data.nodes.find((n) => n.id === selectedNodeId) ?? null;
  }, [selectedNodeId, data.nodes]);

  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const [isScanMode, setIsScanMode] = useState(false);
  const [scanClusterIndex, setScanClusterIndex] = useState(-1);
  const [scanComplete, setScanComplete] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  const scanClusterOrder: SkillCategory[] = [
    "ai-systems",
    "automation",
    "research-engines",
    "trading-systems",
    "game-experiments",
    "visual-interfaces",
    "business-tools",
    "future-concepts",
  ];

  const projectNodes = useMemo(() => {
    return data.nodes.filter((n): n is ProjectNode => n.type === "project");
  }, [data.nodes]);

  const projectDetails = useMemo(() => {
    return projectNodes.map((pn) => getProjectDetail(pn.id)).filter(Boolean) as import("@/lib/types").ProjectDetail[];
  }, [projectNodes]);

  const skillNodes = useMemo(() => {
    return data.nodes.filter((n) => n.type === "skill");
  }, [data.nodes]);

  const getScanStatus = (proficiency: number): string => {
    if (proficiency > 80) return "online";
    if (proficiency > 60) return "active";
    if (proficiency > 40) return "prototype";
    return "experimental";
  };

  const scanStatusText = useMemo(() => {
    if (!isScanMode || scanClusterIndex < 0) return "";
    if (scanComplete) return "Scan Complete. All Systems Nominal.";
    const currentCluster = scanClusterOrder[scanClusterIndex];
    const skillNode = data.nodes.find(
      n => n.type === "skill" && "category" in n && n.category === currentCluster
    );
    if (!skillNode || !("proficiency" in skillNode)) return `${currentCluster}: connecting...`;
    const status = getScanStatus(skillNode.proficiency as number);
    const label = skillNode.label || currentCluster;
    return `${label}: ${status}`;
  }, [isScanMode, scanClusterIndex, scanComplete, data.nodes, scanClusterOrder]);

  const currentScanCategory = useMemo(() => {
    if (!isScanMode || scanClusterIndex < 0 || scanComplete) return undefined;
    return scanClusterOrder[scanClusterIndex];
  }, [isScanMode, scanClusterIndex, scanComplete, scanClusterOrder]);

  const scanTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!isScanMode) {
      setScanClusterIndex(-1);
      setScanComplete(false);
      return;
    }

    // Start scan sequence
    let index = 0;
    setScanClusterIndex(0);

    scanTimerRef.current = setInterval(() => {
      index++;
      if (index >= scanClusterOrder.length) {
        // Scan complete
        if (scanTimerRef.current) clearInterval(scanTimerRef.current);
        setScanComplete(true);
        setScanClusterIndex(-1);
        // Auto-exit after 2 seconds
        setTimeout(() => {
          setIsScanMode(false);
          setScanComplete(false);
        }, 2000);
      } else {
        setScanClusterIndex(index);
      }
    }, 1500);

    return () => {
      if (scanTimerRef.current) {
        clearInterval(scanTimerRef.current);
        scanTimerRef.current = null;
      }
    };
  }, [isScanMode, scanClusterOrder.length]);

  const handleTypeToggle = (type: NodeType) => {
    if (isScanMode) return;
    setFilterTypes((prev) => {
      if (prev.includes(type)) {
        const next = prev.filter((t) => t !== type);
        return next.length === 0 ? prev : next;
      }
      return [...prev, type];
    });
  };

  const handleScanToggle = () => {
    if (isScanMode) {
      // Cancel scan
      setIsScanMode(false);
      setScanClusterIndex(-1);
      setScanComplete(false);
    } else {
      setIsScanMode(true);
    }
  };

  const handleSelectNode = (id: string | null) => {
    if (id === "contact") {
      setIsContactOpen(true);
      return;
    }
    setSelectedNodeId(id);
  };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="px-6 pt-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ViewToggle view={viewMode} onChange={setViewMode} />
          <ScanModeButton
            isActive={isScanMode}
            onToggle={handleScanToggle}
            isComplete={scanComplete}
          />
        </div>
        <div className="flex-1 max-w-md mx-4">
          <SearchBar onSearch={setSearchQuery} />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsContactOpen(true)}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-cyan-400 transition-colors px-4 py-2 border border-neutral-800 rounded-lg hover:border-cyan-500/30"
          >
            <MessageCircle className="w-4 h-4" />
            Contact
          </button>
          <button
            onClick={() => setIsArchiveOpen(true)}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-cyan-400 transition-colors px-4 py-2 border border-neutral-800 rounded-lg hover:border-cyan-500/30"
          >
            <Archive className="w-4 h-4" />
            Project Archive
          </button>
        </div>
      </div>
      {isScanMode && !scanComplete && (
        <div className="px-6 pt-2">
          <div className="animate-scan-status-fade text-center py-2">
            <span className="text-cyan-400 text-sm font-mono">
              {scanStatusText}
            </span>
          </div>
        </div>
      )}
      {scanComplete && (
        <div className="px-6 pt-2">
          <div className="animate-scan-status-fade text-center py-3">
            <span className="text-green-400 text-sm font-mono font-semibold">
              Scan Complete. All Systems Nominal.
            </span>
          </div>
        </div>
      )}
      <FilterBar
        activeTypes={filterTypes}
        activeCategory={filterCategory}
        activeStatus={filterStatus}
        onTypeToggle={handleTypeToggle}
        onCategoryChange={isScanMode ? () => {} : setFilterCategory}
        onStatusChange={isScanMode ? () => {} : setFilterStatus}
      />
      {viewMode === "graph" ? (
        <div className="flex-1 min-h-0 relative">
          <NexusGraph
            data={{ nodes: data.nodes, edges: data.edges, meta: data.meta }}
            selectedNodeId={selectedNodeId}
            onSelectNode={handleSelectNode}
            filteredNodeIds={filteredNodes.map(n => n.id)}
            scanClusterCategory={currentScanCategory}
            scanModeActive={isScanMode}
          />
          {viewMode === "graph" && filteredNodes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-gray-500 text-center">
                {searchQuery !== "" ? (
                  <>
                    <p>No results for &raquo;{searchQuery}&laquo;</p>
                    <p className="text-sm mt-1">Try a different term.</p>
                  </>
                ) : (
                  <p>No nodes match the current filters.</p>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        <section className="px-6 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredNodes.map((node) => (
              <NodeCard
                key={node.id}
                node={node}
                allNodes={data.nodes}
                selectedNodeId={selectedNodeId}
                onClick={handleSelectNode}
              />
            ))}
          </div>
          {filteredNodes.length === 0 && (
            <div className="text-gray-500 text-center py-12">
              {searchQuery !== "" ? (
                <>
                  <p>No results for »{searchQuery}«</p>
                  <p className="text-sm mt-1">Try a different term.</p>
                </>
              ) : (
                <p>No nodes match the current filters.</p>
              )}
            </div>
          )}
        </section>
      )}
      <ProjectArchive
        projects={projectDetails}
        projectNodes={projectNodes}
        skillNodes={skillNodes}
        isOpen={isArchiveOpen}
        onClose={() => setIsArchiveOpen(false)}
        onNavigate={handleSelectNode}
      />
      <DetailPanel
        node={selectedNode}
        allNodes={data.nodes}
        allEdges={data.edges}
        onClose={() => setSelectedNodeId(null)}
        onNavigate={handleSelectNode}
      />
      <ContactPanel
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />
    </div>
  );
}
