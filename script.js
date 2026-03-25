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
let isSpinning = false;
let spinTimeout = null;

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
}

function showCategoryScreen() {
  homeScreen.classList.remove("active");
  categoryScreen.classList.add("active");
}

/* 랜덤 */
function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function setButtonsDisabled(disabled) {
  categoryButtons.forEach((button) => {
    button.disabled = disabled;
    button.style.pointerEvents = disabled ? "none" : "auto";
    button.style.opacity = disabled ? "0.7" : "1";
  });

  allRandomBtn.disabled = disabled;
  allRandomBtn.style.pointerEvents = disabled ? "none" : "auto";
  allRandomBtn.style.opacity = disabled ? "0.7" : "1";

  categoryRandomBtn.disabled = disabled;
  categoryRandomBtn.style.pointerEvents = disabled ? "none" : "auto";
  categoryRandomBtn.style.opacity = disabled ? "0.7" : "1";

  backBtn.disabled = disabled;
  backBtn.style.pointerEvents = disabled ? "none" : "auto";
  backBtn.style.opacity = disabled ? "0.7" : "1";
}

function setRandomBoxContent(target, status, item) {
  target.innerHTML = `
    <div class="random-status">${status}</div>
    <div class="random-name">${item.name}</div>
    <div class="random-menu">${item.menu}</div>
  `;
}

function clearSpinTimeout() {
  if (spinTimeout) {
    clearTimeout(spinTimeout);
    spinTimeout = null;
  }
}

function runRandomEffect(target, list, spinningText, finalText) {
  if (isSpinning || !list || list.length === 0) return;

  clearSpinTimeout();
  isSpinning = true;
  setButtonsDisabled(true);

  target.classList.remove("hidden");
  target.classList.add("spinning");
  target.classList.remove("random-final");

  let step = 0;
  const maxStep = 24;

  function spin() {
    const item = getRandomItem(list);
    const dots = ".".repeat((step % 3) + 1);

    setRandomBoxContent(target, `${spinningText}${dots}`, item);

    step += 1;

    if (step < maxStep) {
      const speed = 55 + step * 12;
      spinTimeout = setTimeout(spin, speed);
    } else {
      const finalItem = getRandomItem(list);

      setRandomBoxContent(target, finalText, finalItem);

      target.classList.remove("spinning");
      target.classList.add("random-final");

      isSpinning = false;
      setButtonsDisabled(false);
      clearSpinTimeout();
    }
  }

  spin();
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
  categoryRandomResult.classList.remove("spinning", "random-final");
  categoryRandomResult.innerHTML = "";

  showCategoryScreen();
}

/* 메인 버튼 */
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
    "RANDOM SELECTING",
    "🎉 SELECT COMPLETE"
  );
});

/* 카테고리 랜덤 */
categoryRandomBtn.addEventListener("click", () => {
  if (!currentCategoryKey) return;

  const list = restaurantData[currentCategoryKey].restaurants;

  runRandomEffect(
    categoryRandomResult,
    list,
    "CATEGORY RANDOM",
    "🎯 SELECT COMPLETE"
  );
});

/* 뒤로가기 */
backBtn.addEventListener("click", () => {
  if (isSpinning) return;

  showHomeScreen();
});