import React from 'react';
import { PlayerModel } from '../models/playerModel';

interface BoardTileProps {
  position: number;
  players: PlayerModel[];
  backgroundImage?: string; // make optional
}

const BoardTile: React.FC<BoardTileProps> = ({ position, players, backgroundImage }) => {
  // Determine styles based on backgroundImage existence
  const hasBackground = !!backgroundImage;
  const bgStyles = hasBackground
    ? {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : {
        backgroundColor: '#f3f4f6' // neutral-100
      };
  return (
    <div
      className="flex flex-col items-center justify-center w-[100px] h-[100px] m-2 border shadow rounded relative"
      style={bgStyles}
    >
      {!hasBackground && (
        <span className="absolute inset-0 flex items-center justify-center font-extrabold text-gray-400 text-4xl select-none pointer-events-none">
          {position+1}
        </span>
      )}
      {players && players.length > 0 ? (
        <div className="mt-2 flex flex-col w-full h-[56px] justify-between z-10">
          {/* Top row */}
          <div className="flex flex-row justify-center gap-1 w-full">
            {players.slice(0, 2).map((player) => (
              <div key={player.id} className="bg-blue-50 rounded px-1 py-0.5 flex-1 min-w-0 flex flex-col items-center">
                <div className="font-semibold text-blue-600 truncate w-full text-xs text-center">{player.name}</div>
              </div>
            ))}
          </div>
          {/* Bottom row */}
          <div className="flex flex-row justify-center gap-1 w-full mt-1">
            {players.slice(2, 4).map((player) => (
              <div key={player.id} className="bg-blue-50 rounded px-1 py-0.5 flex-1 min-w-0 flex flex-col items-center">
                <div className="font-semibold text-blue-600 truncate w-full text-xs text-center">{player.name}</div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div />
      )}
    </div>
  );
};

export default BoardTile;
