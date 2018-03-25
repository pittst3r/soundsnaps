const fs = require("fs");
const path = require("path");

module.exports = function getEpisodes(next, complete) {
  fs.readdir("static/fixtures", (err, files) => {
    if (err) {
      throw err;
    }

    let total = files.length;

    if (total === 0) {
      return;
    }

    let count = 0;

    files.forEach(filename => {
      let file = path.resolve("static", "fixtures", filename);
      let url = path.join("/static/fixtures", filename);
      let title = path.parse(filename).name;

      fs.stat(file, (_, stats) => {
        let date = stats.birthtime.toISOString();

        next({
          title,
          url,
          file,
          date
        });

        count++;
      });
    });

    let interval = setInterval(() => {
      if (count === total) {
        complete();
        clearInterval(interval);
      }
    }, 2);
  });
};
