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
    player.setShuffle(true); 
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
        
        // Only update the queue UI if the modal is currently open to save resources
        if (!document.getElementById('queue-modal').classList.contains('hidden')) {
            renderQueue();
        }
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
// PERFORMANCE FIX: Background Fetch Queue
// ==========================================
let fetchQueue = [];
let isFetching = false;

function processFetchQueue() {
    // If nothing to fetch or already fetching, stop
    if (fetchQueue.length === 0 || isFetching) return;
    
    isFetching = true;
    let id = fetchQueue.shift(); // Take the first ID in line
    
    fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${id}`)
        .then(response => response.json())
        .then(data => {
            if (data.title) {
                let savedTitles = JSON.parse(localStorage.getItem('officePlaylistTitles') || '{}');
                savedTitles[id] = data.title; 
                localStorage.setItem('officePlaylistTitles', JSON.stringify(savedTitles)); 
                
                // Gently update the text on the screen if the queue is open
                let li = document.getElementById('track-' + id);
                if (li) {
                    let isCurrent = li.classList.contains('active-track');
                    li.innerText = (isCurrent ? "▶ " : "") + data.title; 
                }
            }
        })
        .catch(error => console.log("Skipped fetching track"))
        .finally(() => {
            isFetching = false;
            // Wait 300 milliseconds before fetching the next song to prevent browser freezing
            setTimeout(processFetchQueue, 300); 
        });
}

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
    let savedTitles = JSON.parse(localStorage.getItem('officePlaylistTitles') || '{}');
    
    playlist.forEach((id, index) => {
        let li = document.createElement('li');
        li.id = 'track-' + id; // Assign an ID so the background fetcher can find it
        let isCurrent = (index === currentIndex);
        
        if (isCurrent) li.classList.add('active-track');
        
        let displayText = savedTitles[id] ? savedTitles[id] : "Loading Track " + (index + 1) + "...";
        li.innerText = (isCurrent ? "▶ " : "") + displayText;
        
        li.onclick = () => { 
            player.playVideoAt(index);
            ensurePlayingState();
            toggleQueue(); 
        };
        
        queueList.appendChild(li);

        // If the title isn't saved, add it to the background line instead of fetching immediately
        if (!savedTitles[id] && !fetchQueue.includes(id)) {
            fetchQueue.push(id);
        }
    });

    // Start the slow, safe fetching process
    processFetchQueue();
}

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
