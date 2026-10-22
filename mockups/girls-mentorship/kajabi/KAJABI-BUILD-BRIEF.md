# Build brief: ONE-DAY landing page in Kajabi

Paste this whole brief into Claude in Chrome while you're logged in to the Girls Mentorship Kajabi account. Attach `one-days-kajabi.html` (or paste its contents when Claude asks for it).

---

## Task for Claude

Build a new version of the ONE-DAY landing page in Kajabi using the attached code (`one-days-kajabi.html`). Don't touch the live page at `/one-days` until I approve the new one.

### Steps

1. In Kajabi, go to **Website → Pages** (or **Landing Pages**, wherever the current "One Days" page lives).
2. **Duplicate** the existing "One Days" page so the live page stays as it is. Rename the copy "One Days – Redesign" and give it a draft URL slug like `one-days-new`.
3. Open the copy in the page builder and **delete all the existing sections**.
4. Add **one new section** and set it to:
   - Full width (no max-width / container)
   - Top and bottom padding: 0
   - Background: none or white
5. Inside that section, add a **Custom Code** block.
6. Paste **the entire contents of `one-days-kajabi.html`** into the Custom Code block, from the first `<!--` comment to the final `</script>`. Don't edit it.
7. Page settings:
   - If the Kajabi theme header has its own sticky nav, hide the theme header and footer on this page, since the code includes its own nav bar and footer. If hiding them isn't an option, tell me and I'll decide which nav to keep.
   - SEO title: `ONE-DAY | Girls Mentorship`
   - SEO description: `A six-hour, in-person Girls Mentorship experience for 5th–8th grade girls. November 7 & 8, 2026 in Scottsdale, AZ. $149.`
8. **Save** (don't publish), then open the preview.

### Check before reporting back

- All photos load: hero photo, partner logos strip, the 3 practice-scenario photos, and the wide group photo above "We can wait until she needs the tools."
- The hero photo shows the girls' faces, not the baked-in date badge. If the badge or "Less second-guessing" label shows in the hero crop, tell me.
- The day picker in the hero changes where the "Save her spot · $149" button goes:
  - Saturday → `https://www.girlsmentorship.com/resource_redirect/offers/x2eLHXVs`
  - Sunday → `https://www.girlsmentorship.com/resource_redirect/offers/vEVe4hTD`
- Both ticket buttons and the two buttons in the final blue section open the right checkout (same links as above).
- The three practice tabs ("The photo she wasn't in", "The joke in the chat", "The borrowed stuff") switch the photo and text.
- FAQ items open and close.
- On mobile preview, a dark "Save her spot" bar appears at the bottom after scrolling past the hero, and nothing scrolls sideways.
- Fonts show as tall condensed headings (Oswald) and rounded body text (Mulish), not the theme's fonts.

Report what passed, what failed, and include a screenshot of desktop and mobile previews. **Don't publish or replace `/one-days` without my go-ahead.**

### If something breaks

- **Kajabi strips the `<script>`:** the page still reads fine, but the day picker, practice tabs and mobile bar won't work. Tell me, and check whether Kajabi offers a page-level "header/footer code" field to put the script in instead.
- **Code is too long for one block:** split it into 2 Custom Code blocks in the same section. Block 1 gets everything from the start through `</style>`. Block 2 gets everything from `<svg width="0"` to the end.
- **Theme styles leak in (wrong colors or fonts on headings):** tell me which element. Everything in the code is scoped under `.gm1d`, so this should be rare.
