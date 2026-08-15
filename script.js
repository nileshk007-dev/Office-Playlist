let player;
let isPlaying = false;
let updateTimer;

const PLAYLIST_ID = 'PLHK9W6IpLdBo';

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
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    // Tell YouTube to shuffle the playlist on startup
    player.setShuffle(true); 
    
    // Safely load the first song of the newly shuffled list
    setTimeout(() => {
        player.playVideoAt(0);
        player.pauseVideo(); 
    }, 1500);
}

function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.PLAYING) {
        ensurePlayingState();
        let videoData = player.getVideoData();
        if (videoData && videoData.title) {
            document.getElementById('track-name').innerText = videoData.title;
            document.getElementById('track-artist').innerText = "Office Playlist Queue";
        }
        
        let duration = player.getDuration();
        document.getElementById('seek-bar').max = duration;
        document.getElementById('total-time').innerText = formatTime(duration);
        
        clearInterval(updateTimer);
        updateTimer = setInterval(updateProgressBar, 1000);
        
        renderQueue();
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

document.getElementById('seek-bar').addEventListener('input', function() {
    let seekTo = this.value;
    player.seekTo(seekTo, true);
    document.getElementById('current-time').innerText = formatTime(seekTo);
});

// ==========================================
// Visual Queue & Real Song Title Fetching
// ==========================================
function toggleQueue() {
    const modal = document.getElementById('queue-modal');
    modal.classList.toggle('hidden');
    if (!modal.classList.contains('hidden')) {
        renderQueue();
    }
}

function renderQueue() {
    const queueList = document.getElementById('queue-list');
    queueList.innerHTML = '';
    
    if (!player || !player.getPlaylist) return;
    
    const playlist = player.getPlaylist();
    if (!playlist) return;
    
    const currentIndex = player.getPlaylistIndex();
    
    // Check if we already saved the titles in the browser memory
    let savedTitles = JSON.parse(localStorage.getItem('officePlaylistTitles') || '{}');
    
    playlist.forEach((id, index) => {
        let li = document.createElement('li');
        let isCurrent = (index === currentIndex);
        
        if (isCurrent) li.classList.add('active-track');
        
        // If we have the title saved, use it. If not, temporarily show "Loading..."
        let displayText = savedTitles[id] ? savedTitles[id] : "Loading Track " + (index + 1) + "...";
        li.innerText = (isCurrent ? "▶ " : "") + displayText;
        
        li.onclick = () => { 
            player.playVideoAt(index);
            ensurePlayingState();
            toggleQueue(); // Automatically close the queue when a song is clicked
        };
        
        queueList.appendChild(li);

        // If the title wasn't saved, fetch it in the background
        if (!savedTitles[id]) {
            fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${id}`)
                .then(response => response.json())
                .then(data => {
                    if (data.title) {
                        savedTitles[id] = data.title; // Save the real title
                        localStorage.setItem('officePlaylistTitles', JSON.stringify(savedTitles)); 
                        li.innerText = (isCurrent ? "▶ " : "") + data.title; // Update instantly
                    }
                })
                .catch(error => console.log("Could not fetch title"));
        }
    });
}

// Keyboard Shortcuts Logic
document.addEventListener('keydown', function(event) {
    if(event.target.tagName.toLowerCase() === 'input') return;

    switch(event.code) {
        case 'Space':
            event.preventDefault();
            togglePlay();
            break;
        case 'KeyN':
            nextVideo();
            break;
        case 'KeyP':
            prevVideo();
            break;
        case 'KeyQ':
            toggleQueue();
            break;
        case 'ArrowRight':
            if(player) player.seekTo(player.getCurrentTime() + 10, true);
            break;
        case 'ArrowLeft':
            if(player) player.seekTo(player.getCurrentTime() - 10, true);
            break;
    }
});
