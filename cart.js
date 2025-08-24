import { readCart, writeCart, removeFromCart, setQty, money, el, thisYear } from './js/utils.js';

thisYear();

const tbody = document.querySelector("#cart-table tbody");
const summaryLines = document.querySelector("#summary-lines");
const subtotalEl = document.querySelector("#subtotal");
const shippingEl = document.querySelector("#shipping");
const grandEl = document.querySelector("#grandtotal");
const emailBtn = document.querySelector("#email-checkout");
const clearBtn = document.querySelector("#clear-cart");

// CONFIG
const SHIPPING_FLAT = 500; // cents
const EMAIL_TO = "you@example.com"; // <-- change to your email
const SHOP_NAME = "JuanPullz";

function recalc(){
  const cart = readCart();
  tbody.innerHTML = "";
  let subtotal = 0;

  cart.forEach(item => {
    const row = el(`<tr>
      <td>${item.name}</td>
      <td>${item.set||"-"}</td>
      <td>${item.rarity||"-"}</td>
      <td>${money(item.price)}</td>
      <td><input class="qty-input" type="number" min="1" value="${item.qty}"/></td>
      <td class="row-total">${money(item.price * item.qty)}</td>
      <td class="row-actions"><button class="btn">Remove</button></td>
    </tr>`);
    row.querySelector(".qty-input").addEventListener("change",(e)=>{ setQty(item.id, e.target.value); recalc(); });
    row.querySelector(".row-actions button").addEventListener("click",()=>{ removeFromCart(item.id); recalc(); });
    tbody.appendChild(row);
    subtotal += item.price * item.qty;
  });

  const shipping = cart.length ? SHIPPING_FLAT : 0;
  const grand = subtotal + shipping;
  subtotalEl.textContent = money(subtotal);
  shippingEl.textContent = money(shipping);
  grandEl.textContent = money(grand);
  summaryLines.innerHTML = cart.map(i=>`${i.qty} × ${i.name} — ${money(i.price*i.qty)}`).join("<br/>") || "Your cart is empty.";
}

function emailCheckout(){
  const cart = readCart();
  if (!cart.length) return alert("Your cart is empty.");
  const lines = cart.map(i => `${i.qty} x ${i.name} (${i.set||""} ${i.rarity||""}) @ ${money(i.price)} = ${money(i.price*i.qty)}`);
  lines.push("");
  lines.push(`Subtotal: ${subtotalEl.textContent}`);
  lines.push(`Shipping: ${shippingEl.textContent}`);
  lines.push(`Total: ${grandEl.textContent}`);
  const body = encodeURIComponent(lines.join("\n"));
  const subj = encodeURIComponent(`${SHOP_NAME} Order — ${new Date().toLocaleDateString()}`);
  window.location.href = `mailto:${EMAIL_TO}?subject=${subj}&body=${body}`;
}

emailBtn.addEventListener("click", emailCheckout);
clearBtn.addEventListener("click", ()=>{ writeCart([]); recalc(); });
recalc();