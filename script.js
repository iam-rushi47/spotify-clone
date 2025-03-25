document.addEventListener("DOMContentLoaded", function () {
    const songs = document.querySelectorAll(".song");
    const audioPlayer = document.getElementById("audio-player");
    const favoriteList = document.getElementById("favorite-list");
    const prevButton = document.getElementById("prev");
    const nextButton = document.getElementById("next");
    let currentSongIndex = 0;
    let songArray = Array.from(songs);

    function playSong(index) {
        if (index >= 0 && index < songArray.length) {
            currentSongIndex = index;
            audioPlayer.src = songArray[currentSongIndex].getAttribute("data-song");
            audioPlayer.play();
        }
    }

    songs.forEach((song, index) => {
        song.addEventListener("click", function () {
            playSong(index);
        });

        song.addEventListener("dblclick", function () {
            let favoriteItem = document.createElement("li");
            favoriteItem.innerText = this.innerText;
            favoriteList.appendChild(favoriteItem);
        });
    });

    document.getElementById("search").addEventListener("input", function () {
        let filter = this.value.toLowerCase();
        songArray.forEach(song => {
            song.style.display = song.innerText.toLowerCase().includes(filter) ? "block" : "none";
        });
    });

    prevButton.addEventListener("click", function () {
        if (currentSongIndex > 0) {
            playSong(currentSongIndex - 1);
        }
    });

    nextButton.addEventListener("click", function () {
        if (currentSongIndex < songArray.length - 1) {
            playSong(currentSongIndex + 1);
        }
    });
});
///new code bellow
document.addEventListener("DOMContentLoaded", () => {
    const audioPlayer = document.getElementById("audio-player");
    const playButton = document.getElementById("play");
    const prevButton = document.getElementById("prev");
    const nextButton = document.getElementById("next");
    const songList = document.querySelectorAll(".song");
    const recentlyPlayed = document.getElementById("recently-played");
    const favoriteList = document.getElementById("favorite-list");
    const favButtons = document.querySelectorAll(".fav-btn");
    const searchInput = document.getElementById("search");

    let currentSongIndex = 0;
    let songs = [];

    // Load all songs into array
    songList.forEach((song, index) => {
        songs.push({
            element: song,
            src: song.getAttribute("data-song"),
            title: song.innerText.trim(),
            img: song.querySelector("img").src
        });

        song.addEventListener("click", () => {
            playSong(index);
        });
    });

    function playSong(index) {
        if (index < 0 || index >= songs.length) return;

        currentSongIndex = index;
        audioPlayer.src = songs[index].src;
        audioPlayer.play();
        playButton.innerText = "⏸ Pause";
        updateRecentlyPlayed(songs[index]);
    }

    playButton.addEventListener("click", () => {
        if (audioPlayer.paused) {
            audioPlayer.play();
            playButton.innerText = "⏸ Pause";
        } else {
            audioPlayer.pause();
            playButton.innerText = "▶ Play";
        }
    });

    nextButton.addEventListener("click", () => {
        playSong((currentSongIndex + 1) % songs.length);
    });

    prevButton.addEventListener("click", () => {
        playSong((currentSongIndex - 1 + songs.length) % songs.length);
    });

    function updateRecentlyPlayed(song) {
        let listItem = document.createElement("li");
        listItem.innerHTML = `<img src="${song.img}" class="small-song-img"> ${song.title}`;
        recentlyPlayed.prepend(listItem);
        if (recentlyPlayed.children.length > 5) {
            recentlyPlayed.removeChild(recentlyPlayed.lastChild);
        }
    }

    favButtons.forEach((button, index) => {
        button.addEventListener("click", (e) => {
            e.stopPropagation();
            let song = songs[index];
            let favItem = document.createElement("li");
            favItem.innerHTML = `<img src="${song.img}" class="small-song-img"> ${song.title}`;
            favoriteList.appendChild(favItem);
        });
    });

    searchInput.addEventListener("input", () => {
        let searchText = searchInput.value.toLowerCase();
        songList.forEach(song => {
            let title = song.innerText.toLowerCase();
            if (title.includes(searchText)) {
                song.style.display = "flex";
            } else {
                song.style.display = "none";
            }
        });
    });
});
