// Cloudflare Workers OpenAI proxy for YAJU&U AI Chat
// 1) Cloudflare dashboard > Workers > Settings > Variables
// 2) Add secret: OPENAI_API_KEY
// 3) Deploy this file, then set CONFIG.chatEndpoint in index.html to https://your-worker.workers.dev/chat

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === 'OPTIONS') return cors(new Response(null, { status: 204 }));
    if (url.pathname !== '/chat' || request.method !== 'POST') return cors(new Response('Not Found', { status: 404 }));
    try {
      const { message } = await request.json();
      const system = `You are YAJU&U AI, a playful but safe meme-project concierge. Reply in the user's language. Explain NFT, gacha, CA, Discord, roadmap, holder benefits. Do not promise profit, investment returns, or guaranteed resale value. Keep answers concise and fun.`;
      const r = await fetch('https://api.openai.com/v1/responses', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'authorization': `Bearer ${env.OPENAI_API_KEY}` },
        body: JSON.stringify({ model: 'gpt-4.1-mini', input: [{ role: 'system', content: system }, { role: 'user', content: String(message || '').slice(0, 1000) }] })
      });
      const data = await r.json();
      const reply = data.output_text || 'やりますねぇ。もう一度聞いてください。';
      return cors(Response.json({ reply }));
    } catch (e) {
      return cors(Response.json({ reply: 'AI接続でエラーが出ました。Worker設定とOPENAI_API_KEYを確認してください。' }, { status: 500 }));
    }
  }
}
function cors(res){res.headers.set('Access-Control-Allow-Origin','*');res.headers.set('Access-Control-Allow-Methods','POST,OPTIONS');res.headers.set('Access-Control-Allow-Headers','content-type');return res}
