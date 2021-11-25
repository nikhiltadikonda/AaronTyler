process.env.NTBA_FIX_319 = 1;
const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

console.log('Bot is Active');

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {polling: true});
bot.onText(/\/start (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const resp = match[1];
    bot.sendMessage(chatId, resp);
  });