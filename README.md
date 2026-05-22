# YAJU&U NFT MOMENTS Enterprise Site

## Files
- `index.html` — GitHub Pages用。CSS/JS内蔵。
- `assets/` — 画像。
- `worker/cloudflare-worker.js` — OpenAI API連携用Cloudflare Worker。

## Setup
1. GitHub Pagesに `index.html` と `assets/` をアップロード。
2. Cloudflare Workerに `worker/cloudflare-worker.js` をデプロイ。
3. WorkerのSecretに `OPENAI_API_KEY` を登録。
4. `index.html` の `CONFIG.chatEndpoint` をWorker URLに変更。
5. `CONFIG.discord` をDiscordリンクに変更。

## Notes
本文は参考記事の文章を直接コピーせず、ミーム文化の一般的な説明として再構成しています。
NFTは金融商品・利益保証として表現しないでください。
