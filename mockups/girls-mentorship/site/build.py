"""Assemble the Girls Mentorship site preview.

Each page in src/pages/ starts with a meta comment:
  <!--meta route="/summercamp" title="..." desc="..." theme="t-camp" section="programs" mbar="..."-->
Links written as href="@/route" resolve to the built file, or to the site map
page when that route isn't designed yet. index.html is published as the artifact's
main page (the host adds the document skeleton); every other page is a full document.
"""
import re, sys, shutil, html, pathlib

ROOT = pathlib.Path(__file__).parent
SRC = ROOT / "src"
OUT = pathlib.Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else ROOT / "out"  # pass a folder to build somewhere else
LIVE = "https://www.girlsmentorship.com"

# Site map (Expand Lab, approved Oct 5): six menu sections, one button.
MENU = [
  ("programs", "Programs for Girls", [
    ("/summercamp", "Summer Camp", "Our flagship week in Scottsdale, ages 10 to 13"),
    ("/one-days", "One-Days", "A one-day reset, grades 5 to 8, about once a quarter"),
    ("/power-coaching", "Power Coaching", "1:1 coaching with Jill and Mary, from $2,500"),
    ("/find-her-program", "Which program is right for her?", "Compare by age and need"),
  ]),
  ("teens", "For Teens", [
    ("/peer-leader", "Peer Leader Program", "Mentor younger girls at camp, ages 14 to 18"),
    ("/mastermind", "Peer Leader Mastermind", "A six-month leadership cohort"),
    ("/leadership-lab", "Leadership Lab + Service Hours", "Up to 10 verified hours"),
  ]),
  ("schools", "Schools & Orgs", [
    ("/workshops", "Workshops", "For schools, troops, NCL and teams"),
    ("/power-up-club", "Power Up Club", "Six-week after-school program, grades 4 to 6"),
  ]),
  ("lead", "Lead Girls", [
    ("/the-power-method", "The POWER Method", "Get certified to teach our curriculum"),
    ("/facilitator-webinar", "Free Facilitator Webinar", "Next date + replay"),
    ("/girls-circle-kit", "Free Girls' Circle Kit", "One sample POWER lesson to try with your group"),
  ]),
  ("resources", "Parent Resources", [
    ("/resources", "Articles", "Friendships, confidence, boundaries and more"),
    ("/free-guides", "Free Guides", "Gray Area Guide, Friendship Guide"),
    ("/list", "The Mentor Minute", "Our newsletter for parents"),
  ]),
  ("about", "About", [
    ("/about", "Our Story", "Meet Jill and Mary"),
    ("/power-framework", "The POWER Framework", "The five pillars behind every program"),
    ("/results", "Results & Press", "Outcomes, testimonials, In The News"),
    ("/contact", "Contact", "Questions, ESA invoices, partnerships"),
  ]),
]
FOOTER = {
  "Programs": [("/summercamp","Summer Camp"),("/one-days","One-Days"),("/power-coaching","Power Coaching"),("/peer-leader","Peer Leader"),("/workshops","Workshops")],
  "Families": [("/faq","FAQ"),("/esa","Using Arizona ESA Funds"),("/camp-forms","Camp Forms & Waivers"),("/refer","Refer a Family"),("/contact","Contact")],
  "Give": [("/GMF","Girls Mentorship Foundation"),("/GMF#donate","Donate"),("/GMF#sponsor-a-girl","Sponsor a Girl"),("/GMF#sponsor-a-school","Sponsor a School")],
}
BANNER = ('Camp 2027 VIP list: get first access to Black Friday pricing', '/camp-vip')

