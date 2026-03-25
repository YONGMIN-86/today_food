const intro=document.getElementById("intro");
const app=document.getElementById("app");

const home=document.getElementById("home");
const category=document.getElementById("category");

const buttons=document.querySelectorAll(".card[data]");
const allBtn=document.getElementById("allBtn");

const result=document.getElementById("result");
const result2=document.getElementById("result2");

const list=document.getElementById("list");

const back=document.getElementById("back");
const title=document.getElementById("title");
const randomBtn=document.getElementById("random");

let current=[];
let spinning=false;

/* 인트로 */
window.onload=()=>{
setTimeout(()=>{
intro.classList.add("fade");
setTimeout(()=>{
intro.style.display="none";
app.classList.remove("hidden");
},1000);
},2000);
};

/* 랜덤 */
function rand(arr){
return arr[Math.floor(Math.random()*arr.length)];
}

/* 슬롯머신 */
function spin(target,data){

if(spinning)return;
spinning=true;

target.classList.remove("hidden");
target.classList.add("spinning");

let step=0;

function run(){

const r=rand(data);

target.innerHTML=`띠릭${".".repeat(step%3+1)}<br><br>${r.name}<br>${r.menu}`;

step++;

if(step<25){
setTimeout(run,50+step*10);
}else{

const final=rand(data);

target.innerHTML=`🎉 추천 완료<br><br><strong>${final.name}</strong><br>${final.menu}`;

target.classList.remove("spinning");
target.classList.add("final");

spinning=false;
}
}

run();
}

/* 리스트 */
function show(arr){
list.innerHTML=arr.map(x=>`
<div class="item">
<strong>${x.name}</strong><br>
${x.menu}
</div>
`).join("");
}

/* 카테고리 이동 */
buttons.forEach(b=>{
b.onclick=()=>{
const key=b.getAttribute("data");

current=restaurantData[key].restaurants;

title.innerText=restaurantData[key].title;

show(current);

home.classList.remove("active");
category.classList.add("active");
};
});

/* 뒤로 */
back.onclick=()=>{
category.classList.remove("active");
home.classList.add("active");
};

/* 카테고리 랜덤 */
randomBtn.onclick=()=>{
spin(result2,current);
};

/* 전체 랜덤 */
allBtn.onclick=()=>{
const all=[
...restaurantData.near.restaurants,
...restaurantData.across.restaurants,
...restaurantData.car.restaurants
];

spin(result,all);
};