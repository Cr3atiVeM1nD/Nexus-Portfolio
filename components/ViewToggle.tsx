import React from "react";
import { LayoutGrid, GitBranch } from "lucide-react";

interface ViewToggleProps {
  view: "grid" | "graph";
  onChange: (view: "grid" | "graph") => void;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({ view, onChange }) => {
  return (
    <div className="flex gap-0.5">
      <button
        onClick={() => onChange("grid")}
        className={`flex items-center gap-1 px-3 py-1.5 rounded-l-md transition-all duration-200 ${
          view === "grid"
            ? "bg-neutral-700 text-white ring-1 ring-cyan-400/50"
            : "bg-neutral-900 text-gray-400"
        }`}
      >
        <LayoutGrid className="w-4 h-4" />
        Grid
      </button>
      <button
        onClick={() => onChange("graph")}
        className={`flex items-center gap-1 px-3 py-1.5 rounded-r-md transition-all duration-200 ${
          view === "graph"
            ? "bg-neutral-700 text-white ring-1 ring-cyan-400/50"
            : "bg-neutral-900 text-gray-400"
        }`}
      >
        <GitBranch className="w-4 h-4" />
        Graph
      </button>
    </div>
  );
};
