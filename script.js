// Configure o WhatsApp do estabelecimento: DDI + DDD + número, somente dígitos.
const WHATSAPP_NUMBER = "";
const products = {
  "Brasa Clássico": 29.90,
  "Double Cheddar": 36.90,
  "BBQ Supreme": 34.90
};
const cart = {};
const nav = document.querySelector(".nav");
const toggle = document.querySelector(".menu-toggle");
toggle.addEventListener("click", () => {
  const opened = nav.classList.toggle("open");
  toggle.setAttribute("aria-expanded", String(opened));
});
document.querySelectorAll(".nav a").forEach(link => link.addEventListener("click", () => {
  nav.classList.remove("open"); toggle.setAttribute("aria-expanded", "false");
}));
const panel = document.querySelector(".cart-panel");
const backdrop = document.querySelector(".cart-backdrop");
const toast = document.querySelector(".toast");
let toastTimer;
function notify(message) {
  toast.textContent = message; toast.classList.add("show");
  clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove("show"), 3200);
}
function openCart() {
  panel.classList.add("open"); backdrop.hidden = false;
  panel.setAttribute("aria-hidden", "false"); document.body.classList.add("cart-open");
}
function closeCart() {
  panel.classList.remove("open"); backdrop.hidden = true;
  panel.setAttribute("aria-hidden", "true"); document.body.classList.remove("cart-open");
}
document.querySelector(".cart-trigger").addEventListener("click", openCart);
document.querySelector(".cart-close").addEventListener("click", closeCart);
backdrop.addEventListener("click", closeCart);
function money(value) { return value.toLocaleString("pt-BR", {style:"currency",currency:"BRL"}); }
function renderCart() {
  const entries = Object.entries(cart).filter(([,qty]) => qty > 0);
  const count = entries.reduce((sum,[,qty]) => sum + qty, 0);
  const total = entries.reduce((sum,[name,qty]) => sum + products[name] * qty, 0);
  document.querySelector(".cart-count").textContent = count;
  document.querySelector(".cart-total").textContent = money(total);
  const container = document.querySelector(".cart-items");
  if (!entries.length) { container.innerHTML = '<p class="cart-empty">Seu carrinho está vazio. Escolha seu burger favorito!</p>'; return; }
  container.innerHTML = entries.map(([name,qty]) => `<article class="cart-line"><div><strong>${name}</strong><small>${money(products[name])} cada</small></div><div class="quantity"><button type="button" data-action="minus" data-name="${name}" aria-label="Diminuir ${name}">−</button><b>${qty}</b><button type="button" data-action="plus" data-name="${name}" aria-label="Aumentar ${name}">+</button><button type="button" class="remove-item" data-action="remove" data-name="${name}" aria-label="Remover ${name}">×</button></div></article>`).join("");
}
document.querySelectorAll(".order-button").forEach(button => button.addEventListener("click", () => {
  const name = button.dataset.item; cart[name] = (cart[name] || 0) + 1;
  renderCart(); openCart();
}));
document.querySelector(".cart-items").addEventListener("click", event => {
  const button = event.target.closest("button[data-action]"); if (!button) return;
  const {name,action} = button.dataset;
  if (action === "plus") cart[name]++;
  if (action === "minus") cart[name]--;
  if (action === "remove" || cart[name] <= 0) delete cart[name];
  renderCart();
});
const deliveryFields = document.querySelector(".delivery-fields");
function updateFulfillment() {
  const delivery = document.querySelector('input[name="fulfillment"]:checked').value === "delivery";
  deliveryFields.hidden = !delivery;
  deliveryFields.querySelectorAll("input").forEach(input => input.required = delivery);
}
document.querySelectorAll('input[name="fulfillment"]').forEach(input => input.addEventListener("change", updateFulfillment));
updateFulfillment();
document.querySelector(".checkout-form").addEventListener("submit", event => {
  event.preventDefault();
  const entries = Object.entries(cart).filter(([,qty]) => qty > 0);
  if (!entries.length) { notify("Adicione um produto ao carrinho antes de finalizar."); return; }
  if (!WHATSAPP_NUMBER) { notify("Configure o número do WhatsApp no arquivo script.js para ativar os pedidos."); return; }
  const form = new FormData(event.currentTarget);
  const mode = form.get("fulfillment");
  const total = entries.reduce((sum,[name,qty]) => sum + products[name] * qty, 0);
  let message = `Olá! Quero fazer este pedido na Brasa Burger:
${entries.map(([name,qty]) => `• ${name} x${qty} — ${money(products[name]*qty)}`).join("\n")}
Total: ${money(total)}
Recebimento: ${mode === "delivery" ? "Delivery" : "Retirada"}`;
  if (mode === "delivery") message += `
Nome: ${form.get("customer")}
Endereço: ${form.get("address")}
N°: ${form.get("number")}
Ponto de referência: ${form.get("reference")}`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank", "noopener");
});
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add("visible"); observer.unobserve(entry.target); } });
}, {threshold:0.12});
document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
