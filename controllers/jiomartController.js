const puppeteer = require("puppeteer");
const jiomartConstants = require("../constants/jiomartConstants");
const { generateJiomartUrl } = require("../utils/urlGenerator");
let cacheObj = {};

const scrape = async (req, res) => {
  try {
    const { query, sort, num } = req.query;
    let key = `${query}~*~${sort}~*~${num}`;
    if (cacheObj[key]) {
      return res.json(cacheObj[key]);
    }
    const jiomartUrl = generateJiomartUrl(query, sort);

    const browser = await puppeteer.launch({
      args: ["--disable-http2"],
      executablePath:
        process.env.NODE_ENV === "production"
          ? process.env.PUPPETEER_EXECUTABLE_PATH
          : puppeteer.executablePath(),
    });

    const page = await browser.newPage();

    await page.goto(jiomartUrl);

    const productElements = await page.$$(
      jiomartConstants.PRODUCT_ELEMENT_SELECTOR
    );

    const productsData = await Promise.all(
      productElements.map(async (productElement) => {
        const priceElement = await productElement.$(
          jiomartConstants.PRICE_SELECTOR
        );
        if (!priceElement) {
          return null;
        }
        const price = await priceElement.evaluate((node) =>
          node.innerText.trim()
        );

        const titleElement = await productElement.$(
          jiomartConstants.TITLE_SELECTOR
        );
        if (!titleElement) {
          return null;
        }
        const title = await titleElement.evaluate((node) =>
          node.innerText.trim()
        );

        const rating = null;
        const reviewCount = null;

        const urlElement = await productElement.$(
          jiomartConstants.URL_SELECTOR
        );
        if (!urlElement) {
          return null;
        }
        const productUrl = await urlElement.evaluate((node) => node.href);

        return { price, title, productUrl, rating, reviewCount };
      })
    );

    let filteredProductsData = productsData.filter(
      (product) => product !== null
    );

    if (num == null) {
      filteredProductsData = productsData
        .filter((product) => product !== null)
        .slice(0, 3);
    } else if (num < filteredProductsData.length) {
      filteredProductsData = productsData
        .filter((product) => product !== null)
        .slice(0, num);
    }

    await browser.close();
    cacheObj[key] = { filteredProductsData };
    res.json({ filteredProductsData });
  } catch (error) {
    console.error("Error during scraping:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
setInterval(() => {
  cacheObj = {};
}, 1000 * 60 * 10);
module.exports = { scrape };
