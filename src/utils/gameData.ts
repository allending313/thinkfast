import type { Game, GameConfig } from "../types/game.types.ts";

// Game definitions
export const GAMES: Game[] = [
  {
    id: "reaction-test",
    name: "Reaction Test",
    description: "Test your reaction time. Click when the screen turns green!",
    icon: "⚡",
    path: "/games/reaction-test",
  },
  {
    id: "word-memory",
    name: "Word Memory",
    description: "Remember as many words as you can in a limited time.",
    icon: "📝",
    path: "/games/word-memory",
  },
  {
    id: "tile-memory",
    name: "Tile Memory",
    description: "Memorize the pattern of tiles and repeat it.",
    icon: "🧩",
    path: "/games/tile-memory",
  },
];

// Game configuration
export const GAME_CONFIGS: Record<string, GameConfig> = {
  "reaction-test": {
    id: "reaction-test",
    name: "Reaction Test",
    scoreUnit: "ms",
    isHigherBetter: false,
  },
  "word-memory": {
    id: "word-memory",
    name: "Word Memory",
    scoreUnit: "points",
    isHigherBetter: true,
  },
  "tile-memory": {
    id: "tile-memory",
    name: "Tile Memory",
    scoreUnit: "level",
    isHigherBetter: true,
  },
};
