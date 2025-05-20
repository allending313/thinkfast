import { motion } from "motion/react";

export type TileState = "hidden" | "shown";

interface TileProps {
  id: string
  state: TileState;
  isValid?: boolean;
  disabled?: boolean;
  onClick: () => void;
}

const Tile: React.FC<TileProps> = ({ state, isValid, disabled, onClick }) => {
  let bgColor = "bg-gray-200";
  if (state == "shown") {
    if (isValid === true) {
      bgColor = "bg-indigo-500";
    } else if (isValid === false) {
      bgColor = "bg-red-300";
    } else {
      bgColor = "bg-blue-300";
    }
  }

  return (
    <motion.div
      className={`aspect-square rounded-lg cursor-pointer shadow-md overflow-hidden ${
        disabled ? "pointer-events-none" : ""
      }`}
      onClick={onClick}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      layout
    >
      <motion.div
        className={`w-full h-full flex items-center justify-center ${bgColor}`}
        initial={false}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20,
        }}
      />
    </motion.div>
  );
};

export default Tile;
