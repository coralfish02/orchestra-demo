# 🏗️ システムアーキテクチャ

## 📐 全体構成図

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Next.js 14)                    │
│                    (Vercelにデプロイ)                        │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Pages & Components                                   │  │
│  │  - app/page.tsx (メインページ)                        │  │
│  │  - components/PieceSelection.tsx (曲選択)            │  │
│  │  - components/PracticeGuide.tsx (練習ガイド)          │  │
│  │  - components/CriticalPointCard.tsx (重要箇所)       │  │
│  │  - components/MarkdownRenderer.tsx (マークダウン)     │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Static Data                                          │  │
│  │  - data/beethoven_5_data.json (楽曲データ)           │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  │ HTTP Request
                  │ POST /api/generate-background
                  ▼
┌─────────────────────────────────────────────────────────────┐
│              Backend API (Next.js API Routes)               │
│                    (Vercel Serverless)                      │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  API Route: /api/generate-background                 │  │
│  │  - app/api/generate-background/route.ts              │  │
│  │  - リクエスト: { pieceTitle, composer }              │  │
│  │  - レスポンス: { background }                        │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  │ HTTPS Request
                  │ (API Key認証)
                  ▼
┌─────────────────────────────────────────────────────────────┐
│           Azure OpenAI Service (GPT-4)                      │
│                                                             │
│  - エンドポイント: https://your-resource.openai.azure.com/ │
│  - デプロイメント: gpt-4                                   │
│  - 機能: 曲の背景解説を生成                                 │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 データフロー

### 1. ユーザーがアプリにアクセス

```
ユーザー
  ↓
ブラウザ (https://orchestra-demo.vercel.app)
  ↓
Vercel CDN (静的ファイル配信)
  ↓
Next.js Frontend (React)
```

### 2. 曲とパートを選択

```
ユーザー操作
  ↓
PieceSelection コンポーネント
  ↓
PracticeGuide コンポーネントに遷移
```

### 3. 背景解説を生成

```
PracticeGuide コンポーネント
  ↓
fetch('/api/generate-background', {
  method: 'POST',
  body: { pieceTitle, composer }
})
  ↓
Next.js API Route (Serverless Function)
  ↓
Azure OpenAI Service API
  ↓
GPT-4 が背景解説を生成
  ↓
API Route がレスポンスを返す
  ↓
PracticeGuide コンポーネントが表示
```

### 4. 重要箇所を表示

```
PracticeGuide コンポーネント
  ↓
beethoven_5_data.json を読み込み
  ↓
CriticalPointCard コンポーネントで表示
  ↓
YouTube音源を埋め込み
```

## 🧩 コンポーネント構成

### Frontend Layer

```
app/
├── layout.tsx              # ルートレイアウト
├── page.tsx                # メインページ（ルーティング）
├── globals.css             # グローバルスタイル
└── api/
    └── generate-background/
        └── route.ts        # API Route（Serverless Function）

components/
├── PieceSelection.tsx      # 曲・パート選択画面
├── PracticeGuide.tsx       # 練習ガイド画面
├── CriticalPointCard.tsx   # 重要箇所カード
└── MarkdownRenderer.tsx   # マークダウン表示

data/
└── beethoven_5_data.json  # 楽曲データ（静的JSON）
```

## 🔌 API設計

### POST /api/generate-background

**リクエスト:**
```json
{
  "pieceTitle": "交響曲第5番 ハ短調『運命』",
  "composer": "ルートヴィヒ・ヴァン・ベートーヴェン"
}
```

**レスポンス:**
```json
{
  "background": "## 歴史的背景\n\n..."
}
```

**処理フロー:**
1. リクエストボディから `pieceTitle` と `composer` を取得
2. 環境変数から Azure OpenAI Service の認証情報を取得
3. Azure OpenAI API にリクエストを送信
4. GPT-4 が背景解説を生成
5. マークダウン形式でレスポンスを返す

## 🔐 認証・セキュリティ

### 環境変数（Vercel）

```
AZURE_OPENAI_API_KEY        # Azure OpenAI Service のAPIキー
AZURE_OPENAI_ENDPOINT       # エンドポイントURL
AZURE_OPENAI_DEPLOYMENT_NAME # デプロイメント名（gpt-4）
AZURE_OPENAI_API_VERSION   # APIバージョン
```

