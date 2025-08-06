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
  winningCombination: number[] | null;
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
  | { type: "AI_MOVE" }
  | { type: "NEW_ROUND" }
  | { type: "RESET_GAME" }
  | { type: "BACK_TO_MENU" }
  | { type: "OPEN_SETTINGS" }
  | { type: "CLOSE_SETTINGS" }
  | { type: "CHANGE_THINGS"; payload: string };

interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

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
  gameBoardStyle: "lines",
  humanPlayer: null,
  selectedPlayer: null,
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

const getSmartAIMove = (board: Board, aiPlayer: Player): number => {
  const available = board
    .map((val, i) => (val === null ? i : -1))
    .filter((i) => i !== -1) as number[];

  const humanPlayer = aiPlayer === "X" ? "O" : "X";

  // Strategy 1: Win if possible
  for (const cell of available) {
    const testBoard = [...board];
    testBoard[cell] = aiPlayer;
    if (checkWinner(testBoard).winner === aiPlayer) {
      return cell;
    }
  }

  // Strategy 2: Block human's winning move
  for (const cell of available) {
    const testBoard = [...board];
    testBoard[cell] = humanPlayer;
    if (checkWinner(testBoard).winner === humanPlayer) {
      return cell; // Block this winning move
    }
  }

  // Strategy 3: Take center if available
  if (available.includes(4)) {
    return 4;
  }

  // Strategy 4: Take corners (good strategic positions)
  const corners = [0, 2, 6, 8];
  const availableCorners = corners.filter((corner) =>
    available.includes(corner)
  );
  if (availableCorners.length > 0) {
    return availableCorners[
      Math.floor(Math.random() * availableCorners.length)
    ];
  }

  // Strategy 5: Take any remaining cell
  return available[Math.floor(Math.random() * available.length)];
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

      if (state.board[cellIndex] !== null || state.gameStatus !== "playing") {
        return state;
      }

      const newBoard = [...state.board];
      newBoard[cellIndex] = state.currentPlayer;

      const { winner, winningCombination } = checkWinner(newBoard);
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

      const aiMove = getSmartAIMove(state.board, state.currentPlayer);

      const newBoard = [...state.board];
      newBoard[aiMove] = state.currentPlayer;

      const { winner, winningCombination } = checkWinner(newBoard);
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
      return { ...initialState, gameBoardStyle: state.gameBoardStyle };

    case "OPEN_SETTINGS":
      return { ...state, gameStatus: "settings" };

    case "CLOSE_SETTINGS":
      return { ...state, gameStatus: "menu" };

    case "CHANGE_THINGS":
      return { ...state, gameBoardStyle: action.payload };

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
