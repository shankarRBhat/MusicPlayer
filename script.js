const trackCatalog = {
  'Shower': { title: 'Shower', artist: 'Becky G', file: 'Songs/Shower.mpeg' },
  'Struct': { title: 'Struct', artist: 'UdieNnx', file: 'Songs/Struct - Slowed.mpeg' },
  'Tiki Tiki': { title: 'Tiki Tiki', artist: 'QMIIR', file: 'Songs/Tiki Tiki - Slowed.mpeg' },
  'Unfinished': { title: 'Unfinished Hope', artist: 'Govind Vasantha', file: 'Songs/Unfinished Hope.mpeg' },
  'Safar': { title: 'Safar', artist: 'Bayaan', file: 'Songs/Safar.mpeg' },
  'O Sanam': { title: 'O Sanam', artist: 'Akhil Sachdeva', file: 'Songs/O Sanam.mpeg' },
  'Phir Se': { title: 'Phir Se', artist: 'Arijit Singh', file: 'Songs/Phir Se.mpeg' },
  'Luz Roja': { title: 'Luz Roja', artist: 'bxkq', file: 'Songs/Luz Roja.mpeg' },
  'Let me love you': { title: 'Let me love you', artist: 'Justin Bieber', file: 'Songs/Let me love you.mpeg' },
  'Mukil Varna': { title: 'Mukil Varna Mukunda', artist: 'Shweta Mohan', file: 'Songs/Mukil Varna Mukunda.mpeg' },
  'Duppatta': { title: 'Duppatta x Arz Kiya', artist: 'Justin Varghese', file: 'Songs/Duppatta x Arz Kiya.mpeg' },
  'Durandhar BGM': { title: 'Durandhar BGM', artist: 'Shashwat Sachdev', file: 'Songs/Durandhar BGM.mpeg' }
};

const playlists = {
  All: [
    'Shower',
    'Struct',
    'Tiki Tiki',
    'Unfinished',
    'Safar',
    'O Sanam',
    'Phir Se',
    'Luz Roja',
    'Let me love you',
    'Mukil Varna',
    'Duppatta',
    'Durandhar BGM'
  ],
  Bangers: ['Struct', 'Tiki Tiki', 'Luz Roja', 'Durandhar BGM'],
  'Feel Good': ['Mukil Varna', 'Phir Se', 'Unfinished', 'Duppatta'],
  Romantic: ['Safar', 'O Sanam', 'Let me love you', 'Shower']
};

