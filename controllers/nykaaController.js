const puppeteer = require("puppeteer");
const nykaaConstants = require("../constants/nykaaConstants");
const { generateNykaaUrl } = require("../utils/urlGenerator");
let cacheObj = {};

const scrape = async (req, res) => {
  try {
    const { query, sort, num } = req.query;
    let key = `${query}~*~${sort}~*~${num}`;
    if (cacheObj[key]) {
      return res.json(cacheObj[key]);
    }
    const nykaaUrl = generateNykaaUrl(query, sort);

    const browser = await puppeteer.launch({
      executablePath:
        process.env.NODE_ENV === "production"
          ? process.env.PUPPETEER_EXECUTABLE_PATH
          : puppeteer.executablePath(),
    });

    const page = await browser.newPage();

    await page.goto(nykaaUrl);

    const productElements = await page.$$(
      nykaaConstants.PRODUCT_ELEMENT_SELECTOR
    );

    // console.log(productElements);

    // Extracting prices and ratings for each product
    const productsData = await Promise.all(
      productElements.map(async (productElement) => {
        // price
        const priceElement = await productElement.$(
          nykaaConstants.PRICE_SELECTOR
        );
        if (!priceElement) {
          return null;
        }
        const price = await priceElement.evaluate((node) =>
          node.innerText.trim()
        );

        // title
        const titleElement = await productElement.$(
          nykaaConstants.TITLE_SELECTOR
        );
        if (!titleElement) {
          return null;
        }
        const title = await titleElement.evaluate((node) =>
          node.innerText.trim()
        );

        // reviews
        const reviewElement = await productElement.$(
          nykaaConstants.REVIEW_SELECTOR
        );
        let reviewCount = 0;

        if (reviewElement) {
          let reviewText = await reviewElement.evaluate(
            (node) => node.textContent || ""
          );

          // Use a regular expression to extract only numeric characters
          const numericReview = reviewText.replace(/\D/g, "");

          // Parse the numeric string to an integer
          reviewCount = parseInt(numericReview, 10);
        } else {
          reviewCount = 0;
        }

        const rating = null;

        // url;
        const urlElement = await productElement.$(nykaaConstants.URL_SELECTOR);
        if (!urlElement) {
          return null;
        }
        const productUrl = await urlElement.evaluate((node) => node.href);

        return { price, title, reviewCount, rating, productUrl };
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
