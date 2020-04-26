import Telegraf from 'telegraf';
import { getBeers } from 'controllers/beers';
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
      ctx.reply(`Ahoi ${name || 'Hawara'}! Frag mich wo es das günstigste Bier gibt!`);
    });

    this.telegramBot.hears(/.*(b|B)ier/, async (ctx) => {
      const name = ctx.from.first_name;
      const data = await getBeers();

      if (!data) {
        ctx.reply(`Servus ${name || 'Hawara'}! Derzeit gibt es keine Angebote 🤨`);
        return null;
      }
      const checkType = (type) => {
        return type === 'can' ? 'Dose' : 'Flasche';
      };

      const message = data.map((item) => {
        const formatMessage = `🍺 ${item.shortName} / ${item.productMeasure} / ${checkType(
          item.type,
        )} 💵 EUR ${item.lowPricePerItem} 🏪 ${item.supermarket} 📅 gültig bis: ${dayjs(
          item.priceValidUntil.seconds * 1000,
        ).format('DD.MM.YYYY')} \n\n`;
        return formatMessage;
      });

      ctx.reply(
        `Servus ${name || 'Hawara'}! Hier hast du die derzeitigen Angebote: \n ${message.join(
          ' ',
        )}`,
      );
      return null;
    });

    this.telegramBot.hears(/.*(d|D)anke/, async (ctx) => {
      const name = ctx.from.first_name;
      ctx.reply(`Lass es dir schmecken ${name || 'Hawara'}! 🍺`);
    });
  }
}
// this.telegramBot.start((ctx) => ctx.reply('Welcome!'));
// bot.help((ctx) => ctx.reply('Send me a sticker'));
// bot.on('sticker', (ctx) => ctx.reply('👍'));
// bot.hears('hi', (ctx) => ctx.reply('Hey there'));
// bot.launch();

export default Bot;
