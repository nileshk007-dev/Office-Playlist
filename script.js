@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&display=swap');

body, html {
    margin: 0; padding: 0; height: 100vh;
    font-family: 'Inter', sans-serif;
    color: #ffffff;
    display: flex; flex-direction: column;
    overflow: hidden;
}

/* COOL ANIMATED BACKGROUND */
.background-overlay {
    position: absolute;
    top: 0; left: 0; width: 100%; height: 100%;
    /* Sleek dark blue/purple office gradient */
    background: linear-gradient(-45deg, #0f2027, #203a43, #2c5364, #1a2a6c);
    background-size: 400% 400%;
    animation: gradientBG 15s ease infinite;
    z-index: -1;
}

@keyframes gradientBG {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}

.top-bar { display: flex; justify-content: space-between; padding: 20px 40px; }
.logo-area { display: flex; align-items: center; gap: 15px; }
.logo-icon {
    background: rgba(255,255,255,0.1); backdrop-filter: blur(10px);
    width: 45px; height: 45px; border-radius: 8px;
    display: flex; justify-content: center; align-items: center; font-size: 1.2rem;
}
.logo-text h2 { margin: 0; font-size: 1.2rem; font-weight: 600; }
.logo-text p { margin: 0; font-size: 0.75rem; color: #a8b2d1; letter-spacing: 2px; }

.center-content { flex-grow: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.main-title { font-size: 6rem; font-weight: 300; margin: 0; letter-spacing: -2px; text-shadow: 0 10px 20px rgba(0,0,0,0.3); }
.subtitle { color: #a8b2d1; font-size: 1.2rem; margin-top: 10px; }

.hidden-player { height: 1px; width: 1px; opacity: 0; position: absolute; pointer-events: none; }

/* BOTTOM PLAYER */
.player-container { padding: 0 40px 30px 40px; }
.player-bar {
    display: flex; align-items: center; justify-content: space-between;
    background: rgba(15, 23, 42, 0.7); backdrop-filter: blur(20px);
    border: 1px solid rgba(255,255,255,0.1); border-radius: 12px;
    padding: 15px 25px; max-width: 600px; margin: 0 auto;
}
.now-playing { width: 50%; }
.song-details h4 { margin: 0; font-size: 1rem; }
.song-details p { margin: 0; font-size: 0.8rem; color: #a8b2d1; }
.player-controls { display: flex; justify-content: flex-end; width: 50%; }
.buttons { display: flex; gap: 20px; align-items: center; }
.buttons button { background: none; border: none; color: #fff; font-size: 1.2rem; cursor: pointer; opacity: 0.7; transition: 0.2s; }
.buttons button:hover { opacity: 1; }
.buttons .play-btn { 
    background: #fff; color: #0f172a; 
    width: 45px; height: 45px; border-radius: 50%; 
    display: flex; justify-content: center; align-items: center; opacity: 1;
}
