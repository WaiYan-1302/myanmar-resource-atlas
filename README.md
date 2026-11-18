# Myanmar Field Atlas

An interactive, source-led natural-resource atlas built with Vite, React, and
TypeScript. The first edition includes eight toggleable layers, three reading
perspectives, keyboard-accessible map features, responsive layouts, and direct
links to the underlying evidence.

## Run locally

Requirements: Node.js 22 or newer and npm.

```powershell
npm install
npm run dev
```

Open the URL Vite prints (normally `http://localhost:5173`).

Production checks:

```powershell
npm run check
npm run build
npm run preview
```

The production output is written to `dist/`. Vite uses relative asset paths, so
the same build works at a GitHub Pages project subpath.

## Edit facts and sources

All resource descriptions, years, uncertainty statements, direct links, layer
metadata, and perspective text live in one file:

`src/data/resourceData.ts`

Detailed EITI locations are labeled historical. The 2025 gas figure is labeled
gross export value rather than public revenue. USGS global shares are labeled
as 2024 mine output. Approximate symbols are deliberately not precise site
coordinates.

## Map-data provenance

The committed map geometry was extracted from Natural Earth public-domain
datasets. See [DATA_LICENSE.md](DATA_LICENSE.md) for the exact files and terms.

To regenerate `src/data/mapData.ts`, download the three Natural Earth GeoJSON
files named in `DATA_LICENSE.md` into a folder, rename them as expected by
`scripts/extract-map-data.mjs`, then run:

```powershell
npm run extract:map -- "C:\path\to\natural-earth-files"
```

## Publish on GitHub Pages

The workflow at `.github/workflows/deploy-pages.yml` builds and publishes the
site whenever `main` is pushed.

1. Create a GitHub repository and push this project to its `main` branch.
2. On GitHub, open **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **GitHub Actions**.
4. Run **Deploy to GitHub Pages** from the Actions tab, or push a commit to
   `main`.

The live URL will be:

```text
https://<github-user>.github.io/<repository-name>/
```

If the repository is named `<github-user>.github.io`, the URL is instead
`https://<github-user>.github.io/`.

## Accessibility and interpretation

- Map layers, perspective buttons, resource symbols, and regions work by
  keyboard.
- Visible focus states and reduced-motion preferences are supported.
- Text remains readable at mobile widths and information cards move below the
  map.
- Conflict, environmental damage, unsafe work, and displacement are described
  as impacts and uncertainties, never as rewards.
