# 🔑 Azure OpenAI Service のAPIキー設定方法

## 必要な情報

Azure OpenAI ServiceのAPIキーを設定するには、以下の情報が必要です：

1. **API Key** - Azure Portal > あなたのOpenAIリソース > キーとエンドポイント
2. **Endpoint URL** - 例: `https://your-resource.openai.azure.com/`
3. **Deployment Name** - モデルをデプロイした時の名前（例: `gpt-4`）
4. **API Version** - 通常は `2024-02-15-preview`

## 方法1: PowerShellスクリプトを使用（簡単）

```powershell
cd "C:\Users\hp\OneDrive - Sophia Univ. Students\ドキュメント\googlehackthon2026\demo\orchestra-practice-app"
.\setup-azure-openai.ps1
```

スクリプトが対話形式で入力を求めます。

## 方法2: 手動で.env.localファイルを作成

### ステップ1: .env.localファイルを作成

プロジェクトフォルダ（`orchestra-practice-app`）に `.env.local` ファイルを新規作成します。

### ステップ2: 以下の内容をコピー＆ペースト

```env
# Azure OpenAI Service Configuration
AZURE_OPENAI_API_KEY=your-api-key-here
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4
AZURE_OPENAI_API_VERSION=2024-02-15-preview
```

### ステップ3: 実際の値に置き換える

- `your-api-key-here` → Azure Portalから取得したAPIキー（Key 1 または Key 2）
- `https://your-resource.openai.azure.com/` → 実際のエンドポイントURL
- `gpt-4` → デプロイしたモデルの名前（変更している場合）

## 方法3: PowerShellで直接作成

```powershell
cd "C:\Users\hp\OneDrive - Sophia Univ. Students\ドキュメント\googlehackthon2026\demo\orchestra-practice-app"

@"
AZURE_OPENAI_API_KEY=your-api-key-here
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4
AZURE_OPENAI_API_VERSION=2024-02-15-preview
"@ | Out-File -FilePath .env.local -Encoding utf8
```

その後、エディタで `.env.local` を開いて実際の値に置き換えてください。

## Azure Portalで情報を取得する方法

1. [Azure Portal](https://portal.azure.com/) にログイン
2. あなたのAzure OpenAIリソースを開く
3. 左メニューから「キーとエンドポイント」をクリック
4. 以下の情報をコピー：
   - **エンドポイント**: `https://your-resource.openai.azure.com/` のような形式
   - **キー1** または **キー2**: どちらか一方を使用

5. 「モデルのデプロイ」から、デプロイしたモデル名を確認
   - 通常は `gpt-4` または `gpt-35-turbo`

## 設定の確認

`.env.local` ファイルが正しく作成されたか確認：

```powershell
Get-Content .env.local
```

## サーバーの再起動

`.env.local` ファイルを作成または変更した後は、開発サーバーを再起動してください：

```powershell
# サーバーを停止（Ctrl+C）
# 再度起動
npm run dev
```

## トラブルシューティング

### エラー: "Invalid API Key"

- APIキーが正しくコピーされているか確認
- エンドポイントURLの末尾にスラッシュ（`/`）が含まれているか確認
- キーに余分なスペースや改行が含まれていないか確認

### エラー: "Deployment not found"

- デプロイメント名が正しいか確認
- Azure Portalでモデルがデプロイされているか確認

### エラー: "Resource not found"

- エンドポイントURLが正しいか確認
- リソースが正しいリージョンに存在するか確認

## セキュリティ注意事項

⚠️ **重要**: `.env.local` ファイルはGitにコミットしないでください！

- `.env.local` は既に `.gitignore` に含まれています
- APIキーをGitHubなどに公開しないよう注意してください
- チームで共有する場合は、`.env.example` ファイルにテンプレートを置いておきます
