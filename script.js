let player;
let isPlaying = false;

// ==========================================
// YOUR CUSTOM YOUTUBE PLAYLIST
// ==========================================
const PLAYLIST_ID = 'PLHK9W6IpLdBo';

// Load YouTube API
const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        playerVars: { 
            'playsinline': 1, 
            'controls': 0,
            'listType': 'playlist',
            'list': PLAYLIST_ID, 
            'loop': 1
        },
        events: {
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerStateChange(event) {
    // When a new song starts playing, grab its title from YouTube
    if (event.data === YT.PlayerState.PLAYING) {
        ensurePlayingState();
        let videoData = player.getVideoData();
        if (videoData && videoData.title) {
            document.getElementById('track-name').innerText = videoData.title;
            document.getElementById('track-artist').innerText = "Office Playlist Queue";
        }
    }
}

function togglePlay() {
    const playIcon = document.getElementById('play-icon');
    if (isPlaying) {
        player.pauseVideo();
        playIcon.classList.replace('fa-pause', 'fa-play');
    } else {
        player.playVideo(); 
        playIcon.classList.replace('fa-play', 'fa-pause');
    }
    isPlaying = !isPlaying;
}

// These commands talk directly to the YouTube Playlist queue
function nextVideo() {
    player.nextVideo();
}

function prevVideo() {
    player.previousVideo();
}

function ensurePlayingState() {
    if (!isPlaying) {
        isPlaying = true;
        document.getElementById('play-icon').classList.replace('fa-play', 'fa-pause');
    }
}
