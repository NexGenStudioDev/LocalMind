import React from "react";

export type Agent = {
  id: number;
  name: string;
  type: string;
  systemPrompt: string;
  priority: number;
  enabled: boolean;
};

type Props = {
  agent: Agent;
  onChange: (agent: Agent) => void;
  onRemove: () => void;
};

const AgentCard: React.FC<Props> = ({ agent, onChange, onRemove }) => {
  return (
    <div style={{ border: "1px solid #333", padding: 12, marginBottom: 12 }}>
      <input
        placeholder="Agent name"
        value={agent.name}
        onChange={(e) => onChange({ ...agent, name: e.target.value })}
      />

      <br />

      <select
        value={agent.type}
        onChange={(e) => onChange({ ...agent, type: e.target.value })}
      >
        <option value="">Select type</option>
        <option value="planner">Planner</option>
        <option value="executor">Executor</option>
      </select>

      <br />

      <textarea
        placeholder="System prompt"
        value={agent.systemPrompt}
        onChange={(e) =>
          onChange({ ...agent, systemPrompt: e.target.value })
        }
      />

      <br />

      <input
        type="number"
        value={agent.priority}
        onChange={(e) =>
          onChange({ ...agent, priority: Number(e.target.value) })
        }
      />

      <br />

      <label>
        <input
          type="checkbox"
          checked={agent.enabled}
          onChange={(e) =>
            onChange({ ...agent, enabled: e.target.checked })
          }
        />
        Enabled
      </label>

      <br />

      <button onClick={onRemove}>Remove</button>
    </div>
  );
};

export default AgentCard;
