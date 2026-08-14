# Integrated Discovery Command Center

A working prototype of an integrated SEO/GEO diagnostic and agent-dispatch console.

## What it is

Most AI-search tooling reports visibility. This treats discovery as one system across owned, earned,
social, and paid, diagnoses where citation is actually won or lost, and dispatches agents to act on
the findings. Every agent has a defined output, a stated guardrail, and a human checkpoint.

Everything is scored against a named competitive set rather than in isolation, because a visibility
number with no competitor next to it cannot tell you whether you are winning.

## Competitive views

| Tab | What it answers |
|---|---|
| Competitors & SOV | Share of voice in search and in answer engines, side by side, for the whole competitive set. Answer-layer efficiency (GEO SOV minus SEO SOV) shows who converts ranking into citation. Per-engine breakdown, head-to-head scorecard, SERP feature ownership. |
| Gaps & Opportunities | The 18 topic clusters we lead and lose, with the leading competitor named in each. Keyword gaps (they rank top-10, we are outside top-20), prompt gaps (they are cited, we are absent), and a priced opportunity board that routes each row to the agent that produces the artifact. |

The seeded story: brightwheel leads search share of voice at 24.8% and sits third in answer-engine
share at 18.4%. That gap, not the absolute number, is the finding.

## Status

`index.html` runs standalone with seeded demonstration data. No keys, no build step, no network
dependency. Open it in a browser or deploy it as-is.

The seeded numbers are illustrative and labeled as such in the interface. Wiring live data is a
configuration exercise, not a rebuild: the views already assume the shape of the data below.

## Live data wiring

| View | Source |
|---|---|
| Share of model, prompt clusters, sentiment | LLM sampling (Anthropic / OpenAI / Gemini / Perplexity), n samples per prompt |
| SERP position, competitor URLs, SERP features | DataForSEO SERP API |
| Keyword volume, intent clustering, related prompts | DataForSEO Labs |
| Review counts, recency, local entities | DataForSEO Business Data |
| Page inventory, decay cohorts, cannibalization | GSC + GA4 + crawl |
| Findings synthesis, drafting, rubric scoring | Anthropic API |
| SEO share of voice, keyword gaps, SERP features | DataForSEO SERP + Labs, volume-weighted by position |
| GEO share of voice, prompt gaps, per-engine citation | LLM sampling across 5 engines, n samples per prompt |

Stubs live at the repository root (`serp.js`, `visibility.js`, `analyze.js`) and each documents its
expected request and response shape. They are not wired to the interface yet, and Vercel only serves
functions from `/api`, so they need moving there before they will deploy as endpoints.

## Deploy

```bash
vercel                # static deploy, no config needed
```

Environment variables (only needed once live data is wired):

```
DATAFORSEO_LOGIN=
DATAFORSEO_PASSWORD=
ANTHROPIC_API_KEY=
```

## Branding

Colours, type, and the logo are taken from mybrightwheel.com: periwinkle `#6476FF` / `#5463D6`,
teal `#29B9BB`, ink `#18181D`, and the Avenir Next stack the site itself specifies, with Figtree as
the web fallback. Light only, matching the brand's white surface. The log pane and tooltips are
deliberately dark and carry their own fixed on-dark colours.

## Design principles

1. **Sampling, not lookups.** LLM outputs are nondeterministic. Every visibility metric is sampled
   repeatedly and reported with a noise floor. A single query is a screenshot, not a measurement.
2. **Agents automate extraction and analysis, never the decision.** Anything that publishes, contacts
   a customer, or makes a factual claim in a regulated category routes to a review queue.
3. **Nothing is scored without a competitor next to it.** Share of voice, cluster performance, and
   every gap table name the competitor who holds the position. "We are at 18%" is not a finding;
   "we are at 18% and Procare is at 26% on the prompts that carry our largest deals" is.
4. **Citation is an integrated outcome.** Owned content is roughly a third of the input. The console is
   built to make the other two thirds visible, because a program that only optimizes owned content is
   optimizing a minority of the signal.
