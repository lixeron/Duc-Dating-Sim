# Duc Dating Sim — download site

## Run it
    npm install
    npm run dev      # local preview at localhost:5173

## Deploy
    npm run build
Then push to GitHub and import in Vercel (framework preset: Vite), or run `vercel`.

## Changing the download links
Everything lives in `src/config.js` — DOWNLOAD_PC, DOWNLOAD_MAC, RELEASES_PAGE.
Cut a new GitHub release, paste the two asset URLs in, done. No version numbers
appear anywhere on the page, so you don't have to touch anything else.

## Editing content
- `src/App.jsx`
  - CAST — character name, tag, bio, and the "fact" line shown in the popup
  - MARQUEE — the scrolling pink strip
  - GAL_L / GAL_R — gallery photo filenames (drop new files in public/assets)
  - the "What is this" copy and the specs list
- `src/styles.css` — palette tokens are the five variables at the top

## Notes
- The gallery columns only respond to scroll while the cursor is over them.
- Character cards open a popup; Escape or clicking outside closes it.
- Reduced-motion is respected throughout.
