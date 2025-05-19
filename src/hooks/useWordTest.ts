import { useState, useCallback, useEffect } from "react";
import { WORDS } from "../utils/wordBank";
import { useScores } from "./useScores";

type GameState = "ready" | "playing" | "game-over";

export function useWordMemory() {
  const [gameState, setGameState] = useState<GameState>("ready");
  const [seenWords, setSeenWords] = useState<Set<string>>(new Set());
  const [currentWord, setCurrentWord] = useState<string>("");
  const [previousWord, setPreviousWord] = useState<string>("");
  const [score, setScore] = useState<number>(0);
  const [health, setHealth] = useState<number>(3);
  const [showMistake, setShowMistake] = useState<boolean>(false);
  const { addScore } = useScores();

  // Get a random word (that's not the same as the previous word)
  const getRandomWord = useCallback(() => {
    let newWord;
    do {
      newWord = WORDS[Math.floor(Math.random() * WORDS.length)];
    } while (newWord === previousWord);

    return newWord;
  }, [previousWord]);

  // Start the game
  const startGame = useCallback(() => {
    setGameState("playing");
    setSeenWords(new Set());
    const firstWord = getRandomWord();
    setCurrentWord(firstWord);
    setPreviousWord(firstWord);
    setScore(0);
    setHealth(3);
    setShowMistake(false);
  }, [getRandomWord]);

  // Answer whether the current word was seen before
  const answerWord = useCallback(
    (wasSeen: boolean) => {
      const isWordSeen = seenWords.has(currentWord);
      const correct = isWordSeen === wasSeen;

      if (correct) {
        // Increase score for correct answer
        setScore((prev) => prev + 1);
      } else {
        // Show mistake animation
        setShowMistake(true);

        // Reset mistake indicator after animation time
        setTimeout(() => {
          setShowMistake(false);
        }, 500);

        // Reduce health on incorrect answer
        setHealth((prev) => prev - 1);

        // Game over if health reaches 0
        if (health <= 1) {
          addScore("word-memory", score);
          setGameState("game-over");
          return;
        }
      }

      // Add current word to seen words
      setSeenWords((prev) => new Set(prev).add(currentWord));

      // Save current word as previous
      setPreviousWord(currentWord);

      // Get next word
      const nextWord = getRandomWord();
      setCurrentWord(nextWord);
    },
    [currentWord, seenWords, health, score, getRandomWord, addScore]
  );

  // Reset the game
  const resetGame = useCallback(() => {
    setGameState("ready");
    setSeenWords(new Set());
    setCurrentWord("");
    setPreviousWord("");
    setScore(0);
    setHealth(3);
    setShowMistake(false);
  }, []);

  // Try again
  const tryAgain = useCallback(() => {
    startGame();
  }, [startGame]);

  return {
    gameState,
    currentWord,
    score,
    health,
    showMistake,
    startGame,
    answerWord,
    resetGame,
    tryAgain,
  };
}
