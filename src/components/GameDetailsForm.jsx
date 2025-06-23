import { useState, useRef, useEffect } from "react";

const GameDetailsForm = ({
  setPlayerNames,
  playerNames,
  closeModal,
  setIsSinglePlayer,
  setDifficulty,
}) => {
  const { player1, player2 } = playerNames;
  const [localDifficulty, setLocalDifficulty] = useState("easy");
  const [playerCount, setPlayerCount] = useState(2);
  const player1InputRef = useRef(null);

  useEffect(() => {
    player1InputRef.current.focus();
  }, []);

  const handlePlayerCountChange = (e) => {
    setPlayerCount(+e.target.value);

    if (+e.target.value === 1) {
      setPlayerNames({ ...playerNames, player2: "Computer" });
    } else {
      setPlayerNames({ ...playerNames, player2: "" });
    }
  };

  const handlePlayerNameChange = (e) => {
    setPlayerNames({ ...playerNames, [e.target.name]: e.target.value });
  };

  const handleDifficultyChange = (e) => {
    setLocalDifficulty(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedNames = {
      player1: player1 || "Player1",
      player2: playerCount === 1 ? "Computer" : player2 || "Player2",
    };

    setPlayerNames(updatedNames);
    setIsSinglePlayer(playerCount === 1);
    if (playerCount === 1) setDifficulty(localDifficulty);
    closeModal();
  };

  return (
    <div className="modal-overlay">
      <form onSubmit={handleSubmit} className="modal-content">
        <button type="button" className="close-button" onClick={closeModal}>
          &times;
        </button>
        <h2 id="modal-title">Game details</h2>

        <fieldset>
          <legend>Number of players</legend>
          {[1, 2].map((count) => {
            return (
              <div key={count}>
                <input
                  type="radio"
                  name="playerCount"
                  id={`player${count}Count`}
                  value={count}
                  checked={playerCount === count}
                  onChange={handlePlayerCountChange}
                />
                <label htmlFor={`player${count}Count`}>
                  {count} Player{count > 1 && "s"}
                </label>
              </div>
            );
          })}
        </fieldset>

        {playerCount === 1 && (
          <div>
            <label htmlFor="difficulty">Difficulty: </label>
            <select
              name="difficulty"
              id="difficulty"
              value={localDifficulty}
              onChange={handleDifficultyChange}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        )}

        <div>
          <label htmlFor="player1">Player1 (name): </label>
          <input
            type="text"
            name="player1"
            id="player1"
            placeholder="player1"
            value={player1}
            onChange={handlePlayerNameChange}
            ref={player1InputRef}
          />
        </div>

        <div>
          <label htmlFor="player2">Player2 (name): </label>
          <input
            type="text"
            name="player2"
            id="player2"
            placeholder="player2"
            disabled={playerCount === 1}
            value={playerCount === 1 ? "Computer" : `${player2}`}
            onChange={handlePlayerNameChange}
          />
        </div>

        <button type="submit">Set</button>
      </form>
    </div>
  );
};

export default GameDetailsForm;
