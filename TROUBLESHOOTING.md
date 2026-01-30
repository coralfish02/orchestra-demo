# 🔧 トラブルシューティングガイド

## よくあるエラーと対処法

### エラー1: "Cannot find module '@/data/beethoven_5_data.json'"

**原因**: TypeScriptがJSONファイルをインポートできない

**対処法**: `tsconfig.json` に以下を追加：

```json
{
  "compilerOptions": {
    "resolveJsonModule": true
  }
}
```

### エラー2: "Module not found: Can't resolve '@/components/...'"

**原因**: パスエイリアス（@/）が正しく設定されていない

**対処法**: `tsconfig.json` を確認：

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### エラー3: "Error: ENOENT: no such file or directory"

**原因**: ファイルが見つからない

**対処法**: 
- ファイルが正しい場所にあるか確認
- ファイル名の大文字小文字を確認（Windowsは大文字小文字を区別しないが、Linux/Macは区別する）

### エラー4: APIエラー（500 Internal Server Error）

**原因**: APIルートでエラーが発生

**対処法**:
1. ブラウザの開発者ツール（F12）でNetworkタブを確認
2. PowerShellの出力でエラーメッセージを確認
3. `.env.local` ファイルが正しく設定されているか確認

### エラー5: "Invalid API Key" または "Unauthorized"

**原因**: APIキーが正しく設定されていない

**対処法**:
1. `.env.local` ファイルが存在するか確認
2. APIキーに余分なスペースや改行が含まれていないか確認
3. サーバーを再起動（環境変数の変更は再起動が必要）

### エラー6: "Port 3000 is already in use"

**原因**: ポート3000が既に使用されている

**対処法**: 別のポートを使用：

```powershell
npm run dev -- -p 3001
```

## デバッグ方法

### 1. ブラウザのコンソールを確認

1. ブラウザでF12を押す
2. 「Console」タブを開く
3. エラーメッセージを確認

### 2. PowerShellの出力を確認

開発サーバーを起動しているPowerShellウィンドウでエラーメッセージを確認

### 3. ログファイルを確認

Next.jsのログは通常、ターミナルに表示されます

## よくある問題

### 問題: ページが真っ白になる

**対処法**:
1. ブラウザのコンソール（F12）でエラーを確認
2. サーバーが正常に起動しているか確認
3. `npm run build` でビルドエラーがないか確認

### 問題: スタイルが適用されない

**対処法**:
1. `globals.css` が正しくインポートされているか確認
2. Tailwind CSSが正しく設定されているか確認
3. ブラウザのキャッシュをクリア

### 問題: APIが呼び出されない

**対処法**:
1. ネットワークタブでリクエストが送信されているか確認
2. APIルートのパスが正しいか確認（`/api/generate-background`）
3. CORSエラーが出ていないか確認

## リセット方法

### 依存関係を再インストール

```powershell
rm -rf node_modules package-lock.json
npm install
```

### ビルドキャッシュをクリア

```powershell
rm -rf .next
npm run dev
```

## エラーメッセージを共有する際に

以下の情報を含めてください：

1. **エラーメッセージ全文**
2. **どこで発生したか**（ブラウザ、PowerShell、ビルド時など）
3. **何をしていた時か**（ページを開いた時、ボタンをクリックした時など）
4. **ブラウザのコンソールのエラー**（F12で確認）
5. **PowerShellの出力**

これらを共有していただければ、より具体的な解決策を提案できます。
