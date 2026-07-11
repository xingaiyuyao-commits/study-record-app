# study-record-app

## サービスの説明
学習内容と学習時間を記録するためのアプリです。
「何を」「何時間」勉強したかを登録すると一覧に追加され、
合計学習時間（目標1000時間）も自動で計算されます。
登録した記録は削除することもできます。

## デプロイURL
https://study-record-5c41e.web.app

## 環境設定
Supabase（データベース）のURLとAPIキーは `src/supabaseClient.ts` に直接書かれています。
`.env` ファイルは現在使用していません。

## 起動方法
1. 依存パッケージをインストール
   npm install
2. 開発サーバーを起動
   npm start
3. ブラウザで `http://localhost:3000` を開く

本番用にビルドしてFirebaseにデプロイする場合：
make deploy