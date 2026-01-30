# Git設定を修正するスクリプト

Write-Host "🔧 Git設定を修正します" -ForegroundColor Cyan
Write-Host ""

# Gitのユーザー情報を設定
Write-Host "Gitのユーザー情報を設定してください：" -ForegroundColor Yellow
$userName = Read-Host "ユーザー名（例: Your Name）"
$userEmail = Read-Host "メールアドレス（例: your.email@example.com）"

git config --global user.name $userName
git config --global user.email $userEmail

Write-Host ""
Write-Host "✅ Gitのユーザー情報を設定しました" -ForegroundColor Green
Write-Host ""

# 既存のリモートを削除
Write-Host "既存のリモートを削除します..." -ForegroundColor Yellow
git remote remove origin

Write-Host ""
Write-Host "GitHubリポジトリのURLを入力してください：" -ForegroundColor Yellow
Write-Host "例: https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git" -ForegroundColor Gray
$repoUrl = Read-Host "リポジトリURL"

git remote add origin $repoUrl

Write-Host ""
Write-Host "✅ リモートリポジトリを設定しました" -ForegroundColor Green
Write-Host ""

# ファイルを追加
Write-Host "ファイルを追加します..." -ForegroundColor Yellow
git add .

# コミット
Write-Host "コミットします..." -ForegroundColor Yellow
git commit -m "Initial commit: Orchestra Practice App"

# ブランチ名をmainに設定
Write-Host "ブランチ名をmainに設定します..." -ForegroundColor Yellow
git branch -M main

Write-Host ""
Write-Host "✅ 準備完了！" -ForegroundColor Green
Write-Host ""
Write-Host "次のステップ: git push -u origin main でGitHubにプッシュしてください" -ForegroundColor Cyan
