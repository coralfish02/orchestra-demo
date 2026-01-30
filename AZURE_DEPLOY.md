# Azure デプロイ手順

このアプリをAzureにデプロイする方法を説明します。

## 前提条件

- Azureアカウント（[無料アカウント作成](https://azure.microsoft.com/free/)）
- Azure CLIがインストールされていること
- Node.js 18以上がインストールされていること

## 1. Azure OpenAI Serviceのセットアップ

### 1.1 Azure OpenAIリソースの作成

1. [Azure Portal](https://portal.azure.com/) にログイン
2. 「リソースの作成」→「Azure OpenAI」を検索
3. リソースを作成：
   - **サブスクリプション**: 選択
   - **リソースグループ**: 新規作成または既存を選択
   - **リージョン**: `Japan East` または `Japan West`
   - **名前**: `orchestra-practice-openai`（任意）
   - **価格レベル**: `Standard S0`（開発用）

### 1.2 モデルのデプロイ

1. 作成したAzure OpenAIリソースに移動
2. 「モデルのデプロイ」をクリック
3. 「デプロイの管理」をクリック
4. 「+ デプロイの作成」をクリック
5. モデルを選択：
   - **モデル**: `gpt-4` または `gpt-35-turbo`
   - **デプロイ名**: `gpt-4`（この名前を環境変数で使用）
   - **モデル バージョン**: 最新版を選択
6. 「作成」をクリック

### 1.3 エンドポイントとキーの取得

1. Azure OpenAIリソースの「キーとエンドポイント」に移動
2. 以下の情報をメモ：
   - **エンドポイント**: `https://your-resource.openai.azure.com/`
   - **キー1** または **キー2**

## 2. Azure App Serviceへのデプロイ（推奨）

### 2.1 Azure CLIでログイン

```bash
az login
```

### 2.2 リソースグループの作成

```bash
az group create --name orchestra-practice-rg --location japaneast
```

### 2.3 App Serviceプランの作成

```bash
az appservice plan create \
  --name orchestra-practice-plan \
  --resource-group orchestra-practice-rg \
  --sku B1 \
  --is-linux
```

### 2.4 Web Appの作成

```bash
az webapp create \
  --name orchestra-practice-app \
  --resource-group orchestra-practice-rg \
  --plan orchestra-practice-plan \
  --runtime "NODE:18-lts"
```

### 2.5 環境変数の設定

```bash
az webapp config appsettings set \
  --name orchestra-practice-app \
  --resource-group orchestra-practice-rg \
  --settings \
    AZURE_OPENAI_API_KEY="your-api-key" \
    AZURE_OPENAI_ENDPOINT="https://your-resource.openai.azure.com/" \
    AZURE_OPENAI_DEPLOYMENT_NAME="gpt-4" \
    AZURE_OPENAI_API_VERSION="2024-02-15-preview"
```

### 2.6 デプロイ

#### 方法1: Azure CLIを使用

```bash
# ビルド
npm run build

# デプロイ
az webapp deploy \
  --name orchestra-practice-app \
  --resource-group orchestra-practice-rg \
  --src-path . \
  --type zip
```

#### 方法2: GitHub Actionsを使用

`.github/workflows/azure-deploy.yml` を作成（後述）

#### 方法3: VS Code拡張機能を使用

1. VS Codeに「Azure App Service」拡張機能をインストール
2. Azureにログイン
3. プロジェクトを右クリック → 「Deploy to Web App」

## 3. Azure Functionsへのデプロイ（オプション）

### 3.1 Azure Functions Core Toolsのインストール

```bash
npm install -g azure-functions-core-tools@4 --unsafe-perm true
```

### 3.2 Functions アプリの作成

```bash
cd azure-functions
func init --worker-runtime node --language typescript
```

### 3.3 ローカルでテスト

```bash
# 環境変数を設定
# .env ファイルを作成
AZURE_OPENAI_API_KEY=your-key
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4
AZURE_OPENAI_API_VERSION=2024-02-15-preview

# ローカル実行
func start
```

### 3.4 Azureにデプロイ

```bash
# Azure Functions アプリを作成
az functionapp create \
  --name orchestra-practice-functions \
  --resource-group orchestra-practice-rg \
  --consumption-plan-location japaneast \
  --runtime node \
  --runtime-version 18 \
  --functions-version 4

# 環境変数を設定
az functionapp config appsettings set \
  --name orchestra-practice-functions \
  --resource-group orchestra-practice-rg \
  --settings \
    AZURE_OPENAI_API_KEY="your-api-key" \
    AZURE_OPENAI_ENDPOINT="https://your-resource.openai.azure.com/" \
    AZURE_OPENAI_DEPLOYMENT_NAME="gpt-4" \
    AZURE_OPENAI_API_VERSION="2024-02-15-preview"

# デプロイ
func azure functionapp publish orchestra-practice-functions
```

## 4. フロントエンドのデプロイ

### 4.1 Azure Static Web Appsへのデプロイ

```bash
# Static Web Appを作成
az staticwebapp create \
  --name orchestra-practice-frontend \
  --resource-group orchestra-practice-rg \
  --location japaneast \
  --sku Free

# デプロイ
npm run build
az staticwebapp deploy \
  --name orchestra-practice-frontend \
  --resource-group orchestra-practice-rg \
  --app-location "." \
  --output-location ".next"
```

### 4.2 Vercelへのデプロイ（代替案）

1. [Vercel](https://vercel.com/) にアカウント作成
2. GitHubリポジトリを接続
3. 環境変数を設定：
   - `AZURE_OPENAI_API_KEY`
   - `AZURE_OPENAI_ENDPOINT`
   - `AZURE_OPENAI_DEPLOYMENT_NAME`
   - `AZURE_OPENAI_API_VERSION`
4. デプロイ

## 5. 環境変数の設定（ローカル開発）

`.env.local` ファイルを作成：

```env
AZURE_OPENAI_API_KEY=your-api-key
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4
AZURE_OPENAI_API_VERSION=2024-02-15-preview
```

## 6. トラブルシューティング

### APIキーエラー

- Azure Portalでキーが正しく設定されているか確認
- エンドポイントURLに末尾のスラッシュが含まれているか確認

### CORSエラー

Azure App Serviceの場合、CORS設定を追加：

```bash
az webapp cors add \
  --name orchestra-practice-app \
  --resource-group orchestra-practice-rg \
  --allowed-origins "*"
```

### デプロイエラー

- Node.jsバージョンが18以上であることを確認
- `package.json`の依存関係が正しいか確認
- ビルドログを確認

## 7. コスト最適化

- 開発環境では `B1` プラン（Basic）を使用
- 本番環境では必要に応じて `S1` プラン（Standard）にスケールアップ
- Azure OpenAI Serviceは従量課金制なので、使用量に注意

## 参考リンク

- [Azure OpenAI Service ドキュメント](https://learn.microsoft.com/azure/ai-services/openai/)
- [Azure App Service ドキュメント](https://learn.microsoft.com/azure/app-service/)
- [Azure Functions ドキュメント](https://learn.microsoft.com/azure/azure-functions/)
