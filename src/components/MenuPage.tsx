import { useGame } from "../context/GameContext";
import Settings from "./Settings";

function MenuPage() {
  const { dispatch, state } = useGame();
  const { gameMode } = state;
  if (gameMode !== null) return;

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#3B006B] via-[#7064da] to-[#f1bff1] flex flex-col items-center justify-center p-4">
      <div className=" w-full max-w-sm">
        <div className="text-center mb-6">
          <h1 className="text-9xl font-bold text-white text-shadow-lg text-shadow-[#A0A0FF]">
            TIC
          </h1>
          <h1 className="text-[110px] font-bold text-white text-shadow-lg text-shadow-[#A0A0FF]">
            TAC
          </h1>
          <h1 className="text-8xl font-bold text-white text-shadow-lg text-shadow-[#A0A0FF]">
            TOE
          </h1>
        </div>

        <div className="flex flex-col items-center gap-4">
          <button
            onClick={() => dispatch({ type: "PICK_A_SIDE", payload: "vsAi" })}
            className="max-w-sm w-4/5 sm:w-full bg-gradient-to-r from-[#2D006B] via-[#6A00A0] to-[#A000E0] backdrop-blur-sm text-white py-3 rounded-full font-bold text-2xl border-white border-2 hover:bg-white/20 transition-all cursor-pointer"
          >
            👤 Vs AI
          </button>
          <button
            onClick={() =>
              dispatch({ type: "PICK_A_SIDE", payload: "vsPlayer" })
            }
            className="max-w-sm w-4/5 sm:w-full bg-gradient-to-r from-[#2D006B] via-[#6A00A0] to-[#A000E0] backdrop-blur-sm text-white py-3 rounded-full font-bold text-2xl border-white border-2 hover:bg-white/30 transition-all cursor-pointer"
          >
            👥 Vs Player
          </button>
          <button
            onClick={() => dispatch({ type: "OPEN_SETTINGS" })}
            className="max-w-sm w-4/5 sm:w-full bg-gradient-to-r from-[#2D006B] via-[#6A00A0] to-[#A000E0] backdrop-blur-sm text-white py-3 rounded-full font-bold text-2xl border-white border-2 hover:bg-white/30 transition-all cursor-pointer"
          >
            ⚙️ Settings
          </button>
        </div>
      </div>

      {state.gameStatus === "settings" && <Settings />}
    </div>
  );
}

export default MenuPage;
