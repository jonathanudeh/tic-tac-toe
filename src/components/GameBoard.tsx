import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useGame } from "../context/GameContext";
import PlayersCard from "./PlayersCard";
import ScoreBoard from "./ActionBoard";
import NavigationOverlay from "./NavigationOverlay";
import { itemVariants, overlayVariants } from "../animations";
import GridBoard from "./GrideBoard";
import BoxBoard from "./BoxBoard";

function GameBoard() {
  const { state, dispatch } = useGame();
  const [showGameFinished, setShowGameFinished] = useState(false);

  const { board, settings, currentPlayer, round, gameStatus } = state;

  useEffect(() => {
    if (state.gameStatus === "finished") {
      setShowGameFinished(false);
      const finishedTimer = setTimeout(() => setShowGameFinished(true), 1000);
      return () => clearTimeout(finishedTimer);
    } else {
      setShowGameFinished(false);
    }
  }, [state.gameStatus]);

  useEffect(() => {
    if (showGameFinished) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showGameFinished]);

  useEffect(() => {
    if (
      gameStatus === "playing" &&
      state.gameMode === "vsAi" &&
      state.players[currentPlayer] &&
      !state.players[currentPlayer].isHuman
    ) {
      const timer = setTimeout(() => {
        dispatch({ type: "AI_MOVE" });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [
    currentPlayer,
    gameStatus,
    board,
    state.gameMode,
    state.players,
    dispatch,
  ]);

  if (state.gameStatus !== "playing" && state.gameStatus !== "finished")
    return null;

  return (
    <motion.div className="relative w-full max-h-screen h-screen bg-gradient-to-b from-[#9d7bfc] via-[#6a60c4] to-[#9883f3] flex flex-col items-center justify-start gap-3 p-4">
      <motion.div
        className="bg-[#1A004D]/70 m-0 text-center max-w-40 w-30 h-auto p-2 font-bold text-xl text-white rounded-lg shadow-lg backdrop-blur-lg"
        variants={itemVariants}
      >
        Round {round}
      </motion.div>

      <motion.div className="w-full" variants={itemVariants}>
        <PlayersCard />
      </motion.div>

      {/* Game Board */}
      {settings.boardStyle === "lines" ? <GridBoard /> : <BoxBoard />}

      {showGameFinished && (
        <motion.div className="" variants={overlayVariants}>
          <NavigationOverlay
            showRestartMenu={false}
            showMenu={false}
            setShowRestartMenu={() => {}}
            setShowMenu={() => {}}
          />
        </motion.div>
      )}

      <motion.div className="w-full" variants={itemVariants}>
        <ScoreBoard />
      </motion.div>
    </motion.div>
  );
}

export default GameBoard;
