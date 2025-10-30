import React from "react";
import { PlayerModel } from "../models/playerModel";

interface PlayerCardProps {
  player: PlayerModel;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player }) => {
  return player ? (
    <div className="bg-white shadow rounded p-2 flex flex-col items-center w-32">
      <div
        className="font-bold text-blue-600 text-lg break-words text-center w-full"
        style={{ wordBreak: "break-word" }}
      >
        {player.name}
      </div>
      <div className="text-blue-600 font-semibold mt-1">
        Posição: {player.position < 0 ? "" : player.position}
      </div>
    </div>
  ) : (
    <div className="bg-gray-200 shadow rounded p-2 flex flex-col items-center w-32 text-gray-400">
      No player
    </div>
  );
};

export default PlayerCard;
