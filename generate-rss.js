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
    categories: [],
    pubDate: new Date().toISOString(),
    ttl: "60",
    custom_namespaces: {
      itunes: "http://www.itunes.com/dtds/example.0.dtd"
    },
    custom_elements: [
      { "itunes:subtitle": "Stereo recordings of our world" },
      { "itunes:author": "Robbie Pitts" },
      {
        "itunes:summary": "Stereo recordings of our world."
      },
      {
        "itunes:owner": [
          { "itunes:name": "Robbie Pitts" },
          { "itunes:email": "me@robbie-pitts.com" }
        ]
      },
      {
        "itunes:image": {
          _attr: {
            href: "http://aurworld.robbie-pitts.com/icon.png"
          }
        }
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
        enclosure: { url: meta.url }
      });
    },
    () => {
      cb(feed);
    }
  );
};
