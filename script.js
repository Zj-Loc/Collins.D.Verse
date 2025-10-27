/* DJ Collombo final script
   - teddy drops (falling) with pool splash
   - rotating CD + DJ fade handled by CSS
   - slide-in music panel (vanish effect)
   - playlist: play after first user click
   - content shift around the music panel when open
   - promo placeholders are static; replace files later
*/

/* ---------- Canvas teddy drops + splash ---------- */
const canvas = document.getElementById('teddyCanvas');
const ctx = canvas.getContext('2d');

let W = canvas.width = window.innerWidth;
let H = canvas.height = window.innerHeight;
const poolH = Math.max( Math.round(H * 0.06), 50 ); // gold pool height
let teddies = [];
let splashes = [];
const MAX_TEDDIES = Math.min(120, Math.floor(W * 0.05));

function rand(min,max){ return Math.random()*(max-min)+min; }
function resize(){ W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
window.addEventListener('resize', resize);

class Teddy {
  constructor(init=false){
    this.reset(init);
  }
  reset(init=false){
    this.x = rand(0,W);
    this.y = init ? rand(-H, H*0.1) : rand(-500, -40);
    this.size = rand(12,36);
    this.vy = rand(0.6, 2.0);
    this.vx = rand(-0.45, 0.45);
    this.rot = rand(0, Math.PI*2);
    this.spin = rand(-0.02, 0.02);
    this.color = `rgba(255,215,0,${rand(0.7,0.98)})`;
  }
  update(){
    this.x += this.vx;
    this.y += this.vy;
    this.rot += this.spin;
    // hit pool
    if (this.y + this.size*0.5 >= H - poolH){
      this.splash();
      this.reset();
      this.y = rand(-240, -40);
    }
    // recycle horizontal overflow
    if (this.x < -100 || this.x > W + 100) this.reset();
  }
  splash(){
    const n = Math.max(3, Math.round(this.size/8));
    for (let i=0;i<n;i++){
      splashes.push({
        x: this.x + rand(-10,10),
        y: H - poolH + rand(-3,6),
        vx: rand(-1.4,1.4),
        vy: rand(-3.0,-0.6),
        life: rand(18,44),
        size: rand(2,6)
      });
    }
  }
  draw(){
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rot);
    ctx.fillStyle = this.color;
    // head
    ctx.beginPath();
    ctx.ellipse(0,0, this.size*0.5, this.size*0.5, 0, 0, Math.PI*2);
    ctx.fill();
    // ears
    ctx.beginPath();
    ctx.ellipse(-this.size*0.42, -this.size*0.42, this.size*0.22, this.size*0.22, 0, 0, Math.PI*2);
    ctx.ellipse(this.size*0.42, -this.size*0.42, this.size*0.22, this.size*0.22, 0, 0, Math.PI*2);
    ctx.fill();
    ctx.restore();
  }
}

function initTeddies(){
  teddies = [];
  for (let i=0;i<MAX_TEDDIES;i++) teddies.push(new Teddy(true));
}
initTeddies();

function updateSplashes(){
  for (let i = splashes.length-1; i >= 0; i--){
    const s = splashes[i];
    s.x += s.vx;
    s.y += s.vy;
    s.vy += 0.12; // gravity
    s.life--;
    if (s.life <= 0) splashes.splice(i,1);
  }
}
function drawSplashes(){
  splashes.forEach(s => {
    const alpha = Math.max(0, s.life / 44);
    ctx.beginPath();
    ctx.fillStyle = `rgba(255,215,0,${alpha})`;
    ctx.arc(s.x, s.y, s.size, 0, Math.PI*2);
    ctx.fill();
  });
}

function drawPool(){
  const y = H - poolH;
  const g = ctx.createLinearGradient(0,y,0,H);
  g.addColorStop(0, 'rgba(255,220,110,0.52)');
  g.addColorStop(0.6, 'rgba(255,200,0,0.28)');
  g.addColorStop(1, 'rgba(0,0,0,0.22)');
  ctx.fillStyle = g;
  ctx.fillRect(0, y, W, poolH);
  // top highlight
  ctx.fillStyle = 'rgba(255,245,200,0.08)';
  ctx.fillRect(0, y, W, 3);
}

function render(){
  ctx.clearRect(0,0,W,H);
  // subtle dark overlay for contrast
  ctx.fillStyle = 'rgba(0,0,0,0.05)';
  ctx.fillRect(0,0,W,H);

  // draw teddies
  for (let t of teddies){ t.update(); t.draw(); }

  // pool & splashes
  drawPool();
  updateSplashes();
  drawSplashes();

  requestAnimationFrame(render);
}
render();

/* ---------- Music player logic (slide-in, play after user press) ---------- */
const tracks = [
  { src: 'music/jid.mp3', title: 'Cannabeats 1 — Intro', artist: 'DJ Collombo' },
  { src: 'music/jid (1).mp3', title: 'Cannabeats 2 — Midnight Drive', artist: 'DJ Collombo' },
  { src: 'music/jid (2).mp3', title: 'Cannabeats 3 — Lovers Groove', artist: 'DJ Collombo' }
];

