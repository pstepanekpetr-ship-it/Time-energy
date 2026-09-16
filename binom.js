const HEAVEN_STEM_CYCLE = ['K', 'L', 'F', 'E', 'C', 'D', 'B', 'A', 'G', 'H'];
const EARTHLY_BRANCH_CYCLE = ['k', 'l', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];

// Anchor: 2026-01-01 = "Lj" (heaven stem index 1, earthly branch index 11), verified against source calendar.
const ANCHOR_UTC_MS = Date.UTC(2026, 0, 1);
const ANCHOR_HEAVEN_STEM_INDEX = 1;
const ANCHOR_EARTHLY_BRANCH_INDEX = 11;
const MS_PER_DAY = 86400000;

function mod(n, m) {
  return ((n % m) + m) % m;
}

// Returns the two-letter binom (e.g. "Lj") for any calendar date.
function getBinom(date) {
  const dayUTC = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  const diffDays = Math.round((dayUTC - ANCHOR_UTC_MS) / MS_PER_DAY);

  const heavenStem = HEAVEN_STEM_CYCLE[mod(ANCHOR_HEAVEN_STEM_INDEX + diffDays, 10)];
  const earthlyBranch = EARTHLY_BRANCH_CYCLE[mod(ANCHOR_EARTHLY_BRANCH_INDEX + diffDays, 12)];

  return heavenStem + earthlyBranch;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { getBinom, HEAVEN_STEM_CYCLE, EARTHLY_BRANCH_CYCLE };
}
