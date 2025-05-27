import { useState, useCallback } from "react";
import { WORDS } from "../utils/wordBank";
import { useScores } from "./useScores";
import { RandSet } from "../utils/randSet";

type GameState = "ready" | "playing" | "game-over";

export function useWordMemory() {
  const [gameState, setGameState] = useState<GameState>("ready");
  const [seenWords, setSeenWords] = useState<RandSet>(new RandSet());
  const [currentWord, setCurrentWord] = useState<string>("");
  const [previousWord, setPreviousWord] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [health, setHealth] = useState<number>(3);
  const [seen, setSeen] = useState<boolean>(false);
  const { addScore } = useScores();

 const getRandomWord = useCallback((): [string, number, boolean] => {
   const wordCount = WORDS.length;
   let index: number;
   let fromSeen = false;

   if (Math.random() < 0.1 && seenWords.size() > 0) {
     const seenIndex = seenWords.getRandom();
     if (seenIndex !== undefined && seenIndex !== previousWord) {
       return [WORDS[seenIndex], seenIndex, true];
     }
   }

   if (wordCount <= 1) {
     return [WORDS[0], 0, seenWords.has(0)];
   }

   do {
     index = Math.floor(Math.random() * wordCount);
   } while (index === previousWord);

   fromSeen = seenWords.has(index);
   if (!fromSeen) seenWords.add(index)
   return [WORDS[index], index, fromSeen];
 }, [previousWord, seenWords]);

  // Start the game
  const startGame = useCallback(() => {
    setGameState("playing");
    setSeenWords(new RandSet());
    const firstWord = getRandomWord();
    setCurrentWord(firstWord[0]);
    setPreviousWord(0);
    setScore(0);
    setHealth(3);
    setSeen(false);
  }, [getRandomWord]);

  // Answer whether the current word was seen before
  const answerWord = useCallback(
    (correct: boolean) => {
      if (correct) {
        // Increase score for correct answer
        setScore((prev) => prev + 1);
      } else {
        // Reduce health on incorrect answer
        setHealth((prev) => prev - 1);

        // Game over if health reaches 0
        if (health <= 1) {
          addScore("word-memory", score);
          setGameState("game-over");
          return;
        }
      }

      // Get next word
      const [word, index, hasBeenSeen] = getRandomWord();
      setPreviousWord(index);
      setSeen(hasBeenSeen);
      setCurrentWord(word);
    },
    [health, score, getRandomWord, addScore]
  );

  // Reset the game
  const resetGame = useCallback(() => {
    setGameState("ready");
    setSeenWords(new RandSet());
    setCurrentWord("");
    setPreviousWord(0);
    setScore(0);
    setHealth(3);
    setSeen(false);
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
    seen,
    startGame,
    answerWord,
    resetGame,
    tryAgain,
  };
}
