/* eslint-disable no-await-in-loop */
/* eslint-disable no-undef */
/* eslint-disable no-restricted-syntax */
import puppeteer from 'puppeteer';
import $ from 'cheerio';
import { addBeers } from 'controllers/beers';
import { addPages, getPages } from 'controllers/pages';
import { getSubstringItem } from 'utils/formatter';

const MAIN_URL = 'https://www.aktionsfinder.at';
const SUPERMARKETS = ['Merkur', 'Billa', 'ADEG', 'Spar', 'Interspar', 'Penny', 'Unimarkt', 'T&G'];

const fetchPages = (req, res) => {
  if (req) {
    (async () => {
      const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });

      const page = await browser.newPage();

      await page.setRequestInterception(true);

      page.on('request', (request) => {
        const whitelist = ['document', 'script', 'xhr', 'fetch', 'stylesheet'];
        if (!whitelist.includes(request.resourceType())) {
          return request.abort();
        }
        return request.continue();
      });

      const response = await page.goto(`${MAIN_URL}/suche/?q=${req.params.type}`, {
        waitUntil: 'networkidle0',
      });

      const status = response.status();

      if ((status < 200 || status > 300) && status !== 304 && status !== 404) {
        return null;
      }

      const html = await page.evaluate(() => document.body.innerHTML);
      const pages = [];

      $('a[href^="/p/"]', html)
        .toArray()
        .map((item) => {
          if (item?.attribs?.href && /^(\/p\/)/.test(item?.attribs?.href)) {
            pages.push(item?.attribs?.href);
          }
          return null;
        });

      if (pages) {
        addPages({ pages });
      }

      return res.status(200).send(pages);
    })();
  }
};

const getBeerPerPage = async ({ page, url, brand }) => {
  await page.goto(`${MAIN_URL}${url}`, {
    waitUntil: 'load',
    timeout: 0,
  });

  const data = await page.evaluate((productUrl) => {
    const productDataAll = [...document.querySelectorAll('[type="application/ld+json"]')].map(
      (item) => item.innerText
    );

    const productData = productDataAll.filter((item) =>
      productUrl.includes(JSON.parse(item)?.offers?.offers[0].url)
    )[0];

    const title = document.querySelector('title').innerText;
    return { productData, title };
  }, url);

  if (data) {
    addBeers({
      productData: data.productData,
      groceryStore: getSubstringItem(data.title, SUPERMARKETS),
      brand,
    });
  }

  return data;
};

const fetchBeers = (req, res) => {
  if (req) {
    (async () => {
      const data = await getPages();
      let browser;
      if (data) {
        browser = await puppeteer.launch({
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        for (const url of data) {
          const page = await browser.newPage();
          await getBeerPerPage({ url: url.url, page, brand: req.params.type });
        }
      }

      await browser.close();

      return res.status(200).send('beers craweld');
    })();
  }
};

export { fetchPages, fetchBeers };