**セキュリティ対策:**
- 環境変数はVercelのダッシュボードで管理
- `.env.local` はGitにコミットしない（`.gitignore`に含まれている）
- APIキーはサーバーサイドでのみ使用

## ☁️ デプロイメント構成

### Vercel

```
GitHub Repository
  ↓ (自動デプロイ)
Vercel Build Process
  ↓
- npm install (依存関係のインストール)
- npm run build (Next.jsのビルド)
  ↓
Vercel Edge Network
  ↓
- 静的ファイル: CDN経由で配信
- API Routes: Serverless Functionsとして実行
```

**デプロイメントの種類:**
1. **Production**: メインブランチ（main）へのプッシュ
2. **Preview**: 他のブランチやプルリクエスト
3. **Development**: ローカル環境

## 📊 データストレージ

### 静的データ

- **beethoven_5_data.json**: 楽曲のメタデータと重要箇所
  - リポジトリに含まれる
  - ビルド時にバンドルされる
  - クライアントサイドで読み込まれる

### 動的データ

- **背景解説**: Azure OpenAI Service でリアルタイム生成
  - キャッシュなし（毎回生成）
  - 将来的にはキャッシュを追加可能

## 🔄 状態管理

### クライアントサイド

- **React State**: `useState` フックを使用
  - `selectedPiece`: 選択された曲
  - `selectedPart`: 選択されたパート
  - `background`: 生成された背景解説
  - `loading`: ローディング状態

### サーバーサイド

- **Serverless Functions**: ステートレス
  - 各リクエストは独立して処理
  - セッション管理なし

## 🚀 パフォーマンス最適化

### 1. 静的生成（SSG）

- 曲選択画面は静的生成可能
- データはビルド時にバンドル

### 2. サーバーサイドレンダリング（SSR）

- API Route はサーバーサイドで実行
- クライアントに機密情報を露出しない

### 3. CDN配信

- VercelのEdge Network経由で配信
- グローバルに高速アクセス

### 4. コード分割

- Next.jsが自動的にコード分割
- 必要なコンポーネントのみ読み込む

## 🔍 エラーハンドリング

### フロントエンド

```typescript
try {
  const response = await fetch('/api/generate-background', ...);
  if (response.ok) {
    // 成功時の処理
  } else {
    // フォールバック表示
  }
} catch (error) {
  // エラー時のフォールバック
}
```

### バックエンド

```typescript
try {
  // Azure OpenAI API呼び出し
} catch (error) {
  // エラー時はデフォルトの背景解説を返す
  return NextResponse.json({ background: fallbackBackground });
}
```

## 📈 スケーラビリティ

### 現在の構成

- **Vercel Serverless**: 自動スケーリング
- **Azure OpenAI Service**: 従量課金制
- **静的ファイル**: CDN経由で無制限スケール

### 将来的な拡張

- **データベース**: Firestore や PostgreSQL を追加可能
- **キャッシュ**: Redis や Vercel KV を追加可能
- **認証**: NextAuth.js を追加可能

## 🛠️ 技術スタック

### Frontend
- **Next.js 14**: React フレームワーク（App Router）
- **TypeScript**: 型安全性
- **Tailwind CSS**: スタイリング
- **React**: UIライブラリ

### Backend
- **Next.js API Routes**: Serverless Functions
- **Azure OpenAI Service**: AI生成

### Infrastructure
- **Vercel**: ホスティング・デプロイ
- **GitHub**: バージョン管理・CI/CD

### Development Tools
- **npm**: パッケージ管理
- **Git**: バージョン管理
- **ESLint**: コード品質

## 🔄 CI/CD パイプライン

```
開発者がコードを変更
  ↓
git commit & push
  ↓
GitHub Repository
  ↓ (自動トリガー)
Vercel Build
  ↓
- 依存関係のインストール
- ビルド
- デプロイ
  ↓
自動的に本番環境に反映
```

## 📝 まとめ

**アーキテクチャの特徴:**
- ✅ **シンプル**: フロントエンドとAPI Routeのみ
- ✅ **サーバーレス**: VercelのServerless Functions
- ✅ **スケーラブル**: 自動スケーリング
- ✅ **セキュア**: 環境変数でAPIキーを管理
- ✅ **高速**: CDN経由で配信

**データフロー:**
1. ユーザーがブラウザでアクセス
2. Next.jsがページをレンダリング
3. ユーザーが曲・パートを選択
4. API RouteがAzure OpenAI Serviceを呼び出し
5. 背景解説を生成して表示
