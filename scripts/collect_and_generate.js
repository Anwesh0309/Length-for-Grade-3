#!/usr/bin/env node
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
if (!API_KEY) {
  console.error('❌ No ElevenLabs API key found in process.env or .env.local');
  process.exit(1);
}

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

// Original phrases from generate_audio.js
const originalPhrases = [
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

// Seeded Random Logic
let seededRand = Math.random;
function setSeed(seed) {
  let s = seed;
  seededRand = function() {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}
function ri(a, b) { return Math.floor(seededRand() * (b - a + 1)) + a; }
function sh(a) {
  const arr = [...a];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(seededRand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
const WN = ['Emma','Oliver','Lily','Noah','Charlotte','Liam','Grace','Ethan','Ava','James'];
const rn = () => WN[ri(0, WN.length - 1)];

function genW1() {
  setSeed(1000);
  const qs = [];
  const objs=[['pencil','cm',17,3,'✏️'],['eraser','cm',5,5,'🧹'],['crayon','cm',9,0,'🖍️'],['book cover','cm',20,0,'📚'],['paper clip','cm',3,2,'📎']];
  for(let i=0;i<5;i++){
    const [nm,,c,m,em]=objs[i];
    qs.push({narration:`What measurement does the ruler show for the ${nm}? Count the big marks for centimetres and the small marks for millimetres.`});
  }
  const unitObjs=[['a pencil','cm','✏️'],['a swimming pool','m','🏊'],['a door','m','🚪'],['an ant','mm','🐜'],['a football field','m','⚽']];
  for(let i=0;i<5;i++){
    const [obj,unit,em]=unitObjs[i];
    qs.push({narration:`Which unit is best for measuring ${obj}? Think about how big or small it is.`});
  }
  return sh(qs).slice(0,10);
}

function genW2() {
  setSeed(2000);
  return Array.from({length:10},(_,i)=>{
    const m=ri(1,8),c=ri(10,90);
    return {narration:`${m} metres and ${c} centimetres equals how many centimetres? To convert metres, multiply by one hundred.`};
  });
}

function genW3() {
  setSeed(3000);
  const items=[['pencil','✏️',17,50],['textbook','📖',30,60],['shoe','👟',24,50],['hand span','🤚',18,40],['desk height','🪑',75,120],['water bottle','🍼',25,50],['door height','🚪',200,250],['arm length','💪',60,100],['crayon','🖍️',9,20],['finger width','☝️',1,5]];
  return items.map(([nm])=>{
    return {narration:`Estimate the length of ${nm}. Look at the benchmark clues below the picture to help you.`};
  });
}

function genW4() {
  setSeed(4000);
  return Array.from({length:10},(_,i)=>{
    const m=ri(1,5),c=ri(5,95);
    if(i%2===0){
      return {narration:`Convert ${m} metres and ${c} centimetres to centimetres. How do you convert metres to centimetres?`};
    }else{
      const tm=ri(100,900);
      return {narration:`Convert ${tm} centimetres into metres and centimetres. Divide by one hundred to find the metres.`};
    }
  });
}

function genW5() {
  setSeed(5000);
  return Array.from({length:10},(_,i)=>{
    const n1=rn(),n2=rn();
    if(i%3===0){
      const a=ri(80,200),b=ri(80,200);
      return {narration:`${n1} jumped ${a} centimetres. ${n2} jumped ${b} centimetres. Who jumped further?`};
    }else{
      const m=ri(1,3),c=ri(10,90);
      const other=ri(50,300);
      return {narration:`Which is longer: ${m} metres and ${c} centimetres, or ${other} centimetres? Convert to the same unit first.`};
    }
  });
}

function genW6() {
  setSeed(6000);
  return Array.from({length:10},(_,i)=>{
    const name=rn(); const a=ri(20,80); const b=ri(10,50);
    if(i%2===0){
      return {narration:`${name} has two pieces of ribbon. One is ${a} centimetres and the other is ${b} centimetres. How long are they altogether?`};
    }else{
      const total=ri(50,130),cut=ri(10,45);
      return {narration:`${name} had ${total} centimetres of string and used ${cut} centimetres. How much string is left?`};
    }
  });
}

function genW7() {
  setSeed(7000);
  return Array.from({length:10},(_,i)=>{
    if(i<5){
      const m=ri(2,9);
      return {narration:`${m} metres equals how many centimetres? Multiply by one hundred.`};
    }else{
      const total=ri(100,900);
      return {narration:`${total} centimetres equals how many metres and centimetres? Divide by one hundred.`};
    }
  });
}

function genW8() {
  setSeed(8000);
  const shapes=[
    {name:'square',sides:[5,5,5,5],emoji:'🔲'},
    {name:'rectangle',sides:[8,4,8,4],emoji:'▬'},
    {name:'triangle',sides:[6,7,8],emoji:'🔺'},
    {name:'square',sides:[10,10,10,10],emoji:'🔲'},
    {name:'rectangle',sides:[12,5,12,5],emoji:'▬'},
    {name:'triangle',sides:[9,9,9],emoji:'🔺'},
    {name:'rectangle',sides:[15,3,15,3],emoji:'▬'},
    {name:'square',sides:[7,7,7,7],emoji:'🔲'},
    {name:'triangle',sides:[10,12,8],emoji:'🔺'},
    {name:'rectangle',sides:[20,6,20,6],emoji:'▬'},
  ];
  return shapes.map(s=>{
    return {narration:`Find the perimeter of the ${s.name}. Add all the sides together.`};
  });
}

function genW9() {
  const pool=[];
  pool.push(...genW2().slice(0,3));
  pool.push(...genW5().slice(0,3));
  pool.push(...genW6().slice(0,2));
  pool.push(...genW3().slice(0,2));
  setSeed(9000);
  return sh(pool).slice(0,10);
}

function genW10() {
  setSeed(10000);
  return Array.from({length:10},(_,i)=>{
    const name=rn();
    if(i<4){
      const m1=ri(1,4),c1=ri(10,90),m2=ri(1,3),c2=ri(10,90);
      return {narration:`${name} walked ${m1} metres and ${c1} centimetres, then ${m2} metres and ${c2} centimetres. What is the total distance?`};
    }else{
      const total=ri(200,500),cut1=ri(50,100),cut2=ri(30,80);
      return {narration:`A rope is ${total} centimetres long. ${name} cuts off ${cut1} centimetres, then ${cut2} centimetres. How much is left?`};
    }
  });
}

// Gather all 100 questions
const questions = [];
questions.push(...genW1());
questions.push(...genW2());
questions.push(...genW3());
questions.push(...genW4());
questions.push(...genW5());
questions.push(...genW6());
questions.push(...genW7());
questions.push(...genW8());
questions.push(...genW9());
questions.push(...genW10());

// Create unified list of phrases to generate
const finalPhrases = [...originalPhrases];
const addedTexts = new Set(originalPhrases.map(p => p.text));

for (const q of questions) {
  if (q.narration && !addedTexts.has(q.narration)) {
    finalPhrases.push({ text: q.narration, style: 'statement' });
    addedTexts.add(q.narration);
  }
}

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
  console.log(`🎤 Total unique phrases to ensure: ${finalPhrases.length}`);
  const map = {};
  let ok=0, skip=0, err=0;

  for (const p of finalPhrases) {
    const fname = toFilename(p.text);
    const fpath = join(AUDIO_DIR, fname);
    if (existsSync(fpath)) {
      map[p.text] = `/assets/audio/${fname}`;
      skip++;
      continue;
    }
    try {
      console.log(`🎙️ Generating: "${p.text.slice(0, 50)}..."`);
      writeFileSync(fpath, await gen(p.text, p.style));
      map[p.text] = `/assets/audio/${fname}`;
      console.log(`  ✅ ${fname}`);
      ok++;
      await new Promise(r=>setTimeout(r,350)); // rate limiting delay
    } catch(e) {
      console.error(`  ❌ Failed: ${e.message}`);
      err++;
    }
  }

  writeFileSync(
    join(__dirname,'..','src','utils','audioMap.js'),
    `// Auto-generated — DO NOT EDIT\nexport const audioMap = ${JSON.stringify(map,null,2)};\n`
  );
  console.log(`\n📊 Generated:${ok}  Skipped:${skip}  Errors:${err}`);
}

main().catch(console.error);
