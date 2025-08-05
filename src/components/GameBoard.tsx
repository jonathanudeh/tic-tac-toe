import { useEffect } from "react";
import { useGame } from "../context/GameContext";
import OPiece from "./OPiece";
import PlayersCard from "./PlayersCard";
import ScoreBoard from "./ScoreBoard";
import XPiece from "./XPiece";

function GameBoard() {
  const { state, dispatch } = useGame();

  const {
    board,
    gameBoardStyle,
    currentPlayer,
    round,
    gameStatus,
    winningCombination,
  } = state;

  useEffect(() => {
    // run if it's Ai turn
    if (
      gameStatus === "playing" &&
      state.gameMode === "vsAi" &&
      state.players[currentPlayer] &&
      !state.players[currentPlayer].isHuman
    ) {
      const timer = setTimeout(() => {
        dispatch({
          type: "AI_MOVE",
        });
      }, 800);

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

  const handleCellClick = (cellIndex: number) => {
    if (gameStatus === "finished") return;
    dispatch({ type: "MAKE_MOVE", payload: { cellIndex } });
  };

  const renderPiece = (cellValue: "X" | "O" | null) => {
    if (cellValue === "X") return <XPiece />;
    if (cellValue === "O") return <OPiece />;
    return null;
  };

  const isWinningCell = (index: number): boolean => {
    return winningCombination?.includes(index) || false;
  };

  const getCellClassName = (index: number, baseClass: string): string => {
    const winningClass = isWinningCell(index)
      ? state.winner === "X"
        ? "bg-[#1100ff] "
        : "bg-[#FFD700]"
      : "";

    return `${baseClass} ${winningClass}`.trim();
  };

  return (
    <div className="relative w-full max-h-screen h-screen bg-gradient-to-b from-[#9d7bfc] via-[#6a60c4] to-[#9883f3] flex flex-col items-center justify-start gap-2 p-4">
      <div className="bg-[#1A004D]/70 m-0 text-center max-w-40 w-30 h-auto p-2 font-bold text-xl text-white rounded-lg shadow-lg backdrop-blur-lg">
        Round {round}
      </div>

      <PlayersCard />

      {gameBoardStyle === "lines" ? (
        <div className="relative  w-full sm:w-lg sm:h-80">
          <div className="absolute inset-0 pointer-events-none">
            {/* Vertical Lines */}
            <div className="absolute left-1/3 top-0 bottom-0 w-0.5 bg-white/30"></div>
            <div className="absolute left-2/3 top-0 bottom-0 w-0.5 bg-white/30"></div>
            {/* Horizontal Lines */}
            <div className="absolute top-1/3 left-0 right-0 h-0.5 bg-white/30"></div>
            <div className="absolute top-2/3 left-0 right-0 h-0.5 bg-white/30"></div>
          </div>

          <div className="grid grid-cols-3 gap-0 aspect-square sm:aspect-video  w-full h-full ">
            {board.map((square, i) => (
              <button
                key={i}
                className={getCellClassName(
                  i,
                  "aspect-square sm:aspect-video flex items-center justify-center w-full h-full hover:bg-white/10"
                )}
                onClick={() => handleCellClick(i)}
              >
                {square && renderPiece(square)}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-3 place-items-center pt-2 gap-2 sm:aspect-video w-full h-auto sm:w-lg sm:h-90">
          {board.map((square, i) => (
            <button
              key={i}
              className={getCellClassName(
                i,
                "aspect-square sm:aspect-video w-full h-full  backdrop-blur-sm shadow-lg rounded-lg border-2 border-white/20 flex items-center justify-center text-4xl font-bold text-white hover:bg-white/20 transition-all duration-300"
              )}
              onClick={() => handleCellClick(i)}
            >
              {square && renderPiece(square)}
            </button>
          ))}
        </div>
      )}

      {/* Game Finished Actions */}
      {gameStatus === "finished" && (
        <div className="bg-black/40 fixed inset-0 w-full h-full"></div>
      )}
      {gameStatus === "finished" && (
        <div className="fixed top-1/2 -translate-y-1/2 bg-[#9d7bfc]  w-4/5 sm:w-2/3 h-60 rounded-lg flex flex-col items-center justify-start gap-7 p-4">
          <div className="flex flex-col items-center justify-center gap-5 font-bold w-full h-2/3 text-center">
            <span className="text-2xl opacity-75">
              {state.winner === state.selectedPlayer && "Yayy🥳 You Won!"}
              {state.winner !== state.selectedPlayer &&
                !state.isDraw &&
                "sigh😔 you lost."}
            </span>
            <span
              className={`font-bold text-5xl ${
                state.winner === "X" && "text-[#1100ff]"
              } ${state.winner === "O" && "text-[#FFD700]"}`}
            >
              {state.winner ? `${state.winner} wins` : "Round Tied"}
            </span>
          </div>

          <div className="flex items-center justify-between gap-7">
            <button
              className="bg-red-500/50 backdrop-blur-sm text-white w-20 h-12 rounded-lg font-bold border-b-4 border-b-red-800 hover:bg-red-500 transition-all cursor-pointer"
              onClick={() => dispatch({ type: "BACK_TO_MENU" })}
            >
              Quit
            </button>
            <button
              className="bg-green-500/80 backdrop-blur-sm text-white w-30 h-12 rounded-lg font-bold border-b-4 border-b-green-800 hover:bg-green-500 transition-all cursor-pointer"
              onClick={() => dispatch({ type: "NEW_ROUND" })}
            >
              New Round
            </button>
          </div>
        </div>
      )}

      <ScoreBoard />
    </div>
  );
}

export default GameBoard;
