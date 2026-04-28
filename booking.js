// =============================
// BOOKING SESSION MODAL
// =============================
function openSession(type){
  const modal = document.getElementById("sessionModal");
  const title = document.getElementById("sessionTitle");
  const select = document.querySelector('select[name="service"]');

  modal.style.display = "flex";

  const services = {
    dj: {
      title: "🎧 DJ Booking Session",
      options: ["Club Event", "Wedding", "Private Party"]
    },
    web: {
      title: "💻 Web Development Session",
      options: ["Portfolio Website", "Business Website", "System Development"]
    },
    it: {
      title: "🛠 IT Support Session",
      options: ["PC Repair", "Software Installation", "System Setup"]
    },
    design: {
      title: "🎨 Graphics Design Session",
      options: ["Logo Design", "Poster Design", "Branding"]
    }
  };

  const selected = services[type];

  title.innerText = selected.title;

  select.innerHTML = selected.options
    .map(option => `<option>${option}</option>`)
    .join("");
}

function closeSession(){
  document.getElementById("sessionModal").style.display = "none";
}


// =============================
// WHATSAPP
// =============================
function openWhatsApp(){
  let msg = "Hello DJ Collombo, I want to negotiate a booking.";
  let url = "https://wa.me/254797770872?text=" + encodeURIComponent(msg);
  window.open(url, "_blank");
}


// =============================
// PRICE CALCULATOR
// =============================
document.getElementById("hours").addEventListener("input", function(){
  let hours = parseInt(this.value) || 0;
  let base = 1000;
  let total = hours * base;

  document.getElementById("priceEstimate").innerText =
    "Estimated: KES " + total.toLocaleString();
});


// =============================
// PACKAGE TOGGLE
// =============================
function showPackage(type, btn){

  document.querySelectorAll(".package-group").forEach(group=>{
    group.classList.remove("active-pack");
  });

  const selectedGroup = document.querySelector("." + type);

  if(selectedGroup){
    selectedGroup.classList.add("active-pack");
  }

  document.querySelectorAll(".package-toggle button").forEach(button=>{
    button.classList.remove("active");
  });

  btn.classList.add("active");

  suggestBestPackage(type);
}


// =============================
// AI SUGGESTION
// =============================
function suggestBestPackage(type){
  const aiBox = document.getElementById("aiSuggestion");

  const messages = {
    basic: "🧠 Best for startups, small events, and personal brands.",
    standard: "🧠 Recommended for growing businesses and premium events.",
    premium: "🧠 Best for elite clients, clubs, and full business systems."
  };

  aiBox.innerText = messages[type];
}


// =============================
// BOOK THIS PACKAGE BUTTON
// =============================
function bookThisPackage(service){
  openSession(service);
}
