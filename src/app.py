from flask import Flask, render_template, request, jsonify
from bs4 import BeautifulSoup
from urllib.parse import parse_qs, urlparse, unquote
import requests
import xml.etree.ElementTree as ET

app = Flask(__name__)

UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'

HEADERS = {
    'User-Agent': UA,
    'Accept-Language': 'en-US,en;q=0.9',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'same-origin',
}


# ── Web search ──────────────────────────────────────────────────────────

def _ddg_html(query, result_limit=15):
    try:
        resp = requests.post(
            'https://html.duckduckgo.com/html/',
            data={'q': query, 'kl': 'us-en'},
            headers=HEADERS,
            timeout=15,
        )
        if resp.status_code != 200:
            return []

        soup = BeautifulSoup(resp.text, 'html.parser')
        results = []
        for row in soup.select('.result'):
            link = row.select_one('a.result__a')
            snippet_el = row.select_one('.result__snippet')
            if not link:
                continue
            href = link.get('href', '')
            if 'uddg=' in href:
                url = unquote(parse_qs(urlparse(href).query).get('uddg', [href])[0])
            else:
                url = href
            results.append({
                'title': link.get_text(strip=True),
                'link': url,
                'snippet': snippet_el.get_text(strip=True) if snippet_el else '',
            })
            if len(results) >= result_limit:
                break
        return results
    except requests.RequestException:
        return []


def _mojeek(query, result_limit=15):
    try:
        resp = requests.get(
            'https://www.mojeek.com/search',
            params={'q': query},
            headers={'User-Agent': UA},
            timeout=15,
        )
        if resp.status_code != 200:
            return []
        soup = BeautifulSoup(resp.text, 'html.parser')
        results = []
        for li in soup.select('ul.results-standard > li'):
            a = li.select_one('.title a')
            s = li.select_one('.s')
            if a:
                results.append({
                    'title': a.get_text(strip=True),
                    'link': a['href'],
                    'snippet': s.get_text(strip=True) if s else '',
                })
            if len(results) >= result_limit:
                break
        return results
    except requests.RequestException:
        return []


def search_web(query, result_limit=15):
    for engine in (_ddg_html, _mojeek):
        results = engine(query, result_limit)
        if results:
            return results
    return []


# ── Torrent search ──────────────────────────────────────────────────────

def _1337x(query, result_limit=15):
    try:
        resp = requests.get(
            f'https://1337x.to/search/{query}/1/',
            headers={'User-Agent': UA},
            timeout=15,
        )
        if resp.status_code != 200:
            return []
        soup = BeautifulSoup(resp.text, 'html.parser')
        results = []
        for row in soup.select('table.table-list tbody tr'):
            name_td = row.select_one('td.name')
            if not name_td:
                continue
            links = name_td.select('a')
            name_link = links[-1] if links else None
            if not name_link:
                continue
            seed_el = row.select_one('td:nth-child(2)')
            leech_el = row.select_one('td:nth-child(3)')
            size_el = row.select_one('td:nth-child(5)')
            results.append({
                'title': name_link.get_text(strip=True),
                'link': 'https://1337x.to' + name_link['href'],
                'seeders': seed_el.get_text(strip=True) if seed_el else '0',
                'leechers': leech_el.get_text(strip=True) if leech_el else '0',
                'size': size_el.get_text(strip=True) if size_el else '',
            })
            if len(results) >= result_limit:
                break
        return results
    except requests.RequestException:
        return []


def _bitsearch(query, result_limit=15):
    try:
        resp = requests.get(
            'https://bitsearch.to/search',
            params={'q': query, 'sort': 'seeders'},
            headers={'User-Agent': UA},
            timeout=15,
        )
        if resp.status_code != 200:
            return []
        soup = BeautifulSoup(resp.text, 'html.parser')
        results = []
        for card in soup.select('div.bg-white.rounded-lg'):
            title_el = card.select_one('h3 a')
            magnet_el = card.select_one("a[href^='magnet:']")
            seeds_el = card.select_one('span.text-green-600 span')
            leech_el = card.select_one('span.text-red-600 span')
            if title_el:
                results.append({
                    'title': title_el.get_text(strip=True),
                    'link': title_el.get('href', ''),
                    'magnet': magnet_el['href'] if magnet_el else None,
                    'seeders': seeds_el.get_text(strip=True) if seeds_el else '0',
                    'leechers': leech_el.get_text(strip=True) if leech_el else '0',
                })
            if len(results) >= result_limit:
                break
        return results
    except requests.RequestException:
        return []


def _torrentz2(query, result_limit=15):
    try:
        resp = requests.get(
            f'https://torrentz2.nz/search?q={query}',
            headers={'User-Agent': UA},
            timeout=15,
        )
        if resp.status_code != 200:
            return []
        soup = BeautifulSoup(resp.text, 'html.parser')
        results = []
        for div in soup.find_all('div', class_='results'):
            for a in div.find_all('a', href=True):
                if a.text:
                    results.append({
                        'title': a.text.strip(),
                        'link': a['href'],
                    })
                if len(results) >= result_limit:
                    return results
        return results
    except requests.RequestException:
        return []


def search_torrent(query, result_limit=15):
    for engine in (_1337x, _torrentz2, _bitsearch):
        results = engine(query, result_limit)
        if results:
            return results
    return []


# ── Routes ──────────────────────────────────────────────────────────────

@app.route('/search_web', methods=['POST'])
def route_search_web():
    query = request.form.get('searchTerm', '')
    return jsonify(search_web(query))


@app.route('/torrent_search', methods=['POST'])
def route_torrent_search():
    query = request.form.get('searchTerm', '')
    return jsonify(search_torrent(query))


@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        query = request.form.get('searchTerm', '')
        return render_template(
            'index.html',
            google_results=search_web(query),
            torrent_results=search_torrent(query),
        )
    return render_template('index.html', google_results=None, torrent_results=None)
