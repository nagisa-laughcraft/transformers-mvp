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

## フィードバック生成の流れ

1. ユーザーが日本語の価値観タグを選択
2. `@xenova/transformers` の翻訳モデルでタグとプロンプトを英語に変換
3. 英語プロンプトを GPT-2 で推論してフィードバック本文を生成
4. 生成結果を再び翻訳モデルで日本語に戻し、文頭に「フィードバック:」を付与して表示

日本語を直接生成するより安定するため、この二段階翻訳パイプラインを採用しています。

## プロジェクト構成

```
app/
 ├─ components/TagAdvisor.tsx  # タグ選択とフィードバック生成の UI
 ├─ layout.tsx                 # ルートレイアウト
 └─ page.tsx                   # トップページ
```

## ライセンス

このリポジトリは教育目的の MVP として提供されています。
