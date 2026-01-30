import { AzureFunction, Context, HttpRequest } from "@azure/functions";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  try {
    const { pieceTitle, composer } = req.body;

    // Azure OpenAI Serviceを使用して背景解説を生成
    const azureOpenAIApiKey = process.env.AZURE_OPENAI_API_KEY;
    const azureOpenAIEndpoint = process.env.AZURE_OPENAI_ENDPOINT;
    const azureOpenAIDeploymentName =
      process.env.AZURE_OPENAI_DEPLOYMENT_NAME || "gpt-4";
    const azureOpenAIApiVersion =
      process.env.AZURE_OPENAI_API_VERSION || "2024-02-15-preview";

    if (!azureOpenAIApiKey || !azureOpenAIEndpoint) {
      // APIキーがない場合はフォールバック
      context.res = {
        status: 200,
        body: {
          background: `${pieceTitle}は、${composer}が作曲した交響曲です。この曲はクラシック音楽史上最も有名な作品の一つで、特に第1楽章の冒頭「運命動機」として知られる「タタタターン」の動機は、音楽史上最も認識度の高いメロディの一つです。\n\n1808年に初演されたこの交響曲は、ベートーヴェンの中期を代表する作品であり、苦難を乗り越えて勝利に至るという普遍的なテーマを表現しています。`,
        },
      };
      return;
    }

    const prompt = `
以下の情報を元に、${pieceTitle}（${composer}作曲）の歴史的背景を、アマチュア演奏家向けに300字程度で日本語で解説してください。

重視すること：
- いつ、どのような状況で作曲されたか
- 曲の特徴・聴きどころ
- 初演の反響や歴史的意義
- 演奏する際に知っておくと役立つ情報

簡潔で分かりやすい説明をお願いします。
`;

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
            content:
              "あなたはクラシック音楽の専門家です。アマチュアオーケストラ演奏家向けに、分かりやすく簡潔な解説を提供してください。",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error(`Azure OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const background = data.choices[0]?.message?.content || "";

    context.res = {
      status: 200,
      body: { background },
    };
  } catch (error) {
    context.log.error("Error generating background:", error);
    // エラー時もフォールバックを返す
    const { pieceTitle, composer } = req.body;
    context.res = {
      status: 200,
      body: {
        background: `${pieceTitle}は、${composer}が作曲した交響曲です。この曲はクラシック音楽史上最も有名な作品の一つで、特に第1楽章の冒頭「運命動機」として知られる「タタタターン」の動機は、音楽史上最も認識度の高いメロディの一つです。\n\n1808年に初演されたこの交響曲は、ベートーヴェンの中期を代表する作品であり、苦難を乗り越えて勝利に至るという普遍的なテーマを表現しています。`,
      },
    };
  }
};

export default httpTrigger;
