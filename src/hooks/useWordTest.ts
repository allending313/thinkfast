import { useState, useCallback, useEffect, type SetStateAction } from "react";
import { WORDS } from "../utils/wordBank";

type GameState = "ready" | "memorize" | "recall" | "complete";

export function useWordMemory() {
  const [gameState, setGameState] = useState<GameState>("ready");
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [wordsList, setWordsList] = useState<string[]>([]);
  const [seenWords, setSeenWords] = useState<string[]>([]);
  const [currentWord, setCurrentWord] = useState<string>("");
  const [correctAnswers, setCorrectAnswers] = useState<number>(0);
  const [totalAnswered, setTotalAnswered] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  // Get a random word that hasn't been used yet
  const getRandomWord = useCallback(() => {
    const unusedWords = WORDS.filter(
      (word) => !wordsList.includes(word) && !seenWords.includes(word)
    );
    if (unusedWords.length === 0)
      return WORDS[Math.floor(Math.random() * WORDS.length)];
    return unusedWords[Math.floor(Math.random() * unusedWords.length)];
  }, [wordsList, seenWords]);

  // Reset the game
  const resetGame = useCallback(() => {
    setGameState("ready");
    setCurrentLevel(1);
    setWordsList([]);
    setSeenWords([]);
    setCurrentWord("");
    setCorrectAnswers(0);
    setTotalAnswered(0);
    setTimeLeft(0);
  }, []);

  // Start a new level
  const startLevel = useCallback(() => {
    // Generate words to memorize based on the current level
    const wordsToMemorize: SetStateAction<string[]> = [];
    const numWords = Math.min(currentLevel + 2, 15); // Cap at 15 words max

    for (let i = 0; i < numWords; i++) {
      wordsToMemorize.push(getRandomWord());
    }

    setWordsList(wordsToMemorize);
    setSeenWords((prev) => [...prev, ...wordsToMemorize]);
    setGameState("memorize");
    setTimeLeft(numWords * 2); // 2 seconds per word to memorize
  }, [currentLevel, getRandomWord]);

  // Start the recall phase
  const startRecall = useCallback(() => {
    setGameState("recall");
    setCurrentWord(getRandomWord());
    setTotalAnswered(0);
  }, [getRandomWord]);

  // Answer whether the current word was in the list
  const answerWord = useCallback(
    (wasInList: boolean) => {
      const correct = wordsList.includes(currentWord) === wasInList;

      if (correct) {
        setCorrectAnswers((prev) => prev + 1);
      }

      setTotalAnswered((prev) => prev + 1);

      // Show 10 words per round for recall
      if (totalAnswered < 9) {
        setCurrentWord(getRandomWord());
      } else {
        // End of level
        const accuracy = correctAnswers / 10;

        if (accuracy >= 0.7) {
          // 70% accuracy required to advance
          setCurrentLevel((prev) => prev + 1);
        }

        setGameState("complete");
      }
    },
    [currentWord, wordsList, totalAnswered, correctAnswers, getRandomWord]
  );

  // Timer for memorization phase
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (gameState === "memorize" && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (gameState === "memorize" && timeLeft === 0) {
      startRecall();
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [gameState, timeLeft, startRecall]);

  // Start the game
  const startGame = useCallback(() => {
    resetGame();
    startLevel();
  }, [resetGame, startLevel]);

  // Continue to next level
  const nextLevel = useCallback(() => {
    startLevel();
  }, [startLevel]);

  return {
    gameState,
    currentLevel,
    wordsList,
    currentWord,
    correctAnswers,
    totalAnswered,
    timeLeft,
    startGame,
    answerWord,
    nextLevel,
    resetGame,
  };
}
