import React from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { useReactionTest } from "../../hooks/useReactionTest";
import { useScores } from "../../hooks/useScores";

const ReactionTestPage: React.FC = () => {
  const navigate = useNavigate();
  const { gameState, reactionTime, handleGameClick, showKeyboardHint } =
    useReactionTest();
  const { getBestScore } = useScores();

  const bestScore = getBestScore("reaction-test", true)?.score || null;

  // Map game states to background colors
  const getBackgroundColor = () => {
    switch (gameState) {
      case "ready":
        return "bg-blue-500";
      case "waiting":
        return "bg-red-500";
      case "clickNow":
        return "bg-green-500";
      case "tooEarly":
        return "bg-yellow-500";
      case "complete":
        return "bg-purple-500";
      default:
        return "bg-blue-500";
    }
  };

  // Map game states to instructions
  const getInstructions = () => {
    switch (gameState) {
      case "ready":
        return "Click to start";
      case "waiting":
        return "Wait for green...";
      case "clickNow":
        return "Click now!";
      case "tooEarly":
        return "Too early! Click to try again";
      case "complete":
        return "Click to try again";
      default:
        return "Click to start";
    }
  };

  return (
    <div className="px-4 py-6 flex flex-col min-h-[70vh]">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Reaction Test</h1>
        <button
          onClick={() => navigate("/")}
          className="btn btn-secondary text-sm"
        >
          Back to Games
        </button>
      </div>

      <p className="text-gray-600 mb-6">
        Test your reaction time. Wait for the box to turn green, then click as
        quickly as you can!
        {showKeyboardHint && (
          <span className="block mt-1 text-sm italic">
            Tip: You can also press the spacebar instead of clicking
          </span>
        )}
      </p>

      <motion.div
        className={`flex-grow flex flex-col items-center justify-center rounded-lg ${getBackgroundColor()} cursor-pointer transition-colors`}
        onClick={handleGameClick}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        tabIndex={0}
        role="button"
        aria-label="Game interaction area"
      >
        <p className="text-white text-2xl font-medium mb-4">
          {getInstructions()}
        </p>

        {gameState === "complete" && reactionTime !== null && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <p className="text-white text-4xl font-bold mb-2">
              {reactionTime} ms
            </p>
            {bestScore !== null && reactionTime < bestScore && (
              <p className="text-white text-xl">New best score!</p>
            )}
          </motion.div>
        )}
      </motion.div>

      <div className="mt-6 flex justify-between items-center">
        <div>
          {bestScore !== null && (
            <p className="text-gray-700">
              Best time: <span className="font-bold">{bestScore} ms</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReactionTestPage;
