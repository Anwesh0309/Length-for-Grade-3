// Audio Engine — ElevenLabs pre-generated + dynamic fallback
import { audioMap } from './audioMap.js';

let currentAudio = null;
let audioQueue = [];
let isPlaying = false;

// Helper: generate filename from text + style (matches generate_audio.js)
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

// Try loading from static assets first, fallback to ElevenLabs API
async function fetchAudio(text, style) {
  // 1. Check pre-generated audioMap for instant lookup
  if (audioMap[text]) return audioMap[text];

  // 2. Try filename-based static file
  const filename = textToFilename(text, style);
  const staticUrl = `/assets/audio/${filename}`;

  // Try static pre-generated file first
  try {
    const res = await fetch(staticUrl, { method: 'HEAD' });
    if (res.ok) return staticUrl;
  } catch (_) {}

  // Dynamic fallback via ElevenLabs
  const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
  if (!apiKey) return null;

  const VOICE_SETTINGS = {
    celebration:   { stability: 0.12, similarity_boost: 0.45, style: 0.75, use_speaker_boost: true },
    encouragement: { stability: 0.16, similarity_boost: 0.50, style: 0.65, use_speaker_boost: true },
    question:      { stability: 0.20, similarity_boost: 0.55, style: 0.55, use_speaker_boost: true },
    emphasis:      { stability: 0.16, similarity_boost: 0.50, style: 0.60, use_speaker_boost: true },
    thinking:      { stability: 0.24, similarity_boost: 0.60, style: 0.35, use_speaker_boost: true },
    statement:     { stability: 0.20, similarity_boost: 0.55, style: 0.50, use_speaker_boost: true },
    instruction:   { stability: 0.20, similarity_boost: 0.55, style: 0.50, use_speaker_boost: true },
  };

  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/Xb7hH8MSUJpSbSDYk0k2`, {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: VOICE_SETTINGS[style] || VOICE_SETTINGS.statement,
      }),
    });

    if (!response.ok) return null;

    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (e) {
    console.warn('ElevenLabs fallback failed:', e);
    return null;
  }
}

function playNext() {
  if (audioQueue.length === 0) {
    isPlaying = false;
    return;
  }

  const { url, onEnd } = audioQueue.shift();
  if (!url) {
    if (onEnd) onEnd();
    playNext();
    return;
  }

  currentAudio = new Audio(url);
  currentAudio.addEventListener('ended', () => {
    if (onEnd) onEnd();
    playNext();
  });
  currentAudio.addEventListener('error', () => {
    if (onEnd) onEnd();
    playNext();
  });

  currentAudio.play().catch(() => playNext());
  isPlaying = true;

  // Preload next segment
  if (audioQueue.length > 0 && audioQueue[0].text && !audioQueue[0].url) {
    fetchAudio(audioQueue[0].text, audioQueue[0].style).then(url => {
      if (audioQueue[0]) audioQueue[0].url = url;
    });
  }
}

export async function narrate(segments, eager = true) {
  stopNarration();
  audioQueue = segments.map(seg => ({ ...seg, url: null }));

  if (eager && audioQueue.length > 0) {
    const first = audioQueue[0];
    const url = await fetchAudio(first.text, first.style);
    first.url = url;

    if (audioQueue.length > 1) {
      fetchAudio(audioQueue[1].text, audioQueue[1].style).then(u => {
        if (audioQueue[1]) audioQueue[1].url = u;
      });
    }
  }

  playNext();
}

export function stopNarration() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
  audioQueue = [];
  isPlaying = false;
}

export function playSound(soundName) {
  const sounds = {
    correct: '/assets/audio/sfx_correct.mp3',
    wrong: '/assets/audio/sfx_wrong.mp3',
    token: '/assets/audio/sfx_token.mp3',
    celebrate: '/assets/audio/sfx_celebrate.mp3',
    click: '/assets/audio/sfx_click.mp3',
  };
  const url = sounds[soundName];
  if (!url) return;
  const sfx = new Audio(url);
  sfx.volume = 0.6;
  sfx.play().catch(() => {});
}

// Narration segment helpers
export const say = (text) => ({ text, style: 'statement' });
export const ask = (text) => ({ text, style: 'question' });
export const cheer = (text) => ({ text, style: 'celebration' });
export const emphasize = (text) => ({ text, style: 'emphasis' });
export const think = (text) => ({ text, style: 'thinking' });
export const celebrate = (text) => ({ text, style: 'celebration' });
export const instruct = (text) => ({ text, style: 'instruction' });
export const encourage = (text) => ({ text, style: 'encouragement' });
