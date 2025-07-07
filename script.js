const songs = [
  { 
    name: "Gurasai-Fulyo Banaima", 
    artist: "1974 AD",
    album: "Nepali Hits",
    duration: "3:45",
    cover: "cover1.jpg",
    path: "musics/Gurasai_Fulyo_Banaima__गुराँसै_फुल्यो_वनैमा____1974_AD___Lyrical_Video_With_Guitar_Chords(128k).mp3" 
  },
  { 
    name: "Mercedez-Benz", 
    artist: "CowWeb",
    album: "Tuborg Sessions",
    duration: "4:12",
    cover: "cover2.jpg",
    path: "musics/Mercedes_Benz_-_Cobweb___Tuborg_Open_Sessions(128k).mp3" 
  },
  { 
    name: "Saiyaan", 
    artist: "Kailash Kher",
    album: "Jhoomo Re",
    duration: "5:20",
    cover: "cover3.jpg",
    path: "musics/Saiyyan_-_Kailash_Kher__Paresh_Kamath__Naresh_Kamath___Jhoomo_Re(128k).mp3" 
  },
  {
    name: "Sajni",
    artist: "Arijit Singh, Ram Sampath",
    album: "Laapataa Ladies",
    duration: "3:30",
    cover: "cover4.jpg",
    path: "musics/Sajni__Song___Arijit_Singh,_Ram_Sampath___Laapataa_Ladies____Aamir_Khan_Productions(256k).mp3" 
  },
  {
    name: "Aalas Ka Pedh",
    artist: "The Local Train",
    album: "Choo Lo",
    duration: "4:45",
    cover: "cover5.jpg",
    path: "musics/The_Local_Train_-_Aalas_Ka_Pedh_-_Choo_Lo__Official_Audio_(128k).mp3" 
  }
];

// DOM Elements
const songListElement = document.getElementById("song-list");
const recentTracksElement = document.getElementById("recent-tracks");
const currentSongTitle = document.getElementById("current-song-title");
const currentSongArtist = document.getElementById("current-song-artist");
const currentSongCover = document.getElementById("current-song-cover");
const playPauseBtn = document.querySelector('.playpause');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
const shuffleBtn = document.querySelector('.shuffle');
const repeatBtn = document.querySelector('.repeat');
const progressBar = document.querySelector('.progress-bar');
const progress = document.querySelector('.progress');
const currentTimeElement = document.querySelector('.time-current');
const totalTimeElement = document.querySelector('.time-total');
const volumeBar = document.querySelector('.volume-bar');
const volumeLevel = document.querySelector('.volume-level');

// Audio player
const audio = new Audio();
let currentSongIndex = 0;
let isPlaying = false;
let isShuffle = false;
let isRepeat = false;

// Initialize the player
function initPlayer() {
  // Load songs into the playlist
  renderSongList();
  renderRecentTracks();
  
  // Set up event listeners
  setupEventListeners();
  
  // Load the first song
  loadSong(currentSongIndex);
}

// Render song list in the left sidebar
function renderSongList() {
  songListElement.innerHTML = '';
  
  songs.forEach((song, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${song.name}</span>
      <span class="text-grey text-small">${song.artist}</span>
    `;
    li.addEventListener('click', () => playSong(index));
    songListElement.appendChild(li);
  });
}

// Render recent tracks in the main content
function renderRecentTracks() {
  recentTracksElement.innerHTML = '';
  
  songs.forEach((song, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>
        <div class="flex align-center gap-10">
          <img src="${song.cover}" alt="${song.name}" width="40" height="40">
          <div>
            <div class="song-title">${song.name}</div>
            <div class="song-artist">${song.artist}</div>
          </div>
        </div>
      </td>
      <td>${song.album}</td>
      <td>2 days ago</td>
      <td>${song.duration}</td>
    `;
    tr.addEventListener('click', () => playSong(index));
    recentTracksElement.appendChild(tr);
  });
}

// Set up event listeners
function setupEventListeners() {
  // Play/Pause button
  playPauseBtn.addEventListener('click', togglePlay);
  
  // Previous button
  prevBtn.addEventListener('click', playPreviousSong);
  
  // Next button
  nextBtn.addEventListener('click', playNextSong);
  
  // Shuffle button
  shuffleBtn.addEventListener('click', toggleShuffle);
  
  // Repeat button
  repeatBtn.addEventListener('click', toggleRepeat);
  
  // Progress bar click
  progressBar.addEventListener('click', (e) => {
    const clickPosition = e.clientX - progressBar.getBoundingClientRect().left;
    const progressBarWidth = progressBar.clientWidth;
    const percentageClicked = clickPosition / progressBarWidth;
    const seekTime = percentageClicked * audio.duration;
    
    audio.currentTime = seekTime;
    updateProgressBar();
  });
  
  // Volume bar click
  volumeBar.addEventListener('click', (e) => {
    const clickPosition = e.clientX - volumeBar.getBoundingClientRect().left;
    const volumeBarWidth = volumeBar.clientWidth;
    const volumeLevel = clickPosition / volumeBarWidth;
    
    setVolume(volumeLevel);
  });
  
  // Audio time update
  audio.addEventListener('timeupdate', updateProgressBar);
  
  // Song ended
  audio.addEventListener('ended', handleSongEnded);
  
  // Volume change
  audio.addEventListener('volumechange', updateVolumeBar);
}

