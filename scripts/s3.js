#!/usr/bin/env node

const AWS = require("aws-sdk");
const fs = require("fs");
const path = require("path");
const yargs = require("yargs");

const S3 = new AWS.S3({
  accessKeyId: process.env.BUCKETEER_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.BUCKETEER_AWS_SECRET_ACCESS_KEY,
  region: process.env.BUCKETEER_AWS_REGION
});

const ARGV = yargs
  .command(
    "upload <from> <to>",
    "upload a 'cast",
    args => {
      return args
        .positional("from", { type: "string" })
        .positional("to", { type: "string" });
    },
    argv => {
      fs.readFile(argv.from, (err, data) => {
        if (err) throw err;

        S3.putObject(
          {
            Body: data,
            Bucket: process.env.BUCKETEER_BUCKET_NAME,
            Key: argv.to,
            ACL: "public-read"
          },
          (err, response) => {
            if (err) throw err;
            console.log(response);
          }
        );
      });
    }
  )
  .command(
    "list",
    "list files",
    () => {},
    () => {
      S3.listObjectsV2(
        { Bucket: process.env.BUCKETEER_BUCKET_NAME },
        (err, data) => {
          if (err) throw err;

          data.Contents.forEach(console.log);
        }
      );
    }
  ).argv;
