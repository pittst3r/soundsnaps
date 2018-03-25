const RSS = require("rss");
const fs = require("fs");
const path = require("path");
const getEpisodes = require("./get-episodes");

module.exports = function generateRSS(cb) {
  let feed = new RSS({
    title: "Aurworld",
    description: "Stereo recordings of our world",
    feed_url: "http://aurworld.robbie-pitts.com/rss.xml",
    site_url: "http://aurworld.robbie-pitts.com/",
    image_url: "http://aurworld.robbie-pitts.com/icon.png",
    managingEditor: "Robbie Pitts",
    webMaster: "Robbie Pitts",
    copyright: "2018 Robbie Pitts",
    language: "en",
    pubDate: new Date().toISOString(),
    ttl: "60",
    custom_namespaces: {
      itunes: "http://www.itunes.com/dtds/podcast-1.0.dtd"
    },
    custom_elements: [
      {
        "itunes:explicit": "no"
      },
      {
        "itunes:category": [
          {
            _attr: {
              text: "Society & Culture"
            }
          }
        ]
      }
    ]
  });

  let episodes = getEpisodes(
    meta => {
      feed.item({
        title: meta.title,
        url: meta.url,
        categories: ["Society & Culture"],
        author: "Robbie Pitts",
        date: meta.date,
        enclosure: { url: meta.url, size: meta.size },
        custom_elements: [{ "itunes:duration": meta.duration }]
      });
    },
    () => {
      cb(feed);
    }
  );
};
