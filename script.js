const courses = [
  {id:1,title:"The Complete JavaScript Journey",category:"Development",instructor:"Maya Chen",rating:4.9,students:"12.4k",hours:"18.5 hours",price:499,oldPrice:1499,badge:"Bestseller",tag:"Bestseller",image:"images/javascript.svg",description:"Build a strong JavaScript foundation through practical projects, modern syntax, and real-world patterns."},
  {id:2,title:"UI/UX Design: From Idea to Interface",category:"Design",instructor:"Oliver James",rating:4.8,students:"8.2k",hours:"12 hours",price:399,oldPrice:1299,badge:"Bestseller",tag:"Bestseller",image:"images/uiux.svg",description:"Learn design thinking, wireframing, visual hierarchy, and how to make interfaces feel effortless."},
  {id:3,title:"Python for Data Science & AI",category:"Data & AI",instructor:"Dr. Aisha Patel",rating:4.9,students:"15.7k",hours:"24 hours",price:599,oldPrice:1799,badge:"Popular",tag:"Bestseller",image:"images/python-ai.svg",description:"Explore Python, data analysis, visualisation, and the foundations behind machine learning."},
  {id:4,title:"Build a Business That Works",category:"Business",instructor:"Noah Williams",rating:4.7,students:"5.6k",hours:"9 hours",price:349,oldPrice:999,badge:"New",tag:"New",image:"images/business.svg",description:"Turn a promising idea into a clear business model with practical planning and customer research."},
  {id:5,title:"Modern Web Development Bootcamp",category:"Development",instructor:"Leo Martin",rating:4.8,students:"10.1k",hours:"32 hours",price:699,oldPrice:1999,badge:"Bestseller",tag:"Bestseller",image:"images/webdev.svg",description:"Create responsive websites with HTML, CSS, JavaScript, and the habits of a professional developer."},
  {id:6,title:"Creative Photography Essentials",category:"Design",instructor:"Sofia Rivera",rating:4.6,students:"3.9k",hours:"7.5 hours",price:299,oldPrice:899,badge:"New",tag:"New",image:"images/photography.svg",description:"Understand light, composition, and visual storytelling so you can take more intentional photographs."}
];

const state = { category:"All", filter:"All", search:"", wishlist:new Set(), showAll:false };
const courseGrid = document.getElementById("courseGrid");
const resultsCount = document.getElementById("resultsCount");
const emptyState = document.getElementById("emptyState");
const loadMore = document.getElementById("loadMore");
const toast = document.getElementById("toast");
let toastTimer;

function notify(message){
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>toast.classList.remove("show"),2600);
}

function filteredCourses(){
  const query = state.search.trim().toLowerCase();
  return courses.filter(course => {
    const categoryMatch = state.category === "All" || course.category === state.category;
    const filterMatch = state.filter === "All" || course.tag === state.filter;
    const searchMatch = !query || [course.title,course.category,course.instructor,course.description].join(" ").toLowerCase().includes(query);
    return categoryMatch && filterMatch && searchMatch;
  });
}

function courseCard(course){
  const wished = state.wishlist.has(course.id);
  const badgeClass = course.badge === "Bestseller" ? "bestseller" : course.badge === "New" ? "new" : "";
  return `
    <article class="course-card-item">
      <div class="course-cover">
        <img src="${course.image}" alt="${course.title}" loading="lazy" onerror="this.onerror=null;this.src='images/course-fallback.svg'">
        <span class="course-label ${badgeClass}">${course.badge.toUpperCase()}</span>
        <button class="wish-btn ${wished ? "active" : ""}" data-wish="${course.id}" aria-label="${wished ? "Remove from" : "Add to"} wishlist">${wished ? "♥" : "♡"}</button>
      </div>
      <div class="course-content">
        <div class="course-category">${course.category}</div>
        <h3>${course.title}</h3>
        <p class="course-instructor">By ${course.instructor}</p>
        <div class="course-meta"><span class="rating"><b>★</b> ${course.rating}</span><span>◉ ${course.students} learners</span><span>◷ ${course.hours}</span></div>
        <div class="course-footer"><div class="course-price">₹${course.price} <del>₹${course.oldPrice}</del></div><button class="course-detail-btn" data-detail="${course.id}">View course ↗</button></div>
      </div>
    </article>`;
}

function renderCourses(){
  const filtered = filteredCourses();
  const shown = state.showAll ? filtered : filtered.slice(0,6);
  courseGrid.innerHTML = shown.map(courseCard).join("");
  resultsCount.textContent = `Showing ${shown.length} of ${filtered.length} course${filtered.length === 1 ? "" : "s"}`;
  emptyState.hidden = filtered.length !== 0;
  courseGrid.hidden = filtered.length === 0;
  loadMore.parentElement.hidden = filtered.length <= 6;
  loadMore.textContent = state.showAll ? "Show fewer courses ↑" : "Explore all courses →";
  document.getElementById("wishlistCount").textContent = state.wishlist.size;
}

function setCategory(category){
  state.category = category;
  document.querySelectorAll(".category-card").forEach(card => card.classList.toggle("selected",card.dataset.category === category));
  renderCourses();
  document.getElementById("courses").scrollIntoView({behavior:"smooth",block:"start"});
}

