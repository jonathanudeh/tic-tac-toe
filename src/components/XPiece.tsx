import { useGame } from "../context/GameContext";

function XPiece() {
  const { state } = useGame();

  return (
    <div
      className={`text-[#1100ff] font-bold ${
        state.gameStatus !== "pickSide" ? "text-7xl" : "text-8xl"
      }`}
    >
      X
    </div>
  );
}

export default XPiece;
