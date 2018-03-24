const express = require("express");
const generateRSS = require("./generate-rss");

let APP = express();
const IS_PROD = process.env.NODE_ENV === "production";
const PORT = process.env.PORT || 3000;

APP.get("/rss.xml", (req, res) => {
  generateRSS(feed => {
    res.format({
      "application/xml": function() {
        res.send(feed.xml());
      },

      default: function() {
        res.status(406);
      }
    });
  });
});

APP.listen(PORT);
