// ====== CONFIGURATION (à modifier avec TES infos) ======
const CONFIG = {
  whatsapp: "50900000000",            // ton numéro WhatsApp (indicatif + numéro, sans +)
  moncashNumber: "509 0000-0000",     // ton numéro MonCash
  natcashNumber: "509 0000-0000",     // ton numéro NatCash
  paypalLink: "https://www.paypal.me/TON_NOM", // ton lien PayPal.me
  // Pour carte Visa/Mastercard : mets ici le lien de paiement de ton fournisseur
  // (Stripe Payment Link, PayPal, etc.). Ne jamais demander le numéro de carte sur ce site.
  cardLink: "https://buy.stripe.com/TON_LIEN"
};

// ====== DONNÉES ======
const GAMES = [
  { id: "efootball", name: "eFootball", emoji: "⚽", currency: "Coins",
    packs: [["100 Coins", 1.5], ["300 Coins", 4], ["1040 Coins", 12], ["2130 Coins", 24]] },
  { id: "freefire", name: "Free Fire", emoji: "🔥", currency: "Diamants",
    packs: [["100 💎", 1], ["310 💎", 3], ["520 💎", 5], ["1060 💎", 10]] },
  { id: "dls", name: "DLS", emoji: "🏟️", currency: "Pièces",
    packs: [["1000 pièces", 1], ["5000 pièces", 4], ["12000 pièces", 9]] },
  { id: "cod", name: "Call of Duty Mobile", emoji: "🎯", currency: "CP",
    packs: [["80 CP", 1], ["400 CP", 5], ["800 CP", 10], ["2000 CP", 24]] },
  { id: "bloodstrike", name: "Blood Strike", emoji: "🩸", currency: "Gold",
    packs: [["100 Gold", 1], ["500 Gold", 5], ["1000 Gold", 10]] },
  { id: "pubg", name: "PUBG Mobile", emoji: "🪖", currency: "UC",
    packs: [["60 UC", 1], ["325 UC", 5], ["660 UC", 10], ["1800 UC", 25]] }
];
// ⚠️ Les prix ci-dessus sont des exemples : mets tes vrais prix.

const METHODS = [
  { id: "moncash", name: "MonCash", emoji: "📱" },
  { id: "natcash", name: "NatCash", emoji: "📲" },
  { id: "visa", name: "Visa", emoji: "💳" },
  { id: "mastercard", name: "Mastercard", emoji: "💳" },
  { id: "paypal", name: "PayPal", emoji: "🅿️" }
];

// ====== ÉTAT ======
const state = { game: null, pack: null, method: null };
const $ = (id) => document.getElementById(id);

function card(html, active, onClick) {
  const d = document.createElement("div");
  d.className = "item" + (active ? " active" : "");
  d.innerHTML = html;
  d.onclick = onClick;
  return d;
}

function renderGames() {
  const box = $("games"); box.innerHTML = "";
  GAMES.forEach(g => box.appendChild(card(
    `<span class="emoji">${g.emoji}</span>${g.name}<small>${g.currency}</small>`,
    state.game?.id === g.id,
    () => { state.game = g; state.pack = null; refresh(); }
  )));
}

function renderPacks() {
  const box = $("packs"); box.innerHTML = "";
  state.game.packs.forEach(([label, price]) => box.appendChild(card(
    `${label}<br><span class="price">${price.toFixed(2)} $</span>`,
    state.pack?.label === label,
    () => { state.pack = { label, price }; refresh(); }
  )));
}

function renderMethods() {
  const box = $("methods"); box.innerHTML = "";
  METHODS.forEach(m => box.appendChild(card(
    `<span class="emoji">${m.emoji}</span>${m.name}`,
    state.method?.id === m.id,
    () => { state.method = m; refresh(); }
  )));
}

function refresh() {
  renderGames();
  $("step-packs").hidden = !state.game;
  if (state.game) renderPacks();
  $("step-player").hidden = !state.pack;
  $("step-pay").hidden = !state.pack;
  if (state.pack) {
    renderMethods();
    $("total").textContent = state.pack.price.toFixed(2) + " $";
    $("payInfo").textContent = payHint();
    $("payBtn").disabled = !state.method;
  }
}

function payHint() {
  if (!state.method) return "Choisis un mode de paiement.";
  switch (state.method.id) {
    case "moncash": return "Tu enverras le montant par MonCash, puis tu confirmes sur WhatsApp.";
    case "natcash": return "Tu enverras le montant par NatCash, puis tu confirmes sur WhatsApp.";
    case "paypal": return "Tu seras redirigé vers PayPal pour payer.";
    default: return "Paiement par carte sur une page sécurisée du fournisseur de paiement.";
  }
}

function showModal(title, html) {
  $("modalTitle").textContent = title;
  $("modalBody").innerHTML = html;
  $("modal").hidden = false;
}

function pay() {
  const playerId = $("playerId").value.trim();
  const contact = $("contact").value.trim();
  if (!playerId) return alert("Entre ton ID de joueur.");
  if (!contact) return alert("Entre ton téléphone ou email.");

  const order = `Commande: ${state.game.name} - ${state.pack.label} (${state.pack.price.toFixed(2)} $)\n` +
                `ID joueur: ${playerId}\nContact: ${contact}\nPaiement: ${state.method.name}`;
  const wa = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(order)}`;
  const total = state.pack.price.toFixed(2);

  switch (state.method.id) {
    case "moncash":
    case "natcash": {
      const num = state.method.id === "moncash" ? CONFIG.moncashNumber : CONFIG.natcashNumber;
      showModal(`Paiement ${state.method.name}`,
        `<div class="row">1. Envoie <b>${total} $</b> (équivalent en gourdes) au <b>${num}</b>.</div>
         <div class="row">2. Garde la capture / le code de transaction.</div>
         <div class="row">3. <a style="color:#ffd34d" href="${wa}" target="_blank">Clique ici pour confirmer sur WhatsApp</a>.</div>`);
      break;
    }
    case "paypal":
      window.open(`${CONFIG.paypalLink}/${total}USD`, "_blank");
      showModal("PayPal", `Après le paiement, <a style="color:#ffd34d" href="${wa}" target="_blank">envoie-nous ta commande sur WhatsApp</a>.`);
      break;
    default:
      window.open(CONFIG.cardLink, "_blank");
      showModal(`Carte ${state.method.name}`, `Après le paiement, <a style="color:#ffd34d" href="${wa}" target="_blank">confirme ta commande sur WhatsApp</a>.`);
  }
}

$("payBtn").onclick = pay;
$("modalClose").onclick = () => ($("modal").hidden = true);
refresh();
