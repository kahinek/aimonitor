# UK AI Monitor

This site is a statistical bulletin on one sheet of white: four pages, one masthead, no cards. The Inflect wordmark sits with Overview, Compare, How it works and Sources. Poppins is only the page title. Inter does the rest, small and tight. Crimson marks a measured figure, the current page, a hover or a focus. A lighter crimson is only the fill of a partly measured block. Grey hatching marks what is not measured. Light blue marks a search hit on the sources page. Nothing is a card, and nothing is green.

## What it is

The UK AI Monitor prototype, republished for [Inflect](https://inflecthq.io): an overview of 26 indicators, a country comparison, a method note, and the 23 public sources. It is not an official statistic.

Search matches the source name and the indicators it is used for. The area filter follows the five indicator areas, plus country comparison for sources that only support the cross-country figures.

Figures compiled 20 October 2026. The compilation is from the [UK AI Monitor prototype](https://aimonitor.uk).

## Develop

```bash
npm install
npm test
npm run dev
```

Open `/` for the overview. Compare is `/compare`, how it works is `/method`, and sources is `/sources`.

## Deploy on Vercel

Import this GitHub repository in Vercel. The project is a standard Next.js App Router app, so the framework, build command, and output are detected with no extra configuration. No environment variables are required.
