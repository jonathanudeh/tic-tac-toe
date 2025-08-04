import { useGame } from "../context/GameContext";

function Settings() {
  const { dispatch } = useGame();

  return (
    <div className="relative">
      <div
        className="bg-black/40 fixed inset-0 w-full h-full"
        onClick={() => dispatch({ type: "CLOSE_SETTINGS" })}
      ></div>

      <div className="fixed bg-gradient-to-b from-[#3B006B] via-[#7064da] to-[#f1bff1] w-80 h-80 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-2xl"></div>
    </div>
  );
}

export default Settings;
