import React from "react";
import { Link } from "react-router";
import { motion } from "motion/react"
import { GAMES } from "../utils/gameData";

const HomePage: React.FC = () => {
  // Animation variants
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
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Mental Gymnastics
        </h1>
        <p className="text-lg text-gray-600 max-w-xl mx-auto">
          Test your cognitive abilities with these quick brain games. Challenge
          yourself and track your progress!
        </p>
      </div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {GAMES.map((game) => {
          return (
            <motion.div
              key={game.id}
              variants={item}
              className="card hover:border-primary hover:border-2 border-2 border-transparent transition-all"
            >
              <Link to={game.path} className="block h-full">
                <div className="flex items-center mb-4">
                  <span className="text-4xl mr-3">{game.icon}</span>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {game.name}
                  </h2>
                </div>
                <p className="text-gray-600 mb-6">{game.description}</p>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default HomePage;
