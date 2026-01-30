"use client";

import { useState, useEffect } from "react";
import CriticalPointCard from "./CriticalPointCard";
import MarkdownRenderer from "./MarkdownRenderer";

type Part = "Violin I" | "Violin II" | "Viola" | "Cello";

interface CriticalPoint {
  id: number;
  measure: string;
  part: string;
  priority: "critical" | "important" | "recommended";
  title: string;
  description: string;
  image_url: string;
  youtube_url: string;
}

interface PieceData {
  piece_id: string;
  title: string;
  composer: string;
  movement: string;
  parts: string[];
  critical_points: CriticalPoint[];
}

interface PracticeGuideProps {
  pieceData: PieceData;
  selectedPart: Part;
  onBack: () => void;
}

export default function PracticeGuide({
  pieceData,
  selectedPart,
  onBack,
}: PracticeGuideProps) {
  const [background, setBackground] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [selectedPoint, setSelectedPoint] = useState<CriticalPoint | null>(null);

  // 選択されたパートに関連する重要箇所をフィルタリング
  const relevantPoints = pieceData.critical_points.filter(
    (point) =>
      point.part === selectedPart ||
      point.part === "All" ||
      point.part.split(", ").includes(selectedPart)
  );

  // 優先度でソート（critical > important > recommended）
  const sortedPoints = [...relevantPoints].sort((a, b) => {
    const priorityOrder = { critical: 0, important: 1, recommended: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  useEffect(() => {
    const fetchBackground = async () => {
      try {
        const response = await fetch("/api/generate-background", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            pieceTitle: pieceData.title,
            composer: pieceData.composer,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setBackground(data.background);
        } else {
          // フォールバック
          setBackground(
            `${pieceData.title}は、${pieceData.composer}が作曲した交響曲です。第1楽章は「運命動機」として知られる「タタタターン」の動機で始まり、クラシック音楽史上最も有名な作品の一つです。`
          );
        }
      } catch (error) {
        console.error("Error fetching background:", error);
        setBackground(`## 歴史的背景

${pieceData.title}は、${pieceData.composer}が作曲した交響曲です。第1楽章は「運命動機」として知られる「タタタターン」の動機で始まり、クラシック音楽史上最も有名な作品の一つです。

## 曲の構成

第1楽章はソナタ形式で、ハ短調で始まります。

## 主題・動機

冒頭の「運命動機」が全曲を通じて展開されます。

## 演奏のポイント

力強く、決然とした表現が求められます。`);
      } finally {
        setLoading(false);
      }
    };

    fetchBackground();
  }, [pieceData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={onBack}
          className="mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors text-gray-700"
        >
          ← 戻る
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gray-800">
            {pieceData.title}
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            {pieceData.movement} - {selectedPart}
          </p>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-3 text-gray-700">
              📚 曲の背景
            </h2>
            {loading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-6 bg-gray-200 rounded w-1/4 mt-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </div>
            ) : (
              <MarkdownRenderer content={background} />
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <h2 className="text-2xl font-semibold mb-6 text-gray-700">
            ⭐ 重要箇所リスト（優先度順）
          </h2>

          <div className="space-y-4">
            {sortedPoints.map((point) => (
              <CriticalPointCard
                key={point.id}
                point={point}
                isSelected={selectedPoint?.id === point.id}
                onSelect={() =>
                  setSelectedPoint(selectedPoint?.id === point.id ? null : point)
                }
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
