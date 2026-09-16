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
      hour: '2-digit', minute: '2-digit', hour12: false,
    }).formatToParts(date).map((p) => [p.type, p.value])
