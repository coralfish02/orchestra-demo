# セットアップ手順

## 前提条件

- Node.js 18以上がインストールされていること
- npm または yarn がインストールされていること

**Node.jsがインストールされていない場合：**
→ [INSTALL_NODE.md](./INSTALL_NODE.md) を参照してインストールしてください。

## インストール手順

### 1. 依存関係のインストール

```bash
cd orchestra-practice-app
npm install
```

### 2. 環境変数の設定

プロジェクトルートに `.env.local` ファイルを作成し、以下の内容を追加してください：

```env
AZURE_OPENAI_API_KEY=your-api-key
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4
AZURE_OPENAI_API_VERSION=2024-02-15-preview
```

**Azure OpenAI Serviceのセットアップ方法：**

詳細は [AZURE_DEPLOY.md](./AZURE_DEPLOY.md) を参照してください。

**注意：** APIキーがない場合でも、アプリは動作しますが、フォールバックの背景解説が表示されます。

### 3. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

## 使用方法

1. **曲選択**: 現在はベートーヴェン交響曲第5番・第1楽章のみ対応
2. **パート選択**: Violin I, Violin II, Viola, Cello から選択
3. **背景解説**: AIが自動生成した曲の背景情報を確認
4. **重要箇所**: 優先度付きで表示される重要箇所を確認
5. **音源確認**: 各重要箇所のYouTube音源を再生

## トラブルシューティング

### APIキーエラーが発生する場合

- `.env.local` ファイルが正しく作成されているか確認
- APIキーが正しく設定されているか確認
- サーバーを再起動してください（環境変数の変更は再起動が必要です）

### 依存関係のエラー

```bash
rm -rf node_modules package-lock.json
npm install
```

### ポート3000が使用中の場合

```bash
npm run dev -- -p 3001
```

## 次のステップ

- 複数曲への対応
- MusicXML解析による自動重要箇所抽出
- Smart Digest音源生成機能
- モチベーションモード（サバイバル/没入）の実装
