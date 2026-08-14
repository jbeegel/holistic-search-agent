// LLM visibility sampling. Nondeterminism is the whole problem, so every prompt is
// sampled n times and reported as a distribution with a noise floor, never as a point reading.
// POST { prompts: string[], samples?: number, brand: string, competitors: string[] }
// -> { rows:[{ prompt, mentionRate, citationRate, sentiment, competitorsCited:{} }], noiseFloor }
export default async function handler(req, res) {
  const { prompts = [], samples = 20, brand, competitors = [] } = req.body || {};
  const rows = [];

  for (const prompt of prompts) {
    const runs = await Promise.all(
      Array.from({ length: samples }, () =>
        fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.ANTHROPIC_API_KEY,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: 'claude-sonnet-4-6',
            max_tokens: 1000,
            messages: [{ role: 'user', content: prompt }]
          })
        }).then(r => r.json()).catch(() => null)
      )
    );

    const texts = runs.filter(Boolean).map(r =>
      (r.content ?? []).filter(c => c.type === 'text').map(c => c.text).join('\n')
    );
    const hits = texts.filter(t => t.toLowerCase().includes(brand.toLowerCase())).length;

    rows.push({
      prompt,
      samples: texts.length,
      mentionRate: texts.length ? hits / texts.length : 0,
      competitorsCited: Object.fromEntries(
        competitors.map(c => [c, texts.filter(t => t.toLowerCase().includes(c.toLowerCase())).length])
      )
    });
  }

  // 95% CI half-width at p=0.5 is the honest floor for "did this actually move"
  res.status(200).json({ rows, noiseFloor: 1.96 * Math.sqrt(0.25 / samples) });
}
