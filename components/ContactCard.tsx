"use client";
import { type ContactNode } from "@/lib/types";

interface ContactCardProps {
  node: ContactNode;
  isSelected: boolean;
}

export function ContactCard({ node, isSelected }: ContactCardProps) {
  return (
    <div
      className={`bg-neutral-900 border rounded-xl p-5 transition-all duration-200 hover:border-neutral-700 ${
        isSelected
          ? "border-cyan-400 ring-2 ring-cyan-400"
          : "border-neutral-800"
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-white font-semibold">{node.label}</h3>
        <span className="text-xs bg-cyan-500/20 text-cyan-400 rounded-full px-2 py-0.5 shrink-0">
          Contact
        </span>
      </div>
      <p className="text-sm text-gray-300 line-clamp-2 mb-3">{node.description}</p>
      <div className="space-y-1 text-sm">
        {node.email ? (
          <p className="text-gray-400">
            <span className="text-gray-500">Email:</span> {node.email}
          </p>
        ) : (
          <p className="text-gray-500 italic">Email: Coming Soon</p>
        )}
        {node.github ? (
          <p className="text-gray-400">
            <span className="text-gray-500">GitHub:</span> {node.github}
          </p>
        ) : (
          <p className="text-gray-500 italic">GitHub: Coming Soon</p>
        )}
        {node.linkedin ? (
          <p className="text-gray-400">
            <span className="text-gray-500">LinkedIn:</span> {node.linkedin}
          </p>
        ) : (
          <p className="text-gray-500 italic">LinkedIn: Coming Soon</p>
        )}
      </div>
    </div>
  );
}
