# Azure OpenAI Service のAPIキーを設定するスクリプト

Write-Host "🔑 Azure OpenAI Service の設定" -ForegroundColor Cyan
Write-Host ""

# ユーザーに入力を求める
$apiKey = Read-Host "Azure OpenAI API Key を入力してください"
$endpoint = Read-Host "Azure OpenAI Endpoint URL を入力してください (例: https://your-resource.openai.azure.com/)"
$deploymentName = Read-Host "Deployment Name を入力してください (デフォルト: gpt-4)" 
if ([string]::IsNullOrWhiteSpace($deploymentName)) {
    $deploymentName = "gpt-4"
}
$apiVersion = Read-Host "API Version を入力してください (デフォルト: 2024-02-15-preview)"
if ([string]::IsNullOrWhiteSpace($apiVersion)) {
    $apiVersion = "2024-02-15-preview"
}

# .env.local ファイルの内容
$envContent = @"
# Azure OpenAI Service Configuration
AZURE_OPENAI_API_KEY=$apiKey
AZURE_OPENAI_ENDPOINT=$endpoint
AZURE_OPENAI_DEPLOYMENT_NAME=$deploymentName
AZURE_OPENAI_API_VERSION=$apiVersion
"@

# ファイルに書き込む
$envContent | Out-File -FilePath .env.local -Encoding utf8 -NoNewline

Write-Host ""
Write-Host "✅ .env.local ファイルを作成しました！" -ForegroundColor Green
Write-Host ""
Write-Host "設定内容:" -ForegroundColor Yellow
Write-Host "  API Key: $($apiKey.Substring(0, [Math]::Min(10, $apiKey.Length)))..." 
Write-Host "  Endpoint: $endpoint"
Write-Host "  Deployment: $deploymentName"
Write-Host "  API Version: $apiVersion"
Write-Host ""
Write-Host "次のステップ: npm run dev で開発サーバーを起動してください" -ForegroundColor Cyan
