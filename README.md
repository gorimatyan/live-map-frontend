# fukuoka-hackathon-frontend

## プロジェクト構成

```
fukuoka-hackathon-frontend/
├── .git/                    # Gitリポジトリ
├── .next/                   # Next.jsのビルド出力
├── .vscode/                 # VSCode設定
├── node_modules/            # 依存パッケージ
├── public/                  # 静的ファイル
├── src/                     # ソースコード
│   ├── app/                 # Next.jsアプリケーション
│   │   ├── page.tsx         # ホームページ
│   │   ├── layout.tsx       # ルートレイアウト
│   │   ├── globals.css      # グローバルCSS
│   │   └── favicon.ico      # ファビコン
│   ├── components/          # UIコンポーネント
│   │   ├── AppleMap/        # 地図コンポーネント
│   │   ├── DarkModeToggle/  # ダークモード切替
│   │   ├── DetailSection/   # 詳細セクション
│   │   ├── HamburgerToggle/ # ハンバーガーメニュー
│   │   ├── Icons/           # アイコンコンポーネント
│   │   ├── RightSideContent/ # 右サイドコンテンツ
│   │   └── TweetList/       # ツイートリスト
│   ├── utils/               # ユーティリティ
│   │   ├── function/        # ユーティリティ関数
│   │   │   ├── map/         # 地図関連関数
│   │   │   ├── date/        # 日付処理関数
│   │   │   ├── fetchUtil.ts # フェッチユーティリティ
│   │   │   └── formatTweetQueryParams.ts # ツイートパラメータ処理
│   │   └── type/            # 型定義
│   │       ├── api/         # API関連の型
│   │       └── map/         # 地図関連の型
│   └── myApi.ts             # API関連コード
├── .env                     # 環境変数
├── .gitignore               # Gitの除外設定
├── .prettierrc.yaml         # Prettier設定
├── eslint.config.mjs        # ESLint設定
├── next-env.d.ts            # Next.js型定義
├── next.config.ts           # Next.js設定
├── package-lock.json        # 依存関係ロックファイル
├── package.json             # パッケージ設定
├── postcss.config.mjs       # PostCSS設定
├── tailwind.config.ts       # Tailwind CSS設定
└── tsconfig.json            # TypeScript設定
```

## 開発環境の構築方法

### 必要条件

- Node.js (バージョン18.0.0以上)
- npm (バージョン9.0.0以上)

### インストール手順

1. リポジトリをクローンします

```bash
git clone https://github.com/your-username/fukuoka-hackathon-frontend.git
cd fukuoka-hackathon-frontend
```

2. 依存関係をインストールします

```bash
npm install
```

3. 環境変数を設定します
   - `.env`ファイルをプロジェクトのルートに作成します
   - 必要な環境変数を設定します（例：APIキーなど）

```
# .env ファイルの例
API_KEY=your_api_key_here
NEXT_PUBLIC_MAP_API_KEY=your_map_api_key_here
```

### 開発サーバーの起動

開発サーバーを起動するには、以下のコマンドを実行します：

```bash
npm run dev
```

これにより、開発サーバーが起動し、通常は http://localhost:3000 でアプリケーションにアクセスできます。

### ビルドの実行

本番用ビルドを作成するには：

```bash
npm run build
```

ビルド後のアプリケーションを実行するには：

```bash
npm run start
```

## 主な機能

- **地図表示**: Apple Maps を使用して地図上にデータを表示
- **リアルタイムデータ**: 災害情報やニュースをリアルタイムで取得・表示
- **ダークモード**: アプリケーション全体のダークモードサポート
- **レスポンシブデザイン**: モバイルからデスクトップまで対応

## 技術スタック

- **フレームワーク**: Next.js
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **地図**: Apple Maps API
- **データフェッチ**: Fetch API

## デプロイ

Next.jsアプリケーションのため、Vercel、Netlify、AWS Amplifyなど様々なプラットフォームにデプロイ可能です。

### Vercelへのデプロイ例

```bash
npm install -g vercel
vercel
```

## コントリビューション

1. このリポジトリをフォークします
2. 新しいブランチを作成します (`git checkout -b feature/amazing-feature`)
3. 変更をコミットします (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュします (`git push origin feature/amazing-feature`)
5. プルリクエストを作成します

## ライセンス

[使用しているライセンスを記載]

## 連絡先

[プロジェクト管理者の連絡先情報を記載]
