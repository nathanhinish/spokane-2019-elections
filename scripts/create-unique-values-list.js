const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");
const { uniq } = require("lodash");

const DataFile = require.resolve("../data/CityOfSpokane_DailyCumResults.xlsx");
const OutputFile = path.resolve(__dirname, "../src/data/unique-values.json");

async function main() {
  const book = XLSX.readFile(DataFile);
  const sheetName = book.SheetNames[0];
  const sheet = book.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(sheet, {
    range: 2
  });

  const allValues = {};

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const keys = Object.keys(row);

    if (i === 0) {
      keys.forEach(key => {
        const [field] = key.split("_");
        if (!allValues.hasOwnProperty(field)) {
          allValues[field] = [];
        }
      });
    }

    keys.forEach(key => {
      const val = row[key];
      const [field] = key.split("_");
      allValues[field].push(val);
    });
  }

  const uniqVals = {};
  Object.keys(allValues).forEach(k => {
    uniqVals[k] = uniq(allValues[k]).sort();
  });

  const content = JSON.stringify(uniqVals, null, 2);
  fs.writeFileSync(OutputFile, content, "utf8");
}

main().catch(err => {
  console.info(err);
});
