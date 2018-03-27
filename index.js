const express = require("express");
const generateRSS = require("./generate-rss");
const getEpisode = require("./get-episode");
const getEpisodes = require("./get-episodes");
const pug = require("pug");

let APP = express();
const IS_PROD = process.env.NODE_ENV === "production";
const PORT = process.env.PORT || 3000;

APP.use(express.static("static"));

APP.get("/", (req, res) => {
  let episodes = [];

  getEpisodes(
    episode => episodes.push(episode),
    () => {
      let sortedEpisodes = episodes.sort(
        (l, r) => Date.parse(r.date) - Date.parse(l.date)
      );
      pug.renderFile("./index.pug", { episodes }, (err, data) => {
        res.send(data);
      });
    }
  );
});

APP.get("/rss.xml", (req, res) => {
  res.type("application/xml");

  generateRSS(feed => {
    res.send(feed.xml());
  });
});

APP.get("/episodes/:key", (req, res) => {
  let key = req.params["key"];

  getEpisode(key, (err, episode) => {
    if (err) {
      res.status(404);
      res.send("404 Not found");
      return;
    }

    pug.renderFile("./episode.pug", { episode }, (err, data) => {
      res.send(data);
    });
  });
});

APP.listen(PORT);
