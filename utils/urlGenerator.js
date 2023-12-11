function generateAmazonUrl(searchQuery, sort) {
  const formattedQuery = searchQuery.replace(/ /g, "+");
  let url = `https://www.amazon.in/s?k=${formattedQuery}`;

  if (sort) {
    switch (sort) {
      case "lowToHigh":
        url += "&s=price-asc-rank";
        break;
      case "highToLow":
        url += "&s=price-desc-rank";
        break;
      case "ratingAndReview":
        url += "&s=review-rank";
        break;
    }
  }
  return url;
}

function generateNykaaUrl(query, sort) {
  const baseUrl = "https://www.nykaa.com/search/result/";
  const queryParams = new URLSearchParams({ q: query });

  if (sort === "lowToHigh") {
    queryParams.set("sort", "price_asc");
  } else if (sort === "hightToLow") {
    queryParams.set("sort", "price_desc");
  } else if (sort === "ratingAndReview") {
    queryParams.set("sort", "customer_top_rated");
  }

  const url = `${baseUrl}?${queryParams.toString()}`;
  return url;
}

function generateJiomartUrl(searchQuery, sort) {
  const formattedQuery = searchQuery.replace(/ /g, "%20");
  let url = `https://www.jiomart.com/search/${formattedQuery}`;

  if (sort) {
    switch (sort) {
      case "lowToHigh":
        url +=
          "?prod_mart_master_vertical%5BhierarchicalMenu%5D%5Bcategory_tree.level0%5D%5B0%5D=Category&prod_mart_master_vertical%5BsortBy%5D=prod_mart_master_vertical_products_price_asc";
        break;
      case "highToLow":
        url +=
          "?prod_mart_master_vertical%5BhierarchicalMenu%5D%5Bcategory_tree.level0%5D%5B0%5D=Category&prod_mart_master_vertical%5BsortBy%5D=prod_mart_master_vertical_products_price_desc";
        break;
      case "ratingAndReview":
        url +=
          "?prod_mart_master_vertical%5BhierarchicalMenu%5D%5Bcategory_tree.level0%5D%5B0%5D=Category&prod_mart_master_vertical%5BsortBy%5D=prod_mart_master_vertical_products_popularity";
        break;
    }
  }

  return url;
}

function generateSnapdealUrl(searchQuery, sort) {
  const formattedQuery = searchQuery.replace(/ /g, "%20");
  let url = `https://www.snapdeal.com/search?keyword=${formattedQuery}`;

  if (sort) {
    switch (sort) {
      case "lowToHigh":
        url += "&sort=plth";
        break;
      case "highToLow":
        url += "&sort=phtl";
        break;
      case "ratingAndReview":
        url += "&sort=plrty";
        break;
    }
  }

  return url;
}

function generateFlipkartUrl(query, sort) {
  const baseUrl = "https://www.flipkart.com/search";
  const params = {
    q: query,
    otracker: "search",
    otracker1: "search",
    marketplace: "FLIPKART",
    "as-show": "on",
    as: "off",
  };

  if (sort === "lowToHigh") {
    params.sort = "price_asc";
  } else if (sort === "highToLow") {
    params.sort = "price_desc";
  } else if (sort === "ratingAndReview") {
    params.sort = "popularity";
  }

  const urlParams = new URLSearchParams(params);
  const url = `${baseUrl}?${urlParams.toString()}`;
  return url;
}

module.exports = {
  generateAmazonUrl,
  generateSnapdealUrl,
  generateFlipkartUrl,
  generateNykaaUrl,
  generateJiomartUrl,
};
