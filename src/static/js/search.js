function search() {
    var searchTerm = document.getElementById("searchTerm").value.trim();
    if (searchTerm === "") {
        alert("Please Enter Search Keyword.");
        return;
    }

    var loadingAnimation = document.getElementById('loadingAnimation');
    loadingAnimation.style.display = 'block';
    document.getElementById('disclaimerContainer').style.display = 'none';

    // Web search
    $.ajax({
        url: '/search_web',
        method: 'POST',
        data: { searchTerm: searchTerm },
        dataType: 'json',
        success: function(data) {
            displayResults(data);
            loadingAnimation.style.display = 'none';
        },
        error: function(error) {
            console.error('Error:', error);
            loadingAnimation.style.display = 'none';
        }
    });

    // Torrent search
    $.ajax({
        url: '/torrent_search',
        method: 'POST',
        data: { searchTerm: searchTerm },
        success: function(torrentData) {
            displayTorrentResults(torrentData);
            loadingAnimation.style.display = 'none';
        },
        error: function(error) {
            console.error('Error:', error);
            loadingAnimation.style.display = 'none';
        }
    });
}

function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
}

function displayResults(data) {
    var container = $("#searchResults");
    container.empty();
    document.getElementById("madeWithBy").style.display = "none";

    if (!data || data.length === 0) {
        container.html('<p class="no-results">No results found.</p>');
        return;
    }

    var html = '<h3 class="result-heading">Web Results</h3>';
    for (var i = 0; i < data.length; i++) {
        var title = escapeHtml(data[i].title);
        var link = escapeHtml(data[i].link);
        var snippet = data[i].snippet ? escapeHtml(data[i].snippet) : '';
        var isDir = data[i].link.endsWith('/');
        var emoji = isDir ? '📁' : '📄';
        html += '<div class="result-card">' +
            '<div class="result-title">' + emoji + ' <a href="' + link + '" target="_blank" rel="noopener">' + title + '</a></div>' +
            '<div class="result-url">' + link + '</div>' +
            (snippet ? '<div class="result-snippet">' + snippet + '</div>' : '') +
            '</div>';
    }
    container.html(html);
}

function displayTorrentResults(data) {
    var container = $("#torrentResults");
    container.empty();
    document.getElementById("madeWithBy").style.display = "none";

    if (!data || data.length === 0) {
        container.html('<p class="no-results">No torrent results found.</p>');
        return;
    }

    var html = '<h3 class="result-heading">Torrent Results</h3>';
    for (var i = 0; i < data.length; i++) {
        var title = escapeHtml(data[i].title);
        var link = escapeHtml(data[i].link);
        var seeds = data[i].seeders || '0';
        var leech = data[i].leechers || '0';
        var size = data[i].size || '';
        var hasMagnet = data[i].magnet;
        var isDir = link.endsWith('/');
        var emoji = hasMagnet ? '🧲' : (isDir ? '📁' : '📄');

        html += '<div class="result-card torrent-card">' +
            '<div class="result-title">' + emoji + ' <a href="' + link + '" target="_blank" rel="noopener">' + title + '</a></div>' +
            '<div class="torrent-meta">';
        if (size) html += '<span class="torrent-size">Size: ' + escapeHtml(size) + '</span>';
        if (seeds !== '0' || leech !== '0') {
            html += '<span class="torrent-seeds">Seeders: ' + escapeHtml(seeds) + '</span>' +
                    '<span class="torrent-leech">Leechers: ' + escapeHtml(leech) + '</span>';
        }
        html += '</div></div>';
    }
    container.html(html);
}

function toggleDarkMode() {
    var darkModeStyles = document.getElementById('darkModeStyles');
    var isDarkMode = darkModeStyles.href.includes('dark_mode.css');
    darkModeStyles.href = isDarkMode ? 'static/css/custom_styles.css' : 'static/css/dark_mode.css';
    toggleEmojis();
    var disclaimerText = document.getElementById('disclaimerText');
    if (isDarkMode) {
        disclaimerText.classList.remove('text-white');
    } else {
        disclaimerText.classList.add('text-white');
    }
}

function toggleEmojis() {
    var sun = document.querySelector('.sun');
    var moon = document.querySelector('.moon');
    var darkModeToggle = document.querySelector('.switch input');
    if (darkModeToggle.checked) {
        sun.style.display = 'none';
        moon.style.display = 'inline';
    } else {
        sun.style.display = 'inline';
        moon.style.display = 'none';
    }
}
