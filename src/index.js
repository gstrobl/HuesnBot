import express from 'express';
import Bot from 'services/bot';
import crawler from 'services/crawler';

const PORT = process.env.PORT || 3000;
require('dotenv').config();

const app = express();
const bot = new Bot();

app.get('/crawler/:type', crawler.fetchData);

bot.init();
app.use(bot.telegramBot.webhookCallback('/secret-path'));
bot.telegramBot.telegram.setWebhook('https://huesnbot.herokuapp.com/secret-path');
// bot.telegramBot.telegram.setWebhook('https://----.localtunnel.me/secret-path');
app.get('/', (req, res) => res.send('Hello World!'));
// Set the bot API endpoint
// app.use(bot.webhookCallback('/secret-path'));
app.listen(PORT, () => {
  console.log('Example app listening on port 3000!');
});
