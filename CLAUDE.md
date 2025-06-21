# CLAUDE.md

このファイルは、Claude Code (claude.ai/code) がこのリポジトリでコードを扱う際のガイダンスを提供します。

## プロジェクト概要

このプロジェクトは、Astroで構築された個人ブログで、バイリンガル設定（日本語コンテンツ）と現代的なWeb技術を特徴としています。ブログは以下を含みます：
- Astroによる静的サイト生成
- インタラクティブ要素のためのPreactコンポーネント  
- スタイリングのためのTailwind CSS v4
- 型安全性のためのTypeScript
- フロントマターを含むMarkdown形式のブログ記事
- タグベースのカテゴリ分類システム
- ダーク/ライトテーマ切り替え

## 開発コマンド

| コマンド | 目的 |
|---------|---------|
| `npm run dev` | localhost:4321でローカル開発サーバーを起動 |
| `npm run build` | 本番サイトを./dist/にビルド |
| `npm run preview` | 本番ビルドをローカルでプレビュー |
| `npm run typecheck` | AstroでTypeScript型チェックを実行 |
| `npm run lint` | コード品質のためのESLintを実行 |
| `npm run format` | Prettierでコードをフォーマット |
| `npm run format:check` | コードフォーマットをチェック |
| `npm run test:e2e` | Cypressエンドツーエンドテストを実行 |
| `npm run test:visual` | ビジュアルテスト用のCypressを開く |
| `npm run devToolbar:disable` | Astro開発ツールバーを無効化 |
| `npm run devToolbar:enable` | Astro開発ツールバーを有効化 |

## アーキテクチャ

### ブログ記事の構造
- 記事は`src/pages/posts/YYYY/MM/`ディレクトリに保存
- 各記事は単一の`.md`ファイルまたは`index.md` + アセットを含むディレクトリ
- 記事はlayout、title、pubDate、description、tagsを含むフロントマターを使用
- レイアウトは通常`@/layouts/MarkdownPostLayout.astro`

### 主要コンポーネント
- `BaseLayout.astro`: Header/Footerを含むメインページレイアウト
- `Header.astro`: テーマ切り替えとレスポンシブハンバーガーメニューを含むナビゲーション
- `Navigation.astro`: メインナビゲーションリンク
- `BlogPost.astro`: 個別ブログ記事の表示
- `PostsGrid.astro`: ブログ記事一覧のグリッドレイアウト
- `Tag.astro` & `TagsGroup.astro`: タグ表示と管理
- `Card.astro`: バリアント（メインコンテナ用の'default'、デモエリア用の'demo'）を持つ再利用可能なカードコンポーネント

### スタイリングアーキテクチャ
- `src/styles/global.css`内のグローバルスタイル
- ViteプラグインによるTailwind CSS v4統合
- camelCase変換対応のCSSモジュール
- CSSクラスとlocalStorageによるダーク/ライトテーマ実装

### パスエイリアス
- `@/*`は`src/*`にマップされ、よりクリーンなインポートを実現
- `tsconfig.json`とAstro設定の両方で設定

### デプロイメント
- `buildspec.yml`を使用したAWS CodeBuildを使用
- `dist/`ディレクトリにビルド
- サイトURL: https://maguroguma.com

## コンテンツ管理

ブログ記事は以下をサポート：
- フロントマターメタデータ付きMarkdown
- 記事と共存する画像アセット
- タグベースのカテゴリ分類
- `/rss.xml`でのRSSフィード生成
- 日本語コンテンツが主体

## 重要な指針

- コードベース内の既存ファイルの編集を常に優先する。明示的に必要でない限り、新しいファイルを作成しない。
- ドキュメントファイル（*.md）やREADMEファイルを積極的に作成しない。ユーザーから明示的に要求された場合のみドキュメントファイルを作成する。
- ユーザーが明示的に要求した場合のみ絵文字を使用する。要求されない限りファイルに絵文字を追加しない。
- ファイルを変更する際は、まずファイルのコード規約を理解する。コードスタイルを模倣し、既存のライブラリとユーティリティを使用し、既存のパターンに従う。
- 常にセキュリティのベストプラクティスに従う。秘密情報やキーを公開または記録するコードを導入しない。秘密情報やキーをリポジトリにコミットしない。
- 要求されない限りコメントを追加しない。
