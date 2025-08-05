import { useGame } from "../context/GameContext";

function OPiece() {
  const { state } = useGame();

  return (
    <div
      className={`${
        state.winner === "O" ? "text-[#9d7bfc]" : "text-[#FFD700]"
      } font-bold ${state.gameStatus !== "pickSide" ? "text-7xl" : "text-8xl"}`}
    >
      O
    </div>
  );
}

export default OPiece;
