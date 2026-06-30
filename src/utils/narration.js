import { say, ask, cheer, emphasize, think, celebrate, instruct, encourage } from './audio.js';

// ═══════════════════════════════════════════════════════
// HOME
// ═══════════════════════════════════════════════════════
export function homeNarration() {
  return [
    encourage("Welcome to MeasureQuest: Length Adventures! A Grade 3 Mathematics journey."),
    say("Join Sam the Ruler as we explore centimetres, metres, and millimetres."),
    ask("Are you ready to master the language of length? Let us begin!"),
  ];
}

// ═══════════════════════════════════════════════════════
// WONDER
// ═══════════════════════════════════════════════════════
export function wonderNarration() {
  return [
    think("Hmm, I wonder. Emma has a ribbon that is one metre and fifty centimetres long."),
    say("She uses eighty-five centimetres of it. How much ribbon is left?"),
    ask("What if the two lengths are in different units? How do we solve that?"),
    encourage("We might need to convert units first! Let us investigate together."),
  ];
}

// ═══════════════════════════════════════════════════════
// STORY — 4 slides
// ═══════════════════════════════════════════════════════
export function storySlide1Narration() {
  return [
    encourage("Emma, Oliver, and Lily found a glowing treasure map in the old school library."),
    say("The map had a message: Only those who understand the language of length shall find the treasure."),
    ask("Emma looked up and whispered — do you know how to measure things?"),
  ];
}
export function storySlide2Narration() {
  return [
    say("At the first station, Sam the Carpenter handed each child a ruler."),
    emphasize("Always start from zero! Ten small marks make one centimetre."),
    instruct("A hundred centimetres make one metre. They measured pencils, erasers, and planks."),
  ];
}
export function storySlide3Narration() {
  return [
    encourage("The garden was enormous! Sunflowers taller than Oliver stood in rows."),
    say("Lena handed them a metre stick. This sunflower is two metres and thirty centimetres tall!"),
    instruct("For long things, use metres. One metre equals one hundred centimetres."),
  ];
}
export function storySlide4Narration() {
  return [
    say("At the stadium, Emma jumped one hundred and forty-five centimetres."),
    say("Noah jumped one metre and fifty-two centimetres. Who jumped further?"),
    emphasize("Convert to the same unit first! One metre fifty-two centimetres equals one hundred and fifty-two centimetres. Noah won by seven centimetres!"),
  ];
}

// ═══════════════════════════════════════════════════════
// SIMULATE — narrations per station
// ═══════════════════════════════════════════════════════
export function simRulerNarration() {
  return [
    say("Welcome to the Ruler Lab! Look carefully at each ruler."),
    emphasize("Always start measuring from zero. Count the big marks for centimetres and the small marks for millimetres."),
    instruct("Ten millimetres make one centimetre. Read where the coloured bar ends on the ruler."),
  ];
}
export function simConverterNarration() {
  return [
    say("Welcome to the Unit Converter station! Drag the sliders to see live conversions."),
    instruct("To convert metres to centimetres, multiply by one hundred. Three metres equals three hundred centimetres."),
    encourage("Try the quick quiz at the bottom to test your understanding!"),
  ];
}
export function simSliderNarration() {
  return [
    say("Welcome to the Estimation Slider! Estimate the length of each object before revealing the answer."),
    instruct("Use your body as a guide. Your finger is about one centimetre. Your hand span is about fifteen centimetres."),
    encourage("The closer your estimate, the more stars you earn. Give it your best guess!"),
  ];
}
export function simSpotErrorNarration() {
  return [
    say("Welcome to Spot the Error! Look at each measurement conversion carefully."),
    ask("Is the conversion correct or wrong? Think before you answer!"),
    instruct("Remember: to convert metres to centimetres, multiply by one hundred. Never just move a digit!"),
  ];
}
export function simCompleteNarration() {
  return [
    celebrate("Congratulations! You have completed all four simulation stations!"),
    encourage("You are now entering Test Mode — ten exciting worlds with ten questions each!"),
    say("All the best on your measurement adventure. You have got this!"),
  ];
}

// ═══════════════════════════════════════════════════════
// PLAY — per-world intro narrations
// ═══════════════════════════════════════════════════════
export function playWorldNarration(worldNum) {
  const scripts = {
    1: [say("World One: Ruler Meadow. Practise reading rulers and choosing the right units. Good luck!")],
    2: [say("World Two: Conversion Canyon. Convert between centimetres and metres. Remember to multiply by one hundred!")],
    3: [say("World Three: Estimation Island. How good are your estimation skills? Use your body benchmarks!")],
    4: [say("World Four: Metre Mountain. Work with mixed units — metres and centimetres together.")],
    5: [say("World Five: Comparison Creek. Compare and order lengths. Convert to the same unit first!")],
    6: [say("World Six: Word Problem Woods. Solve one-step and two-step length word problems.")],
    7: [say("World Seven: Conversion Castle. Advanced unit conversions both ways — you can do it!")],
    8: [say("World Eight: Perimeter Plaza. Find the perimeter of shapes by adding all the sides.")],
    9: [say("World Nine: Mixed Mastery. A mix of all measurement topics. Show what you know!")],
    10: [say("World Ten: Length Legend Challenge. The ultimate test — one hundred questions worth of mastery. This is your moment!")],
  };
  return scripts[worldNum] || [say(`World ${worldNum}: Let us go!`)];
}

// ═══════════════════════════════════════════════════════
// PLAY — per-question feedback
// ═══════════════════════════════════════════════════════
export function playCorrectNarration() {
  return [cheer("Brilliant! That is correct!")];
}
export function playWrongNarration() {
  return [encourage("Good try! Check the hint and try the next one.")];
}

// ═══════════════════════════════════════════════════════
// REFLECT / CELEBRATE
// ═══════════════════════════════════════════════════════
export function reflectNarration() {
  return [
    celebrate("Congratulations! You have completed MeasureQuest: Length Adventures!"),
    say("Let us look at what you learned. Always start your ruler from zero, and read in millimetres and centimetres for small objects."),
    say("One metre equals one hundred centimetres. Use metres for longer lengths like rooms and roads."),
    think("When you estimate, use your body as a guide — your finger, your hand, your arm."),
    instruct("To convert, multiply by one hundred from metres to centimetres, and divide by one hundred to go back."),
    emphasize("Before comparing lengths, make sure they are all in the same unit!"),
    encourage("And for word problems, always figure out what you are looking for first, then calculate step by step."),
    celebrate("You are a true Length Legend! Well done!"),
  ];
}

export function celebrationNarration() {
  return [
    celebrate("The treasure chest burst open — and inside were not gold coins, but something even better."),
    celebrate("A certificate that read: Length Legend — awarded to the brave explorer who mastered the art of measurement!"),
    encourage("Emma, Oliver, and Lily cheered — and so did you. You are a true Length Legend!"),
  ];
}

// legacy exports for backward compat
export const station1Narration  = simRulerNarration;
export const station2Narration  = simConverterNarration;
export const station3Narration  = simSliderNarration;
export const station4Narration  = simSpotErrorNarration;
export const introNarration     = storySlide1Narration;
export const practiceCorrectNarration = playCorrectNarration;
export const practiceIncorrectNarration = playWrongNarration;
