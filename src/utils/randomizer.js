const QUESTION_TYPES = [
  'ruler_reading',
  'unit_selection',
  'estimation',
  'conversion',
  'comparison',
  'word_problem',
];

function sampleWithoutReplacement(arr, n) {
  const copy = [...arr];
  const result = [];
  for (let i = 0; i < Math.min(n, copy.length); i++) {
    const idx = Math.floor(Math.random() * copy.length);
    result.push(copy.splice(idx, 1)[0]);
  }
  return result;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function generatePracticeSession(bank) {
  const session = [];
  for (const type of QUESTION_TYPES) {
    const pool = bank.filter(q => q.type === type);
    const picked = sampleWithoutReplacement(pool, 2);
    session.push(...picked.map(q => ({ ...q.generate(), id: q.id, type: q.type })));
  }
  return shuffle(session);
}
