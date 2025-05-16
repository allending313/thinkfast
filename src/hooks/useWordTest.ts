import { useState, useCallback, useEffect } from "react";
import { WORDS } from "../utils/wordBank";
import { useScores } from "./useScores";

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
  const [health, setHealth] = useState<number>(3); // Start with 3 health points
  const { addScore } = useScores();

  // Get a random word that hasn't been used yet
  const getRandomWord = useCallback(() => {
    const unusedWords = WORDS.filter((word) => !seenWords.includes(word));
    if (unusedWords.length === 0)
      return WORDS[Math.floor(Math.random() * WORDS.length)];
    return unusedWords[Math.floor(Math.random() * unusedWords.length)];
  }, [seenWords]);

  // Get a random word for the recall phase
  const getRecallWord = useCallback(() => {
    // Decide whether to show a seen word or a new word
    // Higher chance of seen words at the beginning when the seenWords list is short
    const seenWordsWeighting = Math.min(0.7, 0.4 + (1 / seenWords.length) * 3);
    const showSeenWord =
      Math.random() < seenWordsWeighting || totalAnswered === 0;

    if (showSeenWord && seenWords.length > 0) {
      // Show a word from the seen words list
      return seenWords[Math.floor(Math.random() * seenWords.length)];
    } else {
      // Show a word that hasn't been seen yet
      const unusedWords = WORDS.filter((word) => !seenWords.includes(word));
      if (unusedWords.length === 0) {
        return WORDS[Math.floor(Math.random() * WORDS.length)];
      }
      return unusedWords[Math.floor(Math.random() * unusedWords.length)];
    }
  }, [seenWords, totalAnswered]);

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
    setHealth(3);
  }, []);

  // Start a new level
  const startLevel = useCallback(() => {
    // Generate words to memorize based on the current level
    const wordsToMemorize: string[] = [];
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
    setCurrentWord(getRecallWord());
    setTotalAnswered(0);
    setCorrectAnswers(0);
  }, [getRecallWord]);

  // Answer whether the current word was in the list
  const answerWord = useCallback(
    (wasInList: boolean) => {
      const isWordInList = seenWords.includes(currentWord);
      const correct = isWordInList === wasInList;

      if (correct) {
        setCorrectAnswers((prev) => prev + 1);
      } else {
        // Reduce health on incorrect answer
        setHealth((prev) => prev - 1);

        // Game over if health reaches 0
        if (health <= 1) {
          addScore("word-memory", currentLevel);
          setGameState("complete");
          return;
        }
      }

      setTotalAnswered((prev) => prev + 1);

      // Show 10 words per round for recall
      if (totalAnswered < 9) {
        setCurrentWord(getRecallWord());
      } else {
        // End of level
        setCurrentLevel((prev) => prev + 1);
        setGameState("complete");
        addScore("word-memory", currentLevel);
      }
    },
    [
      currentWord,
      seenWords,
      totalAnswered,
      health,
      currentLevel,
      getRecallWord,
      addScore,
    ]
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
    health,
    startGame,
    answerWord,
    nextLevel,
    resetGame,
  };
}
