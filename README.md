# SmartClass

SmartClassは、学校向けの効率的な成績および出欠管理システムです。このシステムを通じて、教員や管理者は簡単に生徒の情報を追跡でき、生徒と保護者も情報を簡単に閲覧できます。

---

## 📌 機能

- **ログイン・ユーザー認証**: ユーザーごとに異なるアクセス権限。
- **成績管理**: 生徒の成績（N1, AP, AIなど）を登録・確認。
- **出欠管理**: 欠席情報の管理。
- **クラス管理**: 各生徒所属クラス管理。
- **教科管理**: 教科の管理。
- **カレンダー**: イベントなどの管理。
- **データ管理**: 学校、クラス、教師、生徒の情報を登録・編集。

---

## 📸 スクリーンショット

以下にアプリの主要画面を紹介します:

1. **ログイン画面**  
   ![ログイン画面 2024-12-03 141012](https://github.com/user-attachments/assets/33d1e07b-1962-4b1e-a1bf-3ccd5528356e)

2. **ホーム画面**  
   - 管理者
   ![管理者画面](public/upload/管理者画面.png)
   - 教師
   ![教師画面](public/upload/教師画面.png)
   - 生徒
   ![生徒](public/upload/生徒.png)
   - 保護者
   ![保護者](public/upload/保護者.png)

3. **成績管理画面**  
   ![成績管理Notas-管理](https://github.com/user-attachments/assets/c15b5a6d-0742-4165-a72f-ab7d3c531897)
   ![成績管理Notas入力](https://github.com/user-attachments/assets/cdbd6928-043e-4197-b41e-479e69968f7e)

4. **出欠管理画面**  
   ![欠席管理](public/upload/欠席管理.png)
   ![欠席管理ー削除](public/upload/欠席管理ー削除.png)

5. **カレンダー**  
   ![カレンダー](public/upload/カレンダー.png)
---

## ⚠️ 既知の問題

   - クラスごとに大量の生徒データがある場合、ページの読み込み速度が遅くなる。
   - フィルター機能の追加が好ましい。
   - モバイル表示の一部レイアウト調整が未完了。

---

## 💻 セットアップ方法

1. リポジトリをクローンします:
   ```
   git clone https://github.com/username/SmartClass.git
   ```

2. パッケージのインストール:
   ```bash
   npm install
   ```

   プロジェクトのルートディレクトリに移動し、以下のコマンドを実行して依存パッケージをインストールします

3. データベースの設定
   - MySQLをインストールし、データベースを作成します。
   - db.sql ファイル（リポジトリ内）を使用して必要なテーブルと初期データを設定します。

4. 環境変数の設定
   - プロジェクトのルートディレクトリに .env ファイルを作成し、以下のように設定してください:
   ```bash
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=yourpassword
   DB_NAME=smartclass
   BASE_URL=http://localhost:5000
   NODE_ENV=development
   PORT=5000
   TWILIO_PASS=TWILIO_PASS
   SENDGRID_API_KEY=SENDPASSWORD
   SENDGRID_SENDER=EMAIL
   ```

5. サーバーの起動
   以下のコマンドを実行してサーバーを起動します:
   ```bash
   node api/server.js
   ```

6. アプリケーションのアクセス
   - ブラウザで以下のURLを開き、アプリケーションを確認します:
   http://localhost:5000

---

## 🔧 使用技術
   - バックエンド: Node.js, Express
   - フロントエンド: EJS, Bootstrap
   - データベース: MySQL
   - デプロイ: Render

---

## 📂 ディレクトリー構成
   ```
   SmartClass/
   ├── api/ # API関連のコード 
   │ └── server.js # サーバーのエントリーポイント
   ├── config/ # API関連のコード 
   │ └── database.js
   │ └── passport.js
   ├── controllers/ # コントローラー (ビジネスロジック) 
   │ ├── alunoController.js
   │ ├── notasFaltasController.js
   │ └── ...
   ├── db/ # データベース
   │ └── index.js
   ├── middleware/ # ミドルウェア
   │ ├── authorize.js
   │ └── isAuthenticated.js
   ├── models/ # モデル
   │ └── User.js
   ├── routes/ # ルート定義
   │ ├── alunoRoutes.js
   │ ├── notasFaltasRoutes.js
   │ └── ...
   ├── public/ # 静的ファイル
   │ ├── css/ # スタイルシート
   │ │ ├── alerta.png
   │ │ ├── alunos.png
   │ │ └── ...
   │ ├── icons/ # アイコン
   │ │ ├── styles.css
   │ │ └── ...
   │ ├── js/ # クライアントサイドのJavaScript
   │ │ ├── scripts.js
   │ │ └── ...
   │ └── upload/ # 画像ファイル
   ├── routes/ # ルート
   │ ├── alunosRoutes.js
   │ ├── aplicarNotasRoutes.js
   │ └── ...
   ├── views/ # テンプレートファイル (.ejs)
   │ ├── aluno/ # 生徒関連のビュー
   │ ├── notas/ # 成績関連のビュー
   │ └── ...
   ├── .env # 環境変数
   ├── package.json # プロジェクト情報と依存関係
   └── README.md # プロジェクトの説明
   ```

---


## 🌐 デプロイ済みリンク
アプリケーションはこちらからアクセス可能です:  
**[https://smartclass-principal.onrender.com](https://smartclass-principal.onrender.com)**

### デモログイン情報
   以下のアカウント情報を使用してログインしてください。
   1. 教師用:
   - **Email:** Geraldo.freitas@uscsonline.com.br
   - **Password:** geraldo123
   2. 生徒用:
   - **Email:** rodrigo_lima@uscsonline.com.br
   - **Password:** rodrigo123
   3. 保護者用: 
   - **Email:** joaopedro@gmail.com
   - **Password:** joao123


---

**補足:**
1. `username/SmartClass.git` をご自身のリポジトリ名に置き換えてください。
2. `.env`ファイルのパラメータも実際の環境に合わせて変更してください。
3. デプロイにはコールドスタートが発生する可能性があるため、初回アクセス時に数分の起動時間がかかる場合があります。