// Load a song
function loadSong(index) {
  const song = songs[index];
  
  audio.src = song.path;
  currentSongTitle.textContent = song.name;
  currentSongArtist.textContent = song.artist;
  currentSongCover.src = song.cover;
  totalTimeElement.textContent = song.duration;
  
  // Highlight the current song in both lists
  highlightCurrentSong(index);
  
  // If player was playing, continue playing
  if (isPlaying) {
    audio.play();
  }
}

// Play a song
function playSong(index) {
  // If same song is clicked and already playing, just toggle play/pause
  if (index === currentSongIndex && isPlaying) {
    togglePlay();
    return;
  }
  
  currentSongIndex = index;
  loadSong(index);
  play();
}

// Play the current song
function play() {
  audio.play();
  isPlaying = true;
  updatePlayPauseButton();
}

// Pause the current song
function pause() {
  audio.pause();
  isPlaying = false;
  updatePlayPauseButton();
}

// Toggle play/pause
function togglePlay() {
  if (isPlaying) {
    pause();
  } else {
    play();
  }
}

// ... (previous code remains the same until the togglePlay function)

// Play previous song
function playPreviousSong() {
  currentSongIndex--;
  if (currentSongIndex < 0) {
    currentSongIndex = songs.length - 1;
  }
  loadSong(currentSongIndex);
  if (isPlaying) {
    play();
  }
}

// Play next song
function playNextSong() {
  if (isShuffle) {
    playRandomSong();
  } else {
    currentSongIndex++;
    if (currentSongIndex >= songs.length) {
      currentSongIndex = 0;
    }
    loadSong(currentSongIndex);
  }
  if (isPlaying) {
    play();
  }
}

// Play random song (for shuffle)
function playRandomSong() {
  let newIndex;
  do {
    newIndex = Math.floor(Math.random() * songs.length);
  } while (newIndex === currentSongIndex && songs.length > 1);
  
  currentSongIndex = newIndex;
  loadSong(currentSongIndex);
}

// Toggle shuffle
function toggleShuffle() {
  isShuffle = !isShuffle;
  shuffleBtn.classList.toggle('active', isShuffle);
}

// Toggle repeat
function toggleRepeat() {
  isRepeat = !isRepeat;
  repeatBtn.classList.toggle('active', isRepeat);
}

// Handle song ended
function handleSongEnded() {
  if (isRepeat) {
    audio.currentTime = 0;
    audio.play();
  } else {
    playNextSong();
  }
}

// Update progress bar
function updateProgressBar() {
  const currentTime = audio.currentTime;
  const duration = audio.duration || 1; // Avoid division by zero
  
  const progressPercent = (currentTime / duration) * 100;
  progress.style.width = `${progressPercent}%`;
  
  // Update time display
  currentTimeElement.textContent = formatTime(currentTime);
  totalTimeElement.textContent = formatTime(duration);
}

// Format time (seconds to MM:SS)
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

// Set volume
function setVolume(volume) {
  audio.volume = volume;
  volumeLevel.style.width = `${volume * 100}%`;
}

// Update volume bar
function updateVolumeBar() {
  const volume = audio.volume;
  volumeLevel.style.width = `${volume * 100}%`;
}

// Highlight current song in both lists
function highlightCurrentSong(index) {
  // Remove active class from all songs
  document.querySelectorAll('#song-list li, #recent-tracks tr').forEach(el => {
    el.classList.remove('active');
  });
  
  // Add active class to current song
  if (songListElement.children[index]) {
    songListElement.children[index].classList.add('active');
  }
  
  if (recentTracksElement.children[index]) {
    recentTracksElement.children[index].classList.add('active');
  }
}

// Update play/pause button
function updatePlayPauseButton() {
  const icon = playPauseBtn.querySelector('i');
  if (isPlaying) {
    icon.classList.replace('fa-play', 'fa-pause');
    playPauseBtn.style.transform = 'scale(1.05)';
  } else {
    icon.classList.replace('fa-pause', 'fa-play');
    playPauseBtn.style.transform = 'scale(1)';
  }
}

// Initialize the player when DOM is loaded
document.addEventListener('DOMContentLoaded', initPlayer);

// Set default volume
audio.volume = 0.7;
volumeLevel.style.width = '70%';