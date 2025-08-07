import { useGame } from "../context/GameContext";

function PlayersCard() {
  const { state } = useGame();

  return (
    <div className="w-full sm:w-2/5 h-auto flex items-center justify-between m-0 p-0">
      {/* player X */}
      <div
        className={`${
          state.gameStatus !== "pickSide" ? "w-25 h-30" : "w-30 h-35"
        } py-2 bg-[#1A004D] rounded-2xl shadow-lg flex flex-col justify-around items-center transition-all duration-300 ${
          state.currentPlayer === "X" &&
          state.gameStatus === "playing" &&
          "shadow-cyan-500 ring-4 ring-cyan-400/50"
        }`}
      >
        <div
          className={`bg-[#80C0FF] ${
            state.gameStatus !== "pickSide" ? "w-15 h-15" : "w-20 h-20"
          } rounded-full flex items-center justify-center text-4xl`}
        >
          {state.players["X"].avatar}
        </div>
        <div className="text-cyan-400 font-bold flex flex-col items-center">
          <span
            className={`${
              state.gameStatus === "finished"
                ? "text-lg"
                : state.gameStatus !== "playing"
                ? "text-2xl"
                : "text-2xl"
            }`}
          >
            {state.gameStatus !== "playing" && state.players["X"].name}
          </span>
          <span className="text-2xl text-cyan-400">
            {state.gameStatus === "playing" ? state.players["X"].score : ""}
          </span>
        </div>
      </div>

      {/* draw */}
      {state.gameStatus === "playing" && (
        <div className="w-20 h-15 py-2 bg-[#1A004D] rounded-lg shadow-lg flex flex-col items-center justify-center text-white">
          <span className="text-sm">Draw</span>
          <span className="font-bold text-lg tetx-gray-300">{state.draws}</span>
        </div>
      )}

      {state.gameStatus === "pickSide" && (
        <div className="text-white text-4xl font-bold opacity-50">VS</div>
      )}

      {/* player O */}
      <div
        className={`${
          state.gameStatus !== "pickSide" ? "w-25 h-30" : "w-30 h-35"
        } py-2 bg-[#1A004D] rounded-2xl shadow-lg flex flex-col justify-around items-center transition-all duration-300 ${
          state.currentPlayer === "O" &&
          state.gameStatus === "playing" &&
          "shadow-yellow-400 ring-4 ring-yellow-400/50"
        }`}
      >
        <div
          className={`bg-yellow-400 ${
            state.gameStatus !== "pickSide" ? "w-15 h-15" : "w-20 h-20"
          } rounded-full flex items-center justify-center text-4xl`}
        >
          {state.players["O"].avatar}
        </div>
        <div className="text-yellow-400 font-bold flex flex-col items-center">
          <span
            className={`${
              state.gameStatus === "finished"
                ? "text-lg"
                : state.gameStatus !== "playing"
                ? "text-2xl"
                : "text-2xl"
            }`}
          >
            {state.gameStatus !== "playing" && state.players["O"].name}
          </span>
          <span className="text-2xl">
            {state.gameStatus === "playing" ? state.players["O"].score : ""}
          </span>
        </div>
      </div>
    </div>
  );
}

export default PlayersCard;
