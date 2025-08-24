import { money, addToCart, el, thisYear } from './js/utils.js';

const results = document.querySelector("#results");
const q = document.querySelector("#q");
const filterSet = document.querySelector("#filter-set");
const filterRarity = document.querySelector("#filter-rarity");
const filterType = document.querySelector("#filter-type");
const filterKind = document.querySelector("#filter-kind");
const clearBtn = document.querySelector("#clear");
const btnGraded = document.querySelector("#go-graded");
const btnRaw = document.querySelector("#go-raw");

thisYear();

let products = [];
let sets = new Set();

async function load() {
  const res = await fetch("products.json");
  products = await res.json();
  products.forEach(p => sets.add(p.set));
  [...sets].sort().forEach(s => {
    const opt = document.createElement("option");
    opt.textContent = s; opt.value = s;
    filterSet.appendChild(opt);
  });

  // navigate via CTA buttons
  if (btnGraded) btnGraded.addEventListener("click", () => { filterKind.value="graded"; render(); window.scrollTo({top:document.body.clientHeight, behavior:'smooth'}) });
  if (btnRaw) btnRaw.addEventListener("click", () => { filterKind.value="raw"; render(); window.scrollTo({top:document.body.clientHeight, behavior:'smooth'}) });

  render();
}

function match(p){
  const term = q.value.trim().toLowerCase();
  const set = filterSet.value;
  const rarity = filterRarity.value;
  const type = filterType.value;
  const kind = filterKind.value;

  if (set && p.set !== set) return false;
  if (rarity && p.rarity !== rarity) return false;
  if (type && p.type !== type) return false;
  if (kind && p.kind !== kind) return false;

  if (term){
    const hay = `${p.name} ${p.number} ${p.set} ${p.grade||""}`.toLowerCase();
    if (!hay.includes(term)) return false;
  }
  return true;
}

function card(p){
  const image = p.image || "images/logo.png";
  const buyNow = p.paymentLink ? `<a href="${p.paymentLink}" target="_blank" rel="noopener"><button class="buy-btn">Buy Now</button></a>` : "";
  const kindBadge = p.kind === "graded" ? `<span class="badge badge-graded">${p.grader||"PSA"} ${p.grade||""}</span>` : `<span class="badge badge-raw">RAW</span>`;
  const node = el(`
    <article class="card">
      <div class="polaroid">
        <div class="thumb"><img alt="${p.name}" src="${image}"/></div>
      </div>
      <div class="body">
        <div class="title">${p.name}</div>
        <div class="badges">
          ${kindBadge}
          <span class="badge">${p.set}</span>
          <span class="badge">${p.rarity}</span>
          <span class="badge">${p.type}</span>
          <span class="badge">#${p.number}</span>
        </div>
        <div class="price-row">
          <div class="price">${money(p.price)}</div>
          <div class="buttons">
            ${buyNow}
            <button class="add-btn">Add</button>
          </div>
        </div>
      </div>
    </article>
  `);
  node.querySelector(".add-btn").addEventListener("click", () => {
    addToCart({ id:p.id, name:p.name, price:p.price, set:p.set, rarity:p.rarity, qty:1 });
    node.querySelector(".add-btn").textContent = "Added ✓";
    setTimeout(()=> node.querySelector(".add-btn").textContent="Add", 900);
  });
  return node;
}

function render(){
  results.innerHTML = "";
  const list = products.filter(match);
  if (!list.length){ results.appendChild(el(`<p>No cards match your filters.</p>`)); return; }
  list.forEach(p => results.appendChild(card(p)));
}

q.addEventListener("input", render);
filterSet.addEventListener("change", render);
filterRarity.addEventListener("change", render);
filterType.addEventListener("change", render);
filterKind.addEventListener("change", render);
clearBtn.addEventListener("click", ()=>{ q.value=""; filterSet.value=""; filterRarity.value=""; filterType.value=""; filterKind.value=""; render(); });

load();