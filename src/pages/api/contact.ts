import type { APIRoute } from "astro";
import { sendMessage } from "../../utils/send-message";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const { email, message } = await request.json();
  if (!email || !message) 
    return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 });
  await sendMessage(`[${ email }] say: ${ message }`);
  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};