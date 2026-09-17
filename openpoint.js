// "Open point" lookup table — Su Jok healing method.
// Row order matches HEAVEN_STEM_CYCLE column order (K, L, F, E, C, D, B, A, G, H).
// summerRange/winterRange are [startHour, endHour] in 24h Prague local time;
// endHour may be <= startHour to mean it wraps past midnight.
const BYOL_ROWS = [
  { letter: 'k', organEn: 'gallbladder', organCs: 'žlučník', summerRange: [0, 2], winterRange: [23, 1], values: ['S-1', 'N-2', 'S-3', 'N-4', 'S-5', 'N-1', 'S-2', 'N-3', 'S-4', 'N-5'] },
  { letter: 'l', organEn: 'liver', organCs: 'játra', summerRange: [2, 4], winterRange: [1, 3], values: ['N-1', 'S-2', 'N-3', 'S-4', 'N-5', 'S-1', 'N-2', 'S-3', 'N-4', 'S-5'] },
  { letter: 'a', organEn: 'lungs', organCs: 'plíce', summerRange: [4, 6], winterRange: [3, 5], values: ['N-2', 'S-3', 'N-4', 'S-5', 'N-1', 'S-2', 'N-3', 'S-4', 'N-5', 'S-1'] },
  { letter: 'b', organEn: 'large intestine', organCs: 'tlusté střevo', summerRange: [6, 8], winterRange: [5, 7], values: ['S-2', 'N-3', 'S-4', 'N-5', 'S-1', 'N-2', 'S-3', 'N-4', 'S-5', 'N-1'] },
  { letter: 'c', organEn: 'stomach', organCs: 'žaludek', summerRange: [8, 10], winterRange: [7, 9], values: ['S-3', 'N-4', 'S-5', 'N-1', 'S-2', 'N-3', 'S-4', 'N-5', 'S-1', 'N-2'] },
  { letter: 'd', organEn: 'pancreas/spleen', organCs: 'slinivka, slezina', summerRange: [10, 12], winterRange: [9, 11], values: ['N-3', 'S-4', 'N-5', 'S-1', 'S-2', 'S-3', 'N-4', 'S-5', 'N-1', 'S-2'] },
  { letter: 'e', organEn: 'heart', organCs: 'srdce', summerRange: [12, 14], winterRange: [11, 13], values: ['N-4', 'S-5', 'N-1', 'S-2', 'N-3', 'S-4', 'N-5', 'S-1', 'N-2', 'S-3'] },
  { letter: 'f', organEn: 'small intestine', organCs: 'tenké střevo', summerRange: [14, 16], winterRange: [13, 15], values: ['S-4', 'N-5', 'S-1', 'N-2', 'S-3', 'N-4', 'S-5', 'N-1', 'S-2', 'N-3'] },
  { letter: 'g', organEn: 'urinary bladder', organCs: 'močový měchýř', summerRange: [16, 18], winterRange: [15, 17], values: ['S-5', 'N-1', 'S-2', 'N-3', 'S-4', 'N-5', 'S-1', 'N-2', 'S-3', 'N-4'] },
  { letter: 'h', organEn: 'kidney', organCs: 'ledvina', summerRange: [18, 20], winterRange: [17, 19], values: ['N-5', 'S-1', 'N-2', 'S-3', 'N-4', 'S-5', 'N-1', 'S-2', 'N-3', 'S-4'] },
  { letter: 'i', organEn: 'brain', organCs: 'mozek', summerRange: [20, 22], winterRange: [19, 21], values: ['N-1', 'S-2', 'N-3', 'S-4', 'N-5', 'S-1', 'N-2', 'S-3', 'N-4', 'S-5'] },
  { letter: 'j', organEn: 'spinal cord', organCs: 'mícha', summerRange: [22, 24], winterRange: [21, 23], values: ['S-1', 'N-2', 'S-3', 'N-4', 'S-5', 'N-1', 'S-2', 'N-3', 'S-4', 'N-5'] },
];

function formatHourRange([start, end]) {
  const fmt = (h) => `${String(h % 24).padStart(2, '0')}:00`;
  return `${fmt(start)}–${fmt(end)}`;
}

const PRAGUE_TIME_ZONE = 'Europe/Prague';

