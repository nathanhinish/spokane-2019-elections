import React from "react";
import { sum } from "lodash";

import Data from "../data/race-candidate-date-total.json";
import Dates from "../data/dates.json";
import Races from "../data/race-map.json";
import Candidates from "../data/candidate-map.json";

export default function OverTime() {
  const races = Object.keys(Data);
  for (const race of races) {
    console.info(Races[race]);
    const candidates = Object.keys(Data[race]);
    const header = (
      <thead>
        <tr>
          <td>Date</td>
          {candidates.map((c, i) => (
            <th key={`c${i}`}>{Candidates[c]}</th>
          ))}
        </tr>
      </thead>
    );

    const rows = [];
    for (const date of Dates) {
      const counts = [];

      for (const cand of candidates) {
        const count = Data[race][cand][date];
        counts.push(count);
      }
      const t = sum(counts);

      const getPct = c => Math.round((c / t) * 1000) / 10;

      rows.push(
        <tr key={`row${date}`}>
          <td>11/{date}</td>
          {counts.map(getPct).map((p, i) => (
            <td key={`c${date}${i}`}>{p}</td>
          ))}
        </tr>
      );
    }

    return (
      <table>
        {header}
        <tbody>{rows}</tbody>
      </table>
    );
  }
}
