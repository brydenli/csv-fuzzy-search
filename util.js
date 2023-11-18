const parse = require('csv-parse');

export const parseCsvToJson = async (fileData) => {
  await parse(fileData, (err, data) => {
    if (err) {
      return null;
    }
    return data;
  });
}
