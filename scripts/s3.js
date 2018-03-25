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
    yargs => {
      return yargs
        .positional("from", { type: "string" })
        .positional("to", { type: "string" })
        .option("title")
        .option("duration");
    },
    argv => {
      fs.readFile(argv.from, (err, data) => {
        if (err) throw err;

        let meta = {};

        if (argv.title) {
          meta.title = argv.title;
        }

        if (argv.duration) {
          meta.duration = argv.duration;
        }

        S3.putObject(
          {
            Body: data,
            Bucket: process.env.BUCKETEER_BUCKET_NAME,
            Key: argv.to,
            ACL: "public-read",
            Metadata: meta
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

          data.Contents.forEach(file => console.log(file.Key));
        }
      );
    }
  )
  .command(
    "delete <key>",
    "delete file",
    yargs => {
      return yargs.positional("key", { type: "string" });
    },
    argv => {
      console.log("deleting", argv.key);

      S3.deleteObject(
        {
          Bucket: process.env.BUCKETEER_BUCKET_NAME,
          Key: argv.key
        },
        err => {
          if (err) throw err;
        }
      );
    }
  ).argv;
