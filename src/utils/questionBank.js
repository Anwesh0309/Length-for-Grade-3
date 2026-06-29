// Question Bank — 60+ questions across 6 types

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomPick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function sampleN(arr, n) {
  const copy = [...arr];
  const result = [];
  for (let i = 0; i < Math.min(n, copy.length); i++) {
    const idx = Math.floor(Math.random() * copy.length);
    result.push(copy.splice(idx, 1)[0]);
  }
  return result;
}

function generateCloseChoices(cm, mm) {
  const correct = `${cm} cm ${mm} mm`;
  const wrong1 = `${cm + 1} cm ${mm} mm`;
  const wrong2 = `${cm} cm ${mm === 0 ? 5 : mm - 1} mm`;
  const wrong3 = `${cm - 1 < 0 ? cm + 2 : cm - 1} cm ${mm} mm`;
  const choices = [correct, wrong1, wrong2, wrong3];
  // shuffle
  for (let i = choices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [choices[i], choices[j]] = [choices[j], choices[i]];
  }
  return choices;
}

// ── RULER READING (10 questions) ──────────────────────────────────────
const rulerQuestions = Array.from({ length: 10 }, (_, i) => ({
  id: `ruler_${i + 1}`,
  type: 'ruler_reading',
  generate: () => {
    const cm = randInt(2, 18);
    const mm = randInt(0, 9);
    return {
      prompt: `Look at the ruler below. Where does the object end? Choose the correct measurement.`,
      visual: { type: 'ruler', props: { markAt: cm * 10 + mm } },
      answer: `${cm} cm ${mm} mm`,
      choices: generateCloseChoices(cm, mm),
      hint: `Count the big marks for centimetres (cm) and the small marks for millimetres (mm). There are 10 mm in 1 cm.`,
    };
  },
}));

// ── UNIT SELECTION (10 questions) ──────────────────────────────────────
const unitObjects = [
  { name: 'a swimming pool', unit: 'm', emoji: '🏊' },
  { name: 'a paperclip', unit: 'cm', emoji: '📎' },
  { name: 'a school building', unit: 'm', emoji: '🏫' },
  { name: 'a crayon', unit: 'cm', emoji: '🖍️' },
  { name: 'a road between two cities', unit: 'km', emoji: '🛣️' },
  { name: 'your finger', unit: 'cm', emoji: '☝️' },
  { name: 'a door', unit: 'm', emoji: '🚪' },
  { name: 'an ant', unit: 'mm', emoji: '🐜' },
  { name: 'a football field', unit: 'm', emoji: '⚽' },
  { name: 'a book', unit: 'cm', emoji: '📚' },
];

const unitQuestions = unitObjects.map((obj, i) => ({
  id: `unit_${i + 1}`,
  type: 'unit_selection',
  generate: () => ({
    prompt: `${obj.emoji} Which unit would you use to measure ${obj.name}?`,
    visual: { type: 'object_card', props: { name: obj.name, emoji: obj.emoji } },
    answer: obj.unit,
    choices: ['mm', 'cm', 'm', 'km'],
    hint: `Think about how big ${obj.name} is. Is it tiny, medium, or very long?`,
  }),
}));

// ── ESTIMATION (10 questions) ──────────────────────────────────────────
const estimationItems = [
  { name: 'a pencil', actualCm: 17, emoji: '✏️' },
  { name: 'a textbook', actualCm: 30, emoji: '📖' },
  { name: 'a shoe', actualCm: 24, emoji: '👟' },
  { name: 'your thumb', actualCm: 6, emoji: '👍' },
  { name: 'a ruler', actualCm: 30, emoji: '📏' },
  { name: 'a smartphone', actualCm: 15, emoji: '📱' },
  { name: 'a water bottle', actualCm: 25, emoji: '🍼' },
  { name: 'a door', actualCm: 200, emoji: '🚪' },
  { name: 'a desk', actualCm: 75, emoji: '🪑' },
  { name: 'a finger', actualCm: 7, emoji: '☝️' },
];

const estimationQuestions = estimationItems.map((item, i) => ({
  id: `estimation_${i + 1}`,
  type: 'estimation',
  generate: () => ({
    prompt: `${item.emoji} Estimate the length of ${item.name} in centimetres. Move the slider to your best guess!`,
    visual: { type: 'estimation_slider', props: { objectName: item.name, emoji: item.emoji, min: 1, max: item.actualCm < 50 ? 50 : 250 } },
    answer: item.actualCm,
    hint: `Remember: your finger is about 1 cm wide. Your hand span is about 15–20 cm. Use these as guides!`,
  }),
}));

