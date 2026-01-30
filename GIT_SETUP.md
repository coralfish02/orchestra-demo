# 🔧 Git設定ガイド

## エラーの解決方法

### エラー1: "Author identity unknown"

Gitのユーザー名とメールアドレスを設定する必要があります。

### エラー2: "remote origin already exists"

既にリモートリポジトリが設定されています。更新する必要があります。

### エラー3: "src refspec main does not match any"

コミットがまだされていないため、mainブランチが存在しません。

## 解決手順

### ステップ1: Gitのユーザー情報を設定

```powershell
# グローバル設定（すべてのリポジトリで使用）
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# または、このリポジトリだけに設定
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

**例：**
```powershell
git config --global user.name "Your Name"
git config --global user.email "your.email@gmail.com"
```

### ステップ2: 既存のリモートを確認・更新

```powershell
# 現在のリモートを確認
git remote -v

# 既存のリモートを削除
git remote remove origin

# 新しいリモートを追加（YOUR_USERNAMEとYOUR_REPO_NAMEを置き換え）
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

### ステップ3: ファイルをコミット

```powershell
# ファイルを追加
git add .

# コミット
git commit -m "Initial commit: Orchestra Practice App"
```

### ステップ4: GitHubにプッシュ

```powershell
# ブランチ名をmainに設定
git branch -M main

# プッシュ
git push -u origin main
```

## 完全な手順（一括実行）

```powershell
cd "C:\Users\hp\OneDrive - Sophia Univ. Students\ドキュメント\googlehackthon2026\demo\orchestra-practice-app"

# 1. Gitのユーザー情報を設定（実際の情報に置き換え）
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# 2. 既存のリモートを削除
git remote remove origin

# 3. ファイルを追加
git add .

# 4. コミット
git commit -m "Initial commit: Orchestra Practice App"

# 5. 新しいリモートを追加（GitHubでリポジトリを作成してから）
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# 6. ブランチ名をmainに設定
git branch -M main

# 7. プッシュ
git push -u origin main
```

## GitHubリポジトリの作成方法

1. [GitHub](https://github.com) にログイン
2. 右上の「+」→「New repository」をクリック
3. リポジトリ名を入力（例: `orchestra-practice-app`）
4. 「Public」または「Private」を選択
5. 「Initialize this repository with a README」は**チェックしない**（既にファイルがあるため）
6. 「Create repository」をクリック
7. 表示されたURLをコピー（例: `https://github.com/YOUR_USERNAME/orchestra-practice-app.git`）

## 確認方法

### Gitの設定を確認

```powershell
git config --global user.name
git config --global user.email
```

### リモートリポジトリを確認

```powershell
git remote -v
```

### コミット履歴を確認

```powershell
git log
```

## トラブルシューティング

### まだエラーが出る場合

1. **GitHubリポジトリが作成されているか確認**
2. **リポジトリURLが正しいか確認**
3. **GitHubの認証情報が正しいか確認**（必要に応じて認証）

### 認証エラーが出る場合

GitHubの認証が必要な場合：

```powershell
# Personal Access Tokenを使用する場合
git remote set-url origin https://YOUR_TOKEN@github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

または、GitHub CLIを使用：

```powershell
gh auth login
```
