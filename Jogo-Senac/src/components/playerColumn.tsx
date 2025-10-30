import React, { useState } from "react";
import { PlayerModel } from "../models/playerModel";
import PlayerCard from "./playerCard";

interface PlayerColumnProps {
  playerList: PlayerModel[];
  setPlayers: React.Dispatch<React.SetStateAction<PlayerModel[]>>;
  movePlayer: (playerId: string, newPosition: number) => void;
}

const PlayerColumn: React.FC<PlayerColumnProps> = ({
  playerList,
  setPlayers,
  movePlayer,
}) => {
  const [newPlayerName, setNewPlayerName] = useState<string>("");
  const [currentMovement, setCurrentMovement] = useState<number>(0);
  const [currentMovementPlayer, setCurrentMovementPlayer] = useState<PlayerModel | null>(null);

  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPlayerName) return;

    setPlayers((prevPlayers) => [
      ...prevPlayers,
      {
        id: crypto.randomUUID(),
        name: newPlayerName,
        position: -1,
      },
    ]);
    setNewPlayerName("");
  };

  const handleRemovePlayer = (id: string) => {
    setPlayers((prevPlayers) =>
      prevPlayers.filter((player) => player.id !== id)
    );
  };

  const handleIncrementPosition = (id: string) => {
    setPlayers((prevPlayers) =>
      prevPlayers.map((player) =>
        player.id === id
          ? { ...player, position: Math.min(player.position + 1, 18) }
          : player
      )
    );
    setCurrentMovement((prevMovement) => Math.min(prevMovement + 1, 18));

    if (
      currentMovementPlayer === null ||
      currentMovementPlayer.id !== id
    ) {
      const newPlayer = playerList.find((player) => player.id === id) || null;
      setCurrentMovementPlayer(newPlayer);
      setCurrentMovement(1); // reset movement for new player
    }
  };

  const handleDecrementPosition = (id: string) => {
    setPlayers((prevPlayers) =>
      prevPlayers.map((player) =>
        player.id === id
          ? { ...player, position: Math.max(player.position - 1, 0) }
          : player
      )
    );
    setCurrentMovement((prevMovement) => Math.max(prevMovement - 1, -18));

    if (
      currentMovementPlayer === null ||
      currentMovementPlayer.id !== id
    ) {
      const newPlayer = playerList.find((player) => player.id === id) || null;
      setCurrentMovementPlayer(newPlayer);
      setCurrentMovement(-1); // reset movement for new player
    }
  };

  // Button to confirm movement  
  const handleConfirmMovement = (player: PlayerModel) => {
    if (player && currentMovement !== 0) {
      movePlayer(player.id, player.position);
      setCurrentMovement(0);
      setCurrentMovementPlayer(null);
    }
  };

  // Button to cancel movement
  const handleCancelMovement = () => {
    console.log("currentMovementPlayer", currentMovementPlayer);
    
    if (currentMovementPlayer) {
      setPlayers((prevPlayers) =>
        prevPlayers.map((player) =>
          player.id === currentMovementPlayer.id
            ? { ...player, position: Math.max(0, Math.min(currentMovementPlayer.position, 18)) }
            : player
        )
      );
    }
    
    setCurrentMovement(0);
    setCurrentMovementPlayer(null);
  };

  return (
    <div className="flex flex-col items-center w-64 max-h-[80vh]">
      <div
        className="flex flex-col gap-4 items-center overflow-y-auto w-full py-2 flex-1"
        style={{ minHeight: 0 }}
      >
        {playerList.map((player) => (
          <div key={player.id} className="flex flex-row items-center w-full">
            <button
              aria-label={`Remove ${player.name}`}
              className="text-red-500 font-bold mr-1 hover:text-red-700"
              onClick={() => handleRemovePlayer(player.id)}
              type="button"
              tabIndex={0}
              style={{
                fontSize: "1.25rem",
                width: "1.5em",
                height: "1.5em",
                minWidth: "unset",
                minHeight: "unset",
                background: "none",
                boxShadow: "none",
                border: "none",
                padding: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                lineHeight: 1,
                margin: 0,
              }}
            >
              ×
            </button>
            <PlayerCard player={player} />
            {/* Position increment/decrement buttons and confirm/cancel inline */}
            <div className="flex flex-row items-center justify-center ml-2 gap-1">
              <div className="flex flex-col items-center">
                <button
                  aria-label={`Increment position for ${player.name}`}
                  className="!bg-yellow-500 text-white font-bold rounded flex items-center justify-center hover:!bg-yellow-500 transition mb-1 text-base w-8 h-8 p-0"
                  onClick={() => handleIncrementPosition(player.id)}
                  type="button"
                  tabIndex={0}
                  disabled={
                    currentMovementPlayer !== null &&
                    currentMovementPlayer.id !== player.id
                  }
                >
                  Λ
                </button>
                <button
                  aria-label={`Decrement position for ${player.name}`}
                  className="!bg-yellow-500 text-white font-bold rounded flex items-center justify-center hover:!bg-yellow-500 transition text-base w-8 h-8 p-0"
                  onClick={() => handleDecrementPosition(player.id)}
                  type="button"
                  tabIndex={0}
                  disabled={
                    currentMovementPlayer !== null &&
                    currentMovementPlayer.id !== player.id
                  }
                >
                  V
                </button>
              </div>
              {/* Inline Confirm Movement button as checkmark and cancel as X */}
              {currentMovementPlayer &&
                currentMovementPlayer.id === player.id &&
                currentMovement !== 0 && (
                  <div className="flex flex-col items-center ml-2">
                    <button
                      aria-label={`Confirm movement for ${player.name}`}
                      className="bg-green-600 text-white font-bold rounded px-2 py-1 flex items-center justify-center hover:bg-green-700 transition text-lg h-8 w-8"
                      onClick={() => handleConfirmMovement(player)}
                      type="button"
                      tabIndex={0}
                      style={{
                        marginTop: 0,
                        minWidth: "2rem",
                        minHeight: "2rem",
                        lineHeight: 1,
                        padding: 0,
                      }}
                    >
                      ✓
                    </button>
                    <button
                      aria-label={`Cancelar movimento de ${player.name}`}
                      className="bg-red-400 text-white font-bold rounded mt-1 px-2 py-1 flex items-center justify-center hover:bg-red-600 transition text-base h-7 w-7"
                      onClick={handleCancelMovement}
                      type="button"
                      tabIndex={0}
                      style={{
                        marginTop: "0.25rem",
                        minWidth: "1.5rem",
                        minHeight: "1.5rem",
                        lineHeight: 1,
                        padding: 0,
                      }}
                    >
                      ×
                    </button>
                  </div>
                )}
              {/* Optionally show movement delta beside checkmark */}
              {currentMovementPlayer &&
                currentMovementPlayer.id === player.id &&
                currentMovement !== 0 && (
                  <span className="ml-1 text-xs font-bold text-green-800">
                    ({currentMovement > 0 ? "+" : ""}{currentMovement})
                  </span>
                )}
            </div>
          </div>
        ))}
      </div>
      <form
        onSubmit={handleAddPlayer}
        className="mt-4 p-2 bg-gray-50 rounded shadow flex flex-col gap-2 w-40"
        style={{ flexShrink: 0 }}
      >
        <input
          type="text"
          className="border rounded px-2 py-1 bg-white text-black"
          placeholder="Nome do jogador"
          value={newPlayerName}
          onChange={(e) => setNewPlayerName(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
          style={{ backgroundColor: "#2563eb" }}
        >
          Adicionar Jogador
        </button>
      </form>
    </div>
  );
};

export default PlayerColumn;