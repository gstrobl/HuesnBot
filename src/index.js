import auth from 'http-auth';
import authConnect from 'http-auth-connect';
import express from 'express';
import Bot from 'services/bot';
import { fetchBeers, fetchPages } from 'services/crawler';

const PORT = process.env.PORT || 3000;
const SECRETPATH = process.env.SECRET_PATH;

require('dotenv').config();

const basic = auth.basic({ realm: 'Monitor Area' }, (user, pass, callback) => {
  callback(user === process.env.MONITOR_USERNAME && pass === process.env.MONITOR_PASSWORD);
});

const app = express();
const bot = new Bot();

const statusMonitor = require('express-status-monitor')({ path: '' });

app.use(statusMonitor.middleware);
app.get('/status', authConnect(basic), statusMonitor.pageRoute);

app.get('/crawler/pages/:type', fetchPages);
app.get('/crawler/beers/:type', fetchBeers);

bot.init();
app.use(bot.telegramBot.webhookCallback(`/${SECRETPATH}`));

bot.telegramBot.telegram.setWebhook(`https://huesnbot.herokuapp.com/${SECRETPATH}`);

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`HuesnBot listening on port ${PORT}!`);
});
