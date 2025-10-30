import { useState } from 'react'
import teatroJoseAlencar from './assets/teatroJoseAlencar.jpg'
import pinacotecaDoCeara from './assets/pinacotecaDoCeara.jpg'
import passeioPublico from './assets/passeioPublico.jpg'
import mercadoCentral from './assets/mercadoCentral.jpeg'
import baraoDeCamocim from './assets/baraoDeCamocim.jpeg'
import catedralMetropolitanaDeFortaleza from './assets/catedralMetropolitanaDeFortaleza.jpeg'
import estacaoDasArtes from './assets/estacaoDasArtes.jpg'
import bibliotecaPublica from './assets/bibliotecaPublica.jpg'
import casaDaAranha from './assets/casaDaAranha.webp'
import casaDaAbobora from './assets/casaDaAbobora.webp'
import casaDoFantasma from './assets/casaDoFantasma.png'
import { PlayerModel } from './models/playerModel'
import BoardTile from './components/boardTile'
import PlayerColumn from './components/playerColumn';
import tilesData from './assets/tiles.json';
import tilePositionsData from './assets/tile-position.json';
import QuestionPopUp from './components/questionPopUp';

const tileIdToImage: Record<string, string | undefined> = {
  "1": teatroJoseAlencar,
  "2": pinacotecaDoCeara,
  "3": passeioPublico,
  "4": mercadoCentral,
  "5": estacaoDasArtes,
  "6": bibliotecaPublica,
  "7": baraoDeCamocim,
  "8": catedralMetropolitanaDeFortaleza,
  "9": casaDaAranha,
  "10": casaDaAbobora,
  "11": casaDoFantasma,
};

function App() {
  const tiles = tilesData.tiles;
  const tilePositions = tilePositionsData.tilePositions as Array<{ tileId: string, position: number }>;

  // Map position => tileId for quick lookup
  const positionToTileId: Record<number, string | undefined> = {};
  tilePositions.forEach(({ tileId, position }) => {
    positionToTileId[position] = tileId;
  });

  const [players, setPlayers] = useState<PlayerModel[]>([]);
  const [questionPopupTileId, setQuestionPopupTileId] = useState<string | null>(null);

  // Function to move a player to a new position and show popup if a tile exists for that position
  const movePlayer = (playerId: string, newPosition: number) => {
    const tileId = positionToTileId[newPosition];
    // Only show popup if there is a non-'N' tileId for this position
    if (tileId && tileId !== "N") {
      setQuestionPopupTileId(tileId);
    }
  };

  // Renders the board with tiles, dynamically mapping tileId by position
  const boardRows = [
    [6, 7, 8, 9, 10, 11, 12],
    [5, 13],
    [4, 14],
    [3, 15],
    [2, 16],
    [1, 17],
    [0, 18],
  ];

  return (
    <div className="min-h-screen min-w-screen flex items-center justify-between bg-gray-600">

      <PlayerColumn playerList={players} setPlayers={setPlayers} movePlayer={movePlayer} />

      <div className="flex flex-col items-center justify-center px-80">
        {boardRows.map((row, i) => (
          <div className="flex justify-between w-full h-full" key={i}>
            {row.map((pos) => {
              const tileId = positionToTileId[pos];
              const backgroundImage = tileId && tileIdToImage[tileId];
              return (
                <BoardTile
                  key={pos}
                  position={pos}
                  players={players.filter(player => player.position === pos)}
                  backgroundImage={backgroundImage}
                />
              );
            })}
          </div>
        ))}
      </div>

      {/* Question pop-up in the middle of the screen */}
      {questionPopupTileId && (
        <QuestionPopUp
          tileId={questionPopupTileId}
          onClose={() => setQuestionPopupTileId(null)}
        />
      )}
    </div>
  )
}

export default App