const audio = new Audio();
audio.preload = 'auto';
let current = 0;
let userInitiated = false;

const playBtn = document.getElementById('playBtn');
const pauseBtn = document.getElementById('pauseBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const playlistEl = document.getElementById('playlist');
const trackTitle = document.getElementById('trackTitle');
const trackArtist = document.getElementById('trackArtist');

function populatePlaylist(){
  playlistEl.innerHTML = '';
  tracks.forEach((t,i)=>{
    const li = document.createElement('li');
    li.textContent = t.title;
    li.addEventListener('click', ()=> {
      setTrack(i);
      if (!userInitiated){
        userInitiated = true;
        playBtn.click();
      }
    });
    playlistEl.appendChild(li);
  });
}
populatePlaylist();

function updateUI(){
  const lis = playlistEl.querySelectorAll('li');
  lis.forEach((li, idx) => li.classList.toggle('playing', idx === current));
  trackTitle.textContent = tracks[current].title;
  trackArtist.textContent = tracks[current].artist;
}

function setTrack(i){
  current = (i + tracks.length) % tracks.length;
  audio.src = tracks[current].src;
  audio.currentTime = 0;
  updateUI();
  if (userInitiated) audio.play();
}

playBtn.addEventListener('click', ()=> {
  userInitiated = true;
  if (!audio.src) audio.src = tracks[current].src;
  audio.play().catch(()=>{ /* autoplay blocked; user gesture required */});
  playBtn.classList.add('hidden');
  pauseBtn.classList.remove('hidden');
});
pauseBtn.addEventListener('click', ()=> {
  audio.pause();
  pauseBtn.classList.add('hidden');
  playBtn.classList.remove('hidden');
});
prevBtn.addEventListener('click', ()=> setTrack(current - 1));
nextBtn.addEventListener('click', ()=> setTrack(current + 1));
audio.addEventListener('ended', ()=> setTrack(current + 1));

setTrack(0);

/* ---------- Slide / vanish behavior & content wrap ---------- */
const mpanel = document.getElementById('musicPanel');
const mpToggle = document.getElementById('mpToggle');
const mainContent = document.getElementById('mainContent');
const body = document.body;

function openPanel(){
  mpanel.classList.add('open');
  // set page left offset to expanded
  document.documentElement.style.setProperty('--page-left-offset', '260px');
  mpToggle.textContent = '◀';
}
function closePanel(){
  mpanel.classList.remove('open');
  document.documentElement.style.setProperty('--page-left-offset', getComputedStyle(document.documentElement).getPropertyValue('--left-compact') || '80px');
  mpToggle.textContent = '▸';
}

// hover open/close (desktop)
mpanel.addEventListener('mouseenter', openPanel);
mpanel.addEventListener('mouseleave', closePanel);

// toggle by button (works on mobile)
mpToggle.addEventListener('click', () => {
  if (mpanel.classList.contains('open')) closePanel();
  else openPanel();
});

/* ---------- Scroll reveal ---------- */
const sections = document.querySelectorAll('section');
function reveal(){ sections.forEach(s => { const r=s.getBoundingClientRect(); if (r.top < window.innerHeight - 120){ s.style.opacity=1; s.style.transform='translateY(0)'; }});}
window.addEventListener('scroll', reveal);
window.addEventListener('load', reveal);

/* ---------- Cursor glow follow ---------- */
const cursor = document.querySelector('.cursor-glow');
document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
});

/* ---------- Hire button ripple ---------- */
document.querySelectorAll('.hire-btn').forEach(btn=>{
  btn.addEventListener('click', (ev)=>{
    const rect = btn.getBoundingClientRect();
    const circle = document.createElement('span');
    circle.style.position = 'absolute';
    circle.style.left = (ev.clientX - rect.left) + 'px';
    circle.style.top = (ev.clientY - rect.top) + 'px';
    circle.style.width = '12px';
    circle.style.height = '12px';
    circle.style.borderRadius = '50%';
    circle.style.background = 'rgba(255,215,0,0.18)';
    circle.style.transform = 'translate(-50%,-50%)';
    circle.style.pointerEvents = 'none';
    circle.style.zIndex = '5';
    circle.style.transition = 'width .6s ease, height .6s ease, opacity .6s ease';
    btn.appendChild(circle);
    requestAnimationFrame(()=> {
      circle.style.width = '420px';
      circle.style.height = '420px';
      circle.style.opacity = '0';
    });
    setTimeout(()=> circle.remove(), 700);
  });
});

/* reduce teddy count on small screens for perf */
if (window.innerWidth < 700) {
  teddies = teddies.slice(0, Math.max(12, Math.floor(MAX_TEDDIES/4)));
}
