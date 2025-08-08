import { AnimatePresence, motion } from "framer-motion";
import { cellVariants, containerVariants, pieceVariants } from "../animations";
import { useGame } from "../context/GameContext";
import XPiece from "./XPiece";
import OPiece from "./OPiece";

function BoxBoard() {
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
      className="grid grid-cols-3 place-items-center pt-2 gap-2 sm:aspect-video w-full h-auto sm:w-lg sm:h-90"
      variants={containerVariants}
    >
      {board.map((square, i) => (
        <motion.button
          key={i}
          className={getCellClassName(
            i,
            `aspect-square sm:aspect-video w-full h-full backdrop-blur-sm shadow-lg rounded-lg border-2 border-white/20 flex items-center justify-center text-4xl font-bold text-white transition-all duration-300 ${
              gameStatus !== "finished" && "hover:bg-white/20 cursor-pointer"
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
    </motion.div>
  );
}

export default BoxBoard;
