const csv = require("csvtojson/v2");

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

function convertToCsv(arr) {
  const arr2 = [Object.keys(arr[0])].concat(arr);
  return arr2.map((obj) => {
    return Object.values(obj).toString();
  }).join('\n');
};

module.exports = {
  csvToJson,
  filterJson,
  convertToCsv
}
