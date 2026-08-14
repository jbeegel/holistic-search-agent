# Integrated Discovery Command Center

A working prototype of an integrated SEO/GEO diagnostic and agent-dispatch console.

## What it is

Most AI-search tooling reports visibility. This treats discovery as one system across owned, earned,
social, and paid, diagnoses where citation is actually won or lost, and dispatches agents to act on
the findings. Every agent has a defined output, a stated guardrail, and a human checkpoint.

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

Stubs are in `/api`. Each documents its expected request and response shape.

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

## Design principles

1. **Sampling, not lookups.** LLM outputs are nondeterministic. Every visibility metric is sampled
   repeatedly and reported with a noise floor. A single query is a screenshot, not a measurement.
2. **Agents automate extraction and analysis, never the decision.** Anything that publishes, contacts
   a customer, or makes a factual claim in a regulated category routes to a review queue.
3. **Citation is an integrated outcome.** Owned content is roughly a third of the input. The console is
   built to make the other two thirds visible, because a program that only optimizes owned content is
   optimizing a minority of the signal.
