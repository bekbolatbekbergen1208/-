# QARAQABAQ — Тиынның ізімен

Kazakh-language digital heritage exhibition, built with Next.js App Router, TypeScript, Tailwind CSS, Motion, React Three Fiber/Drei, Three.js, Leaflet, Lucide and QRCode. No paid API or authentication is needed. This is a local application; no hosted deployment has been created.

## Run

Use Node.js 20.9+:

```sh
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000. Production:

```sh
npm run lint
npm run typecheck
npm run build
npm start
```

## Structure and editing

- `lib/content.ts`: typed editable artifact/exhibit records and quiz questions. Only one coin, one settlement and three clearly classified educational materials are present.
- `components`: shared navigation, home, WebGL coin, Leaflet map, archive/QR passports, activities and chronology.
- `app/[section]/page.tsx`: all named exhibition and research sections, statically generated with individual metadata.
- `app/artifacts/[slug]/page.tsx`: permanent digital passports.
- `public/images/`: original photographs extracted losslessly from the supplied presentation. `lib/photos.ts` records the slide numbers and captions.
- `lib/coin-geometry.ts`: radial photo silhouette extraction, subdivided photo-textured front/back meshes, and illustrative edge geometry.
- `components/PhotoGallery.tsx` and `PhotoTour.tsx`: source-linked galleries, modal enlargement, and four photographic tour stops.
- `public/presentation.pdf`: original eight-page presentation, embedded on the research page.
- `app/globals.css`: responsive design system, print and reduced-motion styling.

Edit structured content locally, review the scientific status and source note, run checks, and deploy. This is the working fallback content-management workflow; there is no unsecured browser admin or write endpoint. UI labels currently live in Kazakh components; future locales can extract them into locale dictionaries while keeping content IDs/slugs stable.

## Routes

`/`, `/history`, `/coin`, `/museum`, `/map`, `/expedition`, `/tour`, `/timeline`, `/artifacts`, `/games`, `/research`, `/sources`, `/about`, `/artifacts/[slug]`. Sitemap and robots are generated. Unknown sections/artifacts return 404.

The coin supports rotation, touch, zoom, two faces, detail markers, reset and fullscreen. The expedition has six stages and a completion badge; three games have explanations, scores and restart. Completion/scores are stored locally on the visitor's browser. Archive search and category filters use local data. Passport QR links derive from the actual host and support PNG download, print and copy.

The map requires internet for OpenStreetMap tiles. Its content remains explained if tiles fail. The regional circle is deliberately approximate, not a settlement coordinate. The optional connection overlay is conceptual, not a verified route. The tour now uses four original presentation photographs, with zoom, drag-to-pan, hotspots and thumbnail navigation. These are ordinary photographs, explicitly not 360° panoramas. No synthetic landscape is used in the visible tour.

## Missing source material

The original eight-page presentation is now included, together with its embedded settlement, coast and coin photographs. Images were extracted without generative replacement or retouching. The original source image is used directly as a Three.js texture; browser-side geometry samples its outline and applies shallow illustrative tonal relief. Coin thickness, relief depth and absolute dimensions are not measured, so the model remains a photo-based reconstruction rather than a scan. Archaeological reports, exact coordinates, true panoramas and a full bibliography remain unavailable. Slide 6 recommendations and slide 7 conclusions are reflected in the research page.

The research page embeds `public/presentation.pdf` and supports download. `lib/photos.ts` provides per-photo slide references. The presentation does not credit the original photographers or supply excavation metadata; captions preserve this distinction. Verify coordinates before replacing the approximate regional layer. The research page retains placeholders for missing methodology and original evidence.

## Optional managed content

Supabase is not configured or connected. A future server-side repository can replace the static content module. Store artifacts, exhibits, articles, references, timeline records, questions and project materials as separate tables with immutable slugs, evidence status and source relationships. Require authenticated admin access and role checks for every mutation, deny anonymous writes with RLS, validate uploads, and use server-only credentials. Never put a service-role key in browser code or a NEXT_PUBLIC variable. Local file editing remains the supported workflow until that backend is implemented.

## Deployment

Deploy as a standard Next.js Node application on a compatible provider, or run `npm run build && npm start` behind HTTPS. Set `NEXT_PUBLIC_SITE_URL` to the final HTTPS origin before building so metadata, sitemap and robots point to the deployed site. Use stable hosting for permanent QR URLs. Public-domain hosting is not configured here. OpenStreetMap's service and attribution rules apply if map traffic grows.

## Accessibility and limitations

Semantic headings, labeled controls, skip link, keyboard-operable navigation/quizzes/markers, visible focus, print styles and reduced-motion CSS are included. WebGL interaction has textual alternatives. Audio starts only after a button press and uses a quiet synthesized tone rather than an authentic sound recording. Browser WebGL/fullscreen/clipboard support and network tile loading depend on the visitor's device. Font stacks use local Georgia and Arial with Cyrillic fallback; no runtime font download is required.

## Verification results

- `npm run lint`: passed with zero warnings/errors.
- `npm run typecheck`: passed.
- `npm run build`: passed; 23 generated pages, including framework and metadata routes.
- Local production HTTP smoke check: all 13 main routes, five material detail routes, sitemap and robots returned 200; two unknown routes returned 404.
- `npm audit --omit=dev`: zero vulnerabilities after overriding PostCSS to a patched release.
- Full audit: five high advisories in the development-only Next ESLint → fast-glob → micromatch → braces chain. The registry's latest braces release is still 3.0.3 and affected. Do not run lint against untrusted glob inputs; revisit the dependency chain when an upstream fix is released.
- The initial release lacked browser QA. For the photo update, Chrome accessibility inspection verified the updated coin page, source gallery and control labels. Screenshot capture failed in the macOS capture service; full visual, touch and WebGL acceptance remains to be completed. Geometry was checked programmatically for finite vertices, triangle counts, bounds and front/back normal orientation.