// ── CONVERSION (10 questions) ──────────────────────────────────────────
const conversionQuestions = Array.from({ length: 10 }, (_, i) => ({
  id: `conversion_${i + 1}`,
  type: 'conversion',
  generate: () => {
    const type = randInt(0, 2);
    if (type === 0) {
      const m = randInt(1, 9); const cm = randInt(1, 99);
      return {
        prompt: `Convert: ${m} m ${cm} cm = _____ cm`,
        visual: { type: 'conversion_display', props: { metres: m, extraCm: cm, direction: 'toTotal' } },
        answer: m * 100 + cm,
        hint: `Multiply the metres by 100, then add the extra centimetres. ${m} × 100 + ${cm} = ?`,
      };
    } else if (type === 1) {
      const totalCm = randInt(100, 900);
      const m = Math.floor(totalCm / 100);
      const rem = totalCm % 100;
      return {
        prompt: `Convert: ${totalCm} cm = _____ m _____ cm`,
        visual: { type: 'conversion_display', props: { totalCm, direction: 'toMixed' } },
        answer: `${m} m ${rem} cm`,
        choices: [`${m} m ${rem} cm`, `${m + 1} m ${rem} cm`, `${m} m ${rem + 10} cm`, `${m - 1 < 0 ? m + 1 : m - 1} m ${rem} cm`],
        hint: `Divide by 100 to get metres. The remainder is the centimetres. ${totalCm} ÷ 100 = ?`,
      };
    } else {
      const m = randInt(2, 8);
      return {
        prompt: `Convert: ${m} m = _____ cm`,
        visual: { type: 'conversion_display', props: { metres: m, direction: 'mToCm' } },
        answer: m * 100,
        hint: `Multiply by 100! ${m} × 100 = ?`,
      };
    }
  },
}));

// ── COMPARISON (10 questions) ──────────────────────────────────────────
const westernNames = ['Oliver', 'Emma', 'Liam', 'Charlotte', 'Noah', 'Ava', 'Ethan', 'Grace', 'James', 'Lily'];

const comparisonQuestions = Array.from({ length: 10 }, (_, i) => ({
  id: `comparison_${i + 1}`,
  type: 'comparison',
  generate: () => {
    const names = sampleN(westernNames, 3);
    const items = names.map(name => ({ name, lengthCm: randInt(80, 200) }));
    const sorted = [...items].sort((a, b) => a.lengthCm - b.lengthCm);
    return {
      prompt: `Drag the names to order their jump lengths from SHORTEST to LONGEST! 🏃`,
      visual: { type: 'drag_order', props: { items } },
      answer: sorted.map(it => it.name),
      hint: `Compare the numbers. The smallest number is the shortest jump!`,
    };
  },
}));

// ── WORD PROBLEMS (10 questions) ──────────────────────────────────────
const wordProblemNames = ['Oliver', 'Emma', 'Liam', 'Charlotte', 'Noah', 'Ethan', 'Grace', 'James'];

const wordProblemQuestions = Array.from({ length: 10 }, (_, i) => ({
  id: `wordproblem_${i + 1}`,
  type: 'word_problem',
  generate: () => {
    const name = randomPick(wordProblemNames);
    const type = i % 3;
    if (type === 0) {
      const a = randInt(20, 80); const b = randInt(10, 50);
      return {
        prompt: `${name} has two pieces of ribbon. One is ${a} cm and the other is ${b} cm long. How long are they altogether?`,
        visual: { type: 'ribbon_visual', props: { length1: a, length2: b, operation: 'add' } },
        answer: a + b,
        hint: `Add the two lengths: ${a} + ${b} = ?`,
      };
    } else if (type === 1) {
      const total = randInt(50, 120); const used = randInt(10, total - 10);
      return {
        prompt: `${name} had ${total} cm of string. They used ${used} cm. How much string is left?`,
        visual: { type: 'ribbon_visual', props: { length1: total, length2: used, operation: 'subtract' } },
        answer: total - used,
        hint: `Subtract: ${total} - ${used} = ?`,
      };
    } else {
      const m = randInt(2, 5); const extraCm = randInt(10, 90);
      const totalCm = m * 100 + extraCm;
      const cutCm = randInt(50, 150);
      return {
        prompt: `A rope is ${m} m ${extraCm} cm long. ${name} cuts off ${cutCm} cm. How many centimetres are left?`,
        visual: { type: 'ribbon_visual', props: { length1: totalCm, length2: cutCm, operation: 'subtract' } },
        answer: totalCm - cutCm,
        hint: `First convert ${m} m ${extraCm} cm to centimetres (${totalCm} cm), then subtract ${cutCm}.`,
      };
    }
  },
}));

// ── EXPORT ────────────────────────────────────────────────────────────
export const questionBank = [
  ...rulerQuestions,
  ...unitQuestions,
  ...estimationQuestions,
  ...conversionQuestions,
  ...comparisonQuestions,
  ...wordProblemQuestions,
];

export { randInt, randomPick, sampleN };
