import {
  createContext,
  useContext,
  useReducer,
  useState,
  type ReactNode,
} from "react";

const GameConext = createContext<GameContextType | undefined>(undefined);

type Player = "X" | "O";
type Cell = Player | null;
type Board = Cell[];

interface GamePlayer {
  id: string;
  name: string;
  symbol: Player;
  avatar: string;
  isHuman: boolean;
  score: number;
}

interface GameSettings {
  boardStyle: "lines" | "boxes";
  soundEnabled: boolean;
  aiDifficulty: "easy" | "medium" | "hard";
}

interface GameState {
  board: Board;
  gameStatus: "menu" | "pickSide" | "playing" | "finished" | "settings";
  currentPlayer: Player;
  winner: Player | null;
  winningCombination: number[] | null;
  isDraw: boolean;
  players: {
    X: GamePlayer;
    O: GamePlayer;
  };
  round: number;
  draws: number;
  gameMode: "vsAi" | "vsPlayer" | null;
  humanPlayer: Player | null;
  selectedPlayer: Player | null;
  settings: GameSettings;
}

type GameAction =
  | { type: "PICK_A_SIDE"; payload: "vsAi" | "vsPlayer" }
  | { type: "SELECT_PLAYER"; payload: Player }
  | { type: "START_GAME" }
  | { type: "MAKE_MOVE"; payload: { cellIndex: number } }
  | { type: "AI_MOVE" }
  | { type: "NEW_ROUND" }
  | { type: "RESET_GAME" }
  | { type: "BACK_TO_MENU" }
  | { type: "OPEN_SETTINGS" }
  | { type: "CLOSE_SETTINGS" }
  | {
      type: "UPDATE_SETTING";
      payload: { key: keyof GameSettings; value: any };
    }
  | { type: "RESET_SETTINGS" };

interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

const defaultSettings: GameSettings = {
  boardStyle: "lines",
  soundEnabled: true,
  aiDifficulty: "easy",
};

const initialState: GameState = {
  board: Array(9).fill(null),
  gameStatus: "menu",
  currentPlayer: "X",
  winner: null,
  winningCombination: null,
  isDraw: false,
  players: {
    X: {
      id: "",
      name: "",
      symbol: "X",
      avatar: "",
      isHuman: true,
      score: 0,
    },
    O: {
      id: "",
      name: "",
      symbol: "O",
      avatar: "",
      isHuman: false,
      score: 0,
    },
  },
  round: 1,
  draws: 0,
  gameMode: null,
  humanPlayer: null,
  selectedPlayer: null,
  settings: defaultSettings,
};

const checkWinner = (
  board: Board
): { winner: Player | null; winningCombination: number[] | null } => {
  const winningCombination = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // columns
    [0, 4, 8], // diagonals
    [2, 4, 6], // diagonals
  ];

  for (const [a, b, c] of winningCombination) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return {
        winner: board[a],
        winningCombination: [a, b, c],
      };
    }
  }

  return { winner: null, winningCombination: null };
};

const isDefiniteDraw = (board: Board): boolean => {
  const { winner } = checkWinner(board);
  if (winner) return false;

  const emptyCells = board
    .map((cell, i) => (cell === null ? i : null))
    .filter((i) => i !== null) as number[];

  if (emptyCells.length > 1) return false;

  // Test if X can win
  const canXWin = emptyCells.some((cell) => {
    const testBoard = [...board];
    testBoard[cell] = "X";
    return checkWinner(testBoard).winner === "X";
  });

  // Test if O can win
  const canOWin = emptyCells.some((cell) => {
    const testBoard = [...board];
    testBoard[cell] = "O";
    return checkWinner(testBoard).winner === "O";
  });

  return !canXWin && !canOWin;
};

