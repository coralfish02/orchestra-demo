# 環境変数の設定方法（PowerShell版）

## ⚠️ 重要な注意

PowerShellでは、Linux/Macの `KEY=value` という構文は**使えません**。

Next.jsアプリでは、**`.env.local` ファイル**を使用します。

## ✅ 正しい方法：`.env.local` ファイルを作成

### ステップ1: `.env.local` ファイルを作成

プロジェクトフォルダ（`orchestra-practice-app`）に `.env.local` ファイルを作成してください。

**方法1: エディタで作成**

1. VS Codeやメモ帳で `.env.local` ファイルを新規作成
2. 以下の内容をコピー＆ペースト：

```env
AZURE_OPENAI_API_KEY=your-api-key-here
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4
AZURE_OPENAI_API_VERSION=2024-02-15-preview
```

**方法2: PowerShellで作成**

```powershell
cd "C:\Users\hp\OneDrive - Sophia Univ. Students\ドキュメント\googlehackthon2026\demo\orchestra-practice-app"

@"
AZURE_OPENAI_API_KEY=your-api-key-here
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4
AZURE_OPENAI_API_VERSION=2024-02-15-preview
"@ | Out-File -FilePath .env.local -Encoding utf8
```

### ステップ2: 値を実際の値に置き換える

Azure OpenAI Serviceをセットアップしている場合：
- `your-api-key-here` → 実際のAPIキーに置き換え
- `https://your-resource.openai.azure.com/` → 実際のエンドポイントURLに置き換え

**まだAzure OpenAI Serviceをセットアップしていない場合：**
- ファイルはそのままにしておいてOKです
- アプリはAPIキーがなくても動作します（フォールバックモード）

### ステップ3: サーバーを再起動

`.env.local` ファイルを変更した後は、開発サーバーを再起動してください：

```powershell
# サーバーを停止（Ctrl+C）
# 再度起動
npm run dev
```

## 🔍 確認方法

`.env.local` ファイルが正しく作成されたか確認：

```powershell
Get-Content .env.local
```

## ❌ 間違った方法（PowerShellでは使えない）

```powershell
# ❌ これは動きません
AZURE_OPENAI_API_KEY=your-api-key

# ✅ PowerShellで一時的に環境変数を設定する場合（開発サーバー起動時のみ）
$env:AZURE_OPENAI_API_KEY = "your-api-key"
npm run dev
```

ただし、Next.jsアプリでは `.env.local` ファイルを使う方が一般的で推奨されます。

## 💡 ヒント

- `.env.local` ファイルは `.gitignore` に含まれているので、Gitにコミットされません
- 実際のAPIキーをGitにコミットしないように注意してください
- チームで共有する場合は、`.env.example` ファイルにテンプレートを置いておきます
