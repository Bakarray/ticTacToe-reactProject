import { useState, useEffect, useCallback } from "react";

const board = Array(9).fill("");
const winningConditions = [
  [0, 1, 2, "row-0"],
  [3, 4, 5, "row-1"],
  [6, 7, 8, "row-2"],
  [0, 3, 6, "col-0"],
  [1, 4, 7, "col-1"],
  [2, 5, 8, "col-2"],
  [0, 4, 8, "diag-0"],
  [2, 4, 6, "diag-1"],
];

const GameBoard = ({
  currentPlayer,
  setCurrentPlayer,
  isSinglePlayer,
  difficulty,
  playerNames,
  updateScores,
  setShowModal,
}) => {
  const [tileContent, setTileContent] = useState(board);
  const [gameWinner, setGameWinner] = useState(null);
  const [gameDraw, setGameDraw] = useState(false);
  const [winningLine, setWinningLine] = useState(null);
  const [lastMove, setLastMove] = useState(null);

  function checkWinner(board) {
    for (let condition of winningConditions) {
      const [a, b, c, type] = condition;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return {
          winner: board[a],
          winningLine: type,
        };
      }
    }
    return null;
  }

  const checkDraw = (board) => board.every((cell) => cell !== "");

  const findWinningMove = (board, player) => {
    for (let condition of winningConditions) {
      const [a, b, c] = condition;
      if (board[a] === player && board[b] === player && board[c] === "")
        return c;
      if (board[a] === player && board[c] === player && board[b] === "")
        return b;
      if (board[b] === player && board[c] === player && board[a] === "")
        return a;
    }
    return null;
  };

  const makeMove = useCallback(
    (index) => {
      if (tileContent[index] !== "" || gameWinner || gameDraw) return;

      const updatedBoard = [...tileContent];
      updatedBoard[index] = currentPlayer;
      setTileContent(updatedBoard);
      setLastMove(index);

      const { winner, winningLine } = checkWinner(updatedBoard) || {};
      if (winner) {
        setGameWinner(winner);
        setWinningLine(winningLine);
        updateScores(winner);
        return;
      }
      if (checkDraw(updatedBoard)) {
        setGameDraw(true);
        updateScores(winner);
        return;
      }

      setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
    },
    [
      currentPlayer,
      gameDraw,
      gameWinner,
      setCurrentPlayer,
      tileContent,
      updateScores,
    ]
  );

  useEffect(() => {
    if (isSinglePlayer && currentPlayer === "O" && !gameWinner && !gameDraw) {
      let moveIndex;
      if (difficulty === "easy") {
        const emptyTiles = tileContent
          .map((val, index) => (val === "" ? index : null))
          .filter((val) => val !== null);
        moveIndex = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
      } else if (difficulty === "medium" || difficulty === "hard") {
        moveIndex = findWinningMove(tileContent, "O"); //try to win

        if (moveIndex === null) {
          moveIndex = findWinningMove(tileContent, "X"); //block opponent
        }
        if (moveIndex === null) {
          //make random move
          const emptyTiles = tileContent
            .map((val, index) => (val === "" ? index : null))
            .filter((val) => val !== null);
          moveIndex = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
        }
      }
      if (moveIndex !== undefined) {
        setTimeout(() => makeMove(moveIndex), 500); // delay move for Ux
      }
    }
  }, [
    isSinglePlayer,
    currentPlayer,
    gameWinner,
    gameDraw,
    difficulty,
    tileContent,
    makeMove,
  ]);

  const handleTileClick = (index) => makeMove(index);

  const resetGame = () => {
    setTileContent(board);
    setCurrentPlayer("X");
    setGameWinner(null);
    setGameDraw(false);
    setWinningLine(null);
    setLastMove(null);
  };

  const playerSymbol = {
    X: playerNames.player1 || "Player1",
    O: playerNames.player2 || "Player2",
  };

  return (
    <div className="game_board_container">
      <div className="game_status">
        {gameWinner ? (
          <p>{playerSymbol[gameWinner]} wins!!</p>
        ) : gameDraw ? (
          <p>Game is a Draw!</p>
        ) : (
          <></> || <p>Current Player: {playerSymbol[currentPlayer]}</p>
        )}
        <button onClick={resetGame}>
          {gameWinner || gameDraw ? "Play Again" : "Reset Game"}
        </button>
        <button
          onClick={() => setShowModal(true)}
          style={{ background: "red" }}
        >
          Quit Game
        </button>
      </div>

      <div className="game_board">
        {tileContent.map((tile, index) => (
          <button
            key={index}
            className={`board_tile ${lastMove === index ? "last-move" : ""}`}
            onClick={() => handleTileClick(index)}
            disabled={tile !== "" || gameDraw || gameWinner}
          >
            {tile}
          </button>
        ))}

        {/* Strike through line shown when there's a winner */}
        {gameWinner && (
          <div
            className="strike"
            data-type={winningLine.split("-")[0]}
            style={{
              "--index": +winningLine.split("-")[1],
              ...(winningLine.startsWith("diag") && {
                "--rotate": `${
                  Math.pow(-1, +winningLine.split("-")[1]) * 45
                }deg`,
              }),
            }}
          ></div>
        )}
      </div>
    </div>
  );
};

export default GameBoard;
