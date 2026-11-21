# FAWCAR Philippines — Website Prototype

Prototype of the FAWCAR Philippines distributor website (JOYEE and BESTUNE cars from China FAW),
built with **Nuxt 4 + Tailwind CSS 4**. Content lives in `app/data/*.ts`; later it can move to a
headless CMS without changing the pages.

> Models, specifications and photos come from China FAW's global site, [fawcar.com](https://www.fawcar.com/)
> (BESTUNE NAT and B70S are not included). The site shows **no prices**: visitors request a quote, and the
> financing calculator uses a price they enter. Offers, warranty terms, dealer services and contact
> details are marked "to be confirmed" until the distributor supplies them.
> The site ships with `noindex, nofollow` (remove it in `nuxt.config.ts` at launch).

## Content sources

- **Specifications**: `app/data/fawcar/<slug>.json`, the fawcar.com specification sheets as read
  (GCC-market variants where several markets are listed). `app/data/specs.ts` turns them into
  display sheets and corrects data-entry slips found on fawcar.com in `fixes` (each with the
  reason; an unused fix fails the build). Variant names are in `app/data/variants.ts`.
- **Model copy and colours**: `app/data/modelDetails.ts` (feature blocks and design/interior text
  from fawcar.com, colour names per cut-out photo). Card figures in `models.ts` are copied from
  `cardSpecs()`; the unit tests check they still match.
- **News and About**: short summaries written for this site, each news item linking to the
  original announcement on fawcar.com.
- **Line-up order**: the order of `models` in `app/data/models.ts` (set by the distributor) is used
  everywhere: menus (body types and powertrain groups follow the first-listed model), footer,
  model pages, forms and the home line-up cards. BESTUNE B70S is not sold in the Philippines and
  is not included. The home carousel shows only the new-energy models listed in `heroSlides`
  (`app/data/home.ts`).
- **Dealers**: the three Philippine retailers listed on fawcar.com (`app/data/dealers.ts`).
  Contact persons and mobile numbers listed there are not published until the dealers confirm.

## Design

Layout follows the BYD Cars Philippines site: #121212 dark sections, #F8F8F8 page background,
square cards, uppercase buttons with a notched corner. Typography: Archivo (headings, set at 112%
width) and Inter (body text), both SIL OFL and self-hosted. Brand blue `#0D2A8F` from the FAWCAR
logo; the call-to-action colour is a single token, `--color-cta`, in `app/assets/css/main.css`.

## Images

- `public/images/models/<slug>/`: fawcar.com CDN photos, reviewed (no Chinese text).
  `card.webp` side cut-out, `hero.webp` scene photo, `scene-<n>` / `interior-<n>` gallery photos
  with `-thumb` versions, `color-<n>.webp` colour cut-outs. Page usage is set in `app/data/media.ts`.
- `public/images/news/`: news covers. `public/images/brand/`, `favicon.png`, `apple-touch-icon.png`:
  the official FAWCAR logo, from the client's artwork.
- To regenerate (originals go to `assets-src/`, which is not in git because this repository is public):

  ```bash
  node scripts/fetch-fawcar-images.mjs     # download the CDN originals listed in app/data/fawcar/*.json
  node scripts/process-fawcar-photos.mjs   # convert them to WebP in public/images/
  node scripts/make-brand-assets.mjs       # logo + icons from assets-src/brand/*.png (client artwork)
  ```

- The feature-block photos on fawcar.com (`www.fawcar.com/file_cos/…`) are not on the CDN and
  refuse scripted downloads, so the feature sections are text-only for now.
- Loading: below-the-fold images are lazy; the home carousel loads the visible slide's photo first
  and preloads the next one; the model gallery renders only the current and next large photo.

## Run

```bash
npm install
npm run dev        # http://localhost:3210
npm run generate   # static HTML in .output/public
```

Deployment (Cloudflare Pages / Netlify / Vercel / BaoTa, custom domain, pre-launch checklist): see [DEPLOY.md](DEPLOY.md).

## Tests

```bash
npm test           # unit + data-integrity tests (Vitest)
npm run test:e2e   # builds the static site, then end-to-end tests in Chrome (Playwright)
npm run test:all   # both
```

Unit tests check the content: every spec sheet is clean English with one value per variant,
card figures match the sheets, every photo, colour cut-out and news cover exists, and every link
has a page.

End-to-end tests run on desktop (1440×900) and mobile (Pixel 7) against the generated static site and check:

- every internal link resolves; every page renders with no console errors, broken images or sideways scrolling
- header mega menu, mobile drawer, floating contact, cookie banner, footer
- home page: hero carousel (new-energy models only), line-up cards and lead form (every model), promos
- all 9 model pages (variants, spec groups, source link, no prices), section nav, colour picker,
  spec "differences only", variant → quote prefill, gallery loading
- Get a Quote (3 steps), Test Drive, Service booking and Contact forms: validation and confirmation
- financing calculator maths, compare, dealer locator + map, news source link, FAQ, legal pages, 404 page
- no critical accessibility (axe) issues

The HTML report is written to `playwright-report/`.

## Structure

```
app/
  data/            site, models, specs (+ fawcar/*.json), variants, modelDetails, media,
                   dealers, home, content  ← site content (future CMS)
  components/      header, footer, floating contact, cookie banner, CarImage, ModelCard, SpecValue, PageHeader
  components/form/ dealer picker, contact fields, consent, success panel
  components/home/ hero carousel, quick actions, line-up, promos, brand, news, CTA
  pages/           models, quote, test drive, dealers, compare, financing, promos, news, about,
                   owners (service, warranty, accessories, FAQ), contact, legal
  error.vue        branded 404 / error page
scripts/           fawcar.com image download and conversion, brand assets
tests/
  unit/            Vitest
  e2e/             Playwright
```

## Before going live

- `app/data/site.ts`: company name, address, hotline, e-mail, Messenger and Viber links, social pages.
- `app/data/dealers.ts`: dealer phone numbers, services (service center, parts), the Bulacan street address, more dealers.
- `app/data/home.ts`, `content.ts`: promo terms, warranty terms, PMS schedule.
- Philippine variants and colours, if they differ from the GCC versions shown.
- Connect the forms to the dealer CRM / e-mail (they currently show a confirmation only).
