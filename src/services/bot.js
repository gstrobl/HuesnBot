import Telegraf from 'telegraf';

require('dotenv').config();

class Bot {
  constructor() {
    this.telegramBot = new Telegraf(process.env.BOT_TOKEN);
  }

  init() {
    // this.telegramBot.telegram.setChatPhoto();
    this.telegramBot.telegram.deleteWebhook().then((success) => {
      if (success) {
        console.log('🤖 is listening to your commands');
      }
      this.telegramBot.startPolling();
    });

    this.telegramBot.start(async (ctx) => {
      const name = ctx.from.first_name;
      ctx.reply(`Ahoi ${name || 'friend'}! You managed to run me!`);
    });

    this.telegramBot.command('bier', async (ctx) => {
      const name = ctx.from.first_name;
      ctx.reply(`Servus ${name || 'Hawara'}! Bald schick ich dir die günstigsten Angebote!`);
    });
  }
}
// this.telegramBot.start((ctx) => ctx.reply('Welcome!'));
// bot.help((ctx) => ctx.reply('Send me a sticker'));
// bot.on('sticker', (ctx) => ctx.reply('👍'));
// bot.hears('hi', (ctx) => ctx.reply('Hey there'));
// bot.launch();

export default Bot;
