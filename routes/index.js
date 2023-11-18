const express = require('express');
const os = require('os');
const fs = require('fs');
const multer = require('multer');
const { parseCsvToJson } = require('../util');
const router = express.Router();
const upload = multer({ dest: os.tmpdir() });

/*
  Receives two CSV files in the form of JSON
  File 1 has Columns A, B
  File 2 has Columns A, C, D
  Data in files 1 and 2 are related via Column A
  Returns a CSV that has Columns A, B, C, D
*/

router.post('/convert', upload.array('csvFiles', 2), async (req, res) => {
  try {
    const { csvFiles } = req;
    const fileData = fs.readFileSync(csvFiles.path);
    const JSON = await parseCsvToJson(fileData);
    res.status(200).json({ JSON });

  } catch (err) {
    const { message } = err;
    return res.status(400).json({ message });
  }
});

module.exports = router;
