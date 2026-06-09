"use client";

import { useState } from "react";
import { loadNexusData } from "@/lib/utils";
import type { CoreNode } from "@/lib/types";
import { CoreHero } from "@/components/CoreHero";
import { NexusExplorer } from "@/components/NexusExplorer";
import { BootScreen } from "@/components/BootScreen";

export default function Home() {
  const [bootComplete, setBootComplete] = useState(false);
  const data = loadNexusData();
  const coreNode = data.nodes.find((n) => n.type === "core") as CoreNode;

  const skillCount = data.nodes.filter((n) => n.type === "skill").length;
  const projectCount = data.nodes.filter((n) => n.type === "project").length;
  const conceptCount = data.nodes.filter((n) => n.type === "concept").length;

  if (!bootComplete) {
    return <BootScreen onComplete={() => setBootComplete(true)} />;
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col">
      <CoreHero
        node={coreNode}
        skillCount={skillCount}
        projectCount={projectCount}
        conceptCount={conceptCount}
      />
      <NexusExplorer data={data} />
    </main>
  );
}