ICONS = """<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
<symbol id="i-check" viewBox="0 0 24 24"><path d="M4 12.5l5 5L20 6.5" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></symbol>
<symbol id="i-arrow" viewBox="0 0 24 24"><path d="M4 12h15M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></symbol>
<symbol id="i-plus" viewBox="0 0 24 24"><path d="M12 4v16M4 12h16" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></symbol>
<symbol id="i-down" viewBox="0 0 24 24"><path d="M5 9l7 7 7-7" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></symbol>
<symbol id="i-menu" viewBox="0 0 24 24"><path d="M3 6h18M3 12h18M3 18h18" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></symbol>
<symbol id="i-x" viewBox="0 0 24 24"><path d="M5 5l14 14M19 5L5 19" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"/></symbol>
<symbol id="i-clock" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M12 7v5l3 2" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></symbol>
<symbol id="i-pin" viewBox="0 0 24 24"><path d="M12 21s-7-6.2-7-11.5a7 7 0 0114 0C19 14.8 12 21 12 21z" fill="none" stroke="currentColor" stroke-width="2.4"/><circle cx="12" cy="9.5" r="2.4" fill="currentColor"/></symbol>
<symbol id="i-sparkle" viewBox="0 0 24 24"><path d="M12 2.5l2.3 6.4 6.7 2.6-6.7 2.6L12 20.5l-2.3-6.4L3 11.5l6.7-2.6z" fill="currentColor"/></symbol>
<symbol id="i-heart" viewBox="0 0 24 24"><path d="M12 20s-7.5-4.6-9.2-9.3C1.6 7.4 3.9 4 7.3 4c2 0 3.6 1.1 4.7 2.7C13.1 5.1 14.7 4 16.7 4c3.4 0 5.7 3.4 4.5 6.7C19.5 15.4 12 20 12 20z" fill="currentColor"/></symbol>
<symbol id="sq-loop" viewBox="0 0 220 120"><path d="M10 90c30-70 70-70 60-20s-50 30-20-10 90-60 100-10-40 50-20 20 60-50 80-40"/></symbol>
<symbol id="sq-zig" viewBox="0 0 160 80"><path d="M8 60l24-40 24 40 24-40 24 40 24-40 24 40"/></symbol>
<symbol id="sq-curl" viewBox="0 0 140 140"><path d="M20 120c0-60 40-100 80-90s20 60-20 50-20-60 30-60 30 50 10 70"/></symbol>
<symbol id="sq-star" viewBox="0 0 100 100"><path d="M50 6c5 18 10 26 30 26-14 11-17 19-11 40-15-11-23-11-38 0 6-21 3-29-11-40 20 0 25-8 30-26z"/></symbol>
</defs></svg>"""

FONTS = ('<link rel="preconnect" href="https://fonts.googleapis.com">\n'
         '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
         '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=Mulish:ital,wght@0,400;0,600;0,800;1,400&family=Permanent+Marker&display=swap">')

def slug(route): return route.strip("/").replace("/", "-").replace("#", "-") or "home"

def pages():
    out = {}
    for f in sorted((SRC / "pages").glob("*.html")):
        txt = f.read_text()
        m = re.match(r'\s*<!--meta (.*?)-->', txt, re.S)
        meta = dict(re.findall(r'(\w+)="(.*?)"', m.group(1)))
        meta["body"] = txt[m.end():]
        meta["file"] = "index.html" if meta["route"] == "/" else f.name
        out[meta["route"]] = meta
    return out

def resolver(built):
    def href(route):
        base, _, frag = route.partition("#")
        if base in built:
            return built[base]["file"] + ("#" + frag if frag else "")
        return "site-map.html#" + slug(base)
    return href

