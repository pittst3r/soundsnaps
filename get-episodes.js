const fs = require("fs");
const path = require("path");

module.exports = function getEpisodes(next, complete) {
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
