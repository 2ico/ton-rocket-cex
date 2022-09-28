const { Telegraf } = require('telegraf');
const DOMAIN = "desolate-savannah-32183.herokuapp.com"
const PORT = 5000

require('dotenv').config()
console.log(process.env)

const bot = new Telegraf(process.env.BOT_API_TOKEN);

bot.on("text", ctx => ctx.reply("Hello"));

// Start webhook via launch method (preferred)
bot.launch({
  webhook: {
    // Public domain for webhook; e.g.: example.com
    domain: DOMAIN,

    // Port to listen on; e.g.: 8080
    port: PORT,

    // Optional path to listen for.
    // `bot.secretPathComponent()` will be used by default
    hookPath: '',

    // Optional secret to be sent back in a header for security.
    // e.g.: `crypto.randomBytes(64).toString("hex")`
    secretToken: crypto.randomBytes(64).toString("hex"),
  },
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));