"use client";

import { useState, useEffect } from "react";

type Part = "Violin I" | "Violin II" | "Viola" | "Cello";

interface Piece {
  piece_id: string;
  title: string;
  composer: string;
  composer_en: string;
  opus: string;
  year: number;
  genre: string;
  movements: Array<{ number: number; title: string; key: string }>;
  parts: string[];
  data_file: string | null;
  popularity: number;
  tags: string[];
}

interface PieceSelectionProps {
  onSelect: (pieceId: string, part: Part) => void;
}

export default function PieceSelection({ onSelect }: PieceSelectionProps) {
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPiece, setSelectedPiece] = useState<Piece | null>(null);
  const [selectedPart, setSelectedPart] = useState<Part | null>(null);

  useEffect(() => {
    const fetchPieces = async () => {
      try {
        const response = await fetch("/api/pieces");
        if (response.ok) {
          const data = await response.json();
          setPieces(data.pieces);
        }
      } catch (error) {
        console.error("Error fetching pieces:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPieces();
  }, []);

  const handlePartSelect = (part: Part) => {
    setSelectedPart(part);
  };

  const handleStart = () => {
    if (selectedPiece && selectedPart) {
      onSelect(selectedPiece.piece_id, selectedPart);
    }
  };

  // 検索でフィルタリング
  const filteredPieces = pieces.filter(
    (piece) =>
      piece.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      piece.composer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      piece.composer_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      piece.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

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
              曲を検索・選択
            </h2>

            {/* 検索バー */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="曲名、作曲家、タグで検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none text-lg"
              />
            </div>

            {/* 曲一覧 */}
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">曲を読み込んでいます...</p>
              </div>
            ) : filteredPieces.length === 0 ? (
              <div className="text-center py-8 text-gray-600">
                <p>検索結果が見つかりませんでした。</p>
                <p className="text-sm mt-2">別のキーワードで検索してください。</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredPieces.map((piece) => (
                  <div
                    key={piece.piece_id}
                    onClick={() => setSelectedPiece(piece)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedPiece?.piece_id === piece.piece_id
                        ? "bg-indigo-600 text-white border-indigo-700 shadow-lg"
                        : "bg-white border-gray-300 hover:border-indigo-400 hover:shadow-md"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3
                          className={`text-lg font-semibold mb-1 ${
                            selectedPiece?.piece_id === piece.piece_id
                              ? "text-white"
                              : "text-gray-800"
                          }`}
                        >
                          {piece.title}
                        </h3>
                        <p
                          className={`text-sm mb-1 ${
                            selectedPiece?.piece_id === piece.piece_id
                              ? "text-indigo-100"
                              : "text-gray-600"
                          }`}
                        >
                          {piece.composer} ({piece.year})
                        </p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {piece.movements.slice(0, 1).map((movement, idx) => (
                            <span
                              key={idx}
                              className={`px-2 py-1 rounded text-xs ${
                                selectedPiece?.piece_id === piece.piece_id
                                  ? "bg-indigo-500 text-white"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {movement.title}
                            </span>
                          ))}
                          {piece.data_file && (
                            <span
                              className={`px-2 py-1 rounded text-xs ${
                                selectedPiece?.piece_id === piece.piece_id
                                  ? "bg-green-500 text-white"
                                  : "bg-green-100 text-green-700"
                              }`}
                            >
                              ✓ データあり
                            </span>
                          )}
                        </div>
                      </div>
                      {selectedPiece?.piece_id === piece.piece_id && (
                        <div className="ml-4 text-2xl">✓</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
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
              disabled={!selectedPiece || !selectedPart}
              className={`px-8 py-4 rounded-lg font-semibold text-lg transition-all ${
                selectedPiece && selectedPart
                  ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg hover:shadow-xl transform hover:scale-105"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              練習ガイドを開始
            </button>
            {selectedPiece && !selectedPiece.data_file && (
              <p className="mt-4 text-sm text-yellow-600">
                ⚠️ この曲の詳細データはまだ準備中です。基本的な情報のみ表示されます。
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