def header(meta, href):
    cur = meta.get("section", "")
    items = []
    for key, label, links in MENU:
        cls = " current" if key == cur else ""
        drop = "".join(
            f'<a href="{href(r)}"{" aria-current=\"page\"" if r == meta["route"] else ""}><b>{html.escape(t)}</b><span>{html.escape(d)}</span></a>'
            for r, t, d in links)
        items.append(f'<li><button class="menu-top{cls}" aria-expanded="false" aria-controls="dd-{key}">{html.escape(label)}'
                     f'<svg aria-hidden="true"><use href="#i-down"/></svg></button><div class="drop" id="dd-{key}">{drop}</div></li>')
    mob = "".join(
        f'<details{" open" if key == cur else ""}><summary>{html.escape(label)}<svg aria-hidden="true"><use href="#i-down"/></svg></summary><div>'
        + "".join(f'<a href="{href(r)}"><b>{html.escape(t)}</b><span>{html.escape(d)}</span></a>' for r, t, d in links)
        + "</div></details>" for key, label, links in MENU)
    btext, broute = BANNER
    return f"""{ICONS}
<div class="banner"><div class="wrap"><a href="{href(broute)}">{btext} &rarr;</a></div></div>
<header class="site-head">
  <div class="wrap">
    <a class="logo" href="{href('/')}" aria-label="Girls Mentorship home"><b>Girls Mentorship</b><span>Scottsdale · Since 2020</span></a>
    <nav aria-label="Main"><ul class="menu">{''.join(items)}</ul></nav>
    <div class="head-actions">
      <a class="donate" href="{href('/GMF')}">Donate</a>
      <a class="btn btn-primary sm" href="{href('/find-her-program')}">Find Her Program</a>
      <button class="burger" id="burger" aria-label="Open menu" aria-expanded="false" aria-controls="mnav"><svg aria-hidden="true"><use href="#i-menu"/></svg></button>
    </div>
  </div>
</header>
<div class="mnav" id="mnav" hidden role="dialog" aria-modal="true" aria-label="Menu">
  <div class="wrap mnav-top"><a class="logo" href="{href('/')}"><b>Girls Mentorship</b><span>Scottsdale · Since 2020</span></a>
    <button class="burger" style="display:inline-flex" id="mclose" aria-label="Close menu"><svg aria-hidden="true"><use href="#i-x"/></svg></button></div>
  <div class="mnav-body wrap">{mob}
    <div class="mnav-foot"><a class="btn btn-primary" href="{href('/find-her-program')}">Find Her Program</a><a class="btn-link" href="{href('/GMF')}">Donate to the Foundation</a></div>
  </div>
</div>"""

def footer(href):
    cols = "".join(
        f'<div><h4>{h}</h4><ul>' + "".join(f'<li><a href="{href(r)}">{html.escape(t)}</a></li>' for r, t in links) + "</ul></div>"
        for h, links in FOOTER.items())
    return f"""<footer class="site-foot">
  <div class="wrap foot-grid">
    <div class="join">
      <h3>Join the Mentor Minute</h3>
      <p>Parenting tips, trend reports and first access to camp. For parents of girls 10 to 18.</p>
      <form data-preview-form><label class="sr" for="foot-email" style="position:absolute;left:-9999px">Email</label><input id="foot-email" type="email" placeholder="Your email" required><button class="btn btn-lime sm" type="submit">Join</button></form>
      <p class="ok" hidden>You're on the list. (Preview only: nothing was sent.)</p>
    </div>
    {cols}
  </div>
  <div class="wrap foot-bottom">
    <span>Girls Mentorship · Scottsdale, Arizona</span><span>Approved Arizona ESA vendor</span><span>Instagram @girlsmentorship</span>
    <a href="{href('/about-girls-mentorship')}">About Girls Mentorship</a><a href="{href('/privacy')}">Privacy</a><a href="{href('/terms')}">Terms</a><span>© 2026 Girls Mentorship</span>
  </div>
</footer>"""

def render(meta, href, built):
    body = meta["body"]
    body = re.sub(r'href="@(/[^"]*)"', lambda m: f'href="{href(m.group(1))}"', body)
    theme = meta.get("theme", "")
    head = (f'<title>{html.escape(meta["title"])}</title>\n'
            f'<meta name="claude:viewport-fit-sides" content="cover">\n'
            f'<meta name="description" content="{html.escape(meta.get("desc",""))}">\n'
            f'{FONTS}\n<link rel="stylesheet" href="styles.css">')
    page = (f'{header(meta, href)}\n<main id="top" class="{theme}">\n{body}\n</main>\n{footer(href)}\n'
            f'<script src="site.js" defer></script>')
    if meta["file"] == "index.html":
        return head + "\n" + page
    return ('<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n'
            '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
            + head + '\n<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}</style>\n'
            '</head>\n<body>\n' + page + '\n</body>\n</html>\n')

