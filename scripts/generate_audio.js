#!/usr/bin/env node
/**
 * ElevenLabs Audio Pre-Generation Script — MeasureQuest Full Suite
 * Run: node scripts/generate_audio.js
 */
import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const AUDIO_DIR = join(__dirname, '..', 'public', 'assets', 'audio');

let API_KEY = process.env.VITE_ELEVENLABS_API_KEY;
if (!API_KEY) {
  try {
    const env = readFileSync(join(__dirname, '..', '.env.local'), 'utf8');
    const m = env.match(/VITE_ELEVENLABS_API_KEY=(.+)/);
    if (m) API_KEY = m[1].trim();
  } catch (_) {}
}
if (!API_KEY) { console.error('❌ No ElevenLabs API key'); process.exit(1); }

const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2';
const MODEL    = 'eleven_multilingual_v2';
const SETTINGS = {
  celebration:   { stability:0.12, similarity_boost:0.45, style:0.75, use_speaker_boost:true },
  encouragement: { stability:0.16, similarity_boost:0.50, style:0.65, use_speaker_boost:true },
  question:      { stability:0.20, similarity_boost:0.55, style:0.55, use_speaker_boost:true },
  emphasis:      { stability:0.16, similarity_boost:0.50, style:0.60, use_speaker_boost:true },
  thinking:      { stability:0.24, similarity_boost:0.60, style:0.35, use_speaker_boost:true },
  statement:     { stability:0.20, similarity_boost:0.55, style:0.50, use_speaker_boost:true },
  instruction:   { stability:0.20, similarity_boost:0.55, style:0.50, use_speaker_boost:true },
};

const phrases = [
  // HOME
  { text:"Welcome to MeasureQuest: Length Adventures! A Grade 3 Mathematics journey.", style:'encouragement' },
  { text:"Join Sam the Ruler as we explore centimetres, metres, and millimetres.", style:'statement' },
  { text:"Are you ready to master the language of length? Let us begin!", style:'question' },
  // WONDER
  { text:"Hmm, I wonder. Emma has a ribbon that is one metre and fifty centimetres long.", style:'thinking' },
  { text:"She uses eighty-five centimetres of it. How much ribbon is left?", style:'statement' },
  { text:"What if the two lengths are in different units? How do we solve that?", style:'question' },
  { text:"We might need to convert units first! Let us investigate together.", style:'encouragement' },
  // STORY S1
  { text:"Emma, Oliver, and Lily found a glowing treasure map in the old school library.", style:'encouragement' },
  { text:"The map had a message: Only those who understand the language of length shall find the treasure.", style:'statement' },
  { text:"Emma looked up and whispered — do you know how to measure things?", style:'question' },
  // STORY S2
  { text:"At the first station, Sam the Carpenter handed each child a ruler.", style:'statement' },
  { text:"Always start from zero! Ten small marks make one centimetre.", style:'emphasis' },
  { text:"A hundred centimetres make one metre. They measured pencils, erasers, and planks.", style:'instruction' },
  // STORY S3
  { text:"The garden was enormous! Sunflowers taller than Oliver stood in rows.", style:'encouragement' },
  { text:"Lena handed them a metre stick. This sunflower is two metres and thirty centimetres tall!", style:'statement' },
  { text:"For long things, use metres. One metre equals one hundred centimetres.", style:'instruction' },
  // STORY S4
  { text:"At the stadium, Emma jumped one hundred and forty-five centimetres.", style:'statement' },
  { text:"Noah jumped one metre and fifty-two centimetres. Who jumped further?", style:'question' },
  { text:"Convert to the same unit first! One metre fifty-two centimetres equals one hundred and fifty-two centimetres. Noah won by seven centimetres!", style:'emphasis' },
  // SIMULATE — Ruler Lab
  { text:"Welcome to the Ruler Lab! Look carefully at each ruler.", style:'statement' },
  { text:"Always start measuring from zero. Count the big marks for centimetres and the small marks for millimetres.", style:'emphasis' },
  { text:"Ten millimetres make one centimetre. Read where the coloured bar ends on the ruler.", style:'instruction' },
  // SIMULATE — Converter
  { text:"Welcome to the Unit Converter station! Drag the sliders to see live conversions.", style:'statement' },
  { text:"To convert metres to centimetres, multiply by one hundred. Three metres equals three hundred centimetres.", style:'instruction' },
  { text:"Try the quick quiz at the bottom to test your understanding!", style:'encouragement' },
  // SIMULATE — Slider
  { text:"Welcome to the Estimation Slider! Estimate the length of each object before revealing the answer.", style:'statement' },
  { text:"Use your body as a guide. Your finger is about one centimetre. Your hand span is about fifteen centimetres.", style:'instruction' },
  { text:"The closer your estimate, the more stars you earn. Give it your best guess!", style:'encouragement' },
  // SIMULATE — Spot Error
  { text:"Welcome to Spot the Error! Look at each measurement conversion carefully.", style:'statement' },
  { text:"Is the conversion correct or wrong? Think before you answer!", style:'question' },
  { text:"Remember: to convert metres to centimetres, multiply by one hundred. Never just move a digit!", style:'instruction' },
  // SIMULATE — Complete
  { text:"Congratulations! You have completed all four simulation stations!", style:'celebration' },
  { text:"You are now entering Test Mode — ten exciting worlds with ten questions each!", style:'encouragement' },
  { text:"All the best on your measurement adventure. You have got this!", style:'statement' },
  // PLAY — World intros
  { text:"World One: Ruler Meadow. Practise reading rulers and choosing the right units. Good luck!", style:'statement' },
  { text:"World Two: Conversion Canyon. Convert between centimetres and metres. Remember to multiply by one hundred!", style:'statement' },
  { text:"World Three: Estimation Island. How good are your estimation skills? Use your body benchmarks!", style:'statement' },
  { text:"World Four: Metre Mountain. Work with mixed units — metres and centimetres together.", style:'statement' },
  { text:"World Five: Comparison Creek. Compare and order lengths. Convert to the same unit first!", style:'statement' },
  { text:"World Six: Word Problem Woods. Solve one-step and two-step length word problems.", style:'statement' },
  { text:"World Seven: Conversion Castle. Advanced unit conversions both ways — you can do it!", style:'statement' },
  { text:"World Eight: Perimeter Plaza. Find the perimeter of shapes by adding all the sides.", style:'statement' },
  { text:"World Nine: Mixed Mastery. A mix of all measurement topics. Show what you know!", style:'statement' },
  { text:"World Ten: Length Legend Challenge. The ultimate test — one hundred questions worth of mastery. This is your moment!", style:'statement' },
  // PLAY — feedback
  { text:"Brilliant! That is correct!", style:'celebration' },
  { text:"Good try! Check the hint and try the next one.", style:'encouragement' },
  // REFLECT
  { text:"Congratulations! You have completed MeasureQuest: Length Adventures!", style:'celebration' },
  { text:"Let us look at what you learned. Always start your ruler from zero, and read in millimetres and centimetres for small objects.", style:'statement' },
  { text:"One metre equals one hundred centimetres. Use metres for longer lengths like rooms and roads.", style:'statement' },
  { text:"When you estimate, use your body as a guide — your finger, your hand, your arm.", style:'thinking' },
  { text:"To convert, multiply by one hundred from metres to centimetres, and divide by one hundred to go back.", style:'instruction' },
  { text:"Before comparing lengths, make sure they are all in the same unit!", style:'emphasis' },
  { text:"And for word problems, always figure out what you are looking for first, then calculate step by step.", style:'encouragement' },
  { text:"You are a true Length Legend! Well done!", style:'celebration' },
  // CELEBRATION
  { text:"The treasure chest burst open — and inside were not gold coins, but something even better.", style:'celebration' },
  { text:"A certificate that read: Length Legend — awarded to the brave explorer who mastered the art of measurement!", style:'celebration' },
  { text:"Emma, Oliver, and Lily cheered — and so did you. You are a true Length Legend!", style:'encouragement' },
];

