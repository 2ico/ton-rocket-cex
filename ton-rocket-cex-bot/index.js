import Telegraf from 'telegraf';
const crypto = require('crypto');
const DOMAIN = `https://${process.env.HEROKU_APP_NAME}.herokuapp.com`
const PORT = process.env.PORT

require('dotenv').config()

const bot = new Telegraf(process.env.BOT_API_TOKEN);

bot.on("text", ctx => ctx.reply(`Hello ${ctx.from.first_name}`, {
    reply_markup: {
        inline_keyboard: [
            [{ text: 'Open webapp', web_app: {url: 'https://test123.heroku.com'} }],
        ]
    }}));

// Start webhook via launch method (preferred)
bot.launch({
  webhook: {
    // Public domain for webhook; e.g.: example.com
    domain: DOMAIN,

    // Port to listen on; e.g.: 8080
    port: PORT,

    // Optional path to listen for.
    // `bot.secretPathComponent()` will be used by default
    // hookPath: '',

    // Optional secret to be sent back in a header for security.
    // e.g.: `crypto.randomBytes(64).toString("hex")`
    secretToken: crypto.randomBytes(64).toString("hex"),
  },
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));