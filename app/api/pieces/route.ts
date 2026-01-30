import { NextRequest, NextResponse } from "next/server";
import piecesList from "@/data/pieces-list.json";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q") || "";
    const composer = searchParams.get("composer") || "";
    const genre = searchParams.get("genre") || "";

    let filteredPieces = piecesList.pieces;

    // 検索クエリでフィルタリング
    if (query) {
      const lowerQuery = query.toLowerCase();
      filteredPieces = filteredPieces.filter(
        (piece) =>
          piece.title.toLowerCase().includes(lowerQuery) ||
          piece.composer.toLowerCase().includes(lowerQuery) ||
          piece.composer_en.toLowerCase().includes(lowerQuery) ||
          piece.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
      );
    }

    // 作曲家でフィルタリング
    if (composer) {
      filteredPieces = filteredPieces.filter(
        (piece) =>
          piece.composer.toLowerCase().includes(composer.toLowerCase()) ||
          piece.composer_en.toLowerCase().includes(composer.toLowerCase())
      );
    }

    // ジャンルでフィルタリング
    if (genre) {
      filteredPieces = filteredPieces.filter(
        (piece) => piece.genre === genre
      );
    }

    // 人気度でソート（降順）
    filteredPieces.sort((a, b) => b.popularity - a.popularity);

    return NextResponse.json({
      pieces: filteredPieces,
      total: filteredPieces.length,
    });
  } catch (error) {
    console.error("Error fetching pieces:", error);
    return NextResponse.json(
      { error: "Failed to fetch pieces" },
      { status: 500 }
    );
  }
}