function toFilename(text) {
  return 'audio_' + text.toLowerCase().replace(/[^a-z0-9\s]/g,'').trim()
    .split(/\s+/).slice(0,6).join('_') + '_0.mp3';
}

async function gen(text, style) {
  const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
    method:'POST',
    headers:{ 'xi-api-key':API_KEY, 'Content-Type':'application/json' },
    body: JSON.stringify({ text, model_id:MODEL, voice_settings: SETTINGS[style]||SETTINGS.statement }),
  });
  if (!r.ok) throw new Error(`${r.status}: ${await r.text()}`);
  return Buffer.from(await r.arrayBuffer());
}

async function main() {
  mkdirSync(AUDIO_DIR, { recursive:true });
  console.log(`🎤 Generating ${phrases.length} audio files...\n`);
  const map = {}; let ok=0, skip=0, err=0;

  for (const p of phrases) {
    const fname = toFilename(p.text);
    const fpath = join(AUDIO_DIR, fname);
    if (existsSync(fpath)) {
      map[p.text] = `/assets/audio/${fname}`; skip++; continue;
    }
    try {
      writeFileSync(fpath, await gen(p.text, p.style));
      map[p.text] = `/assets/audio/${fname}`;
      console.log(`✅ ${fname}`); ok++;
      await new Promise(r=>setTimeout(r,220));
    } catch(e) {
      console.error(`❌ "${p.text.slice(0,45)}...": ${e.message}`); err++;
    }
  }

  writeFileSync(
    join(__dirname,'..','src','utils','audioMap.js'),
    `// Auto-generated — DO NOT EDIT\nexport const audioMap = ${JSON.stringify(map,null,2)};\n`
  );
  console.log(`\n📊 Generated:${ok}  Skipped:${skip}  Errors:${err}`);
}
main().catch(console.error);
