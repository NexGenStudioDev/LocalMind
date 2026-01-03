export const AvailableAiModelConfigAgents = ['Google', 'groq', 'ollama', 'other']

export enum aiModelConfig_Constant {
  ALREADY_EXIST = 'AI Model Config already exists for the user.',
  AGENT_SETUP_SUCCESS = 'Agent added successfully to AI Model Config.',
  NOT_FOUND = 'AI Model Config not found for the user.',
  AGENT_NOT_FOUND = 'Agent not found in the AI Model Config.',
  ALREADY_CONFIGURED = 'AI Model Config is already configured.',
}
