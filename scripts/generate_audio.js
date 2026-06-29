#!/usr/bin/env node
/**
 * ElevenLabs Audio Pre-Generation Script
 * Generates all narration .mp3 files for zero-latency playback
 * Run: node scripts/generate_audio.js
 */

import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const AUDIO_DIR = join(__dirname, '..', 'public', 'assets', 'audio');

// Load API key from .env.local
let API_KEY = process.env.VITE_ELEVENLABS_API_KEY;
if (!API_KEY) {
  try {
    const env = readFileSync(join(__dirname, '..', '.env.local'), 'utf8');
    const match = env.match(/VITE_ELEVENLABS_API_KEY=(.+)/);
    if (match) API_KEY = match[1].trim();
  } catch (_) {}
}

if (!API_KEY) {
  console.error('❌ No ElevenLabs API key found. Set VITE_ELEVENLABS_API_KEY in .env.local');
  process.exit(1);
}

const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2'; // Alice
const MODEL = 'eleven_multilingual_v2';

const VOICE_SETTINGS = {
  celebration:   { stability: 0.12, similarity_boost: 0.45, style: 0.75, use_speaker_boost: true },
  encouragement: { stability: 0.16, similarity_boost: 0.50, style: 0.65, use_speaker_boost: true },
  question:      { stability: 0.20, similarity_boost: 0.55, style: 0.55, use_speaker_boost: true },
  emphasis:      { stability: 0.16, similarity_boost: 0.50, style: 0.60, use_speaker_boost: true },
  thinking:      { stability: 0.24, similarity_boost: 0.60, style: 0.35, use_speaker_boost: true },
  statement:     { stability: 0.20, similarity_boost: 0.55, style: 0.50, use_speaker_boost: true },
  instruction:   { stability: 0.20, similarity_boost: 0.55, style: 0.50, use_speaker_boost: true },
};

const phrases = [
  // INTRO
  { text: "One rainy afternoon, Maya, Jake, and Sofia found a rolled-up map tucked behind the oldest book in the school library.", style: 'encouragement' },
  { text: "It showed a mysterious island — and a note that said: Only those who understand the language of length shall find the treasure.", style: 'statement' },
  { text: "Maya looked up and whispered — do you know how to measure things?", style: 'question' },
  // WONDER
  { text: "Jake pulled out his notebook. We will need to measure everything, he said.", style: 'statement' },
  { text: "But Sofia asked — what IS length, anyway? And how do people measure it all around the world?", style: 'thinking' },
  // STATION 1
  { text: "Sofia picked up a tiny ruler and pressed it against a wooden pencil.", style: 'statement' },
  { text: "You always start from zero! Sam reminded her, tapping the left end of the ruler.", style: 'emphasis' },
  { text: "Ten millimetres make one centimetre. Watch carefully where the pencil ends on the ruler.", style: 'instruction' },
  // STATION 2
  { text: "This ruler is too small! Jake said, staring at the giant sunflower.", style: 'encouragement' },
  { text: "Lena laughed and handed him a long metre stick. One hundred centimetres — that is one full metre!", style: 'statement' },
  { text: "For long objects, we use metres. For shorter ones, centimetres work best.", style: 'instruction' },
  // STATION 3
  { text: "Sometimes you cannot carry a ruler everywhere, Omar said with a grin, pulling his hand from his pocket.", style: 'statement' },
  { text: "That is why great explorers always carry their best measuring tool — their own body!", style: 'encouragement' },
  { text: "Your finger is about one centimetre wide. Your hand span is about fifteen to twenty centimetres. A door is roughly two metres tall.", style: 'instruction' },
  // STATION 4
  { text: "Chen needed exactly two hundred and fifty centimetres of rope to finish the bridge.", style: 'statement' },
  { text: "But the hardware store sells rope in metres, he sighed.", style: 'statement' },
  { text: "Jake flipped open his notebook. That is two metres and fifty centimetres! he announced proudly.", style: 'emphasis' },
  { text: "To convert metres to centimetres, multiply by one hundred. To go the other way, divide by one hundred.", style: 'instruction' },
  // STATION 5
  { text: "Aisha had jumped one hundred and forty-five centimetres. Marco jumped one metre and fifty-two centimetres.", style: 'statement' },
  { text: "Sofia scratched her head — who jumped further?", style: 'thinking' },
  { text: "You need to use the same unit before comparing! Aisha called out.", style: 'emphasis' },
  // STATION 6
  { text: "The final clue said: The path to the treasure has three sections.", style: 'statement' },
  { text: "The first section is forty-five metres long. The second is twice as long. The third is thirty metres shorter than the second.", style: 'statement' },
  { text: "How long is the whole path? Maya looked at her friends and smiled — we have got this.", style: 'question' },
  // REFLECT
  { text: "Maya smiled and said — always start your ruler from zero, and read in millimetres and centimetres for small objects.", style: 'statement' },
  { text: "Jake added — one metre equals one hundred centimetres. Use metres for longer lengths like rooms and roads.", style: 'statement' },
  { text: "Sofia thought out loud — when you estimate, use your body as a guide. Your finger, your hand, your arm.", style: 'thinking' },
  { text: "To convert, multiply by one hundred to go from metres to centimetres, and divide by one hundred to go back.", style: 'instruction' },
  { text: "Before comparing lengths, make sure they are all in the same unit!", style: 'emphasis' },
  { text: "And for word problems, always figure out what you are looking for first, then calculate step by step.", style: 'encouragement' },
  // FEEDBACK
  { text: "Brilliant! You got it right!", style: 'celebration' },
  { text: "Great try! Let us look at this together.", style: 'encouragement' },
  // CELEBRATION
  { text: "The treasure chest burst open — and inside were not gold coins, but something even better.", style: 'celebration' },
  { text: "A certificate that read: Length Legend — awarded to the brave explorer who mastered the art of measurement!", style: 'celebration' },
  { text: "Maya, Jake, and Sofia cheered — and so did you. You are a true Length Legend!", style: 'encouragement' },
];

