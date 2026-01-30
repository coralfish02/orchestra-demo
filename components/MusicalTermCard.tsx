"use client";

import { useState } from "react";

interface MusicalTerm {
  term: string;
  abbreviation?: string;
  language: string;
  category: string;
  appears_in?: string;
}

interface MusicalTermCardProps {
  term: MusicalTerm;
}

export default function MusicalTermCard({ term }: MusicalTermCardProps) {
  const [explanation, setExplanation] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClick = async () => {
    if (explanation) {
      // 既に説明を取得している場合は展開/折りたたみ
      setIsExpanded(!isExpanded);
      return;
    }

    // 説明を取得
    setLoading(true);
    setIsExpanded(true);

    try {
      const response = await fetch("/api/explain-term", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          term: term.term,
          abbreviation: term.abbreviation,
          language: term.language,
          category: term.category,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setExplanation(data.explanation);
      } else {
        setExplanation("説明を取得できませんでした。");
      }
    } catch (error) {
      console.error("Error fetching explanation:", error);
      setExplanation("説明を取得できませんでした。");
    } finally {
      setLoading(false);
    }
  };

  const categoryColors: Record<string, string> = {
    速度記号: "bg-blue-100 text-blue-800 border-blue-300",
    強弱記号: "bg-red-100 text-red-800 border-red-300",
    奏法記号: "bg-green-100 text-green-800 border-green-300",
  };

  const categoryColor = categoryColors[term.category] || "bg-gray-100 text-gray-800 border-gray-300";

  return (
    <div
      className={`border-2 rounded-lg p-4 transition-all cursor-pointer ${
        isExpanded
          ? `${categoryColor} shadow-lg`
          : "bg-white border-gray-200 hover:border-indigo-300 hover:shadow-md"
      }`}
      onClick={handleClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold text-lg text-gray-800">
              {term.term}
            </span>
            {term.abbreviation && (
              <span className="text-sm text-gray-600">
                ({term.abbreviation})
              </span>
            )}
            <span className={`px-2 py-1 rounded text-xs font-semibold border ${categoryColor}`}>
              {term.category}
            </span>
          </div>
          <div className="text-sm text-gray-600 space-y-1">
            <p>
              <span className="font-medium">言語:</span> {term.language}
            </p>
            {term.appears_in && (
              <p>
                <span className="font-medium">使用箇所:</span> {term.appears_in}
              </p>
            )}
          </div>
        </div>
        <button className="ml-4 text-indigo-600 hover:text-indigo-800">
          {isExpanded ? "▲" : "▼"}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-300">
          {loading ? (
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ) : (
            <div>
              <h4 className="font-semibold mb-2 text-gray-700">📖 解説</h4>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {explanation}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
