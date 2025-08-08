import { AnimatePresence, motion } from "framer-motion";
import { cellVariants, containerVariants, pieceVariants } from "../animations";
import { useGame } from "../context/GameContext";
import XPiece from "./XPiece";
import OPiece from "./OPiece";

function GridBoard() {
  const { state, dispatch } = useGame();
  const { board, gameStatus, winningCombination } = state;

  const handleCellClick = (cellIndex: number) => {
    if (gameStatus === "finished") return;
    dispatch({ type: "MAKE_MOVE", payload: { cellIndex } });
  };

  const renderPiece = (cellValue: "X" | "O" | null, cellIndex: number) => {
    const isWinning = isWinningCell(cellIndex);
    if (cellValue === "X") return <XPiece isWinning={isWinning} />;
    if (cellValue === "O") return <OPiece isWinning={isWinning} />;
    return null;
  };

  const isWinningCell = (index: number): boolean => {
    return winningCombination?.includes(index) || false;
  };

  const getCellClassName = (index: number, baseClass: string): string => {
    const winningClass = isWinningCell(index)
      ? state.winner === "X"
        ? "bg-[#1100ff] "
        : "bg-[#FFD700]"
      : "";
    return `${baseClass} ${winningClass}`.trim();
  };

  return (
    <motion.div
      className="relative w-full sm:w-lg sm:h-80"
      variants={containerVariants}
    >
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute left-1/3 top-0 bottom-0 w-0.5 bg-white/30"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: 0.2 }}
        />
        <motion.div
          className="absolute left-2/3 top-0 bottom-0 w-0.5 bg-white/30"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: 0.3 }}
        />
        <motion.div
          className="absolute top-1/3 left-0 right-0 h-0.5 bg-white/30"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.4 }}
        />
        <motion.div
          className="absolute top-2/3 left-0 right-0 h-0.5 bg-white/30"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5 }}
        />
      </div>

      <div className="grid grid-cols-3 gap-1 aspect-square sm:aspect-video w-full h-full">
        {board.map((square, i) => (
          <motion.button
            key={i}
            className={getCellClassName(
              i,
              `aspect-square sm:aspect-video flex items-center justify-center w-full h-full ${
                gameStatus !== "finished" && "hover:bg-white/10 cursor-pointer"
              }`
            )}
            onClick={() => handleCellClick(i)}
            variants={cellVariants}
            animate={isWinningCell(i) ? "winning" : "animate"}
            whileHover={gameStatus !== "finished" ? "hover" : {}}
            whileTap={gameStatus !== "finished" ? "tap" : {}}
          >
            <AnimatePresence mode="wait">
              {square && (
                <motion.div key={`${i}-${square}`} variants={pieceVariants}>
                  {renderPiece(square, i)}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

export default GridBoard;
