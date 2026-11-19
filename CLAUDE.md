# SSCI website (Singapore Section of the Combustion Institute)

Public site at https://www.ssci-combustion.org, hosted on GitHub Pages from this repository.
It is plain static HTML, CSS and JavaScript. There is no build step, no package manager and no framework.

## How the site is put together

- Every page is a hand-written `.html` file in the repository root (`index.html`, `about.html`, `events.html`, `annual-meetings.html`, `webinars.html`, `membership.html`, `young-investigator-award.html`, `collaboration.html`, `contacts.html`).
- Annual meeting pages live in `annuals/`, one pair per meeting (`Nth-ssci-annual-meeting.html` and `...-venue.html`).
- `assets/site.js` injects the shared header, navigation bar and footer into the empty `<div id="site-header">`, `<div id="site-nav">` and `<div id="site-footer">` on every page. Do not copy the header, nav or footer into individual pages.
  - To add, remove or rename a menu item, edit the navigation block in `assets/site.js`.
  - To change the footer text or contact email, edit the footer block in `assets/site.js`.
  - `site.js` detects pages under `/annuals/` and prefixes links with `../`. Pages in `annuals/` must reference assets as `../assets/...` and `../documents/...`.
  - The `data-page` attribute on nav items is used to highlight the current page.
- Colours and shared styles are in `assets/main.css` (CSS variables at the top of the file). Some pages (for example `events.html`) also carry their own `<style>` block for page-specific cards.
- `documents/` holds downloadable files (PDFs, Word templates, sponsor logos). `assets/` holds site images; board photos are in `assets/board/` and `assets/committee member/`.

## Deployment

- Pushing to `main` triggers `.github/workflows/static.yml`, which publishes the whole repository to GitHub Pages. The live site updates within a couple of minutes. Check progress in the Actions tab.
- `CNAME` holds the custom domain (`www.ssci-combustion.org`). Never delete or edit it unless the domain is deliberately being changed. DNS is managed at the domain registrar, not in this repository.
- The home page block "Latest News and Events from CI" reads `data/ci-news.js`, which `scripts/fetch_ci_news.py` builds from the Latest News and Upcoming Events lists on https://www.combustioninstitute.org/index.php (those lists have no dates, so the first entries are used; SSCI's own events are skipped because the home page already shows them). The deploy workflow runs the script every day and before each deploy. Whenever the list changes the workflow commits the new `data/ci-news.js` to `main` (a bot commit), so if a later fetch fails the last good list is shown. If CI changes its page layout the script keeps the old list; fix the parser in `scripts/fetch_ci_news.py`. Do not edit `data/ci-news.js` by hand.
- Because every push to `main` goes live, make changes on a branch, preview them locally, and merge through a pull request.

## Preview locally

The simplest way is to double-click `index.html` (or open it in a browser). The shared header, navigation and footer are added by JavaScript and work fine from `file://`, so no server or install is needed.

If a local server is preferred, run this and open http://localhost:8000:

```bash
python3 -m http.server 8000
```

## Conventions for edits

- Keep the existing page skeleton: `<head>` with favicon, `main.css`, description and title (format `Page | Singapore Section of the Combustion Institute`), a `<main class="content-wrapper">` body, then the three empty placeholder divs and `<script src="assets/site.js">`.
- When adding a new annual meeting, copy the previous year's pair of pages in `annuals/`, update the content, and add links from `annual-meetings.html`.
- New uploads should have simple file names: no spaces, no brackets, for example `ssci_2026_programme_book.pdf`. Existing files with spaces must stay as they are unless every link to them is updated together.
- Link to documents with the exact file name, including case. GitHub Pages is case sensitive.
- Do not commit `.bak`, `.txt`, `.mp3` or `.mp4` files (they are in `.gitignore`).
- `SSCI-website-content.md` is a plain-text copy of the site text and `code_collector.py` is a helper script. Neither is part of the published pages. Do not treat them as the source of truth for content.
- Keep text in English. Contact email is office@ssci-combustion.org.
- Headings use Title Case (capitalise every main word; keep short words such as a, the, and, of, in, to, for, with in lower case), for example "Membership Fees and Period". Talk titles keep the speaker's original wording.
- Before finishing a change, check that every link and image you touched resolves, and that pages in `annuals/` still load their assets.
