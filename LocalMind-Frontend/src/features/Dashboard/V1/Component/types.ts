export type AgentType = "" | "planner" | "executor";

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
