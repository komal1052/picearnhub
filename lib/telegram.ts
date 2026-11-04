const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID;

export async function sendTelegramAlert(htmlMessage: string) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_ADMIN_CHAT_ID) {
    console.warn("⚠️ Telegram credentials missing. Skipping notification.");
    return;
  }

  try {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_ADMIN_CHAT_ID,
        text: htmlMessage,
        parse_mode: "HTML",
        disable_web_page_preview: false,
      }),
    });
  } catch (error) {
    console.error("Failed to send Telegram alert:", error);
  }
}

export async function notifyPhotoUploadAlert(data: {
  title: string;
  category: string;
  creatorName: string;
  isAiGenerated: boolean;
  aiModel?: string | null;
  photoId: string;
}) {
  const message = `
📸 <b>NEW PHOTO PUBLISHED ON PICEARNHUB</b>

🖼️ <b>Title:</b> ${data.title}
📁 <b>Category:</b> ${data.category}
👤 <b>Creator:</b> ${data.creatorName}
🤖 <b>Format:</b> ${data.isAiGenerated ? `AI Art (${data.aiModel || "Generative"})` : "Real Camera Shot"}

👉 <a href="https://www.photoearngallery.site/admin">Open Dashboard to View</a>
  `.trim();

  await sendTelegramAlert(message);
}

export async function notifyWithdrawalAlert(data: {
  userName: string;
  userEmail: string;
  amount: string;
  gateway: string;
  accountDetails: string;
  transactionId: string;
}) {
  const message = `
🚨 <b>NEW PAYOUT REQUEST</b> 🚨

👤 <b>Creator:</b> ${data.userName} (${data.userEmail})
💰 <b>Amount:</b> $${data.amount} USD
💳 <b>Gateway:</b> <code>${data.gateway}</code>
📱 <b>Account / Number:</b> <code>${data.accountDetails}</code>
🆔 <b>Trx Ref:</b> ${data.transactionId}
  `.trim();

  await sendTelegramAlert(message);
}

export async function notifyContestWinnerAlert(data: {
  contestTitle: string;
  winnerName: string;
  prizeAmount: string;
  votes: number;
}) {
  const message = `
🏆 <b>CONTEST WINNER DECLARED</b> 🏆

🎯 <b>Contest:</b> ${data.contestTitle}
👑 <b>Champion:</b> ${data.winnerName}
💵 <b>Prize Credited:</b> $${data.prizeAmount} USD
🗳️ <b>Winning Votes:</b> ${data.votes}
  `.trim();

  await sendTelegramAlert(message);
}