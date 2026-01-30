/**
 * Wikipedia API から情報を取得するユーティリティ関数
 */

interface WikipediaSummary {
  title: string;
  extract: string;
  extract_html: string;
  thumbnail?: {
    source: string;
    width: number;
    height: number;
  };
  pageid: number;
  content_urls: {
    desktop: {
      page: string;
    };
  };
}

interface WikipediaSearchResult {
  title: string;
  pageid: number;
  snippet: string;
}

/**
 * Wikipedia REST API からページの要約を取得
 * @param title 検索するタイトル（日本語または英語）
 * @param lang 言語コード（デフォルト: 'ja'）
 * @returns Wikipediaの要約情報
 */
export async function fetchWikipediaSummary(
  title: string,
  lang: string = "ja"
): Promise<WikipediaSummary | null> {
  try {
    // URLエンコード
    const encodedTitle = encodeURIComponent(title);
    const url = `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodedTitle}`;

    const response = await fetch(url, {
      headers: {
        "User-Agent": "OrchestraPracticeApp/1.0 (https://orchestra-demo.vercel.app)",
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        console.log(`Wikipedia page not found: ${title}`);
        return null;
      }
      throw new Error(`Wikipedia API error: ${response.statusText}`);
    }

    const data: WikipediaSummary = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching Wikipedia summary for "${title}":`, error);
    return null;
  }
}

/**
 * Wikipedia Search API でページを検索
 * @param query 検索クエリ
 * @param lang 言語コード（デフォルト: 'ja'）
 * @returns 検索結果のリスト
 */
export async function searchWikipedia(
  query: string,
  lang: string = "ja"
): Promise<WikipediaSearchResult[]> {
  try {
    const encodedQuery = encodeURIComponent(query);
    const url = `https://${lang}.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=${encodedQuery}&srlimit=5&origin=*`;

    const response = await fetch(url, {
      headers: {
        "User-Agent": "OrchestraPracticeApp/1.0 (https://orchestra-demo.vercel.app)",
      },
    });

    if (!response.ok) {
      throw new Error(`Wikipedia Search API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.query?.search || [];
  } catch (error) {
    console.error(`Error searching Wikipedia for "${query}":`, error);
    return [];
  }
}

/**
 * 曲名からWikipediaページを検索して要約を取得
 * 複数の検索パターンを試行
 * @param pieceTitle 曲名（日本語）
 * @param composer 作曲家名（日本語）
 * @param composerEn 作曲家名（英語）
 * @returns Wikipediaの要約情報
 */
export async function fetchPieceWikipediaInfo(
  pieceTitle: string,
  composer: string,
  composerEn?: string
): Promise<WikipediaSummary | null> {
  // 複数の検索パターンを試行
  const searchPatterns = [
    `${pieceTitle} (${composer})`, // 例: "交響曲第5番 (ベートーヴェン)"
    pieceTitle, // 例: "交響曲第5番"
    `${pieceTitle} (${composerEn || composer})`, // 例: "交響曲第5番 (Beethoven)"
  ];

  // まず日本語版を試行
  for (const pattern of searchPatterns) {
    const result = await fetchWikipediaSummary(pattern, "ja");
    if (result) {
      return result;
    }
  }

  // 日本語版で見つからない場合、英語版を試行
  if (composerEn) {
    const englishPatterns = [
      `${pieceTitle} (${composerEn})`,
      pieceTitle,
    ];

    for (const pattern of englishPatterns) {
      const result = await fetchWikipediaSummary(pattern, "en");
      if (result) {
        return result;
      }
    }
  }

  // 検索APIで見つける
  const searchResults = await searchWikipedia(`${pieceTitle} ${composer}`, "ja");
  if (searchResults.length > 0) {
    const firstResult = await fetchWikipediaSummary(searchResults[0].title, "ja");
    if (firstResult) {
      return firstResult;
    }
  }

  return null;
}

/**
 * Wikipedia情報から重要な情報を抽出・構造化
 * @param wikipediaInfo Wikipediaの要約情報
 * @returns 構造化された情報
 */
export function extractStructuredInfo(wikipediaInfo: WikipediaSummary) {
  const extract = wikipediaInfo.extract;
  
  // 作曲年を抽出（4桁の数字を探す）
  const yearMatch = extract.match(/(\d{4})年/);
  const year = yearMatch ? yearMatch[1] : null;
  
  // 初演情報を抽出
  const premiereMatch = extract.match(/初演[はが]?[^\n。]*/);
  const premiere = premiereMatch ? premiereMatch[0] : null;
  
  // 楽章構成を抽出
  const movementsMatch = extract.match(/(第[一二三四五六七八九十\d]+楽章|楽章[はが]?[^\n。]*)/);
  const movements = movementsMatch ? movementsMatch[0] : null;
  
  // 調性を抽出
  const keyMatch = extract.match(/([ハニホヘトイロ][長短]調)/);
  const key = keyMatch ? keyMatch[1] : null;
  
  // 重要な特徴を抽出（最初の2-3文）
  const sentences = extract.split(/[。\n]/).filter(s => s.trim().length > 0);
  const keyFeatures = sentences.slice(0, 3).join('。');
  
  return {
    year,
    premiere,
    movements,
    key,
    keyFeatures,
    fullExtract: extract,
  };
}
