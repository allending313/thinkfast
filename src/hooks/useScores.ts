import { useState, useEffect } from "react";
import type { GameScore } from "../types/game.types";

// Key for storing scores in localStorage
const SCORES_STORAGE_KEY = "game_platform_scores";

export function useScores() {
  // Initialize state from localStorage or empty array
  const [scores, setScores] = useState<GameScore[]>(() => {
    const savedScores = localStorage.getItem(SCORES_STORAGE_KEY);
    return savedScores ? JSON.parse(savedScores) : [];
  });

  // Update localStorage when scores change
  useEffect(() => {
    localStorage.setItem(SCORES_STORAGE_KEY, JSON.stringify(scores));
  }, [scores]);

  // Add a new score
  const addScore = (
    gameId: string,
    score: number,
    metadata?: Record<string, any>
  ) => {
    const newScore: GameScore = {
      gameId,
      score,
      timestamp: Date.now(),
      metadata,
    };

    setScores((prevScores) => [...prevScores, newScore]);
    return newScore;
  };

  // Get scores for a specific game
  const getScoresByGame = (gameId: string): GameScore[] => {
    return scores.filter((score) => score.gameId === gameId);
  };

  // Get best score for a game (higher is better by default)
  const getBestScore = (
    gameId: string,
    lowerIsBetter = false
  ): GameScore | null => {
    const gameScores = getScoresByGame(gameId);
    if (gameScores.length === 0) return null;

    return lowerIsBetter
      ? gameScores.reduce((min, score) =>
          score.score < min.score ? score : min
        )
      : gameScores.reduce((max, score) =>
          score.score > max.score ? score : max
        );
  };

  // Calculate average score for a game
  const getAverageScore = (gameId: string): number | null => {
    const gameScores = getScoresByGame(gameId);
    if (gameScores.length === 0) return null;

    const sum = gameScores.reduce((acc, score) => acc + score.score, 0);
    return sum / gameScores.length;
  };

  // Clear all scores
  const clearScores = () => {
    setScores([]);
  };

  return {
    scores,
    addScore,
    getScoresByGame,
    getBestScore,
    getAverageScore,
    clearScores,
  };
}
