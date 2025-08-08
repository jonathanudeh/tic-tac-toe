import { motion } from "framer-motion";
import { useGame } from "../context/GameContext";
import Settings from "./Settings";
import {
  containerVariants,
  buttonVariants,
  titleVariants,
  letterVariants,
  overlayVariants,
} from "../animations";

function MenuPage() {
  const { dispatch, state } = useGame();
  const { gameMode } = state;

  if (gameMode !== null) return null;

  return (
    <motion.div
      className="relative min-h-screen bg-gradient-to-b from-[#3B006B] via-[#7064da] to-[#f1bff1] flex flex-col items-center justify-center p-4"
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <motion.div className="w-full max-w-sm">
        <motion.div className="text-center mb-6" variants={titleVariants}>
          <motion.h1
            className="text-9xl font-bold text-white text-shadow-lg text-shadow-[#A0A0FF]"
            variants={letterVariants}
          >
            TIC
          </motion.h1>
          <motion.h1
            className="text-[110px] font-bold text-white text-shadow-lg text-shadow-[#A0A0FF]"
            variants={letterVariants}
          >
            TAC
          </motion.h1>
          <motion.h1
            className="text-8xl font-bold text-white text-shadow-lg text-shadow-[#A0A0FF]"
            variants={letterVariants}
          >
            TOE
          </motion.h1>
        </motion.div>

        <motion.div
          className="flex flex-col items-center gap-4"
          variants={containerVariants}
        >
          <motion.button
            onClick={() => dispatch({ type: "PICK_A_SIDE", payload: "vsAi" })}
            className="max-w-sm w-4/5 sm:w-full bg-gradient-to-r from-[#2D006B] via-[#6A00A0] to-[#A000E0] backdrop-blur-sm text-white py-3 rounded-full font-bold text-2xl border-white border-2 hover:bg-white/20 transition-all cursor-pointer"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            👤 Vs AI
          </motion.button>

          <motion.button
            onClick={() =>
              dispatch({ type: "PICK_A_SIDE", payload: "vsPlayer" })
            }
            className="max-w-sm w-4/5 sm:w-full bg-gradient-to-r from-[#2D006B] via-[#6A00A0] to-[#A000E0] backdrop-blur-sm text-white py-3 rounded-full font-bold text-2xl border-white border-2 hover:bg-white/30 transition-all cursor-pointer"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            👥 Vs Player
          </motion.button>

          <motion.button
            onClick={() => dispatch({ type: "OPEN_SETTINGS" })}
            className="max-w-sm w-4/5 sm:w-full bg-gradient-to-r from-[#2D006B] via-[#6A00A0] to-[#A000E0] backdrop-blur-sm text-white py-3 rounded-full font-bold text-2xl border-white border-2 hover:bg-white/30 transition-all cursor-pointer"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            ⚙️ Settings
          </motion.button>
        </motion.div>
      </motion.div>

      {state.gameStatus === "settings" && (
        <motion.div variants={overlayVariants}>
          <Settings />
        </motion.div>
      )}
    </motion.div>
  );
}

export default MenuPage;
