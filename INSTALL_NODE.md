# Node.js インストール手順（Windows）

このアプリを実行するには、Node.js 18以上が必要です。

## 方法1: 公式インストーラーを使用（推奨）

1. [Node.js公式サイト](https://nodejs.org/) にアクセス
2. LTS版（推奨版）をダウンロード
3. インストーラーを実行してインストール
4. インストール後、PowerShellを再起動

## 方法2: wingetを使用（Windows 10/11）

```powershell
winget install OpenJS.NodeJS.LTS
```

インストール後、PowerShellを再起動してください。

## 方法3: Chocolateyを使用

```powershell
choco install nodejs-lts
```

## インストール確認

PowerShellを再起動後、以下のコマンドで確認：

```powershell
node --version
npm --version
```

両方のコマンドでバージョン番号が表示されれば成功です。

## 次のステップ

Node.jsのインストールが完了したら、プロジェクトディレクトリで以下を実行：

```powershell
cd orchestra-practice-app
npm install
```
