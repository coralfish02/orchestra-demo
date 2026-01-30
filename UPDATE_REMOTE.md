# 🔧 リモートリポジトリURLの更新方法

## 現在の状況

リモートリポジトリのURLがプレースホルダー（`YOUR_USERNAME/YOUR_REPO_NAME`）のままです。
実際のGitHubリポジトリのURLに更新する必要があります。

## 解決方法

### ステップ1: GitHubリポジトリのURLを確認

GitHubでリポジトリを作成した場合、以下のようなURLが表示されます：
```
https://github.com/coralfish02/orchestra-demo.git
```

（ログから `coralfish02/orchestra-demo` というリポジトリ名が見えます）

### ステップ2: リモートURLを更新

```powershell
cd "C:\Users\hp\OneDrive - Sophia Univ. Students\ドキュメント\googlehackthon2026\demo\orchestra-practice-app"

# 既存のリモートを削除
git remote remove origin

# 正しいURLでリモートを追加（実際のURLに置き換え）
git remote add origin https://github.com/coralfish02/orchestra-demo.git

# 確認
git remote -v
```

### ステップ3: プッシュ

```powershell
git push --set-upstream origin main
```

## 正しいリポジトリURLが分からない場合

1. [GitHub](https://github.com) にログイン
2. リポジトリ一覧から該当のリポジトリを開く
3. 緑色の「Code」ボタンをクリック
4. HTTPSのURLをコピー（例: `https://github.com/coralfish02/orchestra-demo.git`）

## ワンライナー（正しいURLが分かっている場合）

```powershell
cd "C:\Users\hp\OneDrive - Sophia Univ. Students\ドキュメント\googlehackthon2026\demo\orchestra-practice-app"
git remote set-url origin https://github.com/coralfish02/orchestra-demo.git
git push --set-upstream origin main
```
