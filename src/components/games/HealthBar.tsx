import { AnimatePresence, motion } from "motion/react";

interface HealthBarProps {
  maxHealth: number;
  health: number;
}
const HeartIcon: React.FC<{ filled: boolean; index: number }> = ({
  filled,
  index,
}) => (
  <AnimatePresence mode="popLayout" initial={false}>
    <motion.span
      key={`${index}-${filled}`} // forces React to treat state changes as unique
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: [1, 1.3, 1], opacity: 1 }}
      exit={{ scale: 0.5, opacity: 0}}
      transition={{ duration: 0.3 }}
      className={`mx-1 text-xl`}
    >
      {filled ? "❤️" : "🤍"}
    </motion.span>
  </AnimatePresence>
);

const HealthBar: React.FC<HealthBarProps> = ({ maxHealth, health }) => {
  return (
    <div className="flex justify-center mb-2">
      {Array.from({ length: maxHealth }).map((_, i) => (
        <HeartIcon key={i} index={i} filled={i < health} />
      ))}
    </div>
  );
};

export default HealthBar;
