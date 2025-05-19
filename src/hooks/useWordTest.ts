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
  const [showMistake, setShowMistake] = useState<boolean>(false);
  const { addScore } = useScores();

  // Get a random word that hasn't been used yet
  const getRandomWord = useCallback(() => {
    const unusedWords = WORDS.filter((word) => !seenWords.includes(word));
    if (unusedWords.length === 0)
      return WORDS[Math.floor(Math.random() * WORDS.length)];
    return unusedWords[Math.floor(Math.random() * unusedWords.length)];
  }, [seenWords]);

  // Prepare words for recall phase based on the level
  const prepareRecallWords = useCallback(() => {
    // Calculate number of seen words to show - approximately (1 + 0.25 * level) seen words, max 7.5
    const targetSeenWords = Math.min(1 + 0.25 * currentLevel, 7.5);
    const numSeenWords = Math.round(targetSeenWords);

    // Total words to show in recall phase (10)
    const totalRecallWords = 10;
    const numNewWords = totalRecallWords - numSeenWords;

    // Select random seen words
    let recallSeenWords: string[] = [];
    if (seenWords.length > 0) {
      // Create a copy of seenWords to shuffle
      const shuffledSeenWords = [...seenWords].sort(() => 0.5 - Math.random());
      recallSeenWords = shuffledSeenWords.slice(0, numSeenWords);
    }

    // Select random new words that weren't seen
    const unusedWords = WORDS.filter((word) => !seenWords.includes(word));
    let recallNewWords: string[] = [];

    if (unusedWords.length >= numNewWords) {
      recallNewWords = unusedWords.slice(0, numNewWords);
    } else {
      // If not enough unseen words, just get what we can
      recallNewWords = [...unusedWords];
      // Fill remaining with random words from WORDS
      const remainingNeeded = numNewWords - recallNewWords.length;
      const randomWords = WORDS.sort(() => 0.5 - Math.random()).slice(
        0,
        remainingNeeded
      );
      recallNewWords = [...recallNewWords, ...randomWords];
    }

    // Combine and shuffle all recall words
    const allRecallWords = [...recallSeenWords, ...recallNewWords].sort(
      () => 0.5 - Math.random()
    );

    return {
      allWords: allRecallWords,
      seenWordsIncluded: recallSeenWords,
    };
  }, [currentLevel, seenWords]);

  // Prepare all recall words at the beginning of recall phase
  const [recallWords, setRecallWords] = useState<string[]>([]);
  const [recallSeenWords, setRecallSeenWords] = useState<string[]>([]);
  const [currentRecallIndex, setCurrentRecallIndex] = useState<number>(0);

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
    setShowMistake(false);
    setRecallWords([]);
    setRecallSeenWords([]);
    setCurrentRecallIndex(0);
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
    const { allWords, seenWordsIncluded } = prepareRecallWords();
    setRecallWords(allWords);
    setRecallSeenWords(seenWordsIncluded);
    setCurrentRecallIndex(0);
    setCurrentWord(allWords[0] || "");
    setGameState("recall");
    setTotalAnswered(0);
    setCorrectAnswers(0);
  }, [prepareRecallWords]);

  // Answer whether the current word was in the list
  const answerWord = useCallback(
    (wasInList: boolean) => {
      const isWordInList = recallSeenWords.includes(currentWord);
      const correct = isWordInList === wasInList;

      if (correct) {
        setCorrectAnswers((prev) => prev + 1);
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
          addScore("word-memory", currentLevel);
          setGameState("complete");
          return;
        }
      }

      setTotalAnswered((prev) => prev + 1);

      // Move to next word in recall phase
      const nextIndex = currentRecallIndex + 1;

      // Show 10 words per round for recall
      if (nextIndex < recallWords.length) {
        setCurrentRecallIndex(nextIndex);
        setCurrentWord(recallWords[nextIndex]);
      } else {
        // End of level
        setCurrentLevel((prev) => prev + 1);
        setGameState("complete");
        addScore("word-memory", currentLevel);
      }
    },
    [
      currentWord,
      recallSeenWords,
      recallWords,
      currentRecallIndex,
      health,
      currentLevel,
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
    showMistake,
    startGame,
    answerWord,
    nextLevel,
    resetGame,
  };
}
