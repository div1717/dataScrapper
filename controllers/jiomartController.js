const puppeteer = require("puppeteer");
const jiomartConstants = require("../constants/jiomartConstants");
const { generateJiomartUrl } = require("../utils/urlGenerator");

const scrape = async (req, res) => {
  try {
    const { query, sort } = req.query;
    const jiomartUrl = generateJiomartUrl(query, sort);
    console.log(jiomartUrl);

    const browser = await puppeteer.launch({
      args: ["--disable-http2"],
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
        const price = await priceElement.evaluate((node) =>
          node.innerText.trim()
        );

        const titleElement = await productElement.$(
          jiomartConstants.TITLE_SELECTOR
        );
        const title = await titleElement.evaluate((node) =>
          node.innerText.trim()
        );

        const rating = null;
        const reviewCount = null;

        const urlElement = await productElement.$(
          jiomartConstants.URL_SELECTOR
        );
        const productUrl = await urlElement.evaluate((node) => node.href);

        return { price, title, productUrl, rating, reviewCount };
      })
    );

    await browser.close();
    res.json({ productsData });
  } catch (error) {
    console.error("Error during scraping:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { scrape };
