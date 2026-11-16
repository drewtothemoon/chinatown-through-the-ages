# Chinatown Through the Ages

An interactive cultural-preservation map of San Francisco's Chinatown.
UC Berkeley EDUC 155AC draft project, in collaboration with the Chinese Historical Society of America (CHSA).

Built with React + TypeScript, Vite, Tailwind CSS, and Leaflet/OpenStreetMap. No API keys, database, or backend.

## Run it locally

Requires [Node.js](https://nodejs.org) 18 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:5173. `npm run build` creates a production build in `dist/`.

## Editing content

**Easiest:** go to `/admin` on the live site (e.g. https://spiffy-snickerdoodle-39ad29.netlify.app/admin), log in with GitHub, edit, and click **Publish**. Netlify rebuilds the site in a minute or two.

All content lives in JSON files, which the CMS edits:

| What | File |
| --- | --- |
| Sites (text, coordinates, sources, photo) | `src/content/locations.json` |
| Timeline periods and their overviews | `src/content/periods.json` |
| Page title, About section, footer, group members | `src/content/site.json` |
| Uploaded photos | `public/images/` |
| CMS form layout | `public/admin/config.yml` |

Code (only needed for layout/design changes): types in `src/types.ts`, loaders that validate the JSON in `src/data/`, components in `src/components/`, colors and fonts in `src/index.css`.

- **Map numbers** follow the order of the locations list. Drag items in the CMS to reorder them.
- **Photos:** only use images you have permission to use (CHSA archives with permission, public domain, or Creative Commons with attribution). An empty photo shows the "Image pending" placeholder.
- **About paragraphs** support `*italics*` and `{verify}`, which shows the red Verify tag.
- **Adding a new period** needs a code change: add the id to `PeriodId` in `src/types.ts` and `PERIOD_IDS` in `src/data/normalize.ts`, add it to `periods.json`, and add the option to both `period_options` lists in `public/admin/config.yml`.

### Verification labels

Every site has a `verificationStatus`:

- `chsa-reviewed`: reviewed with CHSA
- `verified-secondary`: checked against the listed published sources, not yet reviewed with CHSA
- `needs-review`: sources conflict or are weak (see `researchNotes`)
- `placeholder`: not yet researched

Individual events can be flagged with `needsVerification: true`, which shows a "Verify" tag. Open questions for CHSA are in each site's `researchNotes`.

## Deploy

The site is deployed on Netlify from GitHub (see `netlify.toml`: build `npm run build`, publish `dist`, Node 22). Every push to `main`, including CMS edits, triggers a rebuild.

### Alternative: Vercel (no CMS login support)

1. Push this folder to a GitHub repository.
2. Go to https://vercel.com, sign in with GitHub, and choose **Add New → Project**.
3. Import the repository. Vercel detects **Vite** automatically (build command `npm run build`, output directory `dist`).
4. Click **Deploy**. Each later push to GitHub redeploys the site.

You can also deploy from the command line without GitHub:

```bash
npx vercel
```

## Credits

Map data © OpenStreetMap contributors. Site sources are listed in each location panel.
