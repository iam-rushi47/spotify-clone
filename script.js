document.addEventListener("DOMContentLoaded", function () {
    // Ensure there's only ONE Now Playing display
    let nowPlaying = document.getElementById("now-playing");
    if (!nowPlaying) {
        nowPlaying = document.createElement("div");
        nowPlaying.id = "now-playing";
        nowPlaying.style.textAlign = "center";
        nowPlaying.style.marginBottom = "10px";
        nowPlaying.style.color = "white";
        document.getElementById("player-controls").prepend(nowPlaying);
    }

    // Get elements
    const audioPlayer = document.getElementById("audio-player");
    const playButton = document.getElementById("play");
    const prevButton = document.getElementById("prev");
    const nextButton = document.getElementById("next");
    const songList = document.querySelectorAll(".song");
    const recentlyPlayed = document.getElementById("recently-played");
    const favoriteList = document.getElementById("favorite-list");
    const favButtons = document.querySelectorAll(".fav-btn");
    const searchInput = document.getElementById("search");

    let currentSongIndex = -1; // Ensure no song is selected at first
    let songs = [];

    // Load songs into an array
    songList.forEach((song, index) => {
        let songData = {
            element: song,
            src: song.getAttribute("data-song"),
            title: song.innerText.trim(),
            img: song.querySelector("img") ? song.querySelector("img").src : ""
        };
        songs.push(songData);

        // Play song on click
        song.addEventListener("click", () => {
            playSong(index);
        });
    });

    function playSong(index) {
        if (index < 0 || index >= songs.length) return;

        if (currentSongIndex === index && !audioPlayer.paused) {
            audioPlayer.pause();
            playButton.innerText = "▶ Play";
            return;
        }

        currentSongIndex = index;
        const selectedSong = songs[index];

        audioPlayer.src = selectedSong.src;
        audioPlayer.play();
        playButton.innerText = "⏸ Pause";
        updateNowPlaying(selectedSong.title); // ✅ Ensures only one update
        updateRecentlyPlayed(selectedSong);
    }

    function updateNowPlaying(songName) {
        nowPlaying.innerText = `Now Playing: ${songName}`;
    }

    function updateRecentlyPlayed(song) {
        // Avoid duplicate entries
        if ([...recentlyPlayed.children].some(item => item.innerText.includes(song.title))) return;

        let listItem = document.createElement("li");
        listItem.innerHTML = `<img src="${song.img}" class="small-song-img"> ${song.title}`;
        recentlyPlayed.prepend(listItem);

        // Keep max 5 recently played songs
        if (recentlyPlayed.children.length > 5) {
            recentlyPlayed.removeChild(recentlyPlayed.lastChild);
        }
    }

    playButton.addEventListener("click", () => {
        if (audioPlayer.paused && currentSongIndex !== -1) {
            audioPlayer.play();
            playButton.innerText = "⏸ Pause";
        } else {
            audioPlayer.pause();
            playButton.innerText = "▶ Play";
        }
    });

    nextButton.addEventListener("click", () => {
        if (currentSongIndex === -1) return; // Prevent errors if no song is selected
        playSong((currentSongIndex + 1) % songs.length);
    });

    prevButton.addEventListener("click", () => {
        if (currentSongIndex === -1) return;
        playSong((currentSongIndex - 1 + songs.length) % songs.length);
    });

    favButtons.forEach((button, index) => {
        button.addEventListener("click", (e) => {
            e.stopPropagation();
            let song = songs[index];

            // Avoid duplicate favorites
            if ([...favoriteList.children].some(item => item.innerText.includes(song.title))) return;

            let favItem = document.createElement("li");
            favItem.innerHTML = `<img src="${song.img}" class="small-song-img"> ${song.title}`;
            favoriteList.appendChild(favItem);
        });
    });

    searchInput.addEventListener("input", () => {
        let searchText = searchInput.value.toLowerCase();
        songList.forEach(song => {
            let title = song.innerText.toLowerCase();
            song.style.display = title.includes(searchText) ? "flex" : "none";
        });
    });

    // User Login Handling
    let username = localStorage.getItem("loggedInUser");
    let userSection = document.getElementById("user-section");
    let userIcon = document.getElementById("user-icon");
    let logoutBtn = document.getElementById("logout-btn");
    let loginLink = document.getElementById("login-link");

    if (username) {
        let initials = username.charAt(0).toUpperCase();
        userIcon.textContent = initials;
        userSection.style.display = "flex";
        loginLink.style.display = "none";
    } else {
        userSection.style.display = "none";
    }

    logoutBtn.addEventListener("click", function () {
        localStorage.removeItem("loggedInUser");
        window.location.href = "login.html";
    });
});
