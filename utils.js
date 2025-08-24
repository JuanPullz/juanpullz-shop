export function money(n){return `$${(n/100).toFixed(2)}`}
export function parseMoney(str){return Math.round(parseFloat(str)*100)}

const KEY="jp_cart_v1";
export function readCart(){try{return JSON.parse(localStorage.getItem(KEY))||[]}catch{return[]}}
export function writeCart(items){localStorage.setItem(KEY, JSON.stringify(items))}
export function addToCart(item){const cart=readCart();const i=cart.findIndex(x=>x.id===item.id); if(i>=0){cart[i].qty+=item.qty}else{cart.push(item)};writeCart(cart)}
export function removeFromCart(id){writeCart(readCart().filter(x=>x.id!==id))}
export function setQty(id,qty){const cart=readCart();const it=cart.find(x=>x.id===id);if(!it)return;it.qty=Math.max(1,qty|0);writeCart(cart)}

export function el(html){const t=document.createElement("template");t.innerHTML=html.trim();return t.content.firstElementChild}
export function thisYear(){document.querySelectorAll("#year").forEach(n=>n.textContent=new Date().getFullYear())}