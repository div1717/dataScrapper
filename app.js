const express = require("express");
const app = express();
const PORT = 3000;

// Routes
const snapdealRoute = require("./routes/snapdealRoute");
const nykaaRoute = require("./routes/nykaaRoute");
const flipkartRoute = require("./routes/flipkartRoute");
const amazonRoute = require("./routes/amazonRoute");
const jiomartRoute = require("./routes/jiomartRoute");

//health route
app.get("/health", (req, res) => {
  res.send("Server is healthy");
});

// Use routes
app.use("/scrape/", snapdealRoute);
app.use("/scrape/", nykaaRoute);
app.use("/scrape/", amazonRoute);
app.use("/scrape/", jiomartRoute);
app.use("/scrape/", flipkartRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
