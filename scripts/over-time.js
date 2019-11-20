const { sum } = require("lodash");

const Data = require("../data/race-candidate-date-total.json");
const Dates = require("../data/dates.json");
const Races = require('../data/race-map.json');
const Candidates = require('../data/candidate-map.json');

async function main() {
  const races = Object.keys(Data);
  for (const race of races) {
    console.info(Races[race]);
    const candidates = Object.keys(Data[race]);
    console.info('\t', candidates.map(c => Candidates[c]).join('\t'));
    for (const date of Dates) {
      const counts = [];
      
      for (const cand of candidates) {
        const count = Data[race][cand][date];
        counts.push(count);
      }
      const t = sum(counts);

      console.info(
        `11/${date}\t\t${counts
          .map(c => Math.round((c / t) * 1000) / 10)
          .join("\t")}`
      );
    }
    console.info('');
  }
}

main().catch(err => {
  console.info(err);
});
