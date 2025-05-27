import { useState, useEffect, useCallback, useRef } from "react";
import { useScores } from "./useScores";

type GameState = "ready" | "waiting" | "clickNow" | "tooEarly" | "complete";

export function useReactionTest() {
  const [gameState, setGameState] = useState<GameState>("ready");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [showKeyboardHint, setShowKeyboardHint] = useState<boolean>(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { addScore } = useScores();

  // Check if device is mobile
  useEffect(() => {
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
    setShowKeyboardHint(!isMobile);
  }, []);

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
    const delay = Math.floor(Math.random() * 4000) + 900;

    timeoutRef.current = setTimeout(() => {
      // Use performance.now() for more accurate timing
      setStartTime(performance.now());
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
      // Use performance.now() for more accurate timing
      const endTime = performance.now();
      const reaction = Math.round(endTime - startTime);
      setReactionTime(reaction);
      setGameState("complete");
      addScore("reaction-test", reaction);
    }
  }, [gameState, startTime, addScore]);

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

  // Handle keyboard events for spacebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.key === " ") {
        e.preventDefault(); // Prevent page scrolling
        handleGameClick();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [gameState, handleGameClick]); // Re-add listener when gameState changes

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
    showKeyboardHint,
  };
}
