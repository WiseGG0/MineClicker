let gramas = 0;
let madeiras = 0;
let gps = 0;
let mps = 0;
let upgrades = { cortador: 0, rocadeira: 0 };
let woodUpgrades = { machado: 0 };
let unlocked = [];
let prestigeMultiplier = 1;
let clicks = 0;

const clickSound = document.getElementById("clickSound");
const grassBlock = document.getElementById("grassBlock");
const woodBlock = document.getElementById("woodBlock");

function updateCounter() {
  document.getElementById("gramas").textContent = gramas;
  document.getElementById("madeiras").textContent = madeiras;
  document.getElementById("gps").textContent = (gps * prestigeMultiplier).toFixed(1);
}

function spawnParticle(text = "+1") {
  const particle = document.createElement("div");
  particle.className = "particle";
  particle.textContent = text;
  particle.style.left = grassBlock.offsetLeft + grassBlock.offsetWidth / 2 + "px";
  particle.style.top = grassBlock.offsetTop + "px";
  document.body.appendChild(particle);
  setTimeout(() => particle.remove(), 800);
}

function checkAchievements() {
  const list = [
    { gramas: 10, texto: "Primeiras 10 gramas 🌿" },
    { gramas: 100, texto: "100 gramas colhidas! 🌾" },
    { gramas: 500, texto: "Você é um fazendeiro nato! 🧑‍🌾" }
  ];
  list.forEach(a => {
    if (gramas >= a.gramas && !unlocked.includes(a.texto)) {
      unlocked.push(a.texto);
      const div = document.createElement("div");
      div.textContent = `🏆 ${a.texto}`;
      document.getElementById("achievements").appendChild(div);
    }
  });
}

function switchTab(tab) {
  renderStore(tab);
}

function renderStore(tab = "grass") {
  const store = document.getElementById("store");
  store.innerHTML = "";
  if (tab === "grass") {
    store.innerHTML += `<button onclick="buyUpgrade('cortador')">Cortador de Grama (+1 G/s) - ${getCost('cortador')}🌿</button>`;
    store.innerHTML += `<button onclick="buyUpgrade('rocadeira')">Roçadeira (+5 G/s) - ${getCost('rocadeira')}🌿</button>`;
  } else {
    store.innerHTML += `<button onclick="buyWoodUpgrade('machado')">Machado (+1 M/s) - ${getWoodCost('machado')}🪵</button>`;
  }
}

function getCost(type) {
  const baseCosts = { cortador: 50, rocadeira: 250 };
  return Math.floor(baseCosts[type] * Math.pow(1.15, upgrades[type]));
}

function buyUpgrade(type) {
  const cost = getCost(type);
  if (gramas >= cost) {
    gramas -= cost;
    upgrades[type]++;
    gps += type === "cortador" ? 1 : 5;
    updateCounter();
    renderStore("grass");
  }
}

function getWoodCost(type) {
  return Math.floor(100 * Math.pow(1.15, woodUpgrades[type]));
}

function buyWoodUpgrade(type) {
  const cost = getWoodCost(type);
  if (madeiras >= cost) {
    madeiras -= cost;
    woodUpgrades[type]++;
    mps += 1;
    updateCounter();
    renderStore("wood");
  }
}

function saveGame() {
  localStorage.setItem("grassData", JSON.stringify({
    gramas, madeiras, gps, mps, upgrades, woodUpgrades, unlocked, prestigeMultiplier, clicks
  }));
}

function loadGame() {
  const data = JSON.parse(localStorage.getItem("grassData"));
  if (!data) return;
  ({ gramas, madeiras, gps, mps, upgrades, woodUpgrades, unlocked, prestigeMultiplier, clicks } = data);
  updateCounter();
  renderStore("grass");
  if (gramas >= 1000 || clicks >= 1000) unlockWood();
}

function unlockWood() {
  woodBlock.style.display = "inline";
  document.getElementById("woodTab").style.display = "inline";
}

grassBlock.addEventListener("click", () => {
  gramas++;
  clicks++;
  clickSound.currentTime = 0;
  clickSound.play();
  spawnParticle("+1");
  if (clicks >= 1000 || gramas >= 1000) unlockWood();
  updateCounter();
  checkAchievements();
});

woodBlock.addEventListener("click", () => {
  madeiras++;
  clickSound.currentTime = 0;
  clickSound.play();
  spawnParticle("+1🪵");
  updateCounter();
});

setInterval(() => {
  gramas += gps * prestigeMultiplier;
  madeiras += mps;
  updateCounter();
}, 1000);

setInterval(saveGame, 5000);
loadGame();

document.getElementById("resetBtn").onclick = () => {
  if (confirm("Resetar tudo?")) {
    localStorage.clear();
    location.reload();
  }
};

document.getElementById("prestigeBtn").onclick = () => {
  if (gramas >= 10000) {
    localStorage.clear();
    prestigeMultiplier += 0.1;
    gramas = 0;
    madeiras = 0;
    gps = 0;
    mps = 0;
    upgrades = { cortador: 0, rocadeira: 0 };
    woodUpgrades = { machado: 0 };
    unlocked = [];
    clicks = 0;
    saveGame();
    location.reload();
  }
};

setInterval(() => {
  if (gramas >= 10000) document.getElementById("prestigeBtn").style.display = "inline";
}, 1000);
