import dotenv from 'dotenv';
import { pipeline } from '@xenova/transformers';

dotenv.config();
const MODEL_DIR = process.env.MODEL_DIR || './model-js';
const THRESHOLD = parseFloat(process.env.THRESHOLD || '0.5');

async function main() {
  const prompt = process.argv.slice(2).join(' ');
  if (!prompt) {
    console.error('Usage: node classify.js "your prompt here"');
    process.exit(1);
  }
  const classifier = await pipeline('text-classification', MODEL_DIR, { quantize: true });
  const outputs = await classifier(prompt, { top_k: 2 });
  let benignProb, maliciousProb;
  for (const r of outputs) {
    const L = (r.label || '').toUpperCase();
    if (L.includes('BENIGN') || r.label === 'LABEL_0') benignProb = r.score;
    if (L.includes('MALICIOUS') || r.label === 'LABEL_1') maliciousProb = r.score;
  }
  if (maliciousProb == null || benignProb == null) {
    const r = Array.isArray(outputs) ? outputs[0] : outputs;
    if ((r.label || '').toUpperCase().includes('MALICIOUS') || r.label === 'LABEL_1') {
      maliciousProb = r.score; benignProb = 1 - r.score;
    } else {
      benignProb = r.score; maliciousProb = 1 - r.score;
    }
  }
  const verdict = maliciousProb >= THRESHOLD ? 'MALICIOUS' : 'BENIGN';
  console.log(JSON.stringify({ verdict, malicious_prob: maliciousProb, benign_prob: benignProb, threshold: THRESHOLD }, null, 2));
}

main();