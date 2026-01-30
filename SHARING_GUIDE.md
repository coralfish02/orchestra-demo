# 📤 アプリを他の人に共有する方法

## 方法1: GitHubにプッシュして共有（推奨）

### ステップ1: GitHubリポジトリを作成

1. [GitHub](https://github.com) にログイン
2. 「New repository」をクリック
3. リポジトリ名を入力（例: `orchestra-practice-app`）
4. 「Create repository」をクリック

### ステップ2: Gitを初期化してプッシュ

```powershell
cd "C:\Users\hp\OneDrive - Sophia Univ. Students\ドキュメント\googlehackthon2026\demo\orchestra-practice-app"

# Gitを初期化（まだの場合）
git init

# ファイルを追加
git add .

# コミット
git commit -m "Initial commit: Orchestra Practice App"

# GitHubリポジトリを追加（YOUR_USERNAMEとYOUR_REPO_NAMEを置き換え）
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# プッシュ
git branch -M main
git push -u origin main
```

### ステップ3: 他の人に共有

GitHubリポジトリのURLを共有：
```
https://github.com/YOUR_USERNAME/YOUR_REPO_NAME
```

### ステップ4: 他の人が使う方法

```powershell
# リポジトリをクローン
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME

# 依存関係をインストール
npm install

# .env.localファイルを作成（Azure OpenAI Serviceの設定）
# （.env.exampleを参考に）

# 開発サーバーを起動
npm run dev
```

## 方法2: Vercelにデプロイ（無料・簡単）

### ステップ1: Vercelアカウントを作成

1. [Vercel](https://vercel.com) にアクセス
2. GitHubアカウントでサインアップ

### ステップ2: プロジェクトをインポート

1. Vercelダッシュボードで「Add New Project」をクリック
2. GitHubリポジトリを選択
3. 「Import」をクリック

### ステップ3: 環境変数を設定

Vercelのプロジェクト設定で、以下の環境変数を追加：

```
AZURE_OPENAI_API_KEY=your-api-key
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4
AZURE_OPENAI_API_VERSION=2024-02-15-preview
```

### ステップ4: デプロイ

「Deploy」をクリック。数分で完了します。

### ステップ5: URLを共有

デプロイが完了すると、以下のようなURLが生成されます：
```
https://your-app-name.vercel.app
```

このURLを共有すれば、誰でもアクセスできます。

## 方法3: Azure App Serviceにデプロイ

### ステップ1: Azure CLIでログイン

```powershell
az login
```

### ステップ2: リソースグループを作成

```powershell
az group create --name orchestra-practice-rg --location japaneast
```

### ステップ3: App Serviceプランを作成

```powershell
az appservice plan create `
  --name orchestra-practice-plan `
  --resource-group orchestra-practice-rg `
  --sku B1 `
  --is-linux
```

### ステップ4: Web Appを作成

```powershell
az webapp create `
  --name orchestra-practice-app `
  --resource-group orchestra-practice-rg `
  --plan orchestra-practice-plan `
  --runtime "NODE:18-lts"
```

### ステップ5: 環境変数を設定

```powershell
az webapp config appsettings set `
  --name orchestra-practice-app `
  --resource-group orchestra-practice-rg `
  --settings `
    AZURE_OPENAI_API_KEY="your-api-key" `
    AZURE_OPENAI_ENDPOINT="https://your-resource.openai.azure.com/" `
    AZURE_OPENAI_DEPLOYMENT_NAME="gpt-4" `
    AZURE_OPENAI_API_VERSION="2024-02-15-preview"
```

### ステップ6: デプロイ

```powershell
# ビルド
npm run build

# デプロイ
az webapp deploy `
  --name orchestra-practice-app `
  --resource-group orchestra-practice-rg `
  --src-path . `
  --type zip
```

### ステップ7: URLを共有

```
https://orchestra-practice-app.azurewebsites.net
```

## 方法4: ローカルで動かすための手順を共有

### README.mdに追加する内容

プロジェクトの `README.md` に以下の情報を含めます：

1. セットアップ手順
2. 必要な環境変数
3. 実行方法

既に `README.md` に含まれていますが、他の人が使う場合は以下も追加：

```markdown
## セットアップ（初めて使う人向け）

1. このリポジトリをクローン
2. `npm install` で依存関係をインストール
3. `.env.local` ファイルを作成（`.env.example`を参考に）
4. `npm run dev` で開発サーバーを起動
```

## セキュリティ注意事項

⚠️ **重要**: 以下のファイルはGitにコミットしないでください

- `.env.local` - APIキーが含まれています
- `node_modules/` - 依存関係（大きすぎます）

これらは既に `.gitignore` に含まれています。

## 推奨される共有方法

1. **開発中・チーム内共有**: GitHubリポジトリ
2. **一般公開・デモ**: Vercel（無料・簡単）
3. **本番環境・企業利用**: Azure App Service

## デプロイ前のチェックリスト

- [ ] `.env.local` が `.gitignore` に含まれている
- [ ] `README.md` にセットアップ手順が書かれている
- [ ] 環境変数の説明が `README.md` に含まれている
- [ ] ビルドエラーがない（`npm run build` が成功する）
- [ ] ローカルで正常に動作する
