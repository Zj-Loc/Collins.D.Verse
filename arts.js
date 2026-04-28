const feed = document.getElementById("feed");

let posts = [
  {src:"images/meme1.jpg", category:"memes", type:"img"},
  {src:"images/art1.jpg", category:"art", type:"img"},
  {src:"images/ai1.jpg", category:"ai", type:"img"},
  {src:"videos/video1.mp4", category:"art", type:"video"},
  {src:"images/worship1.jpg", category:"worship", type:"img"},
  {src:"images/graffiti1.jpg", category:"graffiti", type:"img"},
  {src:"images/logo1.png", category:"logos", type:"img"},
  {src:"images/wall1.jpg", category:"wallpapers", type:"img"},
  {src:"images/nature.jpg", category:"nature", type:"img"},
  {src:"images/motivation1.jpg", category:"motivational", type:"img"},
  {src:"images/fashion.jpg", category:"clothes", type:"img"},
  {src:"images/motivation.jpg", category:"motivational", type:"img"},
  {src:"images/lamborghini.jpg", category:"cars", type:"img"},
  {src:"images/worship.jpg", category:"worship", type:"img"},
  {src:"images/fashion3.jpg", category:"clothes", type:"img"},
  {src:"images/wall2.jpg", category:"wallpapers", type:"img"},
  {src:"images/web-standard.jpg", category:"art", type:"img"},
  {src:"images/nature1.jpg", category:"nature", type:"img"},
  {src:"images/music1.jpg", category:"graffiti", type:"img"},
  {src:"images/prologo.png", category:"logos", type:"img"},
  {src:"images/worship4.jpg", category:"worship", type:"img"},
  {src:"images/wall3.jpg", category:"wallpapers", type:"img"},
  {src:"images/graffiti2.jpg", category:"graffiti", type:"img"},
  {src:"images/ai3.jpg", category:"ai", type:"img"},
  {src:"images/chevy.jpg", category:"cars", type:"img"},
  {src:"images/cars3.jpg", category:"cars", type:"img"},
  
];

// LOAD POSTS
function loadPosts(list){
  feed.innerHTML="";

  list.forEach((post,i)=>{
    let likes = localStorage.getItem(post.src) || 0;

    let media = post.type === "video"
      ? `<video src="${post.src}" onclick="openModal('${post.src}','video')"></video>`
      : `<img src="${post.src}" onclick="openModal('${post.src}','img')">`;

    let card = document.createElement("div");
    card.className="card";

    card.innerHTML = `
      ${media}
      <div class="actions">
        <span class="like-btn" onclick="likePost('${post.src}')">❤️ ${likes}</span>
        <span>${post.category}</span>
      </div>
    `;

    feed.appendChild(card);
  });

  document.getElementById("loader").style.display="none";
}

// LIKE SYSTEM
function likePost(src){
  let count = localStorage.getItem(src) || 0;
  count++;
  localStorage.setItem(src, count);

  showToast("🔥 Saved to Collombo favorites");
  loadPosts(posts);
}

// FILTER
function filterCategory(cat){
  if(cat==="all"){
    loadPosts(posts);
  } else {
    loadPosts(posts.filter(p=>p.category===cat));
  }
}

// TRENDING
function sortByLikes(){
  let sorted = [...posts].sort((a,b)=>{
    return (localStorage.getItem(b.src)||0) - (localStorage.getItem(a.src)||0);
  });
  loadPosts(sorted);
}

// MODAL
let currentIndex = 0;

// OPEN MODAL
function openModal(src, type){
  const modal = document.getElementById("modal");
  const content = document.getElementById("modalContent");

  currentIndex = posts.findIndex(p => p.src === src);

  renderModal(type, src);

  modal.style.display = "flex";
}

// RENDER MEDIA
function renderModal(type, src){
  const content = document.getElementById("modalContent");

  if(type === "video"){
    content.innerHTML = `<video src="${src}" controls autoplay class="modal-content"></video>`;
  } else {
    content.innerHTML = `<img src="${src}" class="modal-content">`;
  }
}

// NEXT
function nextPost(){
  currentIndex = (currentIndex + 1) % posts.length;
  const post = posts[currentIndex];
  renderModal(post.type, post.src);
}

// PREVIOUS
function prevPost(){
  currentIndex = (currentIndex - 1 + posts.length) % posts.length;
  const post = posts[currentIndex];
  renderModal(post.type, post.src);
}

// CLOSE
function closeModal(){
  document.getElementById("modal").style.display = "none";
}

// TOAST
function showToast(msg){
  const t = document.getElementById("toast");
  t.innerText = msg;
  t.style.opacity=1;
  setTimeout(()=>t.style.opacity=0,3000);
}

// INIT
loadPosts(posts);

document.getElementById("searchInput").addEventListener("input", function(){
  const value = this.value.toLowerCase();

  const filtered = posts.filter(p =>
    p.category.toLowerCase().includes(value)
  );

  loadPosts(filtered);
});