const audio = document.getElementById('audio');
const titleEl = document.getElementById('song-title');
const artistEl = document.getElementById('song-artist');
const coverArt = document.getElementById('cover-art');
const playBtn = document.getElementById('play-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const currentTimeEl = document.getElementById('current-time');
const totalTimeEl = document.getElementById('total-time');
const progressBar = document.getElementById('progress-bar');
const volumeBar = document.getElementById('volume-bar');
const trackCounterEl = document.getElementById('track-counter');
const playlistListEl = document.getElementById('playlist-list');

let currentIndex = 0;
let isPlaying = false;
let isSeeking = false;
let queue = [...playlists.All];
let currentPlaylist = 'All';

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return '0:00';
  }

  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${String(secs).padStart(2, '0')}`;
}

function updateProgressFill() {
  const progress = Number(progressBar.value) || 0;
  progressBar.style.setProperty('--value', `${progress}%`);
}

function setPlayButtonState() {
  playBtn.textContent = isPlaying ? '❚❚' : '▶';
  playBtn.setAttribute('aria-label', isPlaying ? 'Pause' : 'Play');
}

function updateTrackCounter() {
  trackCounterEl.textContent = `${String(currentIndex + 1).padStart(2, '0')} / ${String(queue.length).padStart(2, '0')}`;
}

function updateCoverArt() {
  const coverMap = {
    All: 'Images/All.jpg',
    Bangers: 'Images/Banger.jpg',
    'Feel Good': 'Images/Feelgood.avif',
    Romantic: 'Images/Romantic.jpg'
  };

  coverArt.src = coverMap[currentPlaylist] || coverMap.All;
  coverArt.alt = `${currentPlaylist} album art`;
}

function getCurrentTrack() {
  if (!queue.length) return null;
  const currentKey = queue[currentIndex];
  return trackCatalog[currentKey] || null;
}

function renderPlaylists() {
  playlistListEl.innerHTML = '';

  Object.keys(playlists).forEach((playlistName) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'playlist-btn';
    button.textContent = playlistName;

    if (playlistName === currentPlaylist) {
      button.classList.add('active');
    }

    button.addEventListener('click', () => {
      currentPlaylist = playlistName;
      queue = [...playlists[playlistName]];
      currentIndex = 0;
      updateCoverArt();
      renderPlaylists();
      loadTrack(0, true);
    });

    playlistListEl.appendChild(button);
  });
}

function loadTrack(index, autostart = false) {
  if (!queue.length) return;

  currentIndex = (index + queue.length) % queue.length;
  const track = getCurrentTrack();
  if (!track) return;

  audio.src = track.file;
  titleEl.textContent = track.title;
  artistEl.textContent = track.artist;
  document.title = `${track.title} • ${track.artist}`;
  updateTrackCounter();

  progressBar.value = 0;
  updateProgressFill();
  currentTimeEl.textContent = '0:00';
  totalTimeEl.textContent = '0:00';
  updateCoverArt();

  audio.load();
  if (autostart || isPlaying) {
    const playback = audio.play();
    if (playback && playback.catch) {
      playback.catch(() => {});
    }
  }
}

function togglePlay() {
  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
}

function playNext() {
  loadTrack(currentIndex + 1, true);
}

function playPrevious() {
  loadTrack(currentIndex - 1, true);
}

function seekToPosition(value) {
  if (!Number.isFinite(audio.duration) || audio.duration <= 0) {
    return;
  }

  const newTime = Math.min((Number(value) / 100) * audio.duration, audio.duration);
  audio.currentTime = newTime;
  currentTimeEl.textContent = formatTime(newTime);
}

playBtn.addEventListener('click', togglePlay);
prevBtn.addEventListener('click', playPrevious);
nextBtn.addEventListener('click', playNext);

progressBar.addEventListener('pointerdown', () => {
  isSeeking = true;
  if (!Number.isFinite(audio.duration) || audio.duration <= 0) {
    return;
  }
  const value = Number(progressBar.value);
  const newTime = (value / 100) * audio.duration;
  audio.currentTime = newTime;
  currentTimeEl.textContent = formatTime(newTime);
});

progressBar.addEventListener('input', (event) => {
  const value = Number(event.target.value);
  updateProgressFill();

  if (!Number.isFinite(audio.duration) || audio.duration <= 0) {
    return;
  }

  const newTime = (value / 100) * audio.duration;
  audio.currentTime = newTime;
  currentTimeEl.textContent = formatTime(newTime);
});

progressBar.addEventListener('change', (event) => {
  isSeeking = false;
  seekToPosition(event.target.value);
});

progressBar.addEventListener('pointerup', () => {
  isSeeking = false;
});

audio.addEventListener('play', () => {
  isPlaying = true;
  setPlayButtonState();
});

audio.addEventListener('pause', () => {
  isPlaying = false;
  setPlayButtonState();
});

audio.addEventListener('loadedmetadata', () => {
  totalTimeEl.textContent = formatTime(audio.duration);
  updateProgressFill();
});

audio.addEventListener('timeupdate', () => {
  if (isSeeking || !Number.isFinite(audio.duration) || audio.duration <= 0) {
    return;
  }

  const value = (audio.currentTime / audio.duration) * 100 || 0;
  progressBar.value = value;
  updateProgressFill();
  currentTimeEl.textContent = formatTime(audio.currentTime);
  totalTimeEl.textContent = formatTime(audio.duration);
});

volumeBar.addEventListener('input', (event) => {
  audio.volume = Number(event.target.value);
});

audio.addEventListener('ended', () => {
  loadTrack(currentIndex + 1, true);
});

audio.volume = Number(volumeBar.value);
renderPlaylists();
updateCoverArt();
loadTrack(0, false);
setPlayButtonState();
