import { createContext, useContext, useReducer, type ReactNode } from "react";

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

interface GameState {
  board: Board;
  gameStatus: "menu" | "pickSide" | "playing" | "finished" | "settings";
  currentPlayer: Player;
  winner: Player | null;
  isDraw: boolean;
  players: {
    X: GamePlayer;
    O: GamePlayer;
  };
  round: number;
  draws: number;
  gameMode: "vsAi" | "vsPlayer" | null;
  gameBoardStyle: "lines" | "boxes";
  humanPlayer: Player | null;
  selectedPlayer: Player | null;
}

type GameAction =
  | { type: "PICK_A_SIDE"; payload: "vsAi" | "vsPlayer" }
  | { type: "SELECT_PLAYER"; payload: Player }
  // | { type: "CONFIRM_PLAYER_CHOICE" }
  | { type: "START_GAME" }
  | { type: "MAKE_MOVE"; payload: { cellIndex: number } }
  | { type: "NEW_ROUND" }
  | { type: "RESET_GAME" }
  | { type: "BACK_TO_MENU" }
  | { type: "OPEN_SETTINGS" }
  | { type: "CLOSE_SETTINGS" };

interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

const initialState: GameState = {
  board: Array(9).fill(null),
  gameStatus: "menu",
  currentPlayer: "X",
  winner: null,
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
  gameBoardStyle: "boxes",
  humanPlayer: null,
  selectedPlayer: null,
};

const checkWinner = (board: Board): Player | null => {
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
      return board[a];
    }
  }

  return null;
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

    // case "SELECT_PLAYER":
    //   return { ...state, selectedPlayer: action.payload };

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
        isDraw: false,
        gameStatus: "playing",
        currentPlayer: "X",
      };

    case "MAKE_MOVE": {
      const { cellIndex } = action.payload;

      if (state.board[cellIndex] !== null || state.gameStatus !== "playing") {
        return state;
      }

      const newBoard = [...state.board];
      newBoard[cellIndex] = state.currentPlayer;

      const winner = checkWinner(newBoard);
      const isDraw = !winner && newBoard.every((cell) => cell !== null);

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
      } else if (isDraw) {
        updatedDraws = state.draws + 1;
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
      return { ...initialState };

    case "OPEN_SETTINGS":
      return { ...state, gameStatus: "settings" };

    case "CLOSE_SETTINGS":
      return { ...state, gameStatus: "menu" };

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
