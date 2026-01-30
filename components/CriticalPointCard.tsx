"use client";

import { useState } from "react";

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

interface CriticalPointCardProps {
  point: CriticalPoint;
  isSelected: boolean;
  onSelect: () => void;
}

export default function CriticalPointCard({
  point,
  isSelected,
  onSelect,
}: CriticalPointCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  const priorityConfig = {
    critical: {
      label: "🔴 必須",
      color: "bg-red-100 border-red-300 text-red-800",
      badgeColor: "bg-red-500",
    },
    important: {
      label: "🟡 重要",
      color: "bg-yellow-100 border-yellow-300 text-yellow-800",
      badgeColor: "bg-yellow-500",
    },
    recommended: {
      label: "🟢 推奨",
      color: "bg-green-100 border-green-300 text-green-800",
      badgeColor: "bg-green-500",
    },
  };

  const config = priorityConfig[point.priority];

  return (
    <div
      className={`border-2 rounded-lg p-4 transition-all cursor-pointer ${
        isSelected
          ? `${config.color} shadow-lg`
          : "bg-white border-gray-200 hover:border-indigo-300 hover:shadow-md"
      }`}
      onClick={() => {
        onSelect();
        setShowDetails(!showDetails);
      }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`px-2 py-1 rounded text-xs font-semibold text-white ${config.badgeColor}`}
            >
              {config.label}
            </span>
            <span className="text-sm font-medium text-gray-600">
              小節 {point.measure}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            {point.title}
          </h3>
          <p className="text-sm text-gray-600">{point.description}</p>
        </div>
        <button className="ml-4 text-indigo-600 hover:text-indigo-800">
          {showDetails ? "▲" : "▼"}
        </button>
      </div>

      {showDetails && isSelected && (
        <div className="mt-4 pt-4 border-t border-gray-300">
          <div className="mb-4">
            <h4 className="font-semibold mb-2 text-gray-700">
              🎵 音源で確認
            </h4>
            <div className="aspect-video rounded-lg overflow-hidden">
              <iframe
                width="100%"
                height="100%"
                src={point.youtube_url}
                title={point.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-lg"
              ></iframe>
            </div>
          </div>
          {point.image_url && (
            <div className="mb-4">
              <h4 className="font-semibold mb-2 text-gray-700">📄 譜例</h4>
              <div className="bg-gray-100 rounded p-4 text-center text-gray-500">
                [譜例画像: {point.image_url}]
                <p className="text-xs mt-2">
                  ※ 実際のアプリでは楽譜画像が表示されます
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
