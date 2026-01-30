# 🚀 クイックスタートガイド

## エラーが出た場合の対処法

### エラー: "Could not read package.json"

**原因**: 間違ったフォルダで `npm run dev` を実行しています。

**解決方法**: プロジェクトフォルダ（`orchestra-practice-app`）に移動してから実行してください。

## ✅ 正しい手順

### ステップ1: プロジェクトフォルダに移動

PowerShellで以下を実行：

```powershell
cd "C:\Users\hp\OneDrive - Sophia Univ. Students\ドキュメント\googlehackthon2026\demo\orchestra-practice-app"
```

または、現在 `demo` フォルダにいる場合：

```powershell
cd orchestra-practice-app
```

### ステップ2: 現在のディレクトリを確認

```powershell
pwd
# または
Get-Location
```

以下のようなパスが表示されればOK：
```
C:\Users\hp\OneDrive - Sophia Univ. Students\ドキュメント\googlehackthon2026\demo\orchestra-practice-app
```

### ステップ3: package.jsonが存在するか確認

```powershell
Test-Path package.json
```

`True` と表示されればOKです。

### ステップ4: 開発サーバーを起動

```powershell
npm run dev
```

成功すると、以下のようなメッセージが表示されます：

```
  ▲ Next.js 14.2.5
  - Local:        http://localhost:3000

  ✓ Ready in 2.5s
```

### ステップ5: ブラウザで確認

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

## 📝 ワンライナー（コピー＆ペースト用）

```powershell
cd "C:\Users\hp\OneDrive - Sophia Univ. Students\ドキュメント\googlehackthon2026\demo\orchestra-practice-app"; npm run dev
```

## 🔍 よくあるエラーと対処法

### エラー1: "npm is not recognized"

→ Node.jsがインストールされていません。[INSTALL_NODE.md](./INSTALL_NODE.md) を参照してください。

### エラー2: "Could not read package.json"

→ プロジェクトフォルダ（`orchestra-practice-app`）に移動してください。

### エラー3: "Port 3000 is already in use"

別のポートを使用：

```powershell
npm run dev -- -p 3001
```

### エラー4: "Cannot find module"

依存関係を再インストール：

```powershell
npm install
```

## 💡 ヒント

- PowerShellのプロンプトに現在のフォルダ名が表示されています
- `demo>` と表示されている場合は、`orchestra-practice-app` に移動する必要があります
- `orchestra-practice-app>` と表示されていれば正しいフォルダです
