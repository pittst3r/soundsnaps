const fs = require("fs");
const path = require("path");

const isProd = process.env.NODE_ENV === "production";

module.exports = function getEpisodes(next, complete) {
  if (isProd) {
    throw new Error("Prod not supported");
  }

  fs.readdir("fixtures", (err, files) => {
    if (err) {
      throw err;
    }

    let total = files.length;

    if (total === 0) {
      return;
    }

    let count = 0;

    files.forEach(filename => {
      let location = path.resolve("fixtures", filename);
      let title = path.parse(location).name;

      fs.stat(location, (_, stats) => {
        let date = stats.birthtime.toISOString();

        next({
          title,
          location,
          date
        });

        count++;
      });
    });

    setInterval(() => {
      if (count === total) {
        complete();
      }
    }, 2);
  });
};
