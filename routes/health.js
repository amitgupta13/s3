const express = require("express");
const router = express.Router();
const {
  healthCheck,
  readcsv,
  storeJson,
  parquetWrite,
  readParquet
} = require("../controllers/health");

router.get("/csvwrite", healthCheck);
router.get("/csvread", readcsv);
router.get("/json", storeJson);
router.get("/parquet", parquetWrite);
router.get("/parquetread", readParquet);

module.exports = router;
