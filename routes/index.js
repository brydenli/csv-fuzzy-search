const express = require('express');
const os = require('os');
const multer = require('multer');
const csv = require("csvtojson/v2");
const router = express.Router();
const upload = multer({ dest: os.tmpdir() });

const csvToJson = async (files) => {
  const jsonArr = files.map(async (file) => {
    return await csv().fromFile(file.path);
  });
  return await Promise.all(jsonArr);
};

const filterJson = (json) => {
  return json.map((obj) => {
    return Object.fromEntries(Object.entries(obj).filter(([_, o]) => o != ''));
  });
};

function convertToCSV(arr) {
  const arr2 = [Object.keys(arr[0])].concat(arr);
  return arr2.map((obj) => {
    return Object.values(obj).toString();
  }).join('\n');
};

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
      console.log(dictObj[obj[ref1]]);
      return { ...obj, [ref2]: dictObj[obj[ref1]] };
    });
    const data = convertToCSV(resFile);
    return res.status(200).json({ data });
  } catch (e) {
    return res.status(400);
  }
});

module.exports = router;
