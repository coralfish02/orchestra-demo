# .env.local ファイルを作成するPowerShellスクリプト

$envFile = ".env.local"
$content = @"
# Azure OpenAI Service Configuration
# Get these values from Azure Portal > Your OpenAI Resource > Keys and Endpoint

# API Key (Key 1 or Key 2 from Azure Portal)
# まだAPIキーがない場合は、この行をコメントアウトしてください
# アプリはAPIキーがなくても動作します（フォールバックモード）
AZURE_OPENAI_API_KEY=your-api-key-here

# Endpoint URL (e.g., https://your-resource.openai.azure.com/)
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/

# Deployment name (the name you gave when deploying the model)
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4

# API Version
AZURE_OPENAI_API_VERSION=2024-02-15-preview
"@

$content | Out-File -FilePath $envFile -Encoding utf8 -NoNewline

Write-Host "✅ .env.local ファイルを作成しました！" -ForegroundColor Green
Write-Host ""
Write-Host "次のステップ:" -ForegroundColor Yellow
Write-Host "1. .env.local ファイルを開いて、実際のAzure OpenAI Serviceの値を設定してください"
Write-Host "2. まだAPIキーがない場合は、そのままでも動作します（フォールバックモード）"
Write-Host "3. npm run dev で開発サーバーを起動してください"
