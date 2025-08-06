import { useGame } from "../context/GameContext";

function Settings() {
  const { state, dispatch } = useGame();

  return (
    <div className="relative">
      <div
        className="bg-black/40 fixed inset-0 w-full h-full cursor-pointer"
        onClick={() => dispatch({ type: "CLOSE_SETTINGS" })}
      ></div>

      <div className="fixed bg-gradient-to-b from-[#3B006B]  to-[#f1bff1] w-80 h-80 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg flex flex-col justify-start items-start gap-5 p-4">
        <label className="w-full flex justify-between font-bold text-white">
          Board style :
          <select
            value={state.gameBoardStyle}
            onChange={(e) =>
              dispatch({ type: "CHANGE_THINGS", payload: e.target.value })
            }
            className="w-3/5 border-2 bg-black border-white text-center font-bold text-white"
          >
            <option value="lines">lines</option>
            <option value="boxes">Boxes</option>
          </select>
        </label>

        <label className="w-2/3 font-bold text-white">Sound :</label>
      </div>
    </div>
  );
}

export default Settings;
