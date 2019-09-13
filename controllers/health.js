const db = require("../startup/db");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const csv = require("csv-parser");
const fs = require("fs");
const parquet = require("parquetjs");
const util = require("util");
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);
const path = require("path");
const AWS = require("aws-sdk");
AWS.config.update({
  accessKeyId: "",
  secretAccessKey: ""
});
const s3 = new AWS.S3();

// const params = {
//   Bucket: "sss-mech-spike-1-input",
//   Key: "poc.csv",
//   Body: path.join(__dirname, "poc.csv"),
//   ContentType: "application/octet-stream"
//   // ContentDisposition: contentDisposition(filePath, {
//   //   type: "inline"
//   // }),

//   // CacheControl: "public, max-age=86400"
// };

const healthCheck = async (req, res) => {
  const csvWriter = createCsvWriter({
    path: path.join(__dirname, "poc.csv"),
    header: [
      { id: "id", title: "id" },
      { id: "name", title: "name" },
      { id: "class", title: "class" },
      { id: "passing_marks", title: "passingMarks" }
    ]
  });
  const result = await db()
    .select("*")
    .from("student");
  await csvWriter.writeRecords(result);

  const file = fs.readFileSync("./poc.csv");
  console.log({ file });

  const params = {
    Bucket: "sss-mech-spike-1-input",
    Key: "poc.csv",
    Body: file,
    ContentType: "application/octet-stream",
    // ContentDisposition: contentDisposition(filePath, {
    //   type: "inline"
    // }),
    // ACL: "public-read",

    CacheControl: "public, max-age=86400"
  };

  s3.putObject(params, function(error, response) {
    if (error) {
      console.log({ error });
    } else {
      let params = this.request.params;
      let region = this.request.httpRequest.region;
      let bucket_path = "s3://" + params.Bucket + "/" + params.Key;
      let image_path =
        "https://s3-" +
        region +
        ".amazonaws.com/" +
        params.Bucket +
        "/" +
        params.Key;
      // bucket path.

      res.status(200).send(image_path);
    }
  });
};

const readcsv = async (req, res) => {
  const data = [];
  fs.createReadStream(path.join(__dirname, "poc.csv"))
    .pipe(csv())
    .on("data", row => {
      data.push({ ...row });
    })
    .on("end", () => {
      res.status(200).send(data);
    });
};

const storeJson = async (req, res) => {
  const result = await db()
    .select("*")
    .from("student");
  const file = await writeFileAsync(
    path.join(__dirname, "poc.json"),
    JSON.stringify(result)
  );
  const read = await readFileAsync(path.join(__dirname, "poc.json"));

  const params = {
    Bucket: "sss-mech-spike-1-input",
    Key: "poc.json",
    Body: read,
    ContentType: "application/json",
    // ContentDisposition: contentDisposition(filePath, {
    //   type: "inline"
    // }),
    // ACL: "public-read",

    CacheControl: "public, max-age=86400"
  };

  s3.putObject(params, function(error, response) {
    if (error) {
      console.log({ error });
    } else {
      let params = this.request.params;
      let region = this.request.httpRequest.region;
      let bucket_path = "s3://" + params.Bucket + "/" + params.Key;
      let image_path =
        "https://s3-" +
        region +
        ".amazonaws.com/" +
        params.Bucket +
        "/" +
        params.Key;
      // bucket path.

      res.status(200).send(image_path);
    }
  });
};

const parquetWrite = async (req, res) => {
  var schema = new parquet.ParquetSchema({
    id: { type: "INT64" },
    name: { type: "UTF8" },
    class: { type: "UTF8" },
    passing_marks: { type: "UTF8" }
  });

  var writer = await parquet.ParquetWriter.openFile(
    schema,
    path.join(__dirname, "poc.parquet")
  );

  const result = await db()
    .select("*")
    .from("student");

  result.forEach(async item => {
    await writer.appendRow({
      id: item.id,
      name: item.name,
      class: item.class,
      passing_marks: item.passing_marks
    });
  });
};

const readParquet = async (req, res) => {
  let reader = await parquet.ParquetReader.openFile(
    path.join(__dirname, "poc.parquet")
  );

  let cursor = reader.getCursor();

  const result = await db()
    .select("*")
    .from("student");
  let record = null;
  while ((record = await cursor.next())) {
    console.log(record);
  }
};

module.exports = {
  healthCheck,
  readcsv,
  storeJson,
  parquetWrite,
  readParquet
};
