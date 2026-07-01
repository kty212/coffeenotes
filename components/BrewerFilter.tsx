"use client";

import { brewers } from "@/data/recipes";

interface Props {
  selected: string;
  onChange: (id: string) => void;
}

export default function BrewerFilter({ selected, onChange }: Props) {
  return (
    <div className="flex gap-2 flex-wrap">
      <button
        onClick={() => onChange("all")}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          selected === "all"
            ? "bg-accent text-white"
            : "bg-tag-bg text-text-secondary hover:bg-border"
        }`}
      >
        All
      </button>
      {brewers.map((brewer) => (
        <button
          key={brewer.id}
          onClick={() => onChange(brewer.id)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selected === brewer.id
              ? "bg-accent text-white"
              : "bg-tag-bg text-text-secondary hover:bg-border"
          }`}
        >
          {brewer.name}
        </button>
      ))}
    </div>
  );
}
