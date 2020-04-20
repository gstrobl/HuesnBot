import puppeteer from 'puppeteer';
import $ from 'cheerio';
import { addBeerList } from 'controllers/beers';

const mainUrl = 'https://www.aktionsfinder.at/suche/?q=wieselburger';
const supermarkets = ['Merkur', 'Billa', 'Adeg', 'Spar', 'Interspar', 'Penny', 'Unimarkt'];
const crawler = {
  createEvents(req, res) {
    (async () => {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(`${mainUrl}`);

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
      console.log('page', pageContent.length);
      console.log('mar', markets.length);

      const output = [];
      pageContent.filter((item) => {
        let index = 1;
        const data = JSON.parse(item);

        if (/Kiste/.test(data.name)) {
          output.push({
            name: data.name,
            lowPrice: data.offers.lowPrice,
            highPrice: data.offers.highPrice,
            priceValidUntil: data.offers.priceValidUntil,
            supermarket: markets[index],
          });
        }
        index += 1;
        return null;
      });
      if (output) {
        addBeerList({ data: output, docName: 'priceList' });
      }

      return res.status(200).send(output);
    })();
  },
};

export default crawler;
