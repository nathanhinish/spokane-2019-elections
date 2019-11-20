const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");
const { invert } = require("lodash");

const DataFile = require.resolve("../data/CityOfSpokane_DailyCumResults.xlsx");
const OutputFile = path.resolve(__dirname, "../src/data/race-map.json");

async function main() {
  const book = XLSX.readFile(DataFile);
  const sheetName = book.SheetNames[0];
  const sheet = book.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(sheet, {
    range: 2
  });

  const values = {};

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const label = row["Race"];
    const id = row["Expr2"];
    if (!values.hasOwnProperty(label)) {
      values[label] = id;
    }
  }
  const content = JSON.stringify(invert(values), null, 2);
  fs.writeFileSync(OutputFile, content, "utf8");
}

main().catch(err => {
  console.info(err);
});
