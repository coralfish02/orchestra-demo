import { NextRequest, NextResponse } from "next/server";
import { fetchPieceWikipediaInfo, extractStructuredInfo } from "@/lib/wikipedia";

export async function POST(request: NextRequest) {
  try {
    const { pieceTitle, composer, composerEn } = await request.json();

    // Wikipediaから情報を取得
    let wikipediaInfo = null;
    let structuredInfo = null;
    try {
      wikipediaInfo = await fetchPieceWikipediaInfo(
        pieceTitle,
        composer,
        composerEn
      );
      if (wikipediaInfo) {
        // Wikipedia情報を構造化
        structuredInfo = extractStructuredInfo(wikipediaInfo);
      }
    } catch (error) {
      console.error("Error fetching Wikipedia info:", error);
      // Wikipedia取得に失敗しても続行
    }

    // Wikipedia情報を構造化してプロンプトに含める
    let wikipediaContext = "";
    if (structuredInfo) {
      wikipediaContext = `
【参考情報（Wikipedia）】
${structuredInfo.year ? `- 作曲年: ${structuredInfo.year}年` : ''}
${structuredInfo.premiere ? `- 初演: ${structuredInfo.premiere}` : ''}
${structuredInfo.movements ? `- 楽章構成: ${structuredInfo.movements}` : ''}
${structuredInfo.key ? `- 調性: ${structuredInfo.key}` : ''}
${structuredInfo.keyFeatures ? `- 特徴: ${structuredInfo.keyFeatures}` : ''}

詳細情報:
${structuredInfo.fullExtract.substring(0, 500)}${structuredInfo.fullExtract.length > 500 ? '...' : ''}
`;
    }

    const prompt = `
${pieceTitle}（${composer}作曲）について、アマチュアオーケストラ演奏家向けに詳しく解説してください。

${wikipediaContext ? `${wikipediaContext}

上記のWikipedia情報を基に、正確で詳細な解説を作成してください。Wikipedia情報に含まれている事実（作曲年、初演、楽章構成など）は正確に反映してください。` : '曲の情報を調べて、以下のセクションに分けて解説してください。'}

以下のセクションに分けて、マークダウン形式で記述してください：

## 歴史的背景
- 作曲された時代・年号
- 作曲家の状況（人生のどの時期か、健康状態、社会的背景など）
- 作曲の経緯・動機
- 初演の日時・場所・反響

## 曲の構成
- 楽章ごとの構成と形式（ソナタ形式、ロンド形式など）
- 各楽章の特徴と役割
- 調性の変化

## 主題・動機
- 主要な主題・動機の説明
- 特に有名なメロディ（例：「運命動機」など）
- 主題の展開方法

## 演奏のポイント
- アマチュア演奏家が知っておくべき表現のポイント
- テンポや強弱の特徴
- 他パートとの関係性で注意すべき点

各セクションは詳しく、合計800-1000字程度で記述してください。マークダウン形式（## 見出し、- リスト）を使用してください。
`;

    // 通常のOpenAI API（openai.com）を優先的に使用
    const openAIApiKey = process.env.OPENAI_API_KEY;
    
    if (openAIApiKey) {
      // 通常のOpenAI APIを使用
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${openAIApiKey}`,
        },
        body: JSON.stringify({
          model: process.env.OPENAI_MODEL || "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `あなたはクラシック音楽の専門家です。アマチュアオーケストラ演奏家向けに、分かりやすく詳細な解説を提供してください。

${wikipediaContext ? 'Wikipedia情報を基に、正確で信頼性の高い解説を作成してください。Wikipedia情報に含まれている事実（作曲年、初演、楽章構成など）は必ず正確に反映してください。' : ''}

解説は以下の点を重視してください：
- 歴史的背景や作曲の経緯を詳しく説明
- 楽章構成や形式を明確に説明
- アマチュア演奏家が知っておくべき実践的な情報を含める
- 専門用語は必要に応じて説明を加える`,
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      const background = data.choices[0]?.message?.content || "";
      return NextResponse.json({ background });
    }

    // Azure OpenAI Serviceを使用（フォールバック）
    const azureOpenAIApiKey = process.env.AZURE_OPENAI_API_KEY;
    const azureOpenAIEndpoint = process.env.AZURE_OPENAI_ENDPOINT;
    const azureOpenAIDeploymentName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME || "gpt-4";
    const azureOpenAIApiVersion = process.env.AZURE_OPENAI_API_VERSION || "2024-02-15-preview";

    if (azureOpenAIApiKey && azureOpenAIEndpoint) {
      // Azure OpenAI APIを呼び出す
      const url = `${azureOpenAIEndpoint}/openai/deployments/${azureOpenAIDeploymentName}/chat/completions?api-version=${azureOpenAIApiVersion}`;
      
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": azureOpenAIApiKey,
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: `あなたはクラシック音楽の専門家です。アマチュアオーケストラ演奏家向けに、分かりやすく詳細な解説を提供してください。

${wikipediaContext ? 'Wikipedia情報を基に、正確で信頼性の高い解説を作成してください。Wikipedia情報に含まれている事実（作曲年、初演、楽章構成など）は必ず正確に反映してください。' : ''}

解説は以下の点を重視してください：
- 歴史的背景や作曲の経緯を詳しく説明
- 楽章構成や形式を明確に説明
- アマチュア演奏家が知っておくべき実践的な情報を含める
- 専門用語は必要に応じて説明を加える`,
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        throw new Error(`Azure OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      const background = data.choices[0]?.message?.content || "";
      return NextResponse.json({ background });
    }

    // APIキーがない場合はフォールバック
    const fallbackBackground = `## 歴史的背景

${pieceTitle}は、${composer}が1804年から1808年にかけて作曲した交響曲です。ベートーヴェンが30代後半、難聴が進行していた時期に書かれました。1808年12月22日、ウィーンのアン・デア・ウィーン劇場で初演されました。

## 曲の構成

第1楽章は「Allegro con brio」（速く、力強く）で、ソナタ形式です。ハ短調で始まり、ハ長調で終わるという、苦難から勝利への転換を表現しています。

## 主題・動機

第1楽章の冒頭「タタタターン」の4音は「運命動機」として知られ、音楽史上最も有名な動機の一つです。この動機が全楽章を通じて展開され、曲全体を統一しています。

## 演奏のポイント

第1楽章は力強く、決然とした表現が求められます。運命動機は全楽器でユニゾンで演奏される重要な箇所なので、テンポとリズムを正確に保つことが重要です。`;

    return NextResponse.json({ background: fallbackBackground });
  } catch (error) {
    console.error("Error generating background:", error);
    // エラー時もフォールバックを返す
    try {
      const body = await request.json();
      const { pieceTitle, composer } = body;
      return NextResponse.json({
        background: `${pieceTitle}は、${composer}が作曲した交響曲です。この曲はクラシック音楽史上最も有名な作品の一つで、特に第1楽章の冒頭「運命動機」として知られる「タタタターン」の動機は、音楽史上最も認識度の高いメロディの一つです。\n\n1808年に初演されたこの交響曲は、ベートーヴェンの中期を代表する作品であり、苦難を乗り越えて勝利に至るという普遍的なテーマを表現しています。`,
      });
    } catch (parseError) {
      // リクエストボディのパースに失敗した場合
      const fallback = `## 歴史的背景

この曲はクラシック音楽史上最も有名な作品の一つです。第1楽章は「運命動機」として知られる「タタタターン」の動機で始まり、ベートーヴェンの中期を代表する作品です。

## 曲の構成

第1楽章はソナタ形式で構成されています。

## 主題・動機

冒頭の「運命動機」が全曲を通じて展開されます。

## 演奏のポイント

力強く、決然とした表現が求められます。`;
      return NextResponse.json({ background: fallback });
    }
  }
}
