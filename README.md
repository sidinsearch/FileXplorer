# FileXplorer 📂

FileXplorer is a dynamic tool designed for searching open directories and uncovering Direct Download Links (DDL) for various media, including movies, TV shows, books, and more. It harnesses the power of Google's Dorking and a custom Torrent Indexing Script for comprehensive and efficient results.

## Project Overview
- **Experience the Magic:** [ Explore FileXplorer Live 👨‍💻](https://filexplorer.onrender.com)
- ⚠️ **Disclaimer:** FileXplorer indexes publicly available files and does not host any copyrighted content. Use responsibly.

## Technologies Used 🛠️
- **Frontend:**
  - HTML, CSS, Bootstrap
  - JavaScript, jQuery

- **Backend:**
  - Flask (Python)
  - BeautifulSoup (HTML scraping)
  - DuckDuckGo + Mojeek (web search — free, no API)
  - 1337x + Torrentz2 + BitSearch (torrent search — free, no API)

## FileXplorer Interface
![FileXplorer](https://github.com/sidinsearch/FileXplorer-SearchEngine/assets/29821792/3358ebc2-40ad-4525-904f-d4eb1a12d328)


## Search Results Overview
- **Regular Search:**
  - Displays search results with emojis indicating file types (directories, reference pages).
  - Click on the link to view details, opening in a new tab.

- **Torrent Search:**
  - Presents torrent search results with emojis distinguishing between magnet links and files.
  - Provides direct links for easy access.

## Features 🚀
- **Search Options:**
  - Search for everything or filter by specific types (Video, Audio, eBook, Software).
  - Uses DuckDuckGo and Mojeek for free web search with Google dork syntax.
  - Custom torrent indexing across 1337x, Torrentz2, and BitSearch.

- **Dark Mode:**
  - Toggle between light and dark mode with an emoji-themed switch. 🌙☀️
  - Customize the look and feel according to your preference.

- **Emoji Legend:**
  - Easily understand search results with emojis indicating directories, magnet links, and reference pages. 📁🧲📄

## Search Mechanisms 🔍
FileXplorer employs multiple free search engines with automatic fallback:
- **Open Directory Search:**
  - Primary: DuckDuckGo HTML scraping
  - Fallback: Mojeek (independent index)

- **Torrent Search:**
  - Primary: 1337x (seeds, leechers, size)
  - Fallback: Torrentz2 (meta-search)
  - Last resort: BitSearch (DHT, magnet links)

## Deploy to Render 🌐
1. Push to GitHub
2. [render.com](https://render.com) → **New → Web Service** → connect repo
3. Root Directory: `src`
4. Build Command: `pip install -r requirements.txt`
5. Start Command: `gunicorn app:app`
6. Deploy — no environment variables needed.

## Contributing 🤝
Contributions are welcome! If you have ideas for improvements or find any issues, please open an issue or submit a pull request.

---

**MADE WITH ❤️ BY SIDINSEARCH**
