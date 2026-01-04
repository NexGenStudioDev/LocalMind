import React, { useState } from "react";

/**
 * Multi-Agent Configuration Dashboard
 * Allows users to manage up to 7 AI agents
 */

const DEFAULT_AGENTS = [
  { id: 1, name: "Planner Agent", role: "Planner", active: true, priority: 1 },
  { id: 2, name: "Research Agent", role: "Researcher", active: true, priority: 2 },
  { id: 3, name: "Reasoning Agent", role: "Reasoner", active: true, priority: 3 },
  { id: 4, name: "Execution Agent", role: "Executor", active: true, priority: 4 },
  { id: 5, name: "Validation Agent", role: "Validator", active: true, priority: 5 },
  { id: 6, name: "Memory Agent", role: "Memory", active: false, priority: 6 },
  { id: 7, name: "Observer Agent", role: "Observer", active: false, priority: 7 },
];

const ROLES = [
  "Planner",
  "Researcher",
  "Reasoner",
  "Executor",
  "Validator",
  "Memory",
  "Observer",
];

export default function MultiAgentDashboard() {
  const [agents, setAgents] = useState(DEFAULT_AGENTS);

  const updateAgent = (id, updates) => {
    setAgents((prev) =>
      prev.map((agent) =>
        agent.id === id ? { ...agent, ...updates } : agent
      )
    );
  };

  const addAgent = () => {
    if (agents.length >= 7) return;

    setAgents((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: "New Agent",
        role: "Planner",
        systemPrompt: "",
        task: "",
        active: true,
        priority: prev.length + 1,
      },
    ]);
  };

  const removeAgent = (id) => {
    setAgents((prev) => prev.filter((agent) => agent.id !== id));
  };

  return (
    <div style={{ padding: "24px" }}>
      <h1>🧠 Multi-Agent Task Configuration</h1>
      <p>
        Configure how multiple AI agents collaborate to achieve a single goal.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "16px",
        }}
      >
        {agents.map((agent) => (
          <div
            key={agent.id}
            style={{
              background: "#121212",
              padding: "16px",
              borderRadius: "12px",
              border: "1px solid #2a2a2a",
              opacity: agent.active ? 1 : 0.5,
            }}
          >
            <input
              value={agent.name}
              onChange={(e) =>
                updateAgent(agent.id, { name: e.target.value })
              }
              placeholder="Agent Name"
              style={{ width: "100%", marginBottom: "8px" }}
            />

            <select
              value={agent.role}
              onChange={(e) =>
                updateAgent(agent.id, { role: e.target.value })
              }
              style={{ width: "100%", marginBottom: "8px" }}
            >
              {ROLES.map((role) => (
                <option key={role}>{role}</option>
              ))}
            </select>

            <textarea
              value={agent.systemPrompt || ""}
              placeholder="System Prompt"
              onChange={(e) =>
                updateAgent(agent.id, { systemPrompt: e.target.value })
              }
              style={{ width: "100%", marginBottom: "8px" }}
            />

            <textarea
              placeholder="Task / Instruction"
              onChange={(e) =>
                updateAgent(agent.id, { task: e.target.value })
              }
              style={{ width: "100%", marginBottom: "8px" }}
            />

            <input
              type="number"
              value={agent.priority}
              onChange={(e) =>
                updateAgent(agent.id, { priority: e.target.value })
              }
              style={{ width: "100%", marginBottom: "8px" }}
            />

            <label>
              <input
                type="checkbox"
                checked={agent.active}
                onChange={() =>
                  updateAgent(agent.id, { active: !agent.active })
                }
              />{" "}
              Active
            </label>

            {agents.length > 1 && (
              <button
                onClick={() => removeAgent(agent.id)}
                style={{
                  marginTop: "8px",
                  background: "#ff4d4d",
                  border: "none",
                  padding: "6px",
                  width: "100%",
                }}
              >
                Remove Agent
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={addAgent}
        disabled={agents.length >= 7}
        style={{ marginTop: "20px" }}
      >
        ➕ Add Agent
      </button>
    </div>
  );
}
