# Journal of AI Ethics (LAIEJ)

Open-access academic journal for AI ethics, alignment, LLM security, and AI policy research.
**Live site:** https://journalofaiethics.com
**ISSN:** XXXX-XXXX (pending)

---

## Folder Structure

```
/
├── index.html                  Homepage with paper feed
├── papers.html                 Full paper listing with search & filters
├── about.html                  Mission, editorial standards, contact
├── submit.html                 Submission guide and checklist
├── styles.css                  All styles (light + dark mode)
├── theme.js                    Dark/light toggle with localStorage
├── search.js                   Fuse.js search + tag filter + sort
├── feed.xml                    RSS 2.0 feed
├── sitemap.xml                 XML sitemap for crawlers
├── robots.txt                  Robots directive
├── README.md                   This file
├── templates/
│   └── laiej-template.tex      Official LaTeX template for authors
└── papers/
    └── LAIEJ-2026-001/
        ├── LAIEJ-2026-001.html Paper page (HTML version)
        └── LAIEJ-2026-001.pdf  Paper (PDF version)
```

---

## How to Add a New Paper

### Step 1 — Create the paper folder

Create a new folder under `papers/` using the reference code format:

```
papers/LAIEJ-YYYY-XXX/
```

Where `YYYY` is the year and `XXX` is a zero-padded sequence number (e.g. `002`, `003`).

### Step 2 — Write the paper in LaTeX

Download `templates/laiej-template.tex`, copy it into your new folder, rename it to `LAIEJ-YYYY-XXX.tex`, and write your paper. Create a `references.bib` file for your bibliography.

### Step 3 — Generate HTML and PDF with Pandoc

From inside the paper folder, run:

```bash
pandoc LAIEJ-YYYY-XXX.tex -o LAIEJ-YYYY-XXX.html --standalone --css=../../styles.css

pandoc LAIEJ-YYYY-XXX.tex -o LAIEJ-YYYY-XXX.pdf
```

Pandoc must be installed: https://pandoc.org/installing.html
PDF output requires a LaTeX distribution (TeX Live or MiKTeX).

### Step 4 — Update the paper index

Add a new paper card to `index.html` (in the Latest and All Papers tab panels) and to `papers.html` (in the static fallback, if used).

Add the paper's data object to the `LAIEJ.papers` array at the top of `search.js`:

```js
{
  id: 'LAIEJ-2026-002',
  title: 'Your Paper Title',
  author: 'Author Name',
  affiliation: 'Author Affiliation',
  date: 'Month YYYY',
  dateSort: 'YYYY-MM-DD',
  abstract: 'Full abstract text...',
  tags: ['AI Ethics', 'Alignment'],
  keywords: ['keyword1', 'keyword2'],
  url: 'papers/LAIEJ-2026-002/LAIEJ-2026-002.html',
  pdf: 'papers/LAIEJ-2026-002/LAIEJ-2026-002.pdf'
}
```

### Step 5 — Update feed.xml and sitemap.xml

Add a new `<item>` block to `feed.xml` with the paper's title, link, description (abstract), author, tags, `pubDate`, and `guid`.

Add a new `<url>` block to `sitemap.xml` with the paper page URL and publication date.

---

## Running Locally

No build step required. Open `index.html` directly in a browser, or start a local HTTP server:

```bash
# Python 3
python -m http.server 8080

# Node.js (if npx is available)
npx serve .
```

Then visit http://localhost:8080 in your browser.

> **Note:** Fuse.js is loaded from a CDN on `papers.html`. You need an internet connection for search to work. All other functionality works offline.

---

## Deploying to GitHub Pages

1. Push the repository to GitHub.
2. Go to **Settings → Pages** in the repository.
3. Under **Source**, select **Deploy from a branch**, choose `main`, root (`/`), and click **Save**.
4. GitHub Pages will serve the site at `https://<username>.github.io/<repo-name>/`.
5. To use a custom domain (e.g. `journalofaiethics.org`), add a `CNAME` file to the root containing your domain name, and configure your DNS to point to GitHub Pages.

Once live, update the placeholder `https://journalofaiethics.org/` URLs throughout the site to match your actual domain.

---

## Applying for an ISSN

An ISSN (International Standard Serial Number) identifies the journal as a serial publication. To apply:

1. In the UK, apply through the **British Library ISSN UK Centre**: https://www.bl.uk/help/how-to-get-an-issn
2. You will need at least one published issue and a stable URL.
3. The process is free and typically takes 2–4 weeks.

Once you receive your ISSN, update the following locations in the code:

| File | Location | What to change |
|------|----------|----------------|
| `styles.css` | (n/a) | — |
| `index.html` | Masthead, left sidebar | Replace `XXXX-XXXX` |
| `papers.html` | Left sidebar, right sidebar | Replace `XXXX-XXXX` |
| `about.html` | Left sidebar, right sidebar | Replace `XXXX-XXXX` |
| `submit.html` | Left sidebar, right sidebar | Replace `XXXX-XXXX` |
| Every paper HTML | `<meta name="citation_issn">`, right sidebar | Replace `XXXX-XXXX` |
| `feed.xml` | `<description>` | Update text |

---

## Licence

All papers published in LAIEJ are released under **Creative Commons CC BY 4.0**.
The journal website code (HTML, CSS, JS) is released under the **MIT Licence**.

&copy; 2026 Journal of AI Ethics
