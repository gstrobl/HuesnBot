import puppeteer from 'puppeteer';
import $ from 'cheerio';
import { addBeers } from 'controllers/beers';

const mainUrl = 'https://www.aktionsfinder.at/suche/?q=';
const supermarkets = ['Merkur', 'Billa', 'Adeg', 'Spar', 'Interspar', 'Penny', 'Unimarkt'];

const crawler = {
  fetchData(req, res) {
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

        const response = await page.goto(`${mainUrl}${req.params.type}`, {
          waitUntil: 'networkidle0',
        });

        const status = response.status();

        if ((status < 200 || status > 300) && status !== 304 && status !== 404) {
          return null;
        }

        const html = await page.evaluate(() => document.body.innerHTML);

        const pageContent = [];
        const markets = [];

        $('[type="application/ld+json"]', html).map((i, element) => {
          pageContent[i] = element.children ? element.children[0].data : null;
          if (element.children && element.children[0].data) {
            $('img', element.prev.children).map((index, item) => {
              if (item.attribs && item.attribs.alt && supermarkets.includes(item.attribs.alt)) {
                markets[i] = item.attribs.alt;
              }
              return markets;
            });
          }

          return pageContent;
        });

        if (pageContent) {
          addBeers({ pageContent, groceryStores: markets, brand: req.params.type });
        }

        return res.status(200).send(pageContent);
      })();
    }
  },
};

export default crawler;
