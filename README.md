# 🎼 オーケストラ練習支援エージェント

アマチュアオーケストラ演奏家のための練習準備支援AIエージェントです。

## 機能

- **曲選択**: ベートーヴェン交響曲第5番・第1楽章に対応
- **パート選択**: Violin I, Violin II, Viola, Cello から選択
- **背景解説の自動生成**: Azure OpenAI Serviceを使用して曲の背景情報を生成
- **重要箇所リスト**: 優先度付きで重要箇所を表示
- **YouTube音源埋め込み**: 各重要箇所の音源を確認可能

## セットアップ

**⚠️ 重要：Node.jsがインストールされていない場合は、先に [INSTALL_NODE.md](./INSTALL_NODE.md) を参照してインストールしてください。**

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.local` ファイルを作成し、Azure OpenAI Serviceの設定を追加してください：

```env
AZURE_OPENAI_API_KEY=your-api-key
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4
AZURE_OPENAI_API_VERSION=2024-02-15-preview
```

**Azure OpenAI Serviceのセットアップ方法：**
→ [AZURE_DEPLOY.md](./AZURE_DEPLOY.md) を参照してください。

### 3. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

## プロジェクト構造

```
orchestra-practice-app/
├── app/
│   ├── api/
│   │   └── generate-background/
│   │       └── route.ts          # Azure OpenAI API統合
│   ├── layout.tsx                 # ルートレイアウト
│   ├── page.tsx                   # メインページ
│   └── globals.css                # グローバルスタイル
├── components/
│   ├── PieceSelection.tsx         # 曲・パート選択画面
│   ├── PracticeGuide.tsx          # 練習ガイド画面
│   └── CriticalPointCard.tsx      # 重要箇所カード
├── data/
│   └── beethoven_5_data.json      # ベートーヴェン第5番のデータ
└── package.json
```

## 技術スタック

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Azure OpenAI Service** (GPT-4 / GPT-3.5)

## 他の人に共有する方法

このアプリを他の人に共有する方法は [SHARING_GUIDE.md](./SHARING_GUIDE.md) を参照してください。

主な方法：
- **GitHubリポジトリ**: コードを共有
- **Vercel**: 無料で簡単にデプロイ（推奨）
- **Azure App Service**: Azure環境でデプロイ

## 今後の拡張予定

- MusicXML解析による自動重要箇所抽出
- 複数曲への対応
- Smart Digest音源生成
- モチベーションモード（サバイバル/没入）の実装
- インタラクティブな譜例表示

## ライセンス

MIT
