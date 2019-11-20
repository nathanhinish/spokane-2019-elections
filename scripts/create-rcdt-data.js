const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");

const DataFile = require.resolve("../data/CityOfSpokane_DailyCumResults.xlsx");
const OutputFile = path.resolve(
  __dirname,
  "../src/data/race-candidate-date-total.json"
);

const Dates = require('../data/dates.json');
const NumGroups = Dates.length;

async function main() {
  const book = XLSX.readFile(DataFile);
  const sheetName = book.SheetNames[0];
  const sheet = book.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(sheet, {
    range: 2
  });

  const data = {};

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];

    for (let groupNum = 0; groupNum < NumGroups; groupNum++) {
      const race = row[`Expr2${groupNum ? "_" + groupNum : ""}`];
      const candidate = row[`type${groupNum ? "_" + groupNum : ""}`];
      const count = row[`Count${groupNum ? "_" + groupNum : ""}`];
      if (data[race] === undefined) {
        data[race] = {};
      }
      const raceData = data[race];

      if (raceData[candidate] === undefined) {
        raceData[candidate] = {};
      }
      const candidateData = raceData[candidate];

      const dataValue = (candidateData[Dates[groupNum]] || 0) + count;

      candidateData[Dates[groupNum]] = dataValue;
    }
  }

  fs.writeFileSync(OutputFile, JSON.stringify(data, null, 2), "utf8");
}

main().catch(err => {
  console.info(err);
});
