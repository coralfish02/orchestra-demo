# 🚀 次のステップガイド

このアプリを動かすための手順を順番に説明します。

## ✅ 現在の状態

- ✅ プロジェクトファイル作成済み
- ✅ 依存関係インストール済み（`node_modules` が存在）
- ⏳ 環境変数の設定が必要
- ⏳ 開発サーバーの起動が必要

## 📋 ステップ1: Node.jsの確認

まず、Node.jsがインストールされているか確認してください：

```powershell
node --version
npm --version
```

**もしエラーが出る場合：**
→ [INSTALL_NODE.md](./INSTALL_NODE.md) を参照してNode.jsをインストールしてください。

## 📋 ステップ2: 環境変数の設定（2つの選択肢）

### 選択肢A: Azure OpenAI Serviceを使用する（推奨）

1. **Azure OpenAI Serviceのセットアップ**
   - [AZURE_DEPLOY.md](./AZURE_DEPLOY.md) の「1. Azure OpenAI Serviceのセットアップ」を参照
   - Azure Portalでリソースを作成
   - モデル（GPT-4またはGPT-3.5）をデプロイ
   - エンドポイントとAPIキーを取得

2. **`.env.local` ファイルを作成**

   プロジェクトルート（`orchestra-practice-app/`）に `.env.local` ファイルを作成：

   ```env
   AZURE_OPENAI_API_KEY=your-api-key-here
   AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
   AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4
   AZURE_OPENAI_API_VERSION=2024-02-15-preview
   ```

### 選択肢B: フォールバックモードで試す（APIキーなし）

APIキーを設定しなくても、アプリは動作します（デフォルトの背景解説が表示されます）。

`.env.local` ファイルは作成しなくてもOKです。

## 📋 ステップ3: 開発サーバーの起動

プロジェクトディレクトリで以下を実行：

```powershell
cd orchestra-practice-app
npm run dev
```

成功すると、以下のようなメッセージが表示されます：

```
  ▲ Next.js 14.2.5
  - Local:        http://localhost:3000
```

## 📋 ステップ4: ブラウザで確認

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

以下の画面が表示されるはずです：
1. **曲選択画面**: ベートーヴェン交響曲第5番が表示
2. **パート選択**: Violin I, Violin II, Viola, Cello から選択
3. **練習ガイド画面**: 背景解説と重要箇所リストが表示

## 📋 ステップ5: 動作確認

### 確認項目

- [ ] 曲選択画面が表示される
- [ ] パートを選択できる
- [ ] 「練習ガイドを開始」ボタンが動作する
- [ ] 背景解説が表示される（APIキーがある場合はAI生成、ない場合はデフォルト）
- [ ] 重要箇所リストが表示される
- [ ] 重要箇所をクリックすると詳細が展開される
- [ ] YouTube音源が埋め込まれている

## 🐛 トラブルシューティング

### エラー: "npm is not recognized"

→ Node.jsがインストールされていません。[INSTALL_NODE.md](./INSTALL_NODE.md) を参照してください。

### エラー: "Port 3000 is already in use"

別のポートを使用：

```powershell
npm run dev -- -p 3001
```

### エラー: "Cannot find module"

依存関係を再インストール：

```powershell
rm -rf node_modules package-lock.json
npm install
```

### APIキーエラー

- `.env.local` ファイルが正しく作成されているか確認
- 環境変数の値が正しいか確認（特にエンドポイントURLの末尾のスラッシュ）
- サーバーを再起動（環境変数の変更は再起動が必要）

## 🎯 次のステップ（動作確認後）

アプリが正常に動作したら：

1. **Azureへのデプロイ**
   - [AZURE_DEPLOY.md](./AZURE_DEPLOY.md) を参照
   - Azure App ServiceまたはAzure Functionsにデプロイ

2. **機能の拡張**
   - 複数曲への対応
   - モチベーションモード（サバイバル/没入）の実装
   - より詳細な重要箇所の抽出

3. **UIの改善**
   - デザインの調整
   - レスポンシブ対応の確認
   - アニメーションの追加

## 💡 ヒント

- 開発中はブラウザのコンソール（F12）を開いてエラーを確認
- Next.jsのホットリロード機能で、コードを変更すると自動的に反映されます
- `.env.local` ファイルは `.gitignore` に含まれているので、Gitにコミットされません
