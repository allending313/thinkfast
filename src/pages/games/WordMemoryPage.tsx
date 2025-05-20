import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";
import { useWordMemory } from "../../hooks/useWordTest";
import { useScores } from "../../hooks/useScores";
import HealthBar from "../../components/games/HealthBar";
import MemoryButton from "../../components/games/MemoryButton";

const WordCard: React.FC<{ word: string }> = ({ word }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.2 }}
    className="bg-white p-8 rounded-lg shadow-md w-64 h-40 flex items-center justify-center mb-6"
  >
    <p className="text-3xl font-bold text-center">{word}</p>
  </motion.div>
);

const WordMemoryPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    gameState,
    currentWord,
    score,
    health,
    seen,
    startGame,
    answerWord,
    tryAgain,
  } = useWordMemory();

  const { getBestScore } = useScores();
  const bestScore = getBestScore("word-memory")?.score || 0;
  const maxHealth = 3

  // Game state components
  const renderReadyState = () => (
    <motion.div
      className="text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h2 className="text-xl font-bold mb-4">Word Memory Game</h2>
      <p className="mb-6">
        Remember which words you've seen before. For each word, choose whether
        you've seen it or if it's new. You have 3 lives - be careful!
      </p>
      <HealthBar health={health} maxHealth={maxHealth} />
      <button onClick={startGame} className="btn btn-primary px-8 py-3 text-lg">
        Start Game
      </button>
    </motion.div>
  );

  const renderPlayingState = () => (
    <div className="text-center">
      <div className="mb-4">
        <p className="text-lg font-medium">Score: {score}</p>
        <HealthBar health={health} maxHealth={maxHealth}/>
        <p className="text-gray-600 mb-2">Have you seen this word before?</p>
      </div>

      <AnimatePresence mode="wait">
        <WordCard key={currentWord} word={currentWord} />
      </AnimatePresence>

      <div className="flex justify-center space-x-4">
        <MemoryButton type='seen' isSeen={seen} submit={answerWord}/>
        <MemoryButton type='new' isSeen={seen} submit={answerWord}/>
      </div>
    </div>
  );

  const renderGameOverState = () => (
    <motion.div
      className="text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-2xl font-bold mb-2">Game Over!</h2>
      <HealthBar health={health} maxHealth={maxHealth} />
      <p className="text-xl mb-6">You ran out of lives!</p>

      <div className="mb-8">
        <p className="text-lg font-medium">Final Score: {score}</p>
        {score > bestScore && (
          <p className="text-primary-dark font-medium mt-2">New best score!</p>
        )}
      </div>

      <div className="space-x-4">
        <button onClick={tryAgain} className="btn btn-primary px-6 py-2">
          Try Again
        </button>
        <button
          onClick={() => navigate("/")}
          className="btn btn-primary px-6 py-2"
        >
          Back to Home
        </button>
      </div>
    </motion.div>
  );

  // Render the current game state
  const renderGameContent = () => {
    switch (gameState) {
      case "ready":
        return renderReadyState();
      case "playing":
        return renderPlayingState();
      case "game-over":
        return renderGameOverState();
      default:
        return renderReadyState();
    }
  };

  return (
    <div className="px-4 py-6 flex flex-col min-h-[70vh]">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Word Memory</h1>
      </div>

      <div className="flex-grow flex flex-col items-center justify-center p-4">
        {renderGameContent()}
      </div>

      <div className="mt-6 flex justify-between items-center">
        <div>
          <p className="text-gray-700">
            Best score: <span className="font-bold">{bestScore}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default WordMemoryPage;
