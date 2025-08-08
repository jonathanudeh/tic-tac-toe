import { useState } from "react";
import { motion } from "framer-motion";
import { useGame } from "../context/GameContext";
import NavigationOverlay from "./NavigationOverlay";
import { ActionBoardVariants } from "../animations";

function ActionBoard() {
  const { state } = useGame();
  const [showRestartMenu, setShowRestartMenu] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  return (
    <>
      <motion.div
        className="flex w-full sm:w-3/5 justify-between"
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <motion.button
          className="bg-purple-500 font-bold w-25 h-15 rounded-lg flex flex-col items-center justify-around cursor-pointer"
          onClick={() => setShowMenu(true)}
          variants={ActionBoardVariants}
        >
          MENU
        </motion.button>

        {state.gameStatus === "playing" && (
          <div className="bg-[#1A004D]/80 w-30 h-15 rounded-lg border-b-4 border-[#1A004D]">
            <div className="flex gap-2 justify-center items-center w-full h-full text-white text-[22px]">
              <span
                className={`font-bold text-2xl ${
                  state.currentPlayer === "X"
                    ? "text-[#4135ee]"
                    : "text-[#FFD700]"
                }`}
              >
                {state.currentPlayer === "X" ? "X" : "O"}
              </span>
              Turn
            </div>
          </div>
        )}

        <motion.button
          className="bg-gray-500 font-bold w-25 h-15 rounded-lg flex flex-col items-center justify-around cursor-pointer"
          onClick={() => setShowRestartMenu(true)}
          variants={ActionBoardVariants}
        >
          Restart
        </motion.button>
      </motion.div>

      {(showRestartMenu || showMenu) && (
        <NavigationOverlay
          showRestartMenu={showRestartMenu}
          setShowRestartMenu={setShowRestartMenu}
          showMenu={showMenu}
          setShowMenu={setShowMenu}
        />
      )}
    </>
  );
}

export default ActionBoard;