def site_map_page(built, href):
    """Preview helper: every page in the site map, with what is designed so far."""
    rows = []
    for key, label, links in MENU:
        lis = "".join(
            f'<li id="{slug(r)}"><a href="{href(r)}"><b>{html.escape(t)}</b></a><span>{html.escape(d)}</span><code>{r}</code>'
            + ('<em class="chip">Designed</em>' if r in built else '<em class="chip pink">Next round</em>') + "</li>"
            for r, t, d in links)
        rows.append(f'<div class="smcol"><h3>{html.escape(label)}</h3><ul>{lis}</ul></div>')
    extra = [("/camp-vip","Camp 2027 VIP list","Opt-in + thank-you"),("/esa","Using Arizona ESA Funds","Utility"),
             ("/faq","FAQ","Utility"),("/camp-forms","Camp Forms & Waivers","Utility"),("/refer","Refer a Family","Utility"),
             ("/GMF","Girls Mentorship Foundation","Donate, Sponsor a Girl, Sponsor a School"),
             ("/about-girls-mentorship","About Girls Mentorship","AI reference page"),("/privacy","Privacy",""),("/terms","Terms","")]
    lis = "".join(
        f'<li id="{slug(r)}"><a href="{href(r)}"><b>{html.escape(t)}</b></a><span>{html.escape(d)}</span><code>{r}</code>'
        + ('<em class="chip">Designed</em>' if r in built else '<em class="chip pink">Next round</em>') + "</li>"
        for r, t, d in extra)
    rows.append(f'<div class="smcol"><h3>Footer &amp; utility</h3><ul>{lis}</ul></div>')
    body = f"""
<style>
.smgrid{{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:16px}}
.smcol{{border:2px solid var(--ink);border-radius:20px;background:#fff;overflow:hidden}}
.smcol h3{{background:var(--ink);color:#fff;padding:14px 18px;font-size:1.3rem;text-transform:uppercase;letter-spacing:.04em}}
.smcol ul{{list-style:none;padding:0}}
.smcol li{{padding:12px 18px;border-top:1px solid var(--line);display:grid;gap:3px;scroll-margin-top:140px}}
.smcol li:first-child{{border-top:0}}
.smcol li:target{{background:var(--lime)}}
.smcol li a{{text-decoration:none}}
.smcol li span{{color:var(--muted);font-size:.92rem}}
.smcol li code{{font-size:.8rem;color:var(--blue)}}
.smcol li em{{justify-self:start;font-style:normal;margin-top:4px}}
</style>
<section class="band tight"><div class="wrap">
  <div class="sec-head"><p class="eyebrow">Preview guide</p><h1 class="h-l">Site map</h1>
  <p class="lede">Every page in the approved site map. Pages marked Designed are in this preview; the rest are built next from the same templates. If a link brought you here, the page you clicked is highlighted.</p></div>
  <div class="smgrid">{''.join(rows)}</div>
</div></section>"""
    return {"route": "/site-map", "title": "Site Map · Girls Mentorship", "desc": "Preview guide to every page in the site map.",
            "section": "", "body": body, "file": "site-map.html"}

def main():
    if OUT.exists(): shutil.rmtree(OUT)
    OUT.mkdir()
    built = pages()
    href = resolver(built)
    allp = dict(built); allp["/site-map"] = site_map_page(built, href)
    for meta in allp.values():
        (OUT / meta["file"]).write_text(render(meta, href, built))
    shutil.copy(SRC / "styles.css", OUT / "styles.css")
    shutil.copy(SRC / "site.js", OUT / "site.js")
    shutil.copytree(ROOT / "img", OUT / "img")
    print("built:", ", ".join(m["file"] for m in allp.values()))

if __name__ == "__main__":
    main()
