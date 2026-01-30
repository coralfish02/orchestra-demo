# 🔧 Vercelビルドエラーの対処法

## よくあるエラーと対処法

### エラー1: TypeScriptの型エラー

**対処法**: `next.config.mjs` で型チェックをスキップ（一時的）

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // ビルド時の型チェックをスキップ（開発時は推奨しない）
    ignoreBuildErrors: true,
  },
  eslint: {
    // ビルド時のESLintチェックをスキップ（開発時は推奨しない）
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
```

### エラー2: Next.jsのセキュリティ警告

**対処法**: Next.jsを最新版にアップグレード

```powershell
npm install next@latest
```

### エラー3: 環境変数が設定されていない

**対処法**: Vercelの環境変数を確認

1. Vercelダッシュボード → プロジェクト → Settings → Environment Variables
2. 以下の変数が設定されているか確認：
   - `AZURE_OPENAI_API_KEY`
   - `AZURE_OPENAI_ENDPOINT`
   - `AZURE_OPENAI_DEPLOYMENT_NAME`
   - `AZURE_OPENAI_API_VERSION`

### エラー4: ビルドがタイムアウト

**対処法**: ビルド時間を短縮

- 不要な依存関係を削除
- ビルドキャッシュを活用

## 推奨される修正

### 1. next.config.mjsを更新

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // ビルド時の型チェックとLintを一時的にスキップ
  typescript: {
    ignoreBuildErrors: false, // 本番環境では false に戻す
  },
  eslint: {
    ignoreDuringBuilds: false, // 本番環境では false に戻す
  },
};

export default nextConfig;
```

### 2. Next.jsをアップグレード

```powershell
npm install next@latest react@latest react-dom@latest
```

### 3. ローカルでビルドテスト

```powershell
npm run build
```

エラーが出た場合は、そのエラーを修正してから再デプロイ。

## デプロイ前のチェックリスト

- [ ] ローカルで `npm run build` が成功する
- [ ] TypeScriptの型エラーがない
- [ ] ESLintエラーがない
- [ ] 環境変数がVercelに設定されている
- [ ] `.env.local` がGitにコミットされていない
