import { useAnimation, motion } from "motion/react";

type Variant = "seen" | "new";

interface MemoryButtonProps {
  type: Variant;
  submit: (correct: boolean) => void;
  isSeen: boolean;
}

const MemoryButton: React.FC<MemoryButtonProps> = ({
  type,
  submit,
  isSeen,
}) => {
  const controls = useAnimation();

  const isCorrect = (type === "seen" && isSeen) || (type === "new" && !isSeen);

  const buttonStyle = {
    correct: {
      scale: [1, 1.1, 1],
      boxShadow: ["0 0 0px green", "0 0 12px green", "0 0 0px green"],
      borderRadius: ["0.5rem", "1rem", "0.5rem"],
      transition: { duration: 0.3 },
    },
    incorrect: {
      x: [-8, 8, -6, 6, 0],
      scale: [1, .9, 1],
      boxShadow: ["0 0 0px red", "0 0 12px red", "0 0 0px red"],
      borderRadius: ["0.5rem", "1rem", "0.5rem"],
      transition: { duration: 0.3 },
    },
  };

  const handleClick = () => {
    // Animate scale tap
    controls.start({
      scale: [1, 0.95, 1.05, 1],
      transition: { duration: 0.3 },
    });

    // Trigger visual feedback animation
    if (isCorrect) {
      controls.start(buttonStyle.correct);
    } else {
      controls.start(buttonStyle.incorrect);
    }

    submit(isCorrect);
  };

  return (
    <motion.button
      animate={controls}
      whileHover={{ scale: 1.05 }}
      onClick={handleClick}
      className={`btn btn-primary px-6 py-2 transition-colors`}
    >
      {type}
    </motion.button>
  );
};

export default MemoryButton;
