import { useState, useEffect, useCallback, useRef } from "react";
import { useScores } from "./useScores";

type GamePhase =
  | "ready"
  | "memorize"
  | "recall"
  | "feedback"
  | "levelComplete"
  | "gameOver";

interface Tile {
  row: number;
  col: number;
  id: string;
}

interface UseTileMemoryTestProps {
  initialSize?: number;
  initialTargetCount?: number;
  memorizeTime?: number;
  feedbackTime?: number;
}

export function useTileMemoryTest({
  initialSize = 3,
  initialTargetCount = 3,
  memorizeTime = 2000,
  feedbackTime = 500,
}: UseTileMemoryTestProps = {}) {
  // Game state
  const [gridSize, setGridSize] = useState<number>(initialSize);
  const [targetCount, setTargetCount] = useState<number>(initialTargetCount);
  const [phase, setPhase] = useState<GamePhase>("ready");
  const [level, setLevel] = useState<number>(1);
  const [health, setHealth] = useState<number>(3);
  const [targetTiles, setTargetTiles] = useState<Tile[]>([]);
  const [selectedTiles, setSelectedTiles] = useState<Tile[]>([]);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { addScore } = useScores();

  // Helper function to generate random tiles
  const generateTargetTiles = useCallback(
    (size: number, count: number): Tile[] => {
      const allPositions: Tile[] = [];

      // Generate all possible positions
      for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
          allPositions.push({ row, col, id: `${row}-${col}` });
        }
      }

      // Shuffle and select the first 'count' tiles
      return allPositions
        .sort(() => Math.random() - 0.5)
        .slice(0, count)
        .map((tile) => ({ ...tile }));
    },
    []
  );

  // Clear any active timers
  const clearTimers = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Start a new game
  const startGame = useCallback(() => {
    clearTimers();
    setGridSize(initialSize);
    setTargetCount(initialTargetCount);
    setLevel(1);
    setHealth(3);
    setSelectedTiles([]);
    setPhase("ready");
    startLevel(initialSize, initialTargetCount);
  }, [clearTimers, initialSize, initialTargetCount]);

  // Start a new level
  const startLevel = useCallback(
    (size: number, count: number) => {
      const newTargetTiles = generateTargetTiles(size, count);
      setTargetTiles(newTargetTiles);
      setSelectedTiles([]);
      setPhase("memorize");

      // Automatically switch to recall phase after memorize time
      timerRef.current = setTimeout(() => {
        setPhase("recall");
      }, memorizeTime);
    },
    [generateTargetTiles, memorizeTime]
  );

  // Handle tile click during recall phase
  const handleTileClick = useCallback(
    (tile: Tile) => {
      if (phase !== "recall") return;

      // Check if tile has already been selected
      if (selectedTiles.some((t) => t.id === tile.id)) return;

      const updatedSelectedTiles = [...selectedTiles, tile];
      setSelectedTiles(updatedSelectedTiles);

      // Check if the clicked tile is a target tile
      const isTileTarget = targetTiles.some((t) => t.id === tile.id);

      if (!isTileTarget) {
        // Wrong tile clicked
        setHealth((prev) => prev - 1);

        if (health <= 1) {
          // Game over
          setPhase("gameOver");
          addScore("tile-memory", level - 1);
        }
      } else if (
        updatedSelectedTiles.filter((t) =>
          targetTiles.some((target) => target.id === t.id)
        ).length === targetTiles.length
      ) {
        // All target tiles found
        setPhase("levelComplete");

        timerRef.current = setTimeout(() => {
          const newLevel = level + 1;
          setLevel(newLevel);

          // Every two levels, increase grid size
          const newSize = Math.min(
            12,
            Math.floor((Math.sqrt(8 * newLevel + 1) - 1) / 2) + 2
          );
          setGridSize(newSize);

          // Every level, increase target count by 1
          const newTargetCount = targetCount + 1;
          setTargetCount(newTargetCount);

          startLevel(newSize, newTargetCount);
        }, 1000);
      }
    },
    [
      phase,
      selectedTiles,
      targetTiles,
      health,
      level,
      targetCount,
      feedbackTime,
      addScore,
      startLevel,
      initialSize,
    ]
  );

  // Handle game reset
  const resetGame = useCallback(() => {
    clearTimers();
    setPhase("ready");
  }, [clearTimers]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  return {
    gridSize,
    phase,
    level,
    health,
    targetTiles,
    selectedTiles,
    startGame,
    handleTileClick,
    resetGame,
  };
}
