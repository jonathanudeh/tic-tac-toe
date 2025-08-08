import { useEffect, useState } from "react";
import { useGame } from "../context/GameContext";
import OPiece from "./OPiece";
import PlayersCard from "./PlayersCard";
import ScoreBoard from "./ActionBoard";
import XPiece from "./XPiece";
import NavigationOverlay from "./NavigationOverlay";

function GameBoard() {
  const { state, dispatch } = useGame();
  const [showGameFinished, setShowGameFinished] = useState(false);

  const {
    board,
    settings,
    currentPlayer,
    round,
    gameStatus,
    winningCombination,
  } = state;

  useEffect(() => {
    if (state.gameStatus === "finished") {
      setShowGameFinished(false);

      const finishedTimer = setTimeout(() => {
        setShowGameFinished(true);
      }, 1000);

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

  const handleCellClick = (cellIndex: number) => {
    if (gameStatus === "finished") return;
    dispatch({ type: "MAKE_MOVE", payload: { cellIndex } });
  };

  const renderPiece = (cellValue: "X" | "O" | null, cellIndex: number) => {
    const isWinning = isWinningCell(cellIndex);
    if (cellValue === "X") return <XPiece isWinning={isWinning} />;
    if (cellValue === "O") return <OPiece isWinning={isWinning} />;
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

      {settings.boardStyle === "lines" ? (
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
                  `aspect-square sm:aspect-video flex items-center justify-center w-full h-full ${
                    gameStatus !== "finished" &&
                    "hover:bg-white/10 cursor-pointer"
                  }`
                )}
                onClick={() => handleCellClick(i)}
              >
                {square && renderPiece(square, i)}
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
                `aspect-square sm:aspect-video w-full h-full  backdrop-blur-sm shadow-lg rounded-lg border-2 border-white/20 flex items-center justify-center text-4xl font-bold text-white  transition-all duration-300 ${
                  gameStatus !== "finished" &&
                  "hover:bg-white/20 cursor-pointer"
                }`
              )}
              onClick={() => handleCellClick(i)}
            >
              {square && renderPiece(square, i)}
            </button>
          ))}
        </div>
      )}

      {showGameFinished && <NavigationOverlay />}

      <ScoreBoard />
    </div>
  );
}

export default GameBoard;
