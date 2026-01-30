# 🔧 エラーコード -102 の対処法

## エラーコード -102 とは

エラーコード -102 は、ブラウザがサーバーに接続できないことを示します。

## 考えられる原因

1. **開発サーバーが起動していない**
2. **サーバーがクラッシュしている**
3. **ポートが間違っている**
4. **ファイアウォールがブロックしている**

## 対処法

### ステップ1: サーバーが起動しているか確認

PowerShellで以下を実行：

```powershell
cd "C:\Users\hp\OneDrive - Sophia Univ. Students\ドキュメント\googlehackthon2026\demo\orchestra-practice-app"
npm run dev
```

以下のようなメッセージが表示されれば正常：

```
  ▲ Next.js 14.2.5
  - Local:        http://localhost:3000

  ✓ Ready in 2.5s
```

### ステップ2: サーバーを再起動

1. PowerShellで Ctrl+C を押してサーバーを停止
2. 再度起動：

```powershell
npm run dev
```

### ステップ3: 別のポートで試す

ポート3000が使用されている可能性があります：

```powershell
npm run dev -- -p 3001
```

ブラウザで [http://localhost:3001](http://localhost:3001) を開いてください。

### ステップ4: ポートが使用されているか確認

```powershell
netstat -ano | findstr :3000
```

何か表示されたら、そのポートは使用中です。

### ステップ5: ビルドエラーがないか確認

```powershell
npm run build
```

エラーが出た場合は、そのエラーメッセージを確認してください。

## よくある問題

### 問題: "Port 3000 is already in use"

**解決法**: 別のポートを使用

```powershell
npm run dev -- -p 3001
```

### 問題: サーバーがすぐに終了する

**原因**: ビルドエラーや依存関係の問題

**解決法**:
1. エラーメッセージを確認
2. 依存関係を再インストール：

```powershell
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### 問題: ファイアウォールの警告が出る

WindowsファイアウォールがNode.jsをブロックしている可能性があります。

**解決法**: ファイアウォールの警告が出たら「許可」をクリック

## 確認チェックリスト

- [ ] PowerShellで `npm run dev` を実行した
- [ ] "Ready" というメッセージが表示された
- [ ] ブラウザで正しいURL（http://localhost:3000）を開いた
- [ ] 別のポート（3001など）で試した
- [ ] ビルドエラーがないか確認した

## それでも解決しない場合

1. **すべてのNode.jsプロセスを終了**：

```powershell
taskkill /F /IM node.exe
```

2. **再度起動**：

```powershell
npm run dev
```

3. **ブラウザのキャッシュをクリア**：
   - Ctrl+Shift+Delete
   - キャッシュをクリア
   - ページを再読み込み（Ctrl+F5）
