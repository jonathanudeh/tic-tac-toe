import { useGame } from "../context/GameContext";

function NavigationOverlay({
  showRestartMenu = false,
  showMenu = false,
  setShowRestartMenu,
  setShowMenu,
}) {
  const { state, dispatch } = useGame();
  return (
    <>
      <div className="bg-black/40 fixed inset-0 w-full h-full"></div>
      <div
        className={`fixed top-1/2 -translate-y-1/2 bg-[#9d7bfc]  w-4/5 sm:w-2/3 h-60 rounded-lg flex flex-col items-center ${
          state.gameStatus === "finished" && "justify-start"
        } ${(showRestartMenu || showMenu) && "justify-center"} gap-7 p-4`}
      >
        {/*  */}
        {state.gameStatus === "finished" && (
          <div className="flex flex-col items-center justify-center gap-5 font-bold w-full h-2/3 text-center">
            <span className="text-2xl opacity-75">
              {state.winner === state.selectedPlayer && "Yayy,🥳 You Won!"}
              {state.winner !== state.selectedPlayer &&
                !state.isDraw &&
                "sigh,😔 you lost..."}
            </span>
            <span
              className={`font-bold text-5xl ${
                state.winner === "X" && "text-[#1100ff]"
              } ${state.winner === "O" && "text-[#FFD700]"}`}
            >
              {state.winner ? `${state.winner} wins` : "Round Tied"}
            </span>
          </div>
        )}

        {showRestartMenu && (
          <span className={`font-bold text-3xl text-center`}>
            Restart Game?
          </span>
        )}

        {showMenu && (
          <span className={`font-bold text-3xl text-center`}>
            Return to Menu?
          </span>
        )}

        <div className="flex items-center justify-between gap-7">
          {showMenu && (
            <button
              className="bg-green-500/80 backdrop-blur-sm text-white w-20 h-12 rounded-lg font-bold border-b-4  border-b-green-800 hover:bg-green-800 transition-all cursor-pointer"
              onClick={() => setShowMenu(false)}
            >
              Cancel
            </button>
          )}

          {(state.gameStatus === "finished" || showMenu) && (
            <button
              className="bg-red-500/70 backdrop-blur-sm text-white w-20 h-12 rounded-lg font-bold border-b-4 border-b-red-800 hover:bg-red-500 transition-all cursor-pointer"
              onClick={() => dispatch({ type: "BACK_TO_MENU" })}
            >
              Quit
            </button>
          )}
          {state.gameStatus === "finished" && (
            <button
              className="bg-green-500/80 backdrop-blur-sm text-white w-30 h-12 rounded-lg font-bold border-b-4 border-b-green-800 hover:bg-green-500 transition-all cursor-pointer"
              onClick={() => dispatch({ type: "NEW_ROUND" })}
            >
              New Round
            </button>
          )}

          {showRestartMenu && (
            <button
              className="bg-red-500/70 backdrop-blur-sm text-white w-20 h-12 rounded-lg font-bold border-b-4 border-b-red-800 hover:bg-red-500 transition-all cursor-pointer"
              onClick={() => setShowRestartMenu(false)}
            >
              Cancel
            </button>
          )}

          {showRestartMenu && (
            <button
              className="bg-green-500/80 backdrop-blur-sm text-white w-30 h-12 rounded-lg font-bold border-b-4 border-b-green-800 hover:bg-green-500 transition-all cursor-pointer"
              onClick={() => {
                dispatch({ type: "RESET_GAME" });
                setShowRestartMenu(false);
              }}
            >
              Restart
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default NavigationOverlay;
