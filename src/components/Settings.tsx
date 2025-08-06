import { useGame } from "../context/GameContext";

function Settings() {
  const { state, dispatch } = useGame();

  const { settings } = state;

  const updateSetting = (key: keyof typeof settings, value: any) => {
    dispatch({ type: "UPDATE_SETTING", payload: { key, value } });
  };

  const resetSettings = () => {
    dispatch({ type: "RESET_SETTINGS" });
  };

  return (
    <div className="relative">
      <div
        className="bg-black/40 fixed inset-0 w-full h-full cursor-pointer"
        onClick={() => dispatch({ type: "CLOSE_SETTINGS" })}
      ></div>

      <div className="fixed bg-gradient-to-b from-[#3B006B]  to-[#f1bff1] w-80 h-80 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg flex flex-col justify-start items-start gap-5 p-4">
        <div className="w-full">
          <label className="w-full flex justify-between items-center font-bold text-white mb-2">
            Board Style:
          </label>
          <select
            value={settings.boardStyle}
            onChange={(e) =>
              updateSetting("boardStyle", e.target.value as "lines" | "boxes")
            }
            className="w-full p-2 border-2 bg-black/50 border-white/30 rounded text-center font-bold text-white"
          >
            <option value="lines">Grid Lines</option>
            <option value="boxes">Boxes</option>
          </select>
        </div>

        <div className="w-full">
          <label className="w-full flex justify-between items-center font-bold text-white mb-2">
            AI Difficulty:
          </label>
          <select
            value={settings.aiDifficulty}
            onChange={(e) =>
              updateSetting(
                "aiDifficulty",
                e.target.value as "easy" | "medium" | "hard"
              )
            }
            className="w-full p-2 border-2 bg-black/50 border-white/30 rounded text-center font-bold text-white"
          >
            <option value="easy">Easy (Makes mistakes)</option>
            <option value="medium">Medium (Sometimes smart)</option>
            <option value="hard">Hard (Always optimal)</option>
          </select>
        </div>

        <div className="w-full">
          <label className="w-full flex justify-between items-center font-bold text-white">
            Sound Effects:
            <div className="relative inline-block">
              <div
                onClick={() =>
                  updateSetting("soundEnabled", !settings.soundEnabled)
                }
                className={`w-12 h-6 rounded-full cursor-pointer transition-all duration-300 m-auto flex ${
                  settings.soundEnabled ? "bg-green-500" : "bg-gray-400"
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full transition-transform duration-300 mt-0.5 ${
                    settings.soundEnabled ? "translate-x-7 " : "translate-x-1"
                  }`}
                />
              </div>
            </div>
          </label>
        </div>

        <div className="w-full pt-4 border-t border-white/20">
          <button
            onClick={resetSettings}
            className="w-full bg-red-500/70 hover:bg-red-500 text-white py-2 rounded-lg font-bold transition-all duration-300"
          >
            Reset to Defaults
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings;

{
  /* <input
                type="checkbox"
                checked={settings.soundEnabled}
                onChange={(e) =>
                  updateSetting("soundEnabled", e.target.checked)
                }
                className="sr-only"
              /> */
}
