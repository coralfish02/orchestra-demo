import { NextRequest, NextResponse } from "next/server";
import piecesList from "@/data/pieces-list.json";

export async function GET(
  request: NextRequest,
  { params }: { params: { pieceId: string } }
) {
  try {
    const pieceId = params.pieceId;

    const piece = piecesList.pieces.find((p) => p.piece_id === pieceId);

    if (!piece) {
      return NextResponse.json(
        { error: "Piece not found" },
        { status: 404 }
      );
    }

    // データファイルがある場合は読み込む
    let pieceData = null;
    if (piece.data_file) {
      try {
        pieceData = await import(`@/data/${piece.data_file}`);
      } catch (error) {
        console.error(`Error loading piece data: ${piece.data_file}`, error);
      }
    }

    return NextResponse.json({
      ...piece,
      data: pieceData?.default || null,
    });
  } catch (error) {
    console.error("Error fetching piece:", error);
    return NextResponse.json(
      { error: "Failed to fetch piece" },
      { status: 500 }
    );
  }
}
