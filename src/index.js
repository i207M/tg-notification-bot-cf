/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npx wrangler dev src/index.js` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npx wrangler publish src/index.js --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
  async fetch(request, env, context) {
    const url = new URL(request.url);

    if (!url.searchParams.has('msg') || !url.searchParams.has('token')) {
      return new Response('Missing parameters', { status: 400 });
    }

    if (url.searchParams.get('token') != env.TOKEN) {
      return new Response('Invalid Token', { status: 401 });
    }

    const msg = url.searchParams.get('msg');

    const bot_req = new Request(
      `https://api.telegram.org/bot${env.TG_BOT_TOKEN}/sendMessage?chat_id=${env.TG_CHAT_ID}&text=${msg}`
    );
    const bot_res = await fetch(bot_req);
    return new Response(bot_res.body, {
      status: bot_res.status,
      headers: bot_res.headers,
    });
  },
};
