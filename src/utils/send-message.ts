const TELEGRAM_CHAT_ID = import.meta.env.TELEGRAM_CHAT_ID;
const TELEGRAM_BOT_TOKEN = import.meta.env.TELEGRAM_BOT_TOKEN;

export async function sendMessage(message: string): Promise<boolean> {
  try { 
    const TGUrl = `https://api.telegram.org/bot${ TELEGRAM_BOT_TOKEN }/sendMessage`;

    const response = await fetch(TGUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
      }),
    });

    if (!response.ok) 
      return false; 

    return true;
  } catch (e) { 
    console.error(`[${new Date()}] [sendMessage] [ERROR] ${ e }`);
    return false;
  }
} 