let player;
let isPlaying = false;

// Add the YouTube Video IDs of your choice here!
const playlist = [
    'jfKfPfyJRdk', // Lofi Beats
    '4xDzrrmg58k', // Synthwave
    'tgG2a4Q0bM4'  // Coffee Shop Jazz
];
let currentIndex = 0;

// Load the YouTube IFrame Player API
const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// Initialize player when API is ready
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        videoId: playlist[currentIndex],
        playerVars: {
            'playsinline': 1,
            'controls': 0 // Hides default YouTube controls
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    updateTrackInfo();
}

function onPlayerStateChange(event) {
    // Automatically play the next song when the current one finishes
    if (event.data === YT.PlayerState.ENDED) {
        nextVideo();
    }
}

// Control Playback
function togglePlay() {
    const playIcon = document.getElementById('play-icon');
    if (isPlaying) {
        player.pauseVideo();
        playIcon.classList.remove('fa-pause');
        playIcon.classList.add('fa-play');
    } else {
        player.playVideo();
        playIcon.classList.remove('fa-play');
        playIcon.classList.add('fa-pause');
    }
    isPlaying = !isPlaying;
}

function nextVideo() {
    currentIndex = (currentIndex + 1) % playlist.length;
    player.loadVideoById(playlist[currentIndex]);
    updateTrackInfo();
    ensurePlayingState();
}

function prevVideo() {
    currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    player.loadVideoById(playlist[currentIndex]);
    updateTrackInfo();
    ensurePlayingState();
}

function ensurePlayingState() {
    const playIcon = document.getElementById('play-icon');
    if (!isPlaying) {
        isPlaying = true;
        playIcon.classList.remove('fa-play');
        playIcon.classList.add('fa-pause');
    }
}

function updateTrackInfo() {
    document.getElementById('track-name').innerText = "Office Track " + (currentIndex + 1);
}
