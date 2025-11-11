import express from 'express';
import dotenv from 'dotenv';
import { pipeline } from '@xenova/transformers';

dotenv.config();

const MODEL_DIR = process.env.MODEL_DIR || './model-js';
const THRESHOLD = parseFloat(process.env.THRESHOLD || '0.5');
const PORT = parseInt(process.env.PORT || '8080', 10);

let classifier;
let ready = false;

async function loadModel() {
  console.log('Loading Transformers.js model from', MODEL_DIR);
  classifier = await pipeline('text-classification', MODEL_DIR, {
    quantize: true
  });
  await classifier('warm up');
  ready = true;
  console.log('Model ready');
}

const app = express();
app.use(express.json({ limit: '512kb' }));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', ready, model_dir: MODEL_DIR });
});

app.post('/classify', async (req, res) => {
  try {
    if (!ready) return res.status(503).json({ error: 'Model loading' });
    const { prompt } = req.body;
    if (typeof prompt !== 'string' || !prompt.trim()) {
      return res.status(400).json({ error: 'Missing prompt string' });
    }
    const outputs = await classifier(prompt, { top_k: 2 });
    let benignProb, maliciousProb;
    for (const r of outputs) {
      const label = (r.label || '').toUpperCase();
      if (label.includes('BENIGN') || r.label === 'LABEL_0') benignProb = r.score;
      if (label.includes('MALICIOUS') || r.label === 'LABEL_1') maliciousProb = r.score;
    }
    if (maliciousProb == null || benignProb == null) {
      const r = Array.isArray(outputs) ? outputs[0] : outputs;
      if ((r.label || '').toUpperCase().includes('MALICIOUS') || r.label === 'LABEL_1') {
        maliciousProb = r.score; benignProb = 1 - r.score;
      } else {
        benignProb = r.score; maliciousProb = 1 - r.score;
      }
    }
    const malicious = maliciousProb >= THRESHOLD;
    res.json({
      prompt,
      benign_prob: benignProb,
      malicious_prob: maliciousProb,
      threshold: THRESHOLD,
      malicious
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Internal error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  loadModel();
});