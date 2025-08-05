import { useGame } from "../context/GameContext";

function ScoreBoard() {
  const { state, dispatch } = useGame();

  return (
    <div className="flex w-full sm:w-3/5 justify-between">
      <button
        className="bg-[cyan] w-25 h-15 rounded-lg flex flex-col items-center justify-around cursor-pointer"
        onClick={() => dispatch({ type: "BACK_TO_MENU" })}
      >
        Menu
      </button>

      <div className="bg-blue-500/80 backdrop-blur-sm text-white py-3 px-4 rounded-lg font-semibold flex-1 max-w-32 text-center">
        {state.gameStatus === "playing" ? (
          <div className="flex flex-col items-center">
            <span className="text-xs opacity-75">Turn</span>
            <span className="font-bold">{state.currentPlayer}</span>
          </div>
        ) : (
          <span className="text-sm">Ready</span>
        )}
      </div>

      <button
        className="bg-[purple] w-25 h-15 rounded-lg flex flex-col items-center justify-around cursor-pointer"
        onClick={() => dispatch({ type: "RESET_GAME" })}
      >
        Restart
      </button>
    </div>
  );
}

export default ScoreBoard;
