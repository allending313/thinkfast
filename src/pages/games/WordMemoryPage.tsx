import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";
import { useWordMemory } from "../../hooks/useWordTest";
import { useScores } from "../../hooks/useScores";

const HeartIcon: React.FC<{ filled: boolean }> = ({ filled }) => (
  <motion.span
    key={filled ? "filled" : "empty"}
    initial={{ scale: 1 }}
    animate={{ scale: filled ? [1, 1.3, 1] : 1 }}
    transition={{ duration: 0.3 }}
    className={`mx-1 text-xl ${filled ? "text-red-500" : "text-gray-300"}`}
  >
    ❤️
  </motion.span>
);

const HealthBar: React.FC<{ health: number }> = ({ health }) => (
  <div className="flex justify-center mb-2">
    {Array.from({ length: 3 }).map((_, i) => (
      <HeartIcon key={i} filled={i < health} />
    ))}
  </div>
);

const WordMemoryPage: React.FC = () => {
  const navigate = useNavigate();
  const {
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
  } = useWordMemory();

  const { getBestScore } = useScores();
  const bestScore = getBestScore("word-memory")?.score || 0;

  // Game state components
  const renderReadyState = () => (
    <motion.div
      className="text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h2 className="text-xl font-bold mb-4">Word Memory Test</h2>
      <p className="mb-6">
        Memorize the words shown on screen. Then identify which words you've
        seen before. You have 3 lives - be careful!
      </p>
      <HealthBar health={health} />
      <button onClick={startGame} className="btn btn-primary px-8 py-3 text-lg">
        Start Game
      </button>
    </motion.div>
  );

  const renderMemorizeState = () => (
    <div className="text-center">
      <div className="mb-4">
        <p className="text-lg font-medium">Level {currentLevel}</p>
        <HealthBar health={health} />
        <p className="text-gray-600">Memorize these words:</p>
        <p className="text-gray-600 text-sm mb-2">
          Time left: {timeLeft} seconds
        </p>
      </div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
      >
        {wordsList.map((word, index) => (
          <motion.div
            key={index}
            className="bg-white p-4 rounded-lg shadow-md"
            variants={{
              hidden: { y: 20, opacity: 0 },
              visible: { y: 0, opacity: 1 },
            }}
          >
            <p className="text-lg font-medium">{word}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );

  const renderRecallState = () => (
    <div className="text-center">
      <div className="mb-8">
        <p className="text-lg font-medium">Level {currentLevel}</p>
        <HealthBar health={health} />
        <p className="text-gray-600 mb-2">Did you see this word before?</p>
        <p className="text-3xl font-bold mb-4">{currentWord}</p>

        <AnimatePresence>
          {showMistake && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-red-500 font-medium mb-2"
            >
              Incorrect!
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={showMistake ? { x: [-5, 5, -5, 5, 0] } : {}}
            transition={{ duration: 0.3 }}
            onClick={() => answerWord(true)}
            className={`btn btn-primary px-6 py-2 ${
              showMistake ? "border-red-400" : ""
            }`}
          >
            Seen
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={showMistake ? { x: [-5, 5, -5, 5, 0] } : {}}
            transition={{ duration: 0.3 }}
            onClick={() => answerWord(false)}
            className={`btn btn-secondary px-6 py-2 ${
              showMistake ? "border-red-400" : ""
            }`}
          >
            New
          </motion.button>
        </div>
      </div>

      <div className="text-gray-600">{totalAnswered} / 10 words</div>
    </div>
  );

  const renderCompleteState = () => {
    const gameOver = health === 0;
    return (
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-bold mb-2">
          {gameOver ? "Game Over!" : "Level Complete!"}
        </h2>
        <HealthBar health={health} />
        <p className="text-xl mb-6">
          {gameOver
            ? "You ran out of lives!"
            : `You got ${correctAnswers} out of ${totalAnswered} correct`}
        </p>

        <div className="mb-8">
          <p className="text-lg font-medium">Final Level: {currentLevel}</p>
          {currentLevel > bestScore && (
            <p className="text-primary-dark font-medium mt-2">
              New best score!
            </p>
          )}
        </div>

        <div className="space-x-4">
          {!gameOver && (
            <button onClick={nextLevel} className="btn btn-primary px-6 py-2">
              Next Level
            </button>
          )}
          <button onClick={resetGame} className="btn btn-secondary px-6 py-2">
            Try Again
          </button>
        </div>
      </motion.div>
    );
  };

  // Render the current game state
  const renderGameContent = () => {
    switch (gameState) {
      case "ready":
        return renderReadyState();
      case "memorize":
        return renderMemorizeState();
      case "recall":
        return renderRecallState();
      case "complete":
        return renderCompleteState();
      default:
        return renderReadyState();
    }
  };

  return (
    <div className="px-4 py-6 flex flex-col min-h-[70vh]">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Word Memory</h1>
        <button
          onClick={() => navigate("/")}
          className="btn btn-secondary text-sm"
        >
          Back to Games
        </button>
      </div>

      <div className="flex-grow flex flex-col items-center justify-center p-4">
        {renderGameContent()}
      </div>

      <div className="mt-6 flex justify-between items-center">
        <div>
          <p className="text-gray-700">
            Best level: <span className="font-bold">{bestScore}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default WordMemoryPage;
