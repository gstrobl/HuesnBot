import express from 'express';
// import Bot from 'services/bot';
import crawler from 'services/crawler';
// import { addBeerList, getRecord } from 'controllers/beers';

// const bot = new Bot();

require('dotenv').config();

const app = express();

// app.get('/test', (req, res) => {
//   const dataX = [
//     {
//       first: 'Alan',
//       middle: 'Mathison',
//       last: 'TuringXx',
//       born: 1912,
//     },
//     {
//       first: 'Alan',
//       middle: 'Mathison',
//       last: 'TuringXx',
//       born: 1912,
//     },
//   ];
//   addBeerList({ data: dataX, docName: 'priceList' });
//   const data = getRecord();
//   res.send(data);
//   console.log('HTTP Get Request');
// });

app.get('/crawler/:type', crawler.fetchData);
// bot.init();
// bot.telegramBot.telegram.setWebhook('https://----.localtunnel.me/secret-path');
app.get('/', (req, res) => res.send('Hello World!'));
// Set the bot API endpoint
// app.use(bot.webhookCallback('/secret-path'));
app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});
