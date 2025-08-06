import { useGame } from "../context/GameContext";

function XPiece({ isWinning = false }) {
  const { state } = useGame();

  return (
    <div
      className={`${
        isWinning && state.winner === "X" ? "text-[#9d7bfc]" : "text-[#1100ff]"
      } font-bold ${state.gameStatus !== "pickSide" ? "text-8xl" : "text-8xl"}`}
    >
      X
    </div>
  );
}

export default XPiece;
