"use client";

import { useState } from "react";
import PieceSelection from "@/components/PieceSelection";
import PracticeGuide from "@/components/PracticeGuide";
import beethoven5Data from "@/data/beethoven_5_data.json";

type Part = "Violin I" | "Violin II" | "Viola" | "Cello";

export default function Home() {
  const [selectedPiece, setSelectedPiece] = useState<string | null>(null);
  const [selectedPart, setSelectedPart] = useState<Part | null>(null);

  const handleSelection = (pieceId: string, part: Part) => {
    setSelectedPiece(pieceId);
    setSelectedPart(part);
  };

  const handleBack = () => {
    setSelectedPiece(null);
    setSelectedPart(null);
  };

  if (selectedPiece && selectedPart) {
    return (
      <PracticeGuide
        pieceData={beethoven5Data}
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
