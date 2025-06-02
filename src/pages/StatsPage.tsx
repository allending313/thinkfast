import React from "react";
import { motion } from "motion/react";
import { useScores } from "../hooks/useScores.ts";
import { GAMES, GAME_CONFIGS } from "../utils/gameData";
import ScoreChart from "../components/ScoreChart";

const StatsPage: React.FC = () => {
  const { getScoresByGame, getBestScore, getAverageScore, clearScores } =
    useScores();

  // Simple animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="px-4 py-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Your Stats
        </h1>
        <button
          onClick={() => {
            if (
              window.confirm("Are you sure you want to clear all your scores?")
            ) {
              clearScores();
            }
          }}
          className="btn btn-secondary text-sm"
        >
          Clear All Scores
        </button>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-8"
      >
        {GAMES.map((game) => {
          const scores = getScoresByGame(game.id);
          const config = GAME_CONFIGS[game.id];
          const bestScore = getBestScore(game.id, !config.isHigherBetter);
          const averageScore = getAverageScore(game.id);

          return (
            <motion.div key={game.id} variants={item} className="card">
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-3">{game.icon}</span>
                <h2 className="text-xl font-semibold text-gray-800">
                  {game.name}
                </h2>
              </div>

              {scores.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-500 mb-1">
                        Total Attempts
                      </h3>
                      <p className="text-xl font-semibold">{scores.length}</p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-500 mb-1">
                        Best Score
                      </h3>
                      <p className="text-xl font-semibold">
                        {bestScore
                          ? `${bestScore.score} ${config.scoreUnit}`
                          : "N/A"}
                      </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-500 mb-1">
                        Average Score
                      </h3>
                      <p className="text-xl font-semibold">
                        {averageScore
                          ? `${averageScore.toFixed(1)} ${config.scoreUnit}`
                          : "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Score Chart */}
                  <div className="mb-6">
                    <ScoreChart scores={scores} config={config} />
                  </div>
                </>
              ) : (
                <p className="text-gray-500 italic">
                  No attempts recorded yet.
                </p>
              )}
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default StatsPage;
