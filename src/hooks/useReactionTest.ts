import { useState, useEffect, useCallback, useRef } from "react";
import { useScores } from "./useScores";

type GameState = "ready" | "waiting" | "clickNow" | "tooEarly" | "complete";

export function useReactionTest() {
  const [gameState, setGameState] = useState<GameState>("ready");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { addScore } = useScores()

  // Clean up any timeouts when component unmounts
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Start the game
  const startGame = useCallback(() => {
    setGameState("waiting");
    setReactionTime(null);

    // Random delay
    const delay = Math.floor(Math.random() * 4000) + 750;

    timeoutRef.current = setTimeout(() => {
      setStartTime(Date.now());
      setGameState("clickNow");
    }, delay);
  }, []);

  // Handle click during the "waiting" state (too early)
  const handleEarlyClick = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setGameState("tooEarly");
  }, []);

  // Handle click during the "clickNow" state (measure reaction time)
  const handleClick = useCallback(() => {
    if (gameState === "clickNow" && startTime) {
      const endTime = Date.now();
      const reaction = endTime - startTime;
      setReactionTime(reaction);
      setGameState("complete");
      addScore("reaction-test", reaction)
    }
  }, [gameState, startTime]);

  // Handle click based on current game state
  const handleGameClick = useCallback(() => {
    switch (gameState) {
      case "ready":
        startGame();
        break;
      case "waiting":
        handleEarlyClick();
        break;
      case "clickNow":
        handleClick();
        break;
      case "tooEarly":
      case "complete":
        setGameState("ready");
        break;
      default:
        break;
    }
  }, [gameState, startGame, handleEarlyClick, handleClick]);

  // Reset the game
  const resetGame = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setGameState("ready");
    setStartTime(null);
    setReactionTime(null);
  }, []);

  return {
    gameState,
    reactionTime,
    handleGameClick,
    resetGame,
  };
}
