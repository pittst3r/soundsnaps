const child_process = require("child_process");
const path = require("path");
const yargs = require("yargs");

const ARGV = yargs.argv;

let infile = ARGV._[0];
let infileParts = path.parse(infile);
let outfile = path.join(infileParts.dir, infileParts.name) + ".wav";

let proc = child_process.spawn("ffmpeg", [
  "-i",
  infile,
  "-c:a",
  "pcm_s24le",
  outfile
]);

proc.on("exit", code => {
  process.exit(code);
});

proc.stderr.pipe(process.stdout);
