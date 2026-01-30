# 🌐 チーム共有用デプロイガイド

ローカルサーバーが落ちても、チーム全員がアクセスできるようにクラウドにデプロイします。

## 🚀 方法1: Vercelにデプロイ（推奨・無料・簡単）

### メリット
- ✅ **無料**（個人・小規模チーム向け）
- ✅ **簡単**（数クリックで完了）
- ✅ **自動デプロイ**（GitHubにプッシュするだけで更新）
- ✅ **常時稼働**（サーバーが落ちない）
- ✅ **HTTPS対応**（セキュアな接続）

### ステップ1: GitHubにプッシュ

まず、コードをGitHubにアップロードします：

```powershell
cd "C:\Users\hp\OneDrive - Sophia Univ. Students\ドキュメント\googlehackthon2026\demo\orchestra-practice-app"

# Gitを初期化（まだの場合）
git init

# ファイルを追加
git add .

# コミット
git commit -m "Initial commit: Orchestra Practice App"

# GitHubでリポジトリを作成してから、以下を実行
# （YOUR_USERNAMEとYOUR_REPO_NAMEを置き換え）
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

### ステップ2: Vercelアカウントを作成

1. [Vercel](https://vercel.com) にアクセス
2. 「Sign Up」をクリック
3. GitHubアカウントでサインアップ（推奨）

### ステップ3: プロジェクトをインポート

1. Vercelダッシュボードで「Add New Project」をクリック
2. GitHubリポジトリを選択
3. 「Import」をクリック

### ステップ4: 環境変数を設定

Vercelのプロジェクト設定で、以下の環境変数を追加：

1. 「Settings」→「Environment Variables」を開く
2. 以下の変数を追加：

```
AZURE_OPENAI_API_KEY = your-api-key-here
AZURE_OPENAI_ENDPOINT = https://your-resource.openai.azure.com/
AZURE_OPENAI_DEPLOYMENT_NAME = gpt-4
AZURE_OPENAI_API_VERSION = 2024-02-15-preview
```

**注意**: 各環境（Production, Preview, Development）に設定するか、「All Environments」を選択

### ステップ5: デプロイ

1. 「Deploy」をクリック
2. 数分待つ（自動でビルド・デプロイされます）
3. 完了すると、以下のようなURLが生成されます：
   ```
   https://your-app-name.vercel.app
   ```

### ステップ6: チームに共有

生成されたURLをチームに共有：
```
https://your-app-name.vercel.app
```

このURLは常時アクセス可能で、あなたのPCがオフでも動作します。

### 自動更新

GitHubにプッシュするたびに、自動的にVercelにデプロイされます：

```powershell
# コードを変更
# ...

# GitHubにプッシュ
git add .
git commit -m "Update features"
git push

# Vercelが自動的にデプロイ（数分で完了）
```

---

## ☁️ 方法2: Azure App Serviceにデプロイ

### メリット
- ✅ **Azure環境で統一管理**
- ✅ **スケーラブル**
- ✅ **本番環境向け**

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
cd "C:\Users\hp\OneDrive - Sophia Univ. Students\ドキュメント\googlehackthon2026\demo\orchestra-practice-app"

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

---

## 📋 デプロイ前のチェックリスト

- [ ] `.env.local` が `.gitignore` に含まれている（APIキーをGitにコミットしない）
- [ ] `README.md` にセットアップ手順が書かれている
- [ ] ビルドエラーがない（`npm run build` が成功する）
- [ ] ローカルで正常に動作する

## 🔐 セキュリティ注意事項

⚠️ **重要**: 
- APIキーは環境変数として設定し、コードに直接書かない
- `.env.local` はGitにコミットしない（既に `.gitignore` に含まれています）
- チームメンバーには環境変数の設定方法を共有

## 💡 推奨される方法

**小規模チーム・個人プロジェクト**: Vercel（無料・簡単）
**企業・本番環境**: Azure App Service

## 🆘 トラブルシューティング

### デプロイエラーが出る場合

1. ビルドログを確認（Vercel/Azureのダッシュボード）
2. 環境変数が正しく設定されているか確認
3. `npm run build` がローカルで成功するか確認

### 環境変数が反映されない場合

- デプロイ後に環境変数を変更した場合は、再デプロイが必要
- Vercel: 「Redeploy」をクリック
- Azure: 再度 `az webapp deploy` を実行

## 📞 チームへの共有方法

デプロイが完了したら、以下の情報をチームに共有：

1. **アプリのURL**: `https://your-app.vercel.app`
2. **使用方法**: README.mdのリンク
3. **問題が起きた場合**: 連絡先

---

詳細は [SHARING_GUIDE.md](./SHARING_GUIDE.md) も参照してください。
