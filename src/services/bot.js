import Telegraf from 'telegraf';
import { getBeerList } from 'controllers/beers';
import dayjs from 'dayjs';

require('dotenv').config();

class Bot {
  constructor() {
    this.telegramBot = new Telegraf(process.env.BOT_TOKEN);
  }

  init() {
    this.telegramBot.telegram.deleteWebhook().then(async (success) => {
      if (success) {
        // eslint-disable-next-line no-console
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
      const data = await getBeerList('priceList');

      const message = data.map((item) => {
        const formatMessage = `🍺 ${item.name} 💵 EUR ${item.lowPrice} 🏪 ${
          item.supermarket
        } 📅 gültig bis: ${dayjs(item.priceValidUntil).format('DD.MM')} \n\n`;
        return formatMessage;
      });

      ctx.reply(
        `Servus ${name || 'Hawara'}! Hier hast die derzeitigen Angebote: \n ${message.join(' ')}`,
      );
    });
  }
}
// this.telegramBot.start((ctx) => ctx.reply('Welcome!'));
// bot.help((ctx) => ctx.reply('Send me a sticker'));
// bot.on('sticker', (ctx) => ctx.reply('👍'));
// bot.hears('hi', (ctx) => ctx.reply('Hey there'));
// bot.launch();

export default Bot;
