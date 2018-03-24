const RSS = require("rss");
const fs = require("fs");
const path = require("path");
const getEpisodes = require("./get-episodes");

const isProd = process.env.NODE_ENV === "production";

module.exports = function generateRSS(cb) {
  let feed = new RSS({
    title: "Aurworlds",
    description: "Stereo recordings of our world",
    feed_url: "https://aurworlds.robbie-pitts.com/rss.xml",
    site_url: "https://aurworlds.robbie-pitts.com/",
    image_url: "http://aurworlds.robbie-pitts.com/icon.png",
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
            href: "http://aurworlds.robbie-pitts.com/icon.png"
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
        url: meta.location,
        categories: ["Society & Culture"],
        author: "Robbie Pitts",
        date: meta.date,
        enclosure: { url: meta.location, file: meta.location }
      });
    },
    () => {
      cb(feed);
    }
  );
};
