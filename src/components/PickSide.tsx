import { useGame } from "../context/GameContext";
import { motion } from "framer-motion";

import OPiece from "./OPiece";
import PlayersCard from "./PlayersCard";
import XPiece from "./XPiece";

import {
  containerVariants,
  itemVariants,
  pieceVariants,
  buttonVariants,
} from "../animations";

function PickSide() {
  const { state, dispatch } = useGame();
  if (state.gameStatus !== "pickSide") return null;

  const handlePlayerSelection = (player: "X" | "O") => {
    dispatch({ type: "SELECT_PLAYER", payload: player });
  };

  const canContinue = state.humanPlayer !== null;

  return (
    <motion.div
      className="min-h-screen w-full bg-gradient-to-b from-[#9d7bfc] via-[#6a60c4] to-[#9883f3] flex flex-col items-center gap-15 pt-10 p-4"
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <motion.div
        className="bg-[#1A004D]/70 text-center min-w-60 w-60 p-3 font-bold text-2xl text-white rounded-full shadow-lg backdrop-blur-lg"
        variants={itemVariants}
      >
        Choose Your Side
      </motion.div>

      <motion.div className="w-full flex justify-center items-center">
        <PlayersCard />
      </motion.div>

      <motion.div
        className="w-full sm:w-2/5 flex justify-between items-center relative"
        variants={containerVariants}
      >
        {/* X Piece */}
        <div className="relative">
          <motion.button
            className="cursor-pointer w-30 h-30 relative z-10"
            onClick={() => handlePlayerSelection("X")}
            variants={pieceVariants}
            animate={state.selectedPlayer === "X" ? "selected" : "animate"}
            whileHover="hover"
            whileTap="tap"
          >
            <XPiece />
          </motion.button>

          {state.selectedPlayer === "X" && (
            <motion.div
              className="absolute inset-0 border-4 border-[#1A004D] rounded-2xl z-0"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </div>

        {/* O Piece */}
        <div className="relative">
          <motion.button
            className="cursor-pointer w-30 h-30 flex items-center justify-center relative z-10"
            onClick={() => handlePlayerSelection("O")}
            variants={pieceVariants}
            animate={state.selectedPlayer === "O" ? "selected" : "animate"}
            whileHover="hover"
            whileTap="tap"
          >
            <OPiece />
          </motion.button>

          {state.selectedPlayer === "O" && (
            <motion.div
              className="absolute inset-0 border-4 border-[#1A004D] rounded-2xl z-0"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </div>
      </motion.div>

      <motion.button
        className={`max-w-sm w-4/5 sm:w-full bg-gradient-to-r from-[#671bd3] via-[#3d0ba0] to-[#260170] backdrop-blur-sm text-white py-3 rounded-full font-bold text-2xl border-white border-2 transition-all ${
          canContinue ? "cursor-pointer" : "cursor-not-allowed opacity-60"
        }`}
        onClick={() => canContinue && dispatch({ type: "START_GAME" })}
        disabled={!canContinue}
        variants={buttonVariants}
        animate={canContinue ? "animate" : { opacity: 0.6, scale: 0.95 }}
        whileHover={canContinue ? "hover" : {}}
        whileTap={canContinue ? "tap" : {}}
      >
        {canContinue ? "Continue" : "Select a side first"}
      </motion.button>
    </motion.div>
  );
}

export default PickSide;