function textToFilename(text, style) {
  const clean = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .split(/\s+/)
    .slice(0, 6)
    .join('_');
  return `audio_${clean}_0.mp3`;
}

async function generateSingle(text, style, filename) {
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
    {
      method: 'POST',
      headers: {
        'xi-api-key': API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        model_id: MODEL,
        voice_settings: VOICE_SETTINGS[style] || VOICE_SETTINGS.statement,
      }),
    }
  );

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`API error ${response.status}: ${err}`);
  }

  const buffer = await response.arrayBuffer();
  return Buffer.from(buffer);
}

async function main() {
  mkdirSync(AUDIO_DIR, { recursive: true });
  console.log(`🎤 Generating ${phrases.length} audio files...`);
  console.log(`📁 Output: ${AUDIO_DIR}\n`);

  const audioMap = {};
  let generated = 0;
  let skipped = 0;
  let errors = 0;

  for (const phrase of phrases) {
    const filename = textToFilename(phrase.text, phrase.style);
    const filepath = join(AUDIO_DIR, filename);

    if (existsSync(filepath)) {
      console.log(`⏭️  Skip (exists): ${filename}`);
      audioMap[phrase.text] = `/assets/audio/${filename}`;
      skipped++;
      continue;
    }

    try {
      const buffer = await generateSingle(phrase.text, phrase.style, filename);
      writeFileSync(filepath, buffer);
      audioMap[phrase.text] = `/assets/audio/${filename}`;
      generated++;
      console.log(`✅ Generated: ${filename}`);

      // Rate limit: 200ms between requests
      await new Promise(r => setTimeout(r, 200));
    } catch (err) {
      console.error(`❌ Error for "${phrase.text.slice(0, 40)}...": ${err.message}`);
      errors++;
    }
  }

  // Write audioMap.js
  const audioMapContent = `// Auto-generated by generate_audio.js — DO NOT EDIT
export const audioMap = ${JSON.stringify(audioMap, null, 2)};
`;
  writeFileSync(join(__dirname, '..', 'src', 'utils', 'audioMap.js'), audioMapContent);

  console.log(`\n📊 Summary:`);
  console.log(`   ✅ Generated: ${generated}`);
  console.log(`   ⏭️  Skipped:   ${skipped}`);
  console.log(`   ❌ Errors:    ${errors}`);
  console.log(`\n🗺️  audioMap.js updated!`);
}

main().catch(console.error);
