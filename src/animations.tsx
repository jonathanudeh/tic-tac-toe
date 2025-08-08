export const pageTransition = {
  duration: 0.5,
  ease: "easeOut",
};

export const containerVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { staggerChildren: 0.5 },
  },
};

export const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export const leftCardVariants = {
  initial: { opacity: 0, x: -150 },
  animate: { opacity: 1, x: 0 },
};

export const RightCardVariants = {
  initial: { opacity: 0, x: 150 },
  animate: { opacity: 1, x: 0 },
};

export const ActionBoardVariants = {
  initial: { opacity: 0, y: 150 },
  animate: { opacity: 1, y: 0 },
};

export const buttonVariants = {
  initial: { opacity: 1, scale: 0 },
  animate: { opacity: 1, scale: 1 },
  hover: { scale: 1.05, y: -2 },
  tap: { scale: 0.95 },
  transition: { delay: 2 },
};

export const pieceVariants = {
  initial: { opacity: 0, scale: 0, rotate: -90 },
  animate: { opacity: 1, scale: 1, rotate: 0 },
  hover: { scale: 1.1 },
  tap: { scale: 0.9 },
  selected: { scale: 1.15 },
};

export const cellVariants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
  winning: { scale: [1, 1.15, 1.1] },
};

export const overlayVariants = {
  initial: { opacity: 0, scale: 0 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0 },
};

export const titleVariants = {
  initial: { opacity: 0, y: -30 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.2 },
  },
};

export const letterVariants = {
  initial: { opacity: 0, scale: 0 },
  animate: { opacity: 1, scale: 1 },
};
