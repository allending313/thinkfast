export interface Game {
  id: string;
  name: string;
  description: string;
  icon: string;
  path: string;
}

export interface GameScore {
  gameId: string;
  score: number;
  timestamp: number;
  metadata?: Record<string, any>;
}

export type ScoreUnit = "ms" | "points" | "level" | "words";

export interface GameConfig {
  id: string;
  name: string;
  scoreUnit: ScoreUnit;
  isHigherBetter: boolean; // Whether higher scores are better
}

export interface GameMetrics {
  bestScore: number | null;
  lastScore: number | null;
  averageScore: number | null;
  totalAttempts: number;
}

export type GameResults = Record<string, GameMetrics>;
