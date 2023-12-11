const puppeteer = require("puppeteer");
const flipkartConstants = require("../constants/flipkartConstants");
const { generateFlipkartUrl } = require("../utils/urlGenerator");
let cacheObj = {};

const scrape = async (req, res) => {
  try {
    const { query, sort, num } = req.query;
    let key = `${query}~*~${sort}~*~${num}`;
    if (cacheObj[key]) {
      return res.json(cacheObj[key]);
    }
    const flipkartUrl = generateFlipkartUrl(query, sort);

    const browser = await puppeteer.launch({
      executablePath:
        process.env.NODE_ENV === "production"
          ? process.env.PUPPETEER_EXECUTABLE_PATH
          : puppeteer.executablePath(),
    });
    const page = await browser.newPage();

    await page.goto(flipkartUrl);

    const productElements = await page.$$(flipkartConstants.PRODUCT_SELECTOR);

    const productsData = await Promise.all(
      productElements.map(async (productElement) => {
        const priceElement = await productElement.$(
          flipkartConstants.PRICE_SELECTOR
        );
        if (!priceElement) {
          return null;
        }
        const price = await priceElement.evaluate((node) =>
          node.innerText.trim()
        );

        const ratingElement = await productElement.$(
          flipkartConstants.RATING_SELECTOR
        );
        const rating = ratingElement
          ? await ratingElement.evaluate((node) => node.innerText.trim())
          : null;

        const titleElement = await productElement.$(
          flipkartConstants.TITLE_SELECTOR
        );
        if (!titleElement) {
          return null;
        }
        const title = await titleElement.evaluate((node) =>
          node.innerText.trim()
        );

        const reviewElement = await productElement.$(
          flipkartConstants.REVIEW_SELECTOR
        );
        const review = reviewElement
          ? await reviewElement.evaluate((node) => node.innerText.trim())
          : null;

        const urlElement = await productElement.$(
          flipkartConstants.URL_SELECTOR
        );
        if (!urlElement) {
          return null;
        }
        const productUrl = await urlElement.evaluate((node) => node.href);

        return { price, title, productUrl, rating, review };
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
    res.json({ error: "Internal Server Error" });
  }
};
setInterval(() => {
  cacheObj = {};
}, 1000 * 60 * 10);
module.exports = { scrape };
