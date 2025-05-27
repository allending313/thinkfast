import React, { useEffect } from "react";
import { motion, useAnimate } from "motion/react";

export interface GridProps {
  rows: number;
  cols: number;
  children: (row: number, col: number) => React.ReactNode;
  className?: string;
  gap?: number;
  shakeReady?: boolean;
  shakeTrigger?: number;
}

const Grid: React.FC<GridProps> = ({
  rows,
  cols,
  children,
  className = "",
  gap = 4,
  shakeReady,
  shakeTrigger,
}) => {
  const [scope, animate] = useAnimate();
  
  useEffect(() => {
    if (!shakeReady) return;
    animate(
      scope.current,
      { x: [-5, 5, -3, 3, 0] },
      { duration: 0.4, ease: "easeInOut" }
    );
  }, [animate, scope, shakeReady, shakeTrigger]);
  // Create grid with the specified number of rows and columns
  return (
    <motion.div
      ref={scope}
      className={`grid ${className}`}
      style={{
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
        gap: `${gap}px`,
      }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {Array.from({ length: rows * cols }).map((_, index) => {
        const row = Math.floor(index / cols);
        const col = index % cols;
        return (
          <React.Fragment key={`${row}-${col}`}>
            {children(row, col)}
          </React.Fragment>
        );
      })}
    </motion.div>
  );
};

export default Grid;
