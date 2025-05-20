import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";
import { useTileMemoryTest } from "../../hooks/useTileMemoryTest";
import { useScores } from "../../hooks/useScores";
import HealthBar from "../../components/games/HealthBar";
import Grid from "../../components/games/Grid";
import Tile, { type TileState } from "../../components/games/Tile";

const TileMemoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { getBestScore } = useScores();
  const bestScore = getBestScore("tile-memory")?.score || 0;

  const {
    gridSize,
    phase,
    level,
    health,
    targetTiles,
    selectedTiles,
    startGame,
    handleTileClick,
    resetGame,
  } = useTileMemoryTest();

  // Check if a tile is a target tile
  const isTileTarget = (row: number, col: number): boolean => {
    return targetTiles.some((t) => t.row === row && t.col === col);
  };

  // Check if a tile has been selected
  const isTileSelected = (row: number, col: number): boolean => {
    return selectedTiles.some((t) => t.row === row && t.col === col);
  };

  // Get status text based on game phase
  const getStatusText = (): string => {
    switch (phase) {
      case "ready":
        return "Ready to start";
      case "memorize":
        return "Memorize the tiles!";
      case "recall":
        return "Now click on the correct tiles";
      case "levelComplete":
        return "Level complete!";
      case "gameOver":
        return "Game Over!";
      default:
        return "";
    }
  };

  const animateReady = phase === "recall" && selectedTiles.length > 0

  // Render the game grid
  const renderGrid = () => (
    <Grid rows={gridSize} cols={gridSize} className="max-w-md mx-auto" shakeReady={animateReady} shakeTrigger={health}>
      {(row, col) => {
        const tileId = `${row}-${col}`;
        const selected = isTileSelected(row, col)
        const target = isTileTarget(row, col)

        let tileState: TileState = "hidden";
        let valid: boolean | undefined;

        if ((phase === "memorize" || phase === "levelComplete") && target) {
          tileState = "shown";
        } else if (selected) {
          tileState = "shown";
          valid = target;
        }

        if (phase === "gameOver" && target){
            tileState = "shown"
            if (selected) {
                valid = target
            }
        }

        return (
          <Tile
            id={tileId}
            state={tileState}
            isValid={valid}
            onClick={() => handleTileClick({ row, col, id: tileId })}
            disabled={phase !== "recall" || isTileSelected(row, col)}
          />
        );
      }}
    </Grid>
  );

  // Render game content based on current phase
  const renderGameContent = () => {
    switch (phase) {
      case "ready":
        return (
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h2 className="text-xl font-bold mb-4">Tile Memory Game</h2>
            <p className="mb-6">
              Memorize the highlighted tiles, then click on them from memory.
              Each level increases the number of tiles to remember. Every two
              levels, the grid size increases.
            </p>
            <HealthBar health={health} maxHealth={3} />
            <button
              onClick={startGame}
              className="btn btn-primary px-8 py-3 text-lg mt-4"
            >
              Start Game
            </button>
          </motion.div>
        );
      case "gameOver":
        return (
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-2xl font-bold mb-2">Game Over!</h2>
            <HealthBar health={health} maxHealth={3} />

            <div className="mb-6">
              <p className="text-lg font-medium">Final Score: {level}</p>
              {level > bestScore && (
                <p className="text-primary-dark font-medium mt-2">
                  New best score! 👏
                </p>
              )}
            </div>
            
            <div className="">
              <AnimatePresence mode="wait">
              <motion.div
                key={`grid-${level}-${phase}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {renderGrid()}
              </motion.div>
            </AnimatePresence>  
            </div>
            

            <div className="space-x-4 mt-8">
              <button onClick={startGame} className="btn btn-primary px-6 py-2">
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
      default:
        return (
          <div className="text-center">
            <div className="mb-4">
              <div className="flex justify-between items-center px-2">
                <p className="text-lg font-medium">Level: {level}</p>
                <HealthBar health={health} maxHealth={3} />
              </div>
              <p className="text-gray-600 mb-4">{getStatusText()}</p>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={`grid-${level}-${phase}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {renderGrid()}
              </motion.div>
            </AnimatePresence>
          </div>
        );
    }
  };

  return (
    <div className="px-4 py-6 flex flex-col min-h-[70vh]">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Tile Memory</h1>
        {phase !== "ready" && phase !== "gameOver" && (
          <button
            onClick={resetGame}
            className="btn btn-secondary text-sm px-3 py-1"
          >
            Reset
          </button>
        )}
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

export default TileMemoryPage;
