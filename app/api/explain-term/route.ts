import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { term, abbreviation, language, category } = await request.json();

    const prompt = `
以下の音楽用語について、アマチュアオーケストラ演奏家向けに分かりやすく解説してください。

用語: ${term}${abbreviation ? ` (略記: ${abbreviation})` : ""}
言語: ${language}
カテゴリ: ${category}

以下の点を含めて説明してください：
1. 用語の意味（日本語での意味）
2. 楽譜での表記方法（略記がある場合はそれも）
3. 実際の演奏での表現方法（どう演奏すべきか）
4. この曲での使われ方や重要性（可能であれば）

簡潔で実践的な説明をお願いします。200-300字程度で。
`;

    // 通常のOpenAI API（openai.com）を優先的に使用
    const openAIApiKey = process.env.OPENAI_API_KEY;
    
    if (openAIApiKey) {
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
              content: "あなたはクラシック音楽の専門家です。アマチュアオーケストラ演奏家向けに、音楽用語を分かりやすく実践的に解説してください。",
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
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      const explanation = data.choices[0]?.message?.content || "";
      return NextResponse.json({ explanation });
    }

    // Azure OpenAI Serviceを使用（フォールバック）
    const azureOpenAIApiKey = process.env.AZURE_OPENAI_API_KEY;
    const azureOpenAIEndpoint = process.env.AZURE_OPENAI_ENDPOINT;
    const azureOpenAIDeploymentName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME || "gpt-4";
    const azureOpenAIApiVersion = process.env.AZURE_OPENAI_API_VERSION || "2024-02-15-preview";

    if (azureOpenAIApiKey && azureOpenAIEndpoint) {
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
              content: "あなたはクラシック音楽の専門家です。アマチュアオーケストラ演奏家向けに、音楽用語を分かりやすく実践的に解説してください。",
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
      const explanation = data.choices[0]?.message?.content || "";
      return NextResponse.json({ explanation });
    }

    // APIキーがない場合はフォールバック
    const fallbackExplanations: Record<string, string> = {
      "Allegro con brio": "「速く、力強く」という意味の速度記号。この曲の第1楽章は、この指示に従って、速いテンポで力強く、エネルギッシュに演奏します。",
      "fortissimo": "「非常に強く」という意味の強弱記号。略記は「ff」。全楽器が一体となって、最大限の音量で演奏する箇所です。",
      "pianissimo": "「非常に弱く」という意味の強弱記号。略記は「pp」。息をひそめるような、非常に静かな演奏が求められます。",
      "crescendo": "「だんだん強く」という意味。略記は「cresc.」または「<」。音量を徐々に増やしていきます。",
      "diminuendo": "「だんだん弱く」という意味。略記は「dim.」または「>」。音量を徐々に減らしていきます。",
      "sforzando": "「突然強く」という意味。略記は「sf」。特定の音を強調して演奏します。運命動機などで使われます。",
      "staccato": "「スタッカート」- 音を短く切って演奏する奏法。各音を明確に、はっきりと区切って演奏します。",
      "legato": "「レガート」- 音を滑らかにつなげて演奏する奏法。音と音の間を途切れさせず、なめらかに演奏します。",
      "ritardando": "「だんだん遅く」という意味。略記は「rit.」。テンポを徐々に遅くします。終結部などで使われます。",
      "accelerando": "「だんだん速く」という意味。略記は「accel.」。テンポを徐々に速くします。コーダなどで使われます。",
    };

    const fallback = fallbackExplanations[term] || `${term}は、${category}に分類される音楽用語です。${language}語で、楽譜上で演奏の指示を表します。`;

    return NextResponse.json({ explanation: fallback });
  } catch (error) {
    console.error("Error explaining term:", error);
    return NextResponse.json({
      explanation: "用語の説明を取得できませんでした。",
    });
  }
}