const getSmartAIMove = (
  board: Board,
  aiPlayer: Player,
  aiDifficulty: "easy" | "medium" | "hard"
): number => {
  const emptyCells = board
    .map((cell, index) => (cell === null ? index : -1))
    .filter((index) => index !== -1);

  const humanPlayer = aiPlayer === "X" ? "O" : "X";

  // Strategy 1: Win if possible
  for (const cell of emptyCells) {
    const testBoard = [...board];
    testBoard[cell] = aiPlayer;
    if (checkWinner(testBoard).winner === aiPlayer) {
      return cell;
    }
  }

  // Strategy 2: Block human's winning move
  for (const cell of emptyCells) {
    const testBoard = [...board];
    testBoard[cell] = humanPlayer;
    if (checkWinner(testBoard).winner === humanPlayer) {
      return cell;
    }
  }

  // Strategy 3: Take center if available
  if (aiDifficulty === "hard" && emptyCells.includes(4)) {
    return 4;
  }

  // for (const cell of emptyCells) {
  //   const testBoard = [...board];
  //   if (testBoard[cell]?.includes(4))
  // }

  // Strategy 4: Take corners (good strategic positions)
  // dont touch this perfect for ai X winning
  // dont touch this perfect for ai X winning

  const corners = [0, 2, 6, 8];
  const edges = [1, 3, 5, 7];

  const availableEdges = edges.filter((edge) => emptyCells.includes(edge));
  if (
    aiDifficulty !== "easy" &&
    (!emptyCells.includes(0) ||
      !emptyCells.includes(2) ||
      !emptyCells.includes(6) ||
      !emptyCells.includes(8)) &&
    availableEdges.length > 0
  ) {
    return availableEdges[Math.floor(Math.random() * availableEdges.length)];
  }

  const availableCorners = corners.filter((corner) =>
    emptyCells.includes(corner)
  );
  if (
    aiDifficulty !== "easy" &&
    !emptyCells.includes(4) &&
    (!emptyCells.includes(1) ||
      !emptyCells.includes(3) ||
      !emptyCells.includes(5) ||
      !emptyCells.includes(7)) &&
    availableCorners.length > 0
  ) {
    return availableCorners[
      Math.floor(Math.random() * availableCorners.length)
    ];
  }

  // Strategy 6: Take any remaining cell
  return emptyCells[Math.floor(Math.random() * emptyCells.length)];
};

const reducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case "PICK_A_SIDE":
      return {
        ...state,
        gameStatus: "pickSide",
        gameMode: action.payload,
        selectedPlayer: null,
        humanPlayer: null,
      };

    case "SELECT_PLAYER": {
      if (!action.payload) return state;

      const humanSymbol = action.payload;
      const aiSymbol = humanSymbol === "X" ? "O" : "X";

      const updatedPlayer = {
        [humanSymbol]: {
          id: "human",
          name: state.gameMode === "vsPlayer" ? "Player 1" : "YOU",
          symbol: humanSymbol,
          avatar: "👤",
          isHuman: true,
          score: 0,
        },
        [aiSymbol]: {
          id: state.gameMode === "vsPlayer" ? "Player 2" : "ai",
          name: state.gameMode === "vsPlayer" ? "Player 2" : "AI",
          symbol: aiSymbol,
          avatar: state.gameMode === "vsPlayer" ? "👥" : "🤖",
          isHuman: state.gameMode === "vsPlayer",
          score: 0,
        },
      } as { X: GamePlayer; O: GamePlayer };

      return {
        ...state,
        selectedPlayer: action.payload,
        humanPlayer: humanSymbol,
        players: updatedPlayer,
      };
    }

    case "START_GAME":
      return {
        ...state,
        board: Array(9).fill(null),
        winner: null,
        winningCombination: null,
        isDraw: false,
        gameStatus: "playing",
        currentPlayer: "X",
      };

    case "MAKE_MOVE": {
      const { cellIndex } = action.payload;

      if (
        state.board[cellIndex] !== null ||
        state.gameStatus !== "playing" ||
        (state.gameMode === "vsAi" &&
          !state.players[state.currentPlayer].isHuman)
      ) {
        return state;
      }

      const newBoard = [...state.board];
      newBoard[cellIndex] = state.currentPlayer;

      const { winner, winningCombination } = checkWinner(newBoard);

      if (!winner && state.settings.soundEnabled)
        new Audio("/button-click.wav").play();

      const isDraw =
        !winner &&
        (newBoard.every((cell) => cell !== null) || isDefiniteDraw(newBoard));

      let updatedPlayers = state.players;
      let updatedDraws = state.draws;

      if (winner) {
        updatedPlayers = {
          ...state.players,
          [winner]: {
            ...state.players[winner],
            score: state.players[winner].score + 1,
          },
        };

        if (state.settings.soundEnabled) new Audio("/win.mp3").play();
      } else if (isDraw) {
        updatedDraws = state.draws + 1;

        if (state.settings.soundEnabled) new Audio("/draw.mp3").play();
      }

      const gameStatus = winner || isDraw ? "finished" : "playing";
      // if (gameStatus === "finished" && !winner) new Audio("/lost.wav").play();
      const nextPlayer = state.currentPlayer === "X" ? "O" : "X";

      return {
        ...state,
        board: newBoard,
        currentPlayer:
          gameStatus === "playing" ? nextPlayer : state.currentPlayer,
        gameStatus,
        winner,
        winningCombination,
        isDraw,
        players: updatedPlayers,
        draws: updatedDraws,
      };
    }

    case "AI_MOVE": {
      if (
        state.gameStatus !== "playing" ||
        state.gameMode !== "vsAi" ||
        !state.players[state.currentPlayer] ||
        state.players[state.currentPlayer].isHuman
      ) {
        return state;
      }

      const aiMove = getSmartAIMove(
        state.board,
        state.currentPlayer,
        state.settings.aiDifficulty
      );

      const newBoard = [...state.board];
      newBoard[aiMove] = state.currentPlayer;

      const { winner, winningCombination } = checkWinner(newBoard);

      if (!winner && state.settings.soundEnabled)
        new Audio("/button-click.wav").play();

      const isDraw =
        !winner &&
        (newBoard.every((cell) => cell !== null) || isDefiniteDraw(newBoard));

      let updatedPlayers = state.players;
      let updatedDraws = state.draws;

      if (winner) {
        updatedPlayers = {
          ...state.players,
          [winner]: {
            ...state.players[winner],
            score: state.players[winner].score + 1,
          },
        };

        if (state.settings.soundEnabled) new Audio("/lost.wav").play();
      } else if (isDraw) {
        updatedDraws = state.draws + 1;
        if (state.settings.soundEnabled) new Audio("/draw.mp3").play();
      }

      const gameStatus = winner || isDraw ? "finished" : "playing";
      const nextPlayer = state.currentPlayer === "X" ? "O" : "X";

      return {
        ...state,
        board: newBoard,
        currentPlayer:
          gameStatus === "playing" ? nextPlayer : state.currentPlayer,
        gameStatus,
        winner,
        winningCombination,
        isDraw,
        players: updatedPlayers,
        draws: updatedDraws,
      };
    }

    case "NEW_ROUND":
      return {
        ...state,
        board: Array(9).fill(null),
        winner: null,
        winningCombination: null,
        isDraw: false,
        gameStatus: "playing",
        currentPlayer: "X",
        round: state.round + 1,
      };

    case "RESET_GAME":
      return {
        ...state,
        board: Array(9).fill(null),
        winner: null,
        winningCombination: null,
        isDraw: false,
        gameStatus: "playing",
        currentPlayer: "X",
        round: 1,
        draws: 0,
        players: {
          ...state.players,
          X: { ...state.players.X, score: 0 },
          O: { ...state.players.O, score: 0 },
        },
      };

    case "BACK_TO_MENU":
      return { ...initialState, settings: state.settings };

    case "OPEN_SETTINGS":
      return { ...state, gameStatus: "settings" };

    case "CLOSE_SETTINGS":
      return { ...state, gameStatus: "menu" };

    case "UPDATE_SETTING":
      return {
        ...state,
        settings: {
          ...state.settings,
          [action.payload.key]: action.payload.value,
        },
      };

    case "RESET_SETTINGS":
      return { ...state, settings: defaultSettings };

    default:
      throw new Error("Unknow action type");
  }
};

interface GameProviderProps {
  children: ReactNode;
}

const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <GameConext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </GameConext.Provider>
  );
};

const useGame = (): GameContextType => {
  const context = useContext(GameConext);

  if (context === undefined)
    throw new Error("useGame should be used within provider.");
  return context;
};

export { GameProvider, useGame };
