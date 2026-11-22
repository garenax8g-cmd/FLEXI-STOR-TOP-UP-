// tier: 1 = entrée de gamme, 2 = milieu de gamme, 3 = haut de gamme
const PHONES = {
  "Samsung": { mod: 0, models: [
    ["Galaxy A03 / A04 / A05", 1], ["Galaxy A12 / A13 / A14", 1], ["Galaxy A15 / A25", 2],
    ["Galaxy A34 / A35 / A54 / A55", 2], ["Galaxy S10 / S20", 2], ["Galaxy S21 / S22", 3],
    ["Galaxy S23 / S24", 3], ["Galaxy Note 10 / 20", 3]
  ]},
  "iPhone": { mod: -2, models: [
    ["iPhone 6 / 7 / 8", 2], ["iPhone X / XR / XS", 2], ["iPhone 11", 3],
    ["iPhone 12 / 13", 3], ["iPhone 14 / 15 / 16", 3], ["iPad (tablette)", 3]
  ]},
  "Xiaomi / Redmi / POCO": { mod: 0, models: [
    ["Redmi 9A / 9C / 10A", 1], ["Redmi 10 / 12", 1], ["Redmi Note 10 / 11", 2],
    ["Redmi Note 12 / 13", 2], ["POCO X3 / X4 / X5", 2], ["POCO F3 / F4 / F5", 3],
    ["Xiaomi 12 / 13 / 14", 3]
  ]},
  "Tecno": { mod: 0, models: [
    ["Spark 6 / 7 / 8", 1], ["Spark 10 / 20", 1], ["Camon 17 / 18", 2],
    ["Camon 19 / 20 / 30", 2], ["Pova 4 / 5 / 6", 2], ["Phantom X / X2", 3]
  ]},
  "Infinix": { mod: 0, models: [
    ["Hot 9 / 10 / 11", 1], ["Hot 12 / 20 / 30 / 40", 2], ["Smart 6 / 7 / 8", 1],
    ["Note 12 / 30 / 40", 2], ["Zero 20 / 30 / 40", 3], ["GT 10 / 20 Pro", 3]
  ]},
  "itel": { mod: 0, models: [
    ["A48 / A49 / A56", 1], ["A60 / P40 / P55", 1], ["S23 / S24", 1]
  ]},
  "Oppo": { mod: 0, models: [
    ["A15 / A16 / A17", 1], ["A57 / A58 / A78", 2], ["Reno 6 / 7 / 8", 2],
    ["Reno 10 / 11 / 12", 3], ["Find X", 3]
  ]},
  "Vivo": { mod: 0, models: [
    ["Y12 / Y15 / Y20", 1], ["Y21 / Y33 / Y36", 2], ["V23 / V27 / V29", 2], ["X80 / X90", 3]
  ]},
  "Realme": { mod: 0, models: [
    ["C11 / C21 / C25 / C33", 1], ["Realme 8 / 9 / 10", 2], ["Realme 11 / 12", 2],
    ["GT Neo / GT 5", 3]
  ]},
  "Huawei / Honor": { mod: 0, models: [
    ["Y6 / Y7 / Y9", 1], ["Nova 8 / 9 / 10", 2], ["P30 / P40 / Mate", 3], ["Honor X7 / X8 / X9", 2]
  ]},
  "Motorola": { mod: 0, models: [
    ["Moto E / G Play", 1], ["Moto G 23 / 54 / 84", 2], ["Edge 30 / 40 / 50", 3]
  ]},
  "OnePlus": { mod: -1, models: [
    ["Nord N / CE", 2], ["Nord 2 / 3", 3], ["OnePlus 9 / 10 / 11 / 12", 3]
  ]},
  "Google Pixel": { mod: -1, models: [
    ["Pixel 4a / 5a / 6a", 2], ["Pixel 6 / 7 / 8", 3]
  ]},
  "Gaming (ROG / RedMagic / Black Shark)": { mod: -4, models: [
    ["ROG Phone 5 / 6 / 7", 3], ["RedMagic 7 / 8 / 9", 3], ["Black Shark 4 / 5", 3]
  ]},
  "Autre marque": { mod: 0, models: [
    ["Téléphone d'entrée de gamme (ancien ou peu cher)", 1],
    ["Téléphone milieu de gamme", 2],
    ["Téléphone haut de gamme (récent)", 3]
  ]}
};

