# SmartClass

SmartClassは、学校向けの効率的な成績および出欠管理システムです。このシステムを通じて、教員や管理者は簡単に生徒の情報を追跡でき、生徒と保護者も情報を簡単に閲覧できます。

## 🌐 デプロイ済みリンク
アプリケーションはこちらからアクセス可能です:  
**[https://smartclass-principal.onrender.com](https://smartclass-principal.onrender.com)**

---

## 📌 機能

- **ログイン・ユーザー認証**: ユーザーごとに異なるアクセス権限。
- **成績管理**: 生徒の成績（N1, AP, AIなど）を登録・確認。
- **出欠管理**: 欠席情報の記録と理由（正当化）の管理。
- **データ管理**: 学校、クラス、教師、生徒の情報を登録・編集。

---

## 📸 スクリーンショット

以下にアプリの主要画面を紹介します:

1. **ログイン画面**  
   ![ログイン画面 2024-12-03 141012](https://github.com/user-attachments/assets/33d1e07b-1962-4b1e-a1bf-3ccd5528356e)

2. **ホーム画面**  
   - 管理者
   ![管理者画面](管理者画面.png)
   - 教師
   ![教師画面](教師画面.png)
   - 生徒
   ![生徒](生徒.png)
   - 保護者
   ![保護者](保護者.png)

3. **成績管理画面**  
   ![成績管理Notas-管理](https://github.com/user-attachments/assets/c15b5a6d-0742-4165-a72f-ab7d3c531897)
   ![成績管理Notas入力](https://github.com/user-attachments/assets/cdbd6928-043e-4197-b41e-479e69968f7e)

4. **出欠管理画面**  
   ![欠席管理](欠席管理.png)
   ![欠席管理ー削除](欠席管理ー削除.png)

5. **保護者ダッシュボード**  
   ![保護者ダッシュボード](path-to-parent-dashboard-screenshot.png)

6. **カレンダー**  
   ![カレンダー](カレンダー.png)
---

## ⚠️ 既知の問題

   - クラスごとに大量の生徒データがある場合、ページの読み込み速度が遅くなる。
   - 検索機能が不十分でフィルター機能の追加が好ましい。
   - モバイル表示の一部レイアウト調整が未完了。

---

## 💻 セットアップ方法

1. リポジトリをクローンします:
   ```
   git clone https://github.com/username/SmartClass.git
   ```

2. パッケージのインストール
   ```bash
   npm install
   ```

   プロジェクトのルートディレクトリに移動し、以下のコマンドを実行して依存パッケージをインストールします:

3. データベースの設定
   - MySQLをインストールし、データベースを作成します。
   - db.sql ファイル（リポジトリ内）を使用して必要なテーブルと初期データを設定します。

4. 環境変数の設定
   プロジェクトのルートディレクトリに .env ファイルを作成し、以下のように設定してください:
   ```bash
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=yourpassword
   DB_NAME=smartclass
   BASE_URL=http://localhost:5000
   NODE_ENV=development
   PORT=5000
   ```

5. サーバーの起動
   以下のコマンドを実行してサーバーを起動します:
   ```bash
   node api/server.js
   ```

6. アプリケーションのアクセス
   ブラウザで以下のURLを開き、アプリケーションを確認します:
   http://localhost:5000

