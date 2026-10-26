# FAW-VW Philippines — Demo Website

Demo of the FAW-Volkswagen Philippines distributor website, built with **Nuxt 4 + Tailwind CSS 4**.
Content lives in `app/data/*.ts` (sample data); later it moves to a headless CMS without changing the pages.

> Models, prices, specs, dealers, offers and contact details are **demo placeholders**.
> Car photos are official FAW-VW images from vw.faw-vw.com (vetted: no Chinese text).
> The site ships with `noindex, nofollow` and a "Prototype preview" banner.

## Design

Visual style follows the BYD Cars Philippines site: Chakra Petch headings, Fustat body text
(both self-hosted), #121212 dark sections, #F8F8F8 page background, square cards, uppercase
buttons with a notched corner. The call-to-action colour is a single token, `--color-cta`
in `app/assets/css/main.css` (Volkswagen blue; BYD uses red `#d70d1a`).

## Images

- `public/images/models/<slug>/card.webp`: studio side profile (transparent), from
  `assets-src/cutouts/<slug>.png` via `node scripts/optimize-images.mjs`.
- `public/images/models/<slug>/photo-<n>.webp`: scenic/interior photos. Originals are in
  `assets-src/official/` (list in `scripts/official-photos.json`); the vetted selection is
  converted by `node scripts/process-official-photos.mjs`. Page usage is set in `app/data/media.ts`.
- `assets-src/` (originals) is not in git because this repository is public. To regenerate images,
  re-download the files listed in `scripts/official-photos.json` into `assets-src/official/<slug>/<n>.jpg`.

## Run

```bash
npm install
npm run dev        # http://localhost:3210
npm run generate   # static HTML in .output/public
```

## Tests

```bash
npm test           # unit + data-integrity tests (Vitest)
npm run test:e2e   # builds the static site, then end-to-end tests in Chrome (Playwright)
npm run test:all   # both
```

End-to-end tests run on desktop (1440×900) and mobile (Pixel 7) against the generated static site and check:

- every internal link resolves; every page renders with no console errors, broken images or sideways scrolling
- header mega menu, mobile drawer, floating contact, cookie banner, footer
- hero carousel, "more vehicles" grid, promos
- all 7 model pages, section nav, variant → quote prefill
- Get a Quote (3 steps), Test Drive, Service booking and Contact forms: validation and confirmation
- financing calculator maths, compare, price list, dealer locator + map, FAQ, legal pages, 404 page
- no critical accessibility (axe) issues

The HTML report is written to `playwright-report/`.

## Structure

```
app/
  data/            site, models, modelDetails, dealers, home, content  ← demo content (future CMS)
  components/      header, footer, floating contact, cookie banner, CarImage, ModelCard, PageHeader
  components/form/ dealer picker, contact fields, consent, success panel
  components/home/ hero carousel, quick actions, line-up, promos, brand, news, CTA
  pages/           21 pages: models, quote, test drive, dealers, price list, compare, financing,
                   promos, news, about, owners (service, warranty, accessories, FAQ), legal
  error.vue        branded 404 / error page
tests/
  unit/            Vitest
  e2e/             Playwright
```

## Before going live

Replace in `app/data/site.ts`: company name, address, hotline, e-mail, Messenger and Viber links, social pages.
Replace in `app/data/dealers.ts`, `models.ts`, `modelDetails.ts`, `home.ts`: real dealers, PH-spec data, prices and promos.
Connect the forms to the dealer CRM / e-mail (they currently show a confirmation only).