function getPragueDateTimeParts(date) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', {
      timeZone: PRAGUE_TIME_ZONE,
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
    }).formatToParts(date).map((p) => [p.type, p.value])
  );

  let hour = parseInt(parts.hour, 10);
  if (hour === 24) hour = 0;

  return {
    year: parseInt(parts.year, 10),
    month: parseInt(parts.month, 10),
    day: parseInt(parts.day, 10),
    hour,
    minute: parseInt(parts.minute, 10),
    second: parseInt(parts.second, 10),
  };
}

// Derives Prague's current UTC offset by comparing its wall-clock reading against
// the instant's actual UTC time — avoids relying on Intl's timeZoneName formatting,
// which is inconsistent across browsers (notably older Safari).
function getPragueUtcOffsetHours(date, pragueParts) {
  const utcMillisOfPragueWallClock = Date.UTC(
    pragueParts.year, pragueParts.month - 1, pragueParts.day,
    pragueParts.hour, pragueParts.minute, pragueParts.second
  );
  const offsetMs = utcMillisOfPragueWallClock - date.getTime();
  return Math.round(offsetMs / 3600000);
}

// Whether the given civil date ({year, month, day}, month 1-based) falls in Prague
// summer (DST) time — checked at 10:00 UTC on that date, safely away from the day's
// own start/end so the answer isn't ambiguous for a date's boundary instants.
function isPragueSummerTimeForDate({ year, month, day }) {
  const probe = new Date(Date.UTC(year, month - 1, day, 10, 0, 0));
  const parts = getPragueDateTimeParts(probe);
  return getPragueUtcOffsetHours(probe, parts) === 2;
}

// Returns the open-point result for Prague.
// civilDateOverride ({year, month, day}, month 1-based): use a different day's heaven
// stem instead of today's.
// blockIndexOverride (0-11): use this two-hour block (index into BYOL_ROWS, and into the
// options from getPeriodOptions) instead of the current real-time block. Its summer/winter
// meaning follows civilDateOverride's (or, absent that, today's) actual DST status — not
// necessarily the current moment's, since the two can differ from the chosen date.
function getOpenPointNow(civilDateOverride, blockIndexOverride) {
  const now = new Date();
  const { year, month, day, hour, minute, second } = getPragueDateTimeParts(now);
  const liveIsSummer = getPragueUtcOffsetHours(now, { year, month, day, hour, minute, second }) === 2;

  const civilDate = civilDateOverride
    ? new Date(civilDateOverride.year, civilDateOverride.month - 1, civilDateOverride.day)
    : new Date(year, month - 1, day);
  const biom = getBinom(civilDate);
  const heavenStem = biom[0];
  const heavenStemIndex = HEAVEN_STEM_CYCLE.indexOf(heavenStem);

  let isSummer, blockIndex;
  if (blockIndexOverride != null) {
    isSummer = civilDateOverride ? isPragueSummerTimeForDate(civilDateOverride) : liveIsSummer;
    blockIndex = blockIndexOverride;
  } else {
    isSummer = liveIsSummer;
    blockIndex = isSummer ? Math.floor(hour / 2) : Math.floor(((hour + 1) % 24) / 2);
  }
  const row = BYOL_ROWS[blockIndex];

  const [matchLetter, pointStr] = row.values[heavenStemIndex].split('-');
  const point = parseInt(pointStr, 10);
  const woman = matchLetter === 'S' ? 'right hand' : 'left hand';
  const man = matchLetter === 'S' ? 'left hand' : 'right hand';
  const activeRange = formatHourRange(isSummer ? row.summerRange : row.winterRange);

  return {
    pragueTime: `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`,
    isSummer,
    blockIndex,
    biom,
    heavenStem,
    meridianLetter: row.letter,
    organ: row.organEn,
    organCs: row.organCs,
    activeRange,
    match: matchLetter,
    point,
    woman,
    man,
  };
}

// Returns the 12 period labels (e.g. "0-2, 2-4, ..." or "23-1, 1-3, ...") appropriate
// for the given civil date's summer/winter status, in BYOL_ROWS/blockIndex order.
function getPeriodOptions(civilDate) {
  const isSummer = isPragueSummerTimeForDate(civilDate);
  return {
    isSummer,
    labels: BYOL_ROWS.map((row) => formatHourRange(isSummer ? row.summerRange : row.winterRange)),
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { getOpenPointNow, getPeriodOptions, isPragueSummerTimeForDate, BYOL_ROWS };
}
