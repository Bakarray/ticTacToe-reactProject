import { useState } from "react";
import "./App.css";
import GameDetailsForm from "./components/GameDetailsForm";
import GameBoard from "./components/GameBoard";

function App() {
  const [playerNames, setPlayerNames] = useState({ player1: "", player2: "" });
  const [showModal, setShowModal] = useState(true);
  const [currentPlayer, setCurrentPlayer] = useState("X");
  const [isSinglePlayer, setIsSinglePlayer] = useState(false);
  const [difficulty, setDifficulty] = useState("easy");
  const [scores, setScores] = useState({ player1: 0, player2: 0, draws: 0 });
  // const [theme, setTheme] = useState("dark");

  const closeModal = () => setShowModal(false);
  // const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const updateScores = (winner) => {
    if (winner === "X") {
      setScores((prev) => ({ ...prev, player1: prev.player1 + 1 }));
    } else if (winner === "O") {
      setScores((prev) => ({ ...prev, player2: prev.player2 + 1 }));
    } else {
      setScores((prev) => ({ ...prev, draws: prev.draws + 1 }));
    }
  };

  return (
    <div className={`app`}>
      {/* <button onClick={toggleTheme} className="theme-toggle">
        {theme} mode
      </button> */}
      <h1>Tic-tac-toe</h1>
      {showModal && (
        <GameDetailsForm
          setPlayerNames={setPlayerNames}
          playerNames={playerNames}
          closeModal={closeModal}
          setIsSinglePlayer={setIsSinglePlayer}
          setDifficulty={setDifficulty}
        />
      )}

      <h2 className="wave-text">
        <span className={currentPlayer === "X" ? "current" : ""}>
          {playerNames.player1 || "Player1"}
        </span>
        <p> VS </p>
        <span className={currentPlayer === "O" ? "current" : ""}>
          {playerNames.player2 || "Player2"}
        </span>
      </h2>

      <GameBoard
        currentPlayer={currentPlayer}
        setCurrentPlayer={setCurrentPlayer}
        isSinglePlayer={isSinglePlayer}
        difficulty={difficulty}
        playerNames={playerNames}
        updateScores={updateScores}
        setShowModal={setShowModal}
      />

      <div className="scores">
        <p>
          {playerNames.player1 || "Player1"}: {scores.player1}
        </p>
        <p>
          {playerNames.player2 || "Player2"}: {scores.player2}
        </p>
        <p>Draws: {scores.draws}</p>
      </div>
    </div>
  );
}

export default App;
