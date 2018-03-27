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
    "put <from> <to>",
    "put a 'cast",
    yargs => {
      return yargs
        .positional("from", { type: "string" })
        .positional("to", { type: "string" })
        .option("title")
        .option("date")
        .option("duration");
    },
    argv => {
      fs.readFile(argv.from, (err, data) => {
        if (err) throw err;

        let meta = {
          title: "Untitled",
          duration: "0:00",
          date: new Date().toISOString(),
          size: data.length.toString()
        };

        if (argv.title) {
          meta.title = argv.title;
        }

        if (argv.duration) {
          meta.duration = argv.duration;
        }

        if (argv.date) {
          meta.date = new Date(argv.date).toISOString();
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

          data.Contents.forEach(file => {
            S3.headObject({ Bucket: data.Name, Key: file.Key }, (err, obj) => {
              console.log(file.Key);
              console.log(obj.Metadata);
              console.log();
            });
          });
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
  )
  .command(
    "upload <key> <file>",
    "upload file",
    yargs => {
      return yargs
        .positional("key", { type: "string" })
        .positional("file", { type: "string" });
    },
    argv => {
      fs.readFile(argv.from, (err, data) => {
        S3.upload(
          {
            Bucket: process.env.BUCKETEER_BUCKET_NAME,
            Key: argv.key,
            Body: data
          },
          err => {
            if (err) throw err;
          }
        );
      });
    }
  ).argv;