// Valeurs de base par style (entrée de gamme)
const BASE = {
  rusher:   { general: 100, red: 96, x2: 92, x4: 86, awm: 62, free: 72 },
  balanced: { general: 96,  red: 91, x2: 86, x4: 79, awm: 52, free: 66 },
  sniper:   { general: 90,  red: 86, x2: 81, x4: 73, awm: 45, free: 60 }
};
// Plus le téléphone est rapide (échantillonnage tactile), plus on baisse la sensibilité
const TIER_MOD = { 1: 0, 2: -3, 3: -6 };
const TIER_NAME = { 1: "entrée de gamme", 2: "milieu de gamme", 3: "haut de gamme" };
const STYLE_NAME = { rusher: "Rusher", balanced: "Équilibré", sniper: "Précision" };
const LABELS = {
  general: "Général", red: "Point rouge", x2: "Lunette 2x",
  x4: "Lunette 4x", awm: "Lunette AWM", free: "Vue libre"
};
const DPI_HINT = { 1: "400 – 480", 2: "450 – 520", 3: "500 – 600" };

const $ = id => document.getElementById(id);
let style = "rusher";

const clamp = v => Math.max(1, Math.min(100, Math.round(v)));

function fillBrands() {
  $("brand").innerHTML = Object.keys(PHONES).map(b => `<option>${b}</option>`).join("");
  fillModels();
}
function fillModels() {
  const brand = PHONES[$("brand").value];
  $("model").innerHTML = brand.models.map((m, i) => `<option value="${i}">${m[0]}</option>`).join("");
}

let lastText = "";
function compute() {
  const brandName = $("brand").value;
  const brand = PHONES[brandName];
  const [modelName, tier] = brand.models[+$("model").value];
  const shift = TIER_MOD[tier] + brand.mod;
  const base = BASE[style];

  const values = {};
  for (const k in base) {
    // L'AWM et la vue libre bougent moins avec le matériel
    const f = (k === "awm" || k === "free") ? 0.5 : 1;
    values[k] = clamp(base[k] + shift * f);
  }

  $("title").textContent = `${brandName} – ${modelName}`;
  $("subtitle").textContent = `Profil ${TIER_NAME[tier]} • Style ${STYLE_NAME[style]}`;
  $("bars").innerHTML = Object.keys(values).map(k => `
    <div class="row">
      <div class="top"><span>${LABELS[k]}</span><b>${values[k]}</b></div>
      <div class="track"><div class="fill" data-w="${values[k]}"></div></div>
    </div>`).join("");

  $("extra").innerHTML = `<b>DPI conseillé :</b> ${DPI_HINT[tier]}<br>
    <b>Bouton de tir :</b> taille 45 – 60%, tir à 2 ou 3 doigts<br>
    <b>Astuce :</b> teste en entraînement et ajuste de ±3 selon ton ressenti.`;

  lastText = `Sensi Free Fire – ${brandName} ${modelName} (${STYLE_NAME[style]})\n` +
    Object.keys(values).map(k => `${LABELS[k]} : ${values[k]}`).join("\n");

  $("result").classList.remove("hidden");
  requestAnimationFrame(() => {
    document.querySelectorAll(".fill").forEach(el => el.style.width = el.dataset.w + "%");
  });
  $("result").scrollIntoView({ behavior: "smooth", block: "start" });
}

$("brand").addEventListener("change", fillModels);
$("go").addEventListener("click", compute);
$("styles").addEventListener("click", e => {
  const b = e.target.closest("button");
  if (!b) return;
  style = b.dataset.style;
  document.querySelectorAll("#styles button").forEach(x => x.classList.toggle("active", x === b));
  if (!$("result").classList.contains("hidden")) compute();
});
$("copy").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(lastText);
    $("copy").textContent = "✅ Copié !";
  } catch (e) {
    $("copy").textContent = "Copie impossible";
  }
  setTimeout(() => $("copy").textContent = "📋 Copier les valeurs", 1800);
});

fillBrands();
