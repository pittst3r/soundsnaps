const express = require("express");
const generateRSS = require("./generate-rss");

let APP = express();
const IS_PROD = process.env.NODE_ENV === "production";
const PORT = process.env.PORT || 3000;

APP.use(express.static("static"));

APP.get("/", (req, res) => {
  res.send(
    "<html>" +
      "<head><title>Soundsnaps</title></head>" +
      '<body><a href="/rss.xml">RSS</a></body>' +
      "</html>"
  );
});

APP.get("/rss.xml", (req, res) => {
  res.type("application/xml");

  generateRSS(feed => {
    res.send(feed.xml());
  });
});

APP.listen(PORT);
