// DataForSEO SERP — live position, competitor URLs, SERP features.
// POST { keywords: string[], location_code?: number, language_code?: string }
// -> { results: [{ keyword, items:[{ type, rank_absolute, domain, url, title }] }] }
export default async function handler(req, res) {
  const { keywords = [], location_code = 2840, language_code = 'en' } = req.body || {};
  const auth = Buffer.from(
    `${process.env.DATAFORSEO_LOGIN}:${process.env.DATAFORSEO_PASSWORD}`
  ).toString('base64');

  const tasks = keywords.map(k => ({ keyword: k, location_code, language_code, depth: 20 }));

  const r = await fetch('https://api.dataforseo.com/v3/serp/google/organic/live/advanced', {
    method: 'POST',
    headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(tasks)
  });
  if (!r.ok) return res.status(502).json({ error: 'serp_upstream_failed', status: r.status });
  const data = await r.json();
  res.status(200).json({ results: data.tasks?.map(t => t.result?.[0]) ?? [] });
}
