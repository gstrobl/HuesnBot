import express from 'express';
import Bot from 'services/bot';
import crawler from 'services/crawler';
// import { getBeers } from 'controllers/beers';

const PORT = process.env.PORT || 3000;
require('dotenv').config();

const app = express();
const bot = new Bot();

// app.get('/beers', async (req, res) => {
//   const resX = await getBeers();
//   console.log('rex', resX);

//   res.send(resX);
// });
app.get('/crawler/:type', crawler.fetchData);

bot.init();
app.use(bot.telegramBot.webhookCallback('/secret-path'));

bot.telegramBot.telegram.setWebhook('https://huesnbot.herokuapp.com/secret-path');

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(PORT, () => {
  console.log(`HuesnBot listening on port ${PORT}!`);
});
