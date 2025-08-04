import { useGame } from "../context/GameContext";
import OPiece from "./OPiece";
import PlayersCard from "./PlayersCard";
import ScoreBoard from "./ScoreBoard";
import XPiece from "./XPiece";

function GameBoard() {
  const { state, dispatch } = useGame();
  if (state.gameStatus !== "playing" && state.gameStatus !== "finished")
    return null;

  const { board, gameBoardStyle, currentPlayer, round, gameStatus } = state;

  const handleCellClick = (cellIndex: number) => {
    if (gameStatus === "finished") return;
    dispatch({ type: "MAKE_MOVE", payload: { cellIndex } });
  };

  const renderPiece = (cellValue: "X" | "O" | null) => {
    if (cellValue === "X") return <XPiece />;
    if (cellValue === "O") return <OPiece />;
    return null;
  };

  return (
    <div className="w-full min-h-screen h-screen bg-gradient-to-b from-[#9d7bfc] via-[#6a60c4] to-[#9883f3] flex flex-col items-center justify-center gap-2 px-4">
      <div className="bg-[#1A004D]/70 text-center max-w-40 w-30 h-auto p-2 font-bold text-xl text-white rounded-lg shadow-lg backdrop-blur-lg">
        Round {round}
      </div>

      <PlayersCard />

      {gameBoardStyle === "lines" ? (
        <div className="relative p-4 w-full sm:w-lg sm:h-80 ">
          <div className="absolute inset-4 pointer-events-none">
            {/* Vertical Lines */}
            <div className="absolute left-1/3 top-0 bottom-0 w-0.5 bg-white/30"></div>
            <div className="absolute left-2/3 top-0 bottom-0 w-0.5 bg-white/30"></div>
            {/* Horizontal Lines */}
            <div className="absolute top-1/3 left-0 right-0 h-0.5 bg-white/30"></div>
            <div className="absolute top-2/3 left-0 right-0 h-0.5 bg-white/30"></div>
          </div>

          <div className="grid grid-cols-3 gap-0 aspect-square sm:aspect-video w-full h-full">
            {board.map((square, i) => (
              <button
                key={i}
                className="aspect-square sm:aspect-video flex items-center justify-center w-full h-full"
                onClick={() => handleCellClick(i)}
              >
                {square && renderPiece(square)}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-1 p-2 sm:aspect-video w-full h-auto sm:w-sm sm:h-80">
          {board.map((square, i) => (
            <button
              key={i}
              className="aspect-square sm:aspect-video w-full h-full bg-white/10 backdrop-blur-sm rounded-lg border-2 border-white/20 flex items-center justify-center text-4xl font-bold text-white hover:bg-white/20 transition-all"
              onClick={() => handleCellClick(i)}
            >
              {square && renderPiece(square)}
            </button>
          ))}
        </div>
      )}

      {/* Game Finished Actions */}
      {gameStatus === "finished" && (
        <div className="flex gap-4 mt-4">
          <button
            className="bg-green-500/80 backdrop-blur-sm text-white py-3 px-6 rounded-2xl font-semibold hover:bg-green-500 transition-all"
            onClick={() => dispatch({ type: "NEW_ROUND" })}
          >
            New Round
          </button>
        </div>
      )}

      <ScoreBoard />
    </div>
  );
}

export default GameBoard;
