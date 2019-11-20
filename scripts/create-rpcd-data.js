const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");

const DataFile = require.resolve("../data/CityOfSpokane_DailyCumResults.xlsx");
const OutputFile = path.resolve(
  __dirname,
  "../src/data/race-precinct-candidate-date.json"
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

    let lastCount = 0;
    for (let groupNum = 0; groupNum < NumGroups; groupNum++) {
      const race = row[`Expr2${groupNum ? "_" + groupNum : ""}`];
      const candidate = row[`type${groupNum ? "_" + groupNum : ""}`];
      const precinct = row[`Precinct${groupNum ? "_" + groupNum : ""}`];
      const count = row[`Count${groupNum ? "_" + groupNum : ""}`];
      if (data[race] === undefined) {
        data[race] = {};
      }
      const raceData = data[race];
      if (raceData[precinct] === undefined) {
        raceData[precinct] = {};
      }
      const precinctData = raceData[precinct];
      if (precinctData[candidate] === undefined) {
        precinctData[candidate] = {};
      }
      const candidateData = precinctData[candidate];
      if (count > lastCount) {
        candidateData[Dates[groupNum]] = count;
        lastCount = count;
      }
    }
  }
  const content = JSON.stringify(data, null, 2);
  fs.writeFileSync(OutputFile, content, "utf8");
}

main().catch(err => {
  console.info(err);
});
