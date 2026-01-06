import { useMemo, useState } from "react";
import AgentCard from "../AgentCard";

type AgentType = "" | "planner" | "executor";

export type Agent = {
  id: string;
  name: string;
  type: AgentType;
  systemPrompt: string;
  task: string;
  priority: number;
  active: boolean;
  tools: string[];
};

const MAX_AGENTS = 7;

function createAgent(): Agent {
  return {
    id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now()),
    name: "",
    type: "",
    systemPrompt: "",
    task: "",
    priority: 1,
    active: true,
    tools: [],
  };
}

export default function Agents() {
  const [agents, setAgents] = useState<Agent[]>([]);

  const canAddMore = agents.length < MAX_AGENTS;

  const headerText = useMemo(() => {
    return `Agents (${agents.length}/${MAX_AGENTS})`;
  }, [agents.length]);

  const addAgent = () => {
    setAgents((prev) => {
      if (prev.length >= MAX_AGENTS) return prev;
      return [...prev, createAgent()];
    });
  };

  const updateAgent = (index: number, updated: Agent) => {
    setAgents((prev) =>
      prev.map((a, i) =>
        i === index
          ? {
              ...updated,
              priority: Number(updated.priority) || 1,
              active: Boolean(updated.active),
            }
          : a
      )
    );
  };

  const removeAgent = (index: number) => {
    setAgents((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <h1 style={{ margin: 0 }}>{headerText}</h1>

        <div style={{ marginLeft: "auto" }}>
          <button onClick={addAgent} disabled={!canAddMore}>
            Add Agent
          </button>
        </div>
      </div>

      {agents.length === 0 ? (
        <p style={{ opacity: 0.75, margin: 0 }}>
          No agents yet. Click “Add Agent” to create one.
        </p>
      ) : (
        agents.map((agent, index) => (
          <AgentCard
            key={agent.id}
            agent={agent}
            onChange={(updated: Agent) => updateAgent(index, updated)}
            onRemove={() => removeAgent(index)}
          />
        ))
      )}
    </div>
  );
}
