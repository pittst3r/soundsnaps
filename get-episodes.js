const fs = require("fs");
const path = require("path");
const AWS = require("aws-sdk");

module.exports = function getEpisodes(next, complete) {
  let count = 0;
  let total = null;

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
        s3.headObject({ Bucket: data.Name, Key: file.Key }, (err, obj) => {
          next({
            date: obj.Metadata.date,
            title: obj.Metadata.title,
            duration: obj.Metadata.duration,
            size: obj.Metadata.size,
            key: path.parse(file.Key).name,
            url: `https://${data.Name}.s3.amazonaws.com/${file.Key}`
          });

          count++;
        });
      });
    }
  );

  let interval = setInterval(() => {
    if (count === total) {
      complete();
      clearInterval(interval);
    }
  });
};
