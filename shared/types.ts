export type Language = 'en' | 'ja';
export type Role = 'trainee' | 'customer';

export interface ChatMessage {
  role: Role;
  content: string;
}

export const MAX_TRAINEE_TURNS = 5;
export const MIN_TRAINEE_TURNS = 3;
export const MAX_MESSAGE_CHARS = 600;
export const MAX_MESSAGES = MAX_TRAINEE_TURNS * 2 + 1;

export type ProviderMode = 'guided' | 'gemini';

export interface ConfigResponse {
  mode: ProviderMode;
  model: string | null;
  speech: boolean;
  languages: Language[];
  maxTraineeTurns: number;
  minTraineeTurns: number;
}

export interface ChatResponse {
  reply: string;
  mode: ProviderMode;
  /** Customer mood after this turn: 0 = upset, 1 = calm. */
  mood: number;
}

export interface Criterion {
  id: 'P1' | 'P2' | 'P3' | 'P4' | 'P5';
  title: string;
  earned: number;
  possible: number;
  /** Exact trainee quotation supporting the score, or null when none exists. */
  evidence: string | null;
  improvement: string;
}

export interface Feedback {
  total: number;
  possible: number;
  criteria: Criterion[];
  summary: string;
  mode: ProviderMode;
}

export interface ApiError {
  error: string;
}
