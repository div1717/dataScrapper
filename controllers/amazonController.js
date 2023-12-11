const puppeteer = require("puppeteer");
const amazonConstants = require("../constants/amazonConstants");
const { generateAmazonUrl } = require("../utils/urlGenerator");

const scrape = async (req, res) => {
  try {
    const { query, sort } = req.query;
    const amazonUrl = generateAmazonUrl(query, sort);

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(amazonUrl);

    const productElements = await page.$$(
      amazonConstants.PRODUCT_ELEMENT_SELECTOR
    );

    const productsData = await Promise.all(
      productElements.map(async (productElement) => {
        const priceElement = await productElement.$(
          amazonConstants.PRICE_SELECTOR
        );
        if (!priceElement) {
          return null;
        }
        const price = await priceElement.evaluate((node) =>
          node.innerText.trim()
        );

        const titleElement = await productElement.$(
          amazonConstants.TITLE_SELECTOR
        );
        if (!titleElement) {
          return null;
        }
        const title = await titleElement.evaluate((node) =>
          node.innerText.trim()
        );

        const ratingElement = await productElement.$(
          amazonConstants.RATING_SELECTOR
        );
        let rating = null;
        if (ratingElement) {
          rating = await ratingElement.evaluate((node) =>
            node.getAttribute("aria-label")
          );
        }

        const reviewsElement = await productElement.$(
          amazonConstants.REVIEWS_SELECTOR
        );
        let reviews = null;
        if (reviewsElement) {
          reviews = await reviewsElement.evaluate((node) =>
            node.getAttribute("aria-label")
          );
        }

        const urlElement = await productElement.$(amazonConstants.URL_SELECTOR);
        if (!urlElement) {
          return null;
        }
        const productUrl = await urlElement.evaluate((node) => node.href);

        return { price, productUrl, title, rating, reviews };
      })
    );
    const filteredProductsData = productsData.filter(
      (product) => product !== null
    );

    await browser.close();
    res.json({ filteredProductsData });
  } catch (error) {
    console.error("Error during scraping:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { scrape };