document.querySelectorAll(".category-card").forEach(card => card.addEventListener("click",()=>setCategory(card.dataset.category)));
document.querySelectorAll(".filter-chip").forEach(chip => chip.addEventListener("click",()=>{
  state.filter = chip.dataset.filter;
  document.querySelectorAll(".filter-chip").forEach(item=>item.classList.toggle("active",item===chip));
  renderCourses();
}));
function applySearch(value, shouldScroll = false){
  state.search = value.trim();
  // Search is global: don't let an old category or filter hide valid results.
  if (state.search) {
    state.category = "All";
    state.filter = "All";
    document.querySelectorAll(".category-card").forEach(card => card.classList.toggle("selected", card.dataset.category === "All"));
    document.querySelectorAll(".filter-chip").forEach(chip => chip.classList.toggle("active", chip.dataset.filter === "All"));
  }
  state.showAll = Boolean(state.search);
  renderCourses();
  if (shouldScroll) document.getElementById("courses").scrollIntoView({behavior:"smooth"});
  if (state.search && !filteredCourses().length) notify("No matches found. Try JavaScript, Python, design, business, or photography.");
}
document.getElementById("searchForm").addEventListener("submit", event => {
  event.preventDefault();
  applySearch(document.getElementById("searchInput").value, true);
});
document.getElementById("searchInput").addEventListener("input", event => {
  applySearch(event.target.value, false);
});
document.getElementById("clearFilters").addEventListener("click",()=>{
  state.category="All";state.filter="All";state.search="";state.showAll=false;
  document.getElementById("searchInput").value="";
  document.querySelectorAll(".category-card").forEach(card=>card.classList.toggle("selected",card.dataset.category==="All"));
  document.querySelectorAll(".filter-chip").forEach(chip=>chip.classList.toggle("active",chip.dataset.filter==="All"));
  renderCourses();notify("Filters cleared.");
});
document.getElementById("resetSearch").addEventListener("click",()=>document.getElementById("clearFilters").click());
loadMore.addEventListener("click",()=>{state.showAll=!state.showAll;renderCourses();});

courseGrid.addEventListener("click",event=>{
  const wishButton = event.target.closest("[data-wish]");
  if(wishButton){
    const id=Number(wishButton.dataset.wish);
    if(state.wishlist.has(id)){state.wishlist.delete(id);notify("Removed from your wishlist.");}
    else{state.wishlist.add(id);notify("Added to your wishlist.");}
    renderCourses();return;
  }
  const detailButton=event.target.closest("[data-detail]");
  if(detailButton){
    const course=courses.find(item=>item.id===Number(detailButton.dataset.detail));
    if(course) showCourseModal(course);
  }
});

document.getElementById("wishlistNav").addEventListener("click",()=>{
  const wished = courses.filter(course=>state.wishlist.has(course.id));
  if(!wished.length){notify("Your wishlist is empty. Tap ♡ on a course to save it.");return;}
  state.category="All";state.filter="All";state.search="";
  document.getElementById("searchInput").value="";
  state.showAll=true;
  renderCourses();
  courseGrid.innerHTML=wished.map(courseCard).join("");
  resultsCount.textContent=`Your wishlist · ${wished.length} course${wished.length===1?"":"s"}`;
  emptyState.hidden=true;courseGrid.hidden=false;loadMore.parentElement.hidden=true;
  document.getElementById("courses").scrollIntoView({behavior:"smooth"});
});

function showCourseModal(course){
  document.getElementById("modalTitle").textContent=course.title;
  document.getElementById("modalDescription").textContent=course.description;
  document.getElementById("accountForm").dataset.mode="course";
  document.getElementById("accountForm").dataset.course=course.title;
  document.getElementById("accountSubmit").textContent=`Enrol for ₹${course.price}`;
  document.getElementById("modalBackdrop").hidden=false;
}
const modalBackdrop=document.getElementById("modalBackdrop");
function openAccount(mode){
  document.getElementById("modalTitle").textContent=mode==="signup"?"Start learning today":"Welcome back";
  document.getElementById("modalDescription").textContent=mode==="signup"?"Create your free LearnHub demo account.":"Log in to continue your learning journey.";
  document.getElementById("accountForm").dataset.mode=mode;
  document.getElementById("accountSubmit").textContent=mode==="signup"?"Create account":"Log in";
  modalBackdrop.hidden=false;
}
document.getElementById("loginBtn").addEventListener("click",()=>openAccount("login"));
document.getElementById("signupBtn").addEventListener("click",()=>openAccount("signup"));
document.getElementById("modalClose").addEventListener("click",()=>modalBackdrop.hidden=true);
modalBackdrop.addEventListener("click",event=>{if(event.target===modalBackdrop)modalBackdrop.hidden=true;});
document.addEventListener("keydown",event=>{if(event.key==="Escape")modalBackdrop.hidden=true;});
document.getElementById("accountForm").addEventListener("submit",event=>{
  event.preventDefault();
  const mode=event.currentTarget.dataset.mode;
  const course=event.currentTarget.dataset.course;
  modalBackdrop.hidden=true;
  event.currentTarget.reset();
  if(mode==="course")notify(`Demo enrolment started for ${course}.`);
  else if(mode==="signup")notify("Demo account form submitted. No data was saved.");
  else notify("Demo login submitted. No data was sent.");
});
document.querySelector(".announcement-close").addEventListener("click",()=>document.querySelector(".announcement").remove());
document.getElementById("categoryBtn").addEventListener("click",()=>document.getElementById("categories").scrollIntoView({behavior:"smooth"}));
document.getElementById("mobileMenu").addEventListener("click",()=>notify("Tip: use the course categories and search to explore."));
renderCourses();
