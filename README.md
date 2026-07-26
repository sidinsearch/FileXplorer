# FileXplorer

Open directory and torrent search engine. 100% free, no API keys, no accounts.

Scrapes search engines directly — DuckDuckGo and Mojeek for web results, 1337x and Torrentz2 for torrents.

## Live

[filexplorer.onrender.com](https://filexplorer.onrender.com)

## How it works

| Search type | Sources (tried in order) |
|-------------|--------------------------|
| Web / open dirs | DuckDuckGo HTML → Mojeek |
| Torrents | 1337x → Torrentz2 → BitSearch |

First source with results wins. If one goes down, next takes over automatically.

Google dork syntax (`intitle:"index.of"`) works across all sources.

## Stack

- **Backend:** Flask + BeautifulSoup + Requests
- **Frontend:** HTML, Bootstrap, jQuery
- **Deploy:** Render (free tier)

## Run locally

```bash
pip install -r requirements.txt
cd src
flask run
```

No `.env` file needed. Zero configuration.

## Deploy to Render

1. Push to GitHub
2. [render.com](https://render.com) → **New → Web Service** → connect repo
3. Settings:
   - Root Directory: `src`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn app:app`
4. Deploy. No environment variables required.

## Features

- Open directory finder (Google dorking via DDG/Mojeek)
- Torrent search with seeds/leechers/size
- Dark mode toggle
- Emoji legend for result types

## Disclaimer

Indexes publicly available files. Does not host copyrighted content. Use responsibly.

---

Made by SIDINSEARCH
