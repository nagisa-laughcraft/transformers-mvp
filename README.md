# Love Lens

Next.js と transformers.js を使って恋愛タイプを言語化する MVP アプリケーションです。ユーザーは人生観に近いタグを選択し、AI から自然言語でフィードバックを受け取れます。

## セットアップ

```bash
npm install
```

## 開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:3000` を開くとアプリケーションを確認できます。初回のフィードバック生成時にはモデル読み込みのために時間がかかる場合があります。

## 主な技術スタック

- Next.js 14 (App Router)
- React 18 / TypeScript
- Tailwind CSS
- [@xenova/transformers](https://github.com/xenova/transformers.js) を用いたオンデバイス推論

## プロジェクト構成

```
app/
 ├─ components/TagAdvisor.tsx  # タグ選択とフィードバック生成の UI
 ├─ layout.tsx                 # ルートレイアウト
 └─ page.tsx                   # トップページ
```

## ライセンス

このリポジトリは教育目的の MVP として提供されています。
