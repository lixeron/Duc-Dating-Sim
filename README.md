# Duc's Passion — download site

Pink. Loud. Has the game menu playing in the hero. You know the drill.

## Run it
    npm install
    npm run dev          # local preview at localhost:5173

## Before deploying — 2 edits
1. Upload the game zip somewhere (GitHub Releases, steps below).
2. Open `src/config.js` and set `DOWNLOAD_URL` to that link
   (also bump GAME_SIZE to the real number).

## Hosting the game zip (GitHub Releases — free, handles big files)
1. Make a repo (private is fine, releases can still be public — or just make it public).
2. Repo page -> "Releases" -> "Draft a new release".
3. Tag: v1.0. Attach the zip that Ren'Py's "Build Distributions" made
   (the one ending in -win.zip). Publish.
4. Right-click the asset -> copy link. That's your DOWNLOAD_URL.

## Deploy (Vercel, like always)
    npm run build        # sanity check it compiles
Then either `vercel` from the CLI, or push the repo to GitHub and
import it in the Vercel dashboard. Framework preset: Vite. Done.

## Where things live
- `src/App.jsx`     — all sections + the GSAP/Lenis choreography
- `src/styles.css`  — the whole look; palette tokens at the top
- `src/config.js`   — download URL / version / size
- `public/assets/`  — game assets (menu video, sprites, gallery photos)

Swap gallery photos by dropping files in assets/ and editing the
GALLERY_L / GALLERY_R arrays in App.jsx. Cast one-liners are in CAST.
