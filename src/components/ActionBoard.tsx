import { useGame } from "../context/GameContext";

function ActionBoard() {
  const { state, dispatch } = useGame();

  return (
    <div className="flex w-full sm:w-3/5 justify-between">
      <button
        className="bg-[cyan] w-25 h-15 rounded-lg flex flex-col items-center justify-around cursor-pointer"
        onClick={() => dispatch({ type: "BACK_TO_MENU" })}
      >
        Menu
      </button>
      {state.gameStatus === "playing" && (
        <div className="bg-[#1A004D]/80 w-30 h-15 rounded-lg border-b-4 border-[#1A004D]">
          <div className="flex gap-2 justify-center items-center w-full h-full text-white">
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

      <button
        className="bg-[purple] w-25 h-15 rounded-lg flex flex-col items-center justify-around cursor-pointer"
        onClick={() => dispatch({ type: "RESET_GAME" })}
      >
        Restart
      </button>
    </div>
  );
}

export default ActionBoard;
