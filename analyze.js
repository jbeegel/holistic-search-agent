// Findings synthesis. Takes raw signal, returns ranked findings with evidence and a
// recommended agent. Deliberately asks for structured JSON so output is renderable, not prose.
// POST { signals: object } -> { findings:[{ severity, title, body, evidence, agent }] }
export default async function handler(req, res) {
  const { signals } = req.body || {};
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 2000,
      system:
        'You are a search diagnostics engine. Given signal data, return ONLY a JSON array of findings. ' +
        'Each: {severity:"critical"|"warning"|"opportunity", title, body, evidence, agent}. ' +
        'Rank by revenue exposure. Cite the specific numbers you used as evidence. No preamble, no markdown.',
      messages: [{ role: 'user', content: JSON.stringify(signals) }]
    })
  });
  const data = await r.json();
  const text = (data.content ?? []).filter(c => c.type === 'text').map(c => c.text).join('');
  try {
    res.status(200).json({ findings: JSON.parse(text.replace(/```json|```/g, '').trim()) });
  } catch {
    res.status(200).json({ findings: [], raw: text });
  }
}
