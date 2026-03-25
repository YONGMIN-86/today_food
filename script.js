const intro = document.getElementById("intro");
const app = document.getElementById("app");

const homeScreen = document.getElementById("homeScreen");
const categoryScreen = document.getElementById("categoryScreen");

const categoryButtons = document.querySelectorAll(".menu-card[data-category]");
const allRandomBtn = document.getElementById("allRandomBtn");
const homeRandomResult = document.getElementById("homeRandomResult");

const backBtn = document.getElementById("backBtn");
const categoryTitle = document.getElementById("categoryTitle");
const categoryRandomBtn = document.getElementById("categoryRandomBtn");
const categoryRandomResult = document.getElementById("categoryRandomResult");
const restaurantList = document.getElementById("restaurantList");

let currentCategoryKey = null;
let introClosed = false;
let spinTimer = null;

/* 인트로 */
window.addEventListener("load", () => {
  setTimeout(closeIntro, 2000);
});

function closeIntro() {
  if (introClosed) return;
  introClosed = true;

  app.classList.remove("hidden");
  intro.classList.add("fade-out");

  setTimeout(() => {
    intro.style.display = "none";
  }, 900);
}

intro.addEventListener("click", closeIntro);

/* 화면 전환 */
function showHomeScreen() {
  homeScreen.classList.add("active");
  categoryScreen.classList.remove("active");
  categoryRandomResult.classList.add("hidden");
}

function showCategoryScreen() {
  homeScreen.classList.remove("active");
  categoryScreen.classList.add("active");
}

/* 랜덤 */
function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function setRandomBoxContent(target, status, item) {
  target.innerHTML = `
    <div class="random-status">${status}</div>
    <div class="random-name">${item.name}</div>
    <div class="random-menu">${item.menu}</div>
  `;
}

function runRandomEffect(target, list, spinningText, finalText) {
  if (spinTimer) {
    clearInterval(spinTimer);
    spinTimer = null;
  }

  target.classList.remove("hidden");
  target.classList.add("spinning");

  let count = 0;
  const totalSteps = 18;

  spinTimer = setInterval(() => {
    const item = getRandomItem(list);
    setRandomBoxContent(target, spinningText, item);

    count += 1;

    if (count >= totalSteps) {
      clearInterval(spinTimer);
      spinTimer = null;

      const finalItem = getRandomItem(list);
      setRandomBoxContent(target, finalText, finalItem);
      target.classList.remove("spinning");
    }
  }, 90);
}

/* 식당 카드 */
function createRestaurantCard(item, index) {
  return `
    <article class="restaurant-card">
      <div class="restaurant-number">${index + 1}</div>
      <h3 class="restaurant-name">${item.name}</h3>
      <p class="restaurant-menu">${item.menu}</p>
      <div class="restaurant-bottom-line"></div>
    </article>
  `;
}

/* 카테고리 열기 */
function openCategory(categoryKey) {
  currentCategoryKey = categoryKey;

  const category = restaurantData[categoryKey];
  categoryTitle.textContent = category.title;

  restaurantList.innerHTML = category.restaurants
    .map((item, index) => createRestaurantCard(item, index))
    .join("");

  categoryRandomResult.classList.add("hidden");
  categoryRandomResult.innerHTML = "";

  showCategoryScreen();
}

/* 버튼 이벤트 */
categoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    openCategory(button.dataset.category);
  });
});

allRandomBtn.addEventListener("click", () => {
  const allRestaurants = [
    ...restaurantData.near.restaurants,
    ...restaurantData.across.restaurants,
    ...restaurantData.car.restaurants
  ];

  runRandomEffect(
    homeRandomResult,
    allRestaurants,
    "RANDOM SELECTING...",
    "SELECT COMPLETE"
  );
});

categoryRandomBtn.addEventListener("click", () => {
  if (!currentCategoryKey) return;

  const list = restaurantData[currentCategoryKey].restaurants;

  runRandomEffect(
    categoryRandomResult,
    list,
    "CATEGORY RANDOM...",
    "SELECT COMPLETE"
  );
});

backBtn.addEventListener("click", () => {
  showHomeScreen();
});