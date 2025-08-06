import { useGame } from "../context/GameContext";

function OPiece({ isWinning = false }) {
  const { state } = useGame();

  return (
    <div
      className={`${
        isWinning && state.winner === "O" ? "text-[#9d7bfc]" : "text-[#FFD700]"
      } font-bold ${state.gameStatus !== "pickSide" ? "text-8xl" : "text-8xl"}`}
    >
      O
    </div>
  );
}

export default OPiece;
