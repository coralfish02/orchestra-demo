# 🔍 曲検索機能の実装

## 実装した機能

### 1. 曲リストのデータ構造
- `data/pieces-list.json` - 複数曲のメタデータ
- 現在5曲を登録（ベートーヴェン第5番、第9番、モーツァルト第40番、ドヴォルザーク第9番、チャイコフスキー第6番）

### 2. 曲検索API
- `GET /api/pieces` - 曲一覧を取得（検索・フィルタリング対応）
- `GET /api/pieces/[pieceId]` - 特定の曲の詳細データを取得

### 3. 検索機能付き曲選択画面
- 検索バーで曲名、作曲家、タグで検索可能
- 曲一覧を表示
- 曲を選択してパートを選択

### 4. 動的データ読み込み
- 選択した曲のデータを動的に読み込み
- データファイルがある場合は詳細情報を表示
- データファイルがない場合は基本情報のみ表示

## データ構造

### pieces-list.json

```json
{
  "pieces": [
    {
      "piece_id": "beethoven_5",
      "title": "交響曲第5番 ハ短調『運命』",
      "composer": "ルートヴィヒ・ヴァン・ベートーヴェン",
      "composer_en": "Ludwig van Beethoven",
      "opus": "Op. 67",
      "year": 1808,
      "genre": "交響曲",
      "movements": [...],
      "parts": ["Violin I", "Violin II", "Viola", "Cello"],
      "data_file": "beethoven_5_data.json",
      "popularity": 5,
      "tags": ["運命", "ベートーヴェン", "交響曲"]
    }
  ]
}
```

## APIエンドポイント

### GET /api/pieces

**クエリパラメータ:**
- `q`: 検索クエリ（曲名、作曲家、タグ）
- `composer`: 作曲家でフィルタ
- `genre`: ジャンルでフィルタ

**レスポンス:**
```json
{
  "pieces": [...],
  "total": 5
}
```

### GET /api/pieces/[pieceId]

**レスポンス:**
```json
{
  "piece_id": "beethoven_5",
  "title": "...",
  "data": {...} // データファイルがある場合
}
```

## 使い方

1. **曲を検索**
   - 検索バーに「ベートーヴェン」「運命」「モーツァルト」などと入力
   - リアルタイムでフィルタリング

2. **曲を選択**
   - 検索結果から曲をクリック
   - 選択された曲がハイライト表示

3. **パートを選択**
   - 選択した曲のパートから選択

4. **練習ガイドを開始**
   - データファイルがある曲: 詳細な情報を表示
   - データファイルがない曲: 基本情報のみ表示（背景解説は生成される）

## 新しい曲を追加する方法

### ステップ1: pieces-list.jsonに追加

```json
{
  "piece_id": "new_piece",
  "title": "曲名",
  "composer": "作曲家名",
  ...
}
```

### ステップ2: データファイルを作成（オプション）

詳細データが必要な場合：
- `data/new_piece_data.json` を作成
- `beethoven_5_data.json` を参考に構造を作成

### ステップ3: pieces-list.jsonのdata_fileを更新

```json
{
  "piece_id": "new_piece",
  "data_file": "new_piece_data.json",
  ...
}
```

## 今後の拡張

- **IMSLP連携**: IMSLPから自動で曲情報を取得
- **楽譜解析**: MusicXMLから自動で重要箇所を抽出
- **AI検索**: 自然言語で「悲しい交響曲」などと検索
- **お気に入り機能**: よく使う曲を保存
- **履歴機能**: 最近使った曲を表示
