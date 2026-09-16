const CAPITAL_CYCLE = ['K', 'L', 'F', 'E', 'C', 'D', 'B', 'A', 'G', 'H'];
const LOWERCASE_CYCLE = ['k', 'l', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];

// Anchor: 2026-01-01 = "Lj" (capital index 1, lowercase index 11), verified against source calendar.
const ANCHOR_UTC_MS = Date.UTC(2026, 0, 1);
const ANCHOR_CAPITAL_INDEX = 1;
const ANCHOR_LOWERCASE_INDEX = 11;
const MS_PER_DAY = 86400000;

function mod(n, m) {
  return ((n % m) + m) % m;
}

// Returns the two-letter binom (e.g. "Lj") for any calendar date.
function getBinom(date) {
  const dayUTC = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  const diffDays = Math.round((dayUTC - ANCHOR_UTC_MS) / MS_PER_DAY);

  const capital = CAPITAL_CYCLE[mod(ANCHOR_CAPITAL_INDEX + diffDays, 10)];
  const lowercase = LOWERCASE_CYCLE[mod(ANCHOR_LOWERCASE_INDEX + diffDays, 12)];

  return capital + lowercase;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { getBinom, CAPITAL_CYCLE, LOWERCASE_CYCLE };
}
