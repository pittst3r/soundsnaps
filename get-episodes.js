const fs = require("fs");
const path = require("path");
const AWS = require("aws-sdk");

const IS_PROD = process.env.NODE_ENV === "production";

module.exports = function getEpisodes(next, complete) {
  let count = 0;
  let total = null;

  if (IS_PROD) {
    let s3 = new AWS.S3({
      accessKeyId: process.env.BUCKETEER_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.BUCKETEER_AWS_SECRET_ACCESS_KEY,
      region: "us-east-1"
    });

    s3.listObjectsV2(
      { Bucket: process.env.BUCKETEER_BUCKET_NAME },
      (err, data) => {
        if (!data) {
          total = 0;

          return;
        }

        total = data.Contents.length;

        if (total === 0) {
          return;
        }

        data.Contents.forEach(file => {
          next({
            date: file.LastModified,
            file: path.parse(file.Key).base,
            title: path.parse(file.Key).name,
            url: `https://${data.Name}.s3.amazonaws.com/${file.Key}`
          });

          count++;
        });
      }
    );
  } else {
    fs.readdir("static/fixtures", (err, files) => {
      if (err) {
        throw err;
      }

      total = files.length;

      if (total === 0) {
        return;
      }

      files.forEach(filename => {
        let file = path.resolve("static", "fixtures", filename);
        let url = path.join("/fixtures", filename);
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
    });
  }

  let interval = setInterval(() => {
    if (count === total) {
      complete();
      clearInterval(interval);
    }
  }, 2);
};
