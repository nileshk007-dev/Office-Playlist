let player;
let isPlaying = false;
let updateTimer;

// YOUR CUSTOM YOUTUBE PLAYLIST
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
    if (event.data === YT.PlayerState.PLAYING) {
        ensurePlayingState();
        let videoData = player.getVideoData();
        if (videoData && videoData.title) {
            document.getElementById('track-name').innerText = videoData.title;
            document.getElementById('track-artist').innerText = "Office Playlist Queue";
        }
        
        // Setup the progress bar maximum length and start the timer
        let duration = player.getDuration();
        document.getElementById('seek-bar').max = duration;
        document.getElementById('total-time').innerText = formatTime(duration);
        
        clearInterval(updateTimer);
        updateTimer = setInterval(updateProgressBar, 1000);
    } else {
        clearInterval(updateTimer);
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

function nextVideo() { player.nextVideo(); }
function prevVideo() { player.previousVideo(); }

function ensurePlayingState() {
    if (!isPlaying) {
        isPlaying = true;
        document.getElementById('play-icon').classList.replace('fa-play', 'fa-pause');
    }
}

// Progress Bar & Time Logic
function updateProgressBar() {
    if (player && isPlaying) {
        let currentTime = player.getCurrentTime();
        document.getElementById('seek-bar').value = currentTime;
        document.getElementById('current-time').innerText = formatTime(currentTime);
    }
}

function formatTime(timeInSeconds) {
    let minutes = Math.floor(timeInSeconds / 60);
    let seconds = Math.floor(timeInSeconds % 60);
    return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
}

// Skip when the user drags the slider
document.getElementById('seek-bar').addEventListener('input', function() {
    let seekTo = this.value;
    player.seekTo(seekTo, true);
    document.getElementById('current-time').innerText = formatTime(seekTo);
});

// Keyboard Shortcuts Logic
document.addEventListener('keydown', function(event) {
    // Make sure we aren't typing inside an input field
    if(event.target.tagName.toLowerCase() === 'input') return;

    switch(event.code) {
        case 'Space':
            event.preventDefault(); // Prevents the page from scrolling down
            togglePlay();
            break;
        case 'KeyN':
            nextVideo();
            break;
        case 'KeyP':
            prevVideo();
            break;
        case 'ArrowRight':
            if(player) player.seekTo(player.getCurrentTime() + 10, true);
            break;
        case 'ArrowLeft':
            if(player) player.seekTo(player.getCurrentTime() - 10, true);
            break;
    }
});
