const express = require('express');
const os = require('os');
const multer = require('multer');
const router = express.Router();
const upload = multer({ dest: os.tmpdir() });
const { csvToJson, filterJson, convertToCsv } = require('../util');

router.post('/convert', upload.array('csvFiles'), async (req, res) => {
  try {
    const { files } = req;
    const { ref1, ref2 } = req.body;
    const json = await csvToJson(files);
    const filteredArr = json.map((obj) => {
      return filterJson(obj);
    });
    const sortedArr = filteredArr.sort((a, b) => {
      return Object.values(a[0]).length - Object.values(b[0]).length;
    });
    const dictObj = {};
    sortedArr[1].forEach((obj) => {
      dictObj[obj[ref1]] = obj[ref2];
    });
    const resFile = sortedArr[0].map((obj) => {
      return { ...obj, [ref2]: dictObj[obj[ref1]] };
    });
    const data = convertToCsv(resFile);
    return res.status(200).json({ data });
  } catch (e) {
    return res.status(400);
  }
});

module.exports = router;
