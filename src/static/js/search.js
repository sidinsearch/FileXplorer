function search() {
    var searchTerm = document.getElementById("searchTerm").value.trim();
    if (searchTerm === "") {
        alert("Please Enter Search Keyword.");
        return;
    }

    var loading = document.getElementById('loadingAnimation');
    loading.style.display = 'block';
    document.getElementById('disclaimerContainer').style.display = 'none';
    document.getElementById('madeWithBy').style.display = 'none';

    // Clear previous results
    $("#searchResults").html('');
    $("#torrentResults").html('');

    $.ajax({
        url: '/search_web',
        method: 'POST',
        data: { searchTerm: searchTerm },
        dataType: 'json',
        success: function(data) {
            renderWebResults(data);
            loading.style.display = 'none';
        },
        error: function() {
            $("#searchResults").html('<div class="result-card"><p class="no-results">Search failed. Try again.</p></div>');
            loading.style.display = 'none';
        }
    });

    $.ajax({
        url: '/torrent_search',
        method: 'POST',
        data: { searchTerm: searchTerm },
        dataType: 'json',
        success: function(data) {
            renderTorrentResults(data);
            loading.style.display = 'none';
        },
        error: function() {
            $("#torrentResults").html('<div class="result-card"><p class="no-results">Torrent search failed.</p></div>');
            loading.style.display = 'none';
        }
    });
}

function esc(s) {
    var d = document.createElement('div');
    d.appendChild(document.createTextNode(s || ''));
    return d.innerHTML;
}

function cleanUrl(url) {
    try {
        var u = new URL(url);
        return u.hostname + u.pathname;
    } catch(e) {
        return url;
    }
}

function renderWebResults(data) {
    var el = $("#searchResults");
    if (!data || data.length === 0) {
        el.html('<div class="result-section"><h3 class="result-heading">Web Results</h3><div class="result-card"><p class="no-results">No results found.</p></div></div>');
        return;
    }
    var h = '<div class="result-section"><h3 class="result-heading">Web Results</h3>';
    for (var i = 0; i < data.length; i++) {
        var t = esc(data[i].title);
        var l = esc(data[i].link);
        var s = data[i].snippet ? esc(data[i].snippet) : '';
        var d = data[i].link.endsWith('/');
        var em = d ? '📁' : '📄';
        var host = '';
        try { host = new URL(data[i].link).hostname; } catch(e) {}
        h += '<div class="result-card">' +
            '<div class="result-title">' + em + ' <a href="' + l + '" target="_blank" rel="noopener">' + t + '</a></div>' +
            (host ? '<div class="result-url">' + esc(host) + '</div>' : '') +
            (s ? '<div class="result-snippet">' + s + '</div>' : '') +
            '</div>';
    }
    h += '</div>';
    el.html(h);
}

function renderTorrentResults(data) {
    var el = $("#torrentResults");
    if (!data || data.length === 0) {
        el.html('<div class="result-section"><h3 class="result-heading">Torrent Results</h3><div class="result-card"><p class="no-results">No torrent results found.</p></div></div>');
        return;
    }
    var h = '<div class="result-section"><h3 class="result-heading">Torrent Results</h3>';
    for (var i = 0; i < data.length; i++) {
        var t = esc(data[i].title);
        var l = esc(data[i].link);
        var seeds = data[i].seeders || '0';
        var leech = data[i].leechers || '0';
        var size = data[i].size || '';
        var magnet = data[i].magnet;
        var em = magnet ? '🧲' : '📄';
        var host = '';
        try { host = new URL(data[i].link).hostname; } catch(e) {}

        h += '<div class="result-card torrent-card">' +
            '<div class="result-title">' + em + ' <a href="' + l + '" target="_blank" rel="noopener">' + t + '</a></div>';
        if (host) h += '<div class="result-url">' + esc(host) + '</div>';
        h += '<div class="torrent-meta">';
        if (size) h += '<span class="torrent-size">' + esc(size) + '</span>';
        if (seeds !== '0') h += '<span class="torrent-seeds">▲ ' + esc(seeds) + '</span>';
        if (leech !== '0') h += '<span class="torrent-leech">▼ ' + esc(leech) + '</span>';
        h += '</div></div>';
    }
    h += '</div>';
    el.html(h);
}

function toggleDarkMode() {
    var el = document.getElementById('darkModeStyles');
    var isDark = el.href.includes('dark_mode.css');
    el.href = isDark ? 'static/css/custom_styles.css' : 'static/css/dark_mode.css';
    toggleEmojis();
    var dt = document.getElementById('disclaimerText');
    if (isDark) { dt.classList.remove('text-white'); }
    else { dt.classList.add('text-white'); }
}

function toggleEmojis() {
    var sun = document.querySelector('.sun');
    var moon = document.querySelector('.moon');
    var on = document.querySelector('.switch input').checked;
    sun.style.display = on ? 'none' : 'inline';
    moon.style.display = on ? 'inline' : 'none';
}
