import { useGame } from "../context/GameContext";

import OPiece from "./OPiece";
import PlayersCard from "./PlayersCard";
import XPiece from "./XPiece";

function PickSide() {
  const { state, dispatch } = useGame();
  if (state.gameStatus !== "pickSide") return null;

  const handlePlayerSelection = (player: "X" | "O") => {
    dispatch({ type: "SELECT_PLAYER", payload: player });
    // dispatch({ type: "CONFIRM_PLAYER_CHOICE" });
  };

  const canContinue = state.humanPlayer !== null;

  return (
    <div className="min-h-screen w-full  bg-gradient-to-b from-[#9d7bfc] via-[#6a60c4] to-[#9883f3] flex flex-col  items-center gap-15 pt-10 p-4 ">
      <div className="bg-[#1A004D]/70 text-center min-w-60 w-60 p-3 font-bold text-2xl text-white rounded-full shadow-lg backdrop-blur-lg">
        Choose Your Side
      </div>
      {/* <span className="block text-xs bg-[#1A004D] text-center text-white p-2 rounded-xs">
        X goes first
      </span> */}

      <PlayersCard />

      <div className="w-full sm:w-2/5 flex justify-between items-center">
        <button
          className={`cursor-pointer w-30 h-30 ${
            state.selectedPlayer === "X"
              ? "border-2 border-[#1A004D] rounded-2xl"
              : "hover:scale-105"
          }`}
          onClick={() => handlePlayerSelection("X")}
        >
          <XPiece />
        </button>
        <button
          className={`cursor-pointer w-30 h-30 flex items-center justify-center ${
            state.selectedPlayer === "O"
              ? "border-2 border-[#1A004D] rounded-2xl"
              : "hover:scale-105"
          }`}
          onClick={() => handlePlayerSelection("O")}
        >
          <OPiece />
        </button>
      </div>

      <button
        className={`max-w-sm w-4/5 sm:w-full bg-gradient-to-r from-[#671bd3] via-[#3d0ba0] to-[#260170] backdrop-blur-sm text-white py-3 rounded-full font-bold text-2xl border-white border-2 hover:bg-white/30 transition-all ${
          canContinue ? "cursor-pointer" : "cursor-not-allowed"
        }`}
        onClick={() => canContinue && dispatch({ type: "START_GAME" })}
        disabled={!canContinue}
      >
        {canContinue ? "Continue" : "Select a side first"}
      </button>
    </div>
  );
}

export default PickSide;
