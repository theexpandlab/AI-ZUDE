# Girls Mentorship website concept

Full-site design concept built from the ONE-DAY landing page's visual system and the approved
Expand Lab site map (six menu sections + "Find Her Program").

- `src/styles.css`: the shared design system (tokens, nav, footer, components)
- `src/site.js`: shared behaviour (dropdowns, mobile menu, preview-only forms, phone sticky bar)
- `src/pages/*.html`: one file per page; header/footer are injected by the build
- `img/`: photos cropped from the current girlsmentorship.com pages
- `build.py`: `python3 build.py [outdir]` writes the static site to `out/` (or `outdir`)

Links written as `href="@/route"` go to the built page, or to `site-map.html` when that
route isn't designed yet. Forms are preview-only and send nothing.
