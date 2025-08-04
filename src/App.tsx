import { GameProvider } from "./context/GameContext.tsx";
import MenuPage from "./components/MenuPage.tsx";
import PickSide from "./components/PickSide.tsx";
import GameBoard from "./components/GameBoard.tsx";

function App() {
  return (
    <GameProvider>
      <MenuPage />
      <PickSide />
      <GameBoard />
    </GameProvider>
  );
}

export default App;
