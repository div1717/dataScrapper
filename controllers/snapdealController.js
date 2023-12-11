const puppeteer = require("puppeteer");
const snapdealConstants = require("../constants/snapdealConstants");
const { generateSnapdealUrl } = require("../utils/urlGenerator");
let cacheObj = {};

const scrape = async (req, res) => {
  try {
    const { query, sort } = req.query;
    let key = `${query}~*~${sort}`;
    if (cacheObj[key]) {
      return res.json(cacheObj[key]);
    }
    const url = generateSnapdealUrl(query, sort);

    console.log(url);

    const browser = await puppeteer.launch({
      executablePath:
        process.env.NODE_ENV === "production"
          ? process.env.PUPPETEER_EXECUTABLE_PATH
          : puppeteer.executablePath(),
    });
    const page = await browser.newPage();

    await page.goto(url);

    const productElements = await page.$$(
      snapdealConstants.PRODUCT_ELEMENT_SELECTOR
    );
    console.log(productElements);

    const productsData = await Promise.all(
      productElements.map(async (productElement) => {
        const priceElement = await productElement.$(
          snapdealConstants.PRICE_ELEMENT_SELECTOR
        );
        const price = await priceElement.evaluate((node) =>
          node.innerText.trim()
        );

        const titleElement = await productElement.$(
          snapdealConstants.TITLE_ELEMENT_SELECTOR
        );
        let title = titleElement
          ? await titleElement.evaluate((node) => node.innerText.trim())
          : null;

        if (!title) {
          const pTagElement = await productElement.$(
            snapdealConstants.P_TAG_ELEMENT_SELECTOR
          );
          title = pTagElement
            ? await pTagElement.evaluate((node) => node.innerText.trim())
            : null;
        }

        const reviewElement = await productElement.$(
          snapdealConstants.REVIEW_ELEMENT_SELECTOR
        );

        let review;

        if (reviewElement) {
          review = await reviewElement.evaluate((node) =>
            node.innerText.trim()
          );
        } else {
          review = null;
        }

        const ratingElement = await productElement.$(
          snapdealConstants.RATING_ELEMENT_SELECTOR
        );

        let rating;

        if (ratingElement) {
          const widthAttribute = await ratingElement.evaluate(
            (node) => node.style.width
          );
          const match = widthAttribute.match(/(\d+(\.\d+)?)%/);

          rating = match ? parseFloat(match[1]) : null;
        } else {
          rating = null;
        }

        const urlElement = await productElement.$(
          snapdealConstants.URL_ELEMENT_SELECTOR
        );

        const productUrl = await urlElement.evaluate((node) => node.href);

        return { price, title, review, productUrl, rating };
      })
    );

    await browser.close();
    cacheObj[key] = { productsData };
    res.json({ productsData });
  } catch (error) {
    console.error("Error during scraping:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

setInterval(() => {
  cacheObj = {};
}, 1000 * 60 * 10);
module.exports = { scrape };
