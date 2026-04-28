/* =========================
   WELCOME MODAL
========================= */
window.onload = function () {
  document.getElementById("welcomeModal").style.display = "flex";
};

function enterLounge() {
  document.getElementById("welcomeModal").style.display = "none";
}

/* =========================
   MUSIC PLAYER MODAL
========================= */

const audioPlayer = document.getElementById("audioPlayer");
const playerModal = document.getElementById("playerModal");
const trackTitle = document.getElementById("trackTitle");
const trackGenre = document.getElementById("trackGenre");
const playerThumbnail = document.getElementById("playerThumbnail");

const tracks = [
  {
    src: "Diss_mix.mp3",
    title: "Night Vibes Mix",
    genre: "HipHop House",
    image: "images/thumb1.png"
  },
  {
    src: "Chill_mix.mp3",
    title: "Club Heat",
    genre: "Kenyan Lounge Bangers",
    image: "images/thumb2.png"
  },
  {
    src: "mix1.mp3",
    title: "Gym Mode Vibes",
    genre: "Workout House",
    image: "images/thumb.jpg"
  },
  {
    src: "jid.mp3",
    title: "Earthgang",
    genre: "HipHop House",
    image: "images/thumb3.jpg"
  },
  {
    src: "jid (2).mp3",
    title: "Boost Vibes",
    genre: "Gangstar House",
    image: "images/thumb4.jpg"
  },
  {
    src: "epic_dawn.mp3",
    title: "Zone In Beats",
    genre: "Epic House",
    image: "images/epic.jpg"
  },
  {
    src: "siaka.mp3",
    title: "Kenyan Bangers",
    genre: "Party House",
    image: "images/duffy.jpg"
  },
  {
    src: "heathens.mp3",
    title: "Tavern Vibes",
    genre: "Villain House",
    image: "images/heathen.jpg"
  },
  {
    src: "doba.mp3",
    title: "Nightmare Vibes",
    genre: "HipHop House",
    image: "images/thumb5.jpg"
  }
];

let currentSong = 0;

function loadSong(index){
  currentSong = index;
  audioPlayer.src = "music/" + tracks[index].src;
  trackTitle.innerText = tracks[index].title;
  trackGenre.innerText = tracks[index].genre;
  playerThumbnail.src = tracks[index].image;
}

function openPlayer(index){
  if(index < 0 || index >= tracks.length) return;

  playerModal.style.display = "flex";
  loadSong(index);

  audioPlayer.play().catch(() => {
    console.log("Autoplay blocked until user interacts.");
  });
}

function closePlayer(){
  playerModal.style.display = "none";
  audioPlayer.pause();
}
function closePlayer(){
  playerModal.style.display = "none";
  miniPlayer.style.display = "none";
  audioPlayer.pause();
  bgVisualizer.classList.remove("active");
}

function togglePlay(){
  if(audioPlayer.paused){
    audioPlayer.play();
    bgVisualizer.classList.add("active");
  } else {
    audioPlayer.pause();
    bgVisualizer.classList.remove("active");
  }
}

function nextSong(){
  currentSong = (currentSong + 1) % tracks.length;
  loadSong(currentSong);
  audioPlayer.play();
}

function prevSong(){
  currentSong = (currentSong - 1 + tracks.length) % tracks.length;
  loadSong(currentSong);
  audioPlayer.play();
}

audioPlayer.addEventListener("ended", nextSong);

window.onclick = function(e){
  if(e.target === playerModal){
    closePlayer();
  }
};
/* =========================
   THEME SWITCHER
========================= */

function setTheme(theme) {
  const body = document.body;

  if (theme === "gold") {
    body.style.background = "#050505";
    document.documentElement.style.setProperty("--accent", "#d4af37");
  }

  if (theme === "blue") {
    body.style.background = "#050816";
    document.documentElement.style.setProperty("--accent", "#00c3ff");
  }

  if (theme === "white") {
    body.style.background = "#f5f5f5";
    body.style.color = "#111";
  }

  if (theme === "purple") {
    body.style.background = "#120018";
    document.documentElement.style.setProperty("--accent", "#b300ff");
  }
}

/* =========================
   OPTIONAL: AUTO PLAY EXPERIENCE
========================= */

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    closePlayer();
    document.getElementById("welcomeModal").style.display = "none";
  }
});
function toggleThemeMenu() {
    const menu = document.getElementById("themeMenu");

    if (menu.style.display === "flex") {
        menu.style.display = "none";
    } else {
        menu.style.display = "flex";
    }
}
/* SLIDER */
const slides = document.getElementById("slides");
const slider = document.getElementById("discoverSlider");

const backgrounds = [
  "url('images/slide-bg.png')",
  "url('images/slide-bg2.png')",
  "url('images/slide-bg3.png')"
];

let slideIndex = 0;

function changeSlide() {
  slideIndex = (slideIndex + 1) % 3;

  slides.style.transform = `translateX(-${slideIndex * 100}%)`;

  slider.style.backgroundImage = backgrounds[slideIndex];
}

// set initial background
slider.style.backgroundImage = backgrounds[0];

setInterval(changeSlide, 4000);
/*Miniplayer*/
const miniPlayer = document.getElementById("miniPlayer");
const miniTrackTitle = document.getElementById("miniTrackTitle");
const bgVisualizer = document.getElementById("bgVisualizer");

function minimizePlayer(){
  playerModal.style.display = "none";
  miniPlayer.style.display = "block";
  miniTrackTitle.innerText = tracks[currentSong].title;
  bgVisualizer.classList.add("active");
}

function restorePlayer(){
  playerModal.style.display = "flex";
  miniPlayer.style.display = "none";
}
