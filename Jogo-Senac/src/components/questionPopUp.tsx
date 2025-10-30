import React, { useEffect, useState } from "react";

// This import only works if using Vite/CRA and proper loader. If not, require/context may be needed.
import questionsData from "../assets/questions.json";

interface QuestionPopUpProps {
  tileId: string | number;
  onClose: () => void;
}

interface QuestionDetail {
  question: string;
  answer: string;
  bonus: string | null;
  drawback: string | null;
}

// Extending for display info
interface PopupDisplay {
  isSpecial: boolean;
  detail: QuestionDetail;
}

const QuestionPopUp: React.FC<QuestionPopUpProps> = ({ tileId, onClose }) => {
  const [popupData, setPopupData] = useState<PopupDisplay | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [showResposta, setShowResposta] = useState<null | "correta" | "errada">(null);

  useEffect(() => {
    if (!tileId) return;

    setPopupData(null);
    setNotFound(false);
    setShowResposta(null);

    let found = false;

    // Regular tiles (not special)
    for (const tileQ of questionsData.locale_tiles) {
      if (String(tileQ.tile_id) === String(tileId)) {
        const questionsObj = tileQ.questions;
        const values: QuestionDetail[] = Object.values(questionsObj);

        if (values.length) {
          const randIdx = Math.floor(Math.random() * values.length);
          setPopupData({
            isSpecial: false,
            detail: values[randIdx]
          });
          found = true;
        }
        break;
      }
    }

    // Special tiles: show drawback as the question
    if (!found) {
      for (const special of (questionsData.special_tiles || [])) {
        if (String(special.tile_id) === String(tileId)) {
          setPopupData({
            isSpecial: true,
            detail: {
              question: special.drawback,
              answer: "",
              bonus: null,
              drawback: null,
            }
          });
          found = true;
          break;
        }
      }
    }

    if (!found) {
      setNotFound(true);
    }

  }, [tileId]);

  if (notFound) {
    return (
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-40">
        <div className="bg-white rounded-lg shadow-lg p-6 w-[350px] text-center text-black">
          <h3 className="text-xl font-bold mb-2">Nenhuma pergunta encontrada</h3>
          <button className="px-4 py-2 mt-4 bg-blue-600 text-white rounded" onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    );
  }

  if (!popupData) return null;

  const { isSpecial, detail } = popupData;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[350px] max-w-[95vw] relative text-black">
        <button
          className="absolute right-4 top-4 text-gray-500 hover:text-red-400 font-bold text-xl"
          onClick={onClose}
          aria-label="Fechar popup"
        >
          ×
        </button>
        <h3 className="text-lg font-bold mb-3">
          {isSpecial ? "Casa Especial" : "Pergunta"}
        </h3>
        <p className="mb-2 text-base">{detail.question}</p>
        {!isSpecial && (
          <>
            {showResposta !== null && showResposta === "correta" && (
              <>
                <div className="mb-2">
                  <span className="font-semibold">Resposta:</span> <span>{detail.answer}</span>
                </div>
                {detail.bonus && (
                  <div className="mb-2">
                    <span className="font-semibold">Bônus:</span> <span>{detail.bonus}</span>
                  </div>
                )}
              </>
            )}
            {detail.drawback && showResposta === "errada" && (
              <div className="mb-2">
                <span className="font-semibold">Desafio:</span> <span>{detail.drawback}</span>
              </div>
            )}
          </>
        )}
        {isSpecial !== true && (
          <div className="flex justify-center gap-4 mt-4">
            <button
              className="px-4 py-2 bg-green-600 text-white rounded"
              onClick={() => setShowResposta("correta")}
            >
              Resposta Correta
            </button>
            <button
              className="px-4 py-2 bg-red-600 text-white rounded"
              onClick={() => setShowResposta("errada")}
            >
              Resposta Errada
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionPopUp;
