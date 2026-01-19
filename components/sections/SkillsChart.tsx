"use client";

import { cn } from "@/lib/utils";
import { AnimatedList } from "@/components/ui/animated-list";
import { Brain, Database, Globe, Layers, Server, Terminal, Wrench } from "lucide-react";

interface Skill {
  name: string | null;
  category: string | null;
  proficiency: string | null;
  percentage: number | null;
  yearsOfExperience: number | null;
  color: string | null;
}

interface SkillsChartProps {
  skills: Skill[];
}

const Notification = ({ name, description, icon: Icon, color, time }: any) => {
  return (
    <figure
      className={cn(
        "relative mx-auto min-h-fit w-full max-w-[400px] cursor-pointer overflow-hidden rounded-2xl p-4",
        // animation styles
        "transition-all duration-200 ease-in-out hover:scale-[103%]",
        // light styles
        "bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
        // dark styles
        "transform-gpu dark:bg-transparent dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset] dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)]"
      )}
    >
      <div className="flex flex-row items-center gap-3">
        <div
          className="flex size-10 items-center justify-center rounded-2xl"
          style={{
            backgroundColor: color,
          }}
        >
          <Icon className="text-white h-5 w-5" />
        </div>
        <div className="flex flex-col overflow-hidden">
          <figcaption className="flex flex-row items-center text-lg font-medium whitespace-pre dark:text-white">
            <span className="text-sm sm:text-lg">{name}</span>
            <span className="mx-1 ms-1">·</span>
            <span className="text-xs text-gray-500">{time}</span>
          </figcaption>
          <p className="text-sm font-normal dark:text-white/60 line-clamp-1">
            {description}
          </p>
        </div>
      </div>
    </figure>
  );
};

export function SkillsChart({ skills }: SkillsChartProps) {
  // Data processing
  const coreSkills = skills?.filter(s => (s.percentage || 0) >= 60) || [];
  const groupedSkills = new Map<string, Skill[]>();
  for (const skill of coreSkills) {
    const category = skill.category || "other";
    const existing = groupedSkills.get(category) || [];
    groupedSkills.set(category, [...existing, skill]);
  }

  const categoryOrder = ["ai", "backend", "frontend", "automation", "tools", "cloud"];

  const categoryConfig: Record<string, { icon: any, color: string, label: string }> = {
    ai: { icon: Brain, color: "#7c3aed", label: "Artificial Intelligence" },
    backend: { icon: Server, color: "#3b82f6", label: "Backend Engineering" },
    frontend: { icon: Globe, color: "#10b981", label: "Frontend Development" },
    automation: { icon: Layers, color: "#f59e0b", label: "Automation Workflows" },
    tools: { icon: Wrench, color: "#f97316", label: "Dev Tools" },
    cloud: { icon: Database, color: "#06b6d4", label: "Cloud Infrastructure" },
    other: { icon: Terminal, color: "#64748b", label: "Stack Tecnológico" }
  };

  const notificationData = Array.from(groupedSkills.entries())
    .sort((a, b) => {
      const idxA = categoryOrder.indexOf(a[0].toLowerCase());
      const idxB = categoryOrder.indexOf(b[0].toLowerCase());
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return a[0].localeCompare(b[0]);
    })
    .map(([category, categorySkills]) => {
      const config = categoryConfig[category.toLowerCase()] || categoryConfig.other;
      const skillNames = categorySkills.slice(0, 5).map(s => s.name).join(", ");
      const totalExp = Math.max(...categorySkills.map(s => s.yearsOfExperience || 0));

      return {
        name: config.label,
        description: skillNames,
        icon: config.icon,
        color: config.color,
        time: `${totalExp}+y`
      };
    });

  return (
    <div className="relative flex max-h-[400px] min-h-[400px] w-full flex-col overflow-hidden p-2">
      <AnimatedList delay={1500}>
        {notificationData.map((item, idx) => (
          <Notification key={idx} {...item} />
        ))}
      </AnimatedList>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-zinc-950/30 to-transparent" />
    </div>
  );
}
