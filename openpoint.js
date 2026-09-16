// "Open point" lookup table — Su Jok healing method.
// Row order matches HEAVEN_STEM_CYCLE column order (K, L, F, E, C, D, B, A, G, H).
const BYOL_ROWS = [
  { letter: 'k', organEn: 'gallbladder', values: ['S-1', 'N-2', 'S-3', 'N-4', 'S-5', 'N-1', 'S-2', 'N-3', 'S-4', 'N-5'] },
  { letter: 'l', organEn: 'liver', values: ['N-1', 'S-2', 'N-3', 'S-4', 'N-5', 'S-1', 'N-2', 'S-3', 'N-4', 'S-5'] },
  { letter: 'a', organEn: 'lungs', values: ['N-2', 'S-3', 'N-4', 'S-5', 'N-1', 'S-2', 'N-3', 'S-4', 'N-5', 'S-1'] },
  { letter: 'b', organEn: 'large intestine', values: ['S-2', 'N-3', 'S-4', 'N-5', 'S-1', 'N-2', 'S-3', 'N-4', 'S-5', 'N-1'] },
  { letter: 'c', organEn: 'stomach', values: ['S-3', 'N-4', 'S-5', 'N-1', 'S-2', 'N-3', 'S-4', 'N-5', 'S-1', 'N-2'] },
  { letter: 'd', organEn: 'pancreas/spleen', values: ['N-3', 'S-4', 'N-5', 'S-1', 'S-2', 'S-3', 'N-4', 'S-5', 'N-1', 'S-2'] },
  { letter: 'e', organEn: 'heart', values: ['N-4', 'S-5', 'N-1', 'S-2', 'N-3', 'S-4', 'N-5', 'S-1', 'N-2', 'S-3'] },
  { letter: 'f', organEn: 'small intestine', values: ['S-4', 'N-5', 'S-1', 'N-2', 'S-3', 'N-4', 'S-5', 'N-1', 'S-2', 'N-3'] },
  { letter: 'g', organEn: 'urinary bladder', values: ['S-5', 'N-1', 'S-2', 'N-3', 'S-4', 'N-5', 'S-1', 'N-2', 'S-3', 'N-4'] },
  { letter: 'h', organEn: 'kidney', values: ['N-5', 'S-1', 'N-2', 'S-3', 'N-4', 'S-5', 'N-1', 'S-2', 'N-3', 'S-4'] },
  { letter: 'i', organEn: 'brain', values: ['N-1', 'S-2', 'N-3', 'S-4', 'N-5', 'S-1', 'N-2', 'S-3', 'N-4', 'S-5'] },
  { letter: 'j', organEn: 'spinal cord', values: ['S-1', 'N-2', 'S-3', 'N-4', 'S-5', 'N-1', 'S-2', 'N-3', 'S-4', 'N-5'] },
];

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

// Returns the open-point result for the current time in Prague.
// Pass civilDateOverride ({year, month, day}, month 1-based) to use a different day's
// heaven stem while still using the real current Prague time of day.
function getOpenPointNow(civilDateOverride) {
  const now = new Date();
  const { year, month, day, hour, minute, second } = getPragueDateTimeParts(now);
  const isSummer = getPragueUtcOffsetHours(now, { year, month, day, hour, minute, second }) === 2;

  const civilDate = civilDateOverride
    ? new Date(civilDateOverride.year, civilDateOverride.month - 1, civilDateOverride.day)
    : new Date(year, month - 1, day);
  const biom = getBinom(civilDate);
  const heavenStem = biom[0];
  const heavenStemIndex = HEAVEN_STEM_CYCLE.indexOf(heavenStem);

  const blockIndex = isSummer
    ? Math.floor(hour / 2)
    : Math.floor(((hour + 1) % 24) / 2);
  const row = BYOL_ROWS[blockIndex];

  const [matchLetter, pointStr] = row.values[heavenStemIndex].split('-');
  const point = parseInt(pointStr, 10);
  const woman = matchLetter === 'S' ? 'right hand' : 'left hand';
  const man = matchLetter === 'S' ? 'left hand' : 'right hand';

  return {
    pragueTime: `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`,
    isSummer,
    biom,
    heavenStem,
    meridianLetter: row.letter,
    organ: row.organEn,
    match: matchLetter,
    point,
    woman,
    man,
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { getOpenPointNow, BYOL_ROWS };
}
