function search() {
    // Get the search term
    var searchTerm = document.getElementById("searchTerm").value.trim();

    // Check if the search term is empty
    if (searchTerm === "") {
        // Display an error message or handle it as needed
        alert("Please Enter Search Keyword.");
        return;
    }

    // Show the loading animation
    var loadingAnimation = document.getElementById('loadingAnimation');
    loadingAnimation.style.display = 'block';

    // Hide the disclaimer after the search button is clicked
    document.getElementById('disclaimerContainer').style.display = 'none';

    // Web search via DuckDuckGo (no API key needed)
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

    // Torrent search logic using AJAX
    $.ajax({
        url: '/torrent_search',
        method: 'POST',
        data: { searchTerm: searchTerm },
        success: function(torrentData) {
            // Handle torrent search results and update the UI
            displayTorrentResults(torrentData);

            // Hide the loading animation after the search is complete
            loadingAnimation.style.display = 'none';
        },
        error: function(error) {
            console.error('Error:', error);

            // Hide the loading animation in case of an error
            loadingAnimation.style.display = 'none';
        }
    });
}


function displayResults(data) {
    var resultsContainer = $("#searchResults");
    resultsContainer.empty();
    document.getElementById("madeWithBy").style.display = "none";

    if (data && data.length > 0) {
        for (var i = 0; i < data.length; i++) {
            var title = data[i].title;
            var link = data[i].link;
            var isDirectory = link.endsWith('/');
            var emoji = isDirectory ? '📁' : '📄';
            resultsContainer.append('<p>' + emoji + ' <strong style="display: block; word-wrap: break-word;">' + title + '</strong><a href="' + link + '" target="_blank">View Details</a></p>');
        }
    } else {
        resultsContainer.append('<p>No results found.</p>');
    }
}


function displayTorrentResults(torrentData) {
    var torrentResultsContainer = $("#torrentResults");
    torrentResultsContainer.empty();
        // Hide the "MADE WITH ❤️ BY SIDINSEARCH" paragraph
        document.getElementById("madeWithBy").style.display = "none";

    if (torrentData) {
        for (var i = 0; i < torrentData.length; i++) {
            var title = torrentData[i].title;
            var link = torrentData[i].link;

            // Determine if the link is likely a file or directory
            var isDirectory = link.endsWith('/');

            // Emoji for file or directory
            var emoji = isDirectory ? '🧲' : '📄';

            // Append result to the container with emoji and link opening in a new tab
            torrentResultsContainer.append('<p>' + emoji + ' <strong>' + title + '</strong><br><a href="' + link + '" target="_blank">' + link + '</a></p>');
        }
    } else {
        torrentResultsContainer.append('<p>No torrent results found.</p>');
    }
}

function toggleDarkMode() {
    var darkModeStyles = document.getElementById('darkModeStyles');
    var isDarkMode = darkModeStyles.href.includes('dark_mode.css');

    // Toggle between dark mode and custom styles
    darkModeStyles.href = isDarkMode ? 'static/css/custom_styles.css' : 'static/css/dark_mode.css';

    // Toggle emojis based on dark mode
    toggleEmojis();

    // Get the disclaimer text span
    var disclaimerText = document.getElementById('disclaimerText');

    // Toggle the text-white class based on dark mode
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