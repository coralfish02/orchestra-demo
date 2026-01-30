"use client";

import { useState } from "react";
import beethoven5Data from "@/data/beethoven_5_data.json";

type Part = "Violin I" | "Violin II" | "Viola" | "Cello";

interface PieceSelectionProps {
  onSelect: (pieceId: string, part: Part) => void;
}

export default function PieceSelection({ onSelect }: PieceSelectionProps) {
  const [selectedPart, setSelectedPart] = useState<Part | null>(null);

  const handlePartSelect = (part: Part) => {
    setSelectedPart(part);
  };

  const handleStart = () => {
    if (selectedPart) {
      onSelect(beethoven5Data.piece_id, selectedPart);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-4xl font-bold text-center mb-2 text-gray-800">
            🎼 オーケストラ練習支援エージェント
          </h1>
          <p className="text-center text-gray-600 mb-8">
            アマチュア演奏家のための練習準備を効率化
          </p>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">
              曲を選択
            </h2>
            <div className="bg-indigo-50 rounded-lg p-6 border-2 border-indigo-200">
              <h3 className="text-xl font-semibold mb-2 text-indigo-900">
                {beethoven5Data.title}
              </h3>
              <p className="text-gray-700 mb-1">
                <span className="font-medium">作曲者：</span>
                {beethoven5Data.composer}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">楽章：</span>
                {beethoven5Data.movement}
              </p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">
              楽器パートを選択
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {beethoven5Data.parts.map((part) => (
                <button
                  key={part}
                  onClick={() => handlePartSelect(part as Part)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedPart === part
                      ? "bg-indigo-600 text-white border-indigo-700 shadow-lg transform scale-105"
                      : "bg-white text-gray-700 border-gray-300 hover:border-indigo-400 hover:shadow-md"
                  }`}
                >
                  <div className="font-semibold">{part}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={handleStart}
              disabled={!selectedPart}
              className={`px-8 py-4 rounded-lg font-semibold text-lg transition-all ${
                selectedPart
                  ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg hover:shadow-xl transform hover:scale-105"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              練習ガイドを開始
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
