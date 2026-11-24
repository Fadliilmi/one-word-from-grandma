// One Word From Grandma — make.fun entry
// https://make.fun/bounty/u-0xkianno-one-word-from-grandma-f04bed16
//
// The task: write exactly one word to /output/entry.txt — the single word
// a grandma would text about AI. A judge model compares words two at a
// time and picks the funnier, more grandma-like one.
//
// The word this program writes is "contraption".
//
// Why "contraption" wins the brief's own criteria, most important first:
//   1. It reads as the single word a grandma would text about AI. Grandmas
//      do not say "artificial intelligence"; they say "that contraption"
//      about any confusing machine in the house. It is a word she would
//      actually send, not a sentence, a phrase or an explanation.
//   2. It sounds like a real grandmother's texting voice: warm, a little
//      baffled, the way she types it to a grandchild when the phone does
//      something clever she did not ask it to do.
//   3. It is funny in one word, with the joke landing without a caption:
//      the whole mystery of AI reduced to a fussy old machine word.
//   4. It is tied to machines, not to any subject at all: a contraption
//      is a device, a gadget, a piece of machinery — never a word you
//      would use about the weather or a birthday.
//   5. It is a fresh pick rather than the obvious one ("robot", "scary",
//      "wow"), and still instantly readable at a glance.
//
// The candidates below are scored against those five criteria so the
// choice is reproducible and the reasoning is visible in the code, not
// hidden in a comment. The program writes only the winning word —
// one word, 11 characters, well inside the 1–30 character gate.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

// Each candidate: [word, grandmaVoice, funny, tiedToMachines, fresh]
// scored 0–5. The first criterion (reads as a grandma's word about AI)
// is the gate: a candidate below 3 there cannot win at all.
const CANDIDATES: Array<{
  word: string;
  grandmaWord: number;
  grandmaVoice: number;
  funny: number;
  machineTied: number;
  fresh: number;
}> = [
  { word: "contraption", grandmaWord: 5, grandmaVoice: 5, funny: 4, machineTied: 5, fresh: 4 },
  { word: "thingamajig", grandmaWord: 4, grandmaVoice: 5, funny: 4, machineTied: 2, fresh: 3 },
  { word: "doohickey", grandmaWord: 4, grandmaVoice: 5, funny: 4, machineTied: 3, fresh: 3 },
  { word: "robit", grandmaWord: 3, grandmaVoice: 4, funny: 4, machineTied: 5, fresh: 3 },
  { word: "gizmo", grandmaWord: 3, grandmaVoice: 3, funny: 2, machineTied: 4, fresh: 2 },
  { word: "whatchamacallit", grandmaWord: 4, grandmaVoice: 4, funny: 3, machineTied: 1, fresh: 3 },
  { word: "robot", grandmaWord: 3, grandmaVoice: 2, funny: 1, machineTied: 5, fresh: 1 },
];

// Weighted score: the brief weighs the criteria in order, so the first
// two count double and the last one counts half.
function score(c: (typeof CANDIDATES)[number]): number {
  return (
    c.grandmaWord * 2 +
    c.grandmaVoice * 2 +
    c.funny +
    c.machineTied +
    c.fresh * 0.5
  );
}

function pickWord(): string {
  const eligible = CANDIDATES.filter((c) => c.grandmaWord >= 3);
  let best = eligible[0];
  for (const c of eligible) {
    if (score(c) > score(best)) best = c;
  }
  return best.word;
}

// The word is written lowercase on purpose: that is how a grandma texts,
// no capital letter, no punctuation, just the word itself.
const word = pickWord();

// Show the ranking on stdout for transparency; only the winner is written
// to the entry file, so the judging sees exactly one word.
const ranked = [...CANDIDATES]
  .filter((c) => c.grandmaWord >= 3)
  .sort((a, b) => score(b) - score(a));
for (const c of ranked) {
  console.log(`  ${c.word.padEnd(16)} ${score(c).toFixed(1)}`);
}

// The gate: /output/entry.txt must be UTF-8 text of 1 to 30 characters,
// not only white space. One word, no trailing newline, no punctuation.
if (!/^[A-Za-z]{1,30}$/.test(word)) {
  throw new Error(`entry word fails the gate: ${JSON.stringify(word)}`);
}

const outPath = "/output/entry.txt";
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, word, "utf8");
console.log(`wrote ${JSON.stringify(word)} (${word.length} chars) to ${outPath}`);
