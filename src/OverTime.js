import React from "react";
import { sum } from "lodash";

import Data from "./data/race-candidate-date-total.json";
import Dates from "./data/dates.json";
import Races from "./data/race-map.json";
import Candidates from "./data/candidate-map.json";

function THead({ candidates }) {
  return (
    <thead>
      <tr>
        <th>Date</th>
        {candidates.map((c, i) => (
          <th key={`c${i}`}>{Candidates[c]}</th>
        ))}
      </tr>
    </thead>
  );
}

function Table({ header, rows }) {
  return (
    <table>
      {header}
      <tbody>{rows}</tbody>
    </table>
  );
}

function RaceTable({ race }) {
  const candidates = Object.keys(Data[race]);
  const header = <THead candidates={candidates} />;

  const rowData = [];
  for (const date of Dates) {
    const counts = [];

    for (const cand of candidates) {
      const count = Data[race][cand][date];
      counts.push(count);
    }
    const t = sum(counts);

    const getPct = c => Math.round((c / t) * 100000) / 1000;

    rowData.push({
      id: date,
      date: `11/${date}`,
      pcts: counts.map(getPct)
    });
  }

  const rows = rowData.map(({id, date, pcts}, i) => {
    let prevRow;
    if (i > 0) {
      prevRow = rowData[i - 1];
    }

    return (
      <tr key={`row_${id}`}>
        <th>{date}</th>
        {pcts.map((p, i) => {
          let className = '';
          if (prevRow) {
            switch (true) {
              case prevRow.pcts[i] > p:
                className = 'decreased';
                break;
              case prevRow.pcts[i] < p:
                className = 'increased';
                break;
              default: 
              className = 'unchanged';
            }
          }
          return <td key={`c${date}${i}`} className={className}>{p}</td>
        })}
      </tr>
    );
  });

  return (
    <div>
      <h3>{Races[race]}</h3>
      <Table header={header} rows={rows} />
    </div>
  );
}

export default function OverTime() {
  const races = Object.keys(Data);
  return (
    <>
      {races.map((r, i) => (
        <RaceTable race={r} key={`table${i}`} />
      ))}
    </>
  );
}
