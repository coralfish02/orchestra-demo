"use client";

import { useState, useEffect } from "react";
import PieceSelection from "@/components/PieceSelection";
import PracticeGuide from "@/components/PracticeGuide";

type Part = "Violin I" | "Violin II" | "Viola" | "Cello";

export default function Home() {
  const [selectedPieceId, setSelectedPieceId] = useState<string | null>(null);
  const [selectedPart, setSelectedPart] = useState<Part | null>(null);
  const [pieceData, setPieceData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSelection = async (pieceId: string, part: Part) => {
    setSelectedPieceId(pieceId);
    setSelectedPart(part);
    setLoading(true);

    try {
      // 曲データを取得
      const response = await fetch(`/api/pieces/${pieceId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.data) {
          // データファイルがある場合
          setPieceData({
            ...data.data,
            composer_en: data.composer_en, // composer_enを追加
          });
        } else {
          // データファイルがない場合、基本情報から作成
          setPieceData({
            piece_id: data.piece_id,
            title: data.title,
            composer: data.composer,
            composer_en: data.composer_en, // composer_enを追加
            movement: data.movements[0]?.title || "第1楽章",
            parts: data.parts,
            critical_points: [],
            musical_terms: [],
          });
        }
      }
    } catch (error) {
      console.error("Error fetching piece data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setSelectedPieceId(null);
    setSelectedPart(null);
    setPieceData(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">曲データを読み込んでいます...</p>
        </div>
      </div>
    );
  }

  if (selectedPieceId && selectedPart && pieceData) {
    return (
      <PracticeGuide
        pieceData={pieceData}
        selectedPart={selectedPart}
        onBack={handleBack}
      />
    );
  }

  return (
    <PieceSelection
      onSelect={(pieceId, part) => handleSelection(pieceId, part as Part)}
    />
  );
}
