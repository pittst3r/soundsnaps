const fs = require("fs");
const AWS = require("aws-sdk");

const EXTENSION = "wav";

module.exports = function getEpisode(key, complete) {
  let fullKey = `${key}.${EXTENSION}`;
  let s3 = new AWS.S3({
    accessKeyId: process.env.BUCKETEER_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.BUCKETEER_AWS_SECRET_ACCESS_KEY,
    region: "us-east-1"
  });

  s3.headObject(
    { Bucket: process.env.BUCKETEER_BUCKET_NAME, Key: fullKey },
    (err, obj) => {
      complete({
        date: obj.Metadata.date,
        title: obj.Metadata.title,
        duration: obj.Metadata.duration,
        size: obj.Metadata.size,
        key: key,
        url: `https://${
          process.env.BUCKETEER_BUCKET_NAME
        }.s3.amazonaws.com/${fullKey}`
      });
    }
  );
};
