// Personalize o número abaixo com DDI + DDD + número, somente dígitos.
const WHATSAPP_NUMBER = "5500000000000"; // Exemplo: 5582999999999
const DELIVERY_FEE = 5.00; // Taxa demonstrativa; ajuste conforme sua região.
const products = [
{id:1,name:"Brasa Clássico",category:"burgers",desc:"Burger 150g, queijo, alface, tomate e molho da casa.",price:24.90,tag:"O clássico",photo:"https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=85"},
{id:2,name:"Cheddar & Bacon",category:"burgers",desc:"Burger 150g, cheddar cremoso e bacon crocante.",price:29.90,tag:"Mais pedido",photo:"https://images.unsplash.com/photo-1553979459-d2229ba7433a?auto=format&fit=crop&w=800&q=85"},
{id:3,name:"Duplo Brasa",category:"burgers",desc:"Dois burgers, queijo duplo e molho especial.",price:34.90,tag:"Para matar a fome",photo:"https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=85"},
{id:4,name:"Frango Crocante",category:"burgers",desc:"Frango empanado, queijo, salada e maionese.",price:26.90,tag:"Crocante",photo:"https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=800&q=85"},
{id:5,name:"Batata da Casa",category:"acompanhamentos",desc:"Batatas douradas e crocantes para compartilhar.",price:14.90,tag:"Acompanhamento",photo:"https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=85"},
{id:6,name:"Onion Rings",category:"acompanhamentos",desc:"Anéis de cebola empanados e sequinhos.",price:16.90,tag:"Crocante",photo:"https://images.unsplash.com/photo-1639024471283-03518883512d?auto=format&fit=crop&w=800&q=85"},
{id:7,name:"Refrigerante",category:"bebidas",desc:"Lata 350 ml. Escolha seu sabor nas observações.",price:6.00,tag:"Geladinho",photo:"https://images.unsplash.com/photo-1581636625402-29b2a704ef13?auto=format&fit=crop&w=800&q=85"},
{id:8,name:"Milk-shake",category:"bebidas",desc:"Cremoso, 300 ml. Chocolate ou morango.",price:15.90,tag:"Doce final",photo:"https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=85"}
];
const cart = {}; let method = "retirada"; const brl = n => n.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
const $ = id => document.getElementById(id);
function renderProducts(category="todos"){
 const list=products.filter(p=>category==="todos"||p.category===category);
 $("products").innerHTML=list.map(p=>`<article class="product"><div class="product-photo"><img loading="lazy" src="${p.photo}" alt="${p.name}" onerror="this.src='https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80'"><span class="tag">${p.tag}</span></div><div class="product-info"><h3>${p.name}</h3><p>${p.desc}</p><div class="product-bottom"><span class="price">${brl(p.price)}</span><button class="add" onclick="add(${p.id})">+ Adicionar</button></div></div></article>`).join("");
}
function filterMenu(category,button){document.querySelectorAll(".filter").forEach(b=>b.classList.remove("active"));button.classList.add("active");renderProducts(category)}
function add(id){cart[id]=(cart[id]||0)+1;renderCart();toast("Adicionado ao carrinho!");}
function change(id,delta){cart[id]=(cart[id]||0)+delta;if(cart[id]<=0)delete cart[id];renderCart()}
function removeItem(id){delete cart[id];renderCart()}
function totals(){const sub=Object.entries(cart).reduce((s,[id,q])=>s+products.find(p=>p.id==id).price*q,0);const fee=method==="delivery"&&sub?DELIVERY_FEE:0;return{sub,fee,total:sub+fee,count:Object.values(cart).reduce((a,b)=>a+b,0)}}
function renderCart(){
 const t=totals();$("count").textContent=t.count;$("drawer-count").textContent=`(${t.count})`;
 $("cart-list").innerHTML=t.count?Object.entries(cart).map(([id,q])=>{const p=products.find(x=>x.id==id);return `<div class="cart-item"><img src="${p.photo}" alt=""><div><h4>${p.name}</h4><small>${brl(p.price)} cada · ${brl(p.price*q)}</small><div class="qty"><button onclick="change(${id},-1)" aria-label="Diminuir">−</button><b>${q}</b><button onclick="change(${id},1)" aria-label="Aumentar">+</button></div></div><button class="remove" onclick="removeItem(${id})">Remover</button></div>`}).join(""):'<div class="empty">🛍️<strong>Seu carrinho está vazio</strong>Escolha algo delicioso no cardápio.</div>';
 $("subtotal").textContent=brl(t.sub);$("fee").textContent=brl(t.fee);$("total").textContent=brl(t.total);$("finish").disabled=!t.count;
}
function openCart(){$("drawer").classList.add("show");$("overlay").classList.add("show");document.body.style.overflow="hidden"}
function closeCart(){$("drawer").classList.remove("show");$("overlay").classList.remove("show");document.body.style.overflow=""}
function setMethod(m){method=m;$("pickup").classList.toggle("active",m==="retirada");$("delivery").classList.toggle("active",m==="delivery");$("address-fields").style.display=m==="delivery"?"block":"none";$("pickup-fields").style.display=m==="retirada"?"block":"none";renderCart()}
function toast(message){$("toast").textContent=message;$("toast").classList.add("show");setTimeout(()=>$("toast").classList.remove("show"),1700)}
function finishOrder(){
 const name=$("customer").value.trim(),phone=$("phone").value.trim(),address=$("address").value.trim();
 if(!name||!phone||(method==="delivery"&&!address)){alert("Preencha nome, WhatsApp e o endereço para delivery.");return}
 if(WHATSAPP_NUMBER==="5500000000000"){alert("Antes de usar, configure o número de WhatsApp da loja no arquivo script.js.");return}
 const t=totals(),lines=Object.entries(cart).map(([id,q])=>{const p=products.find(x=>x.id==id);return `• ${q}x ${p.name} — ${brl(p.price*q)}`}).join("%0A");
 const msg=`Olá! Quero fazer um pedido na Brasa Burger.%0A%0A${encodeURIComponent(name)}%0A${encodeURIComponent(phone)}%0A%0A${encodeURIComponent(lines)}%0A%0ARecebimento: ${method==="delivery"?"Delivery":"Retirada no balcão"}%0A${method==="delivery"?"Endereço: "+encodeURIComponent(address+" "+$("city").value+" "+$("cep").value)+"%0AReferência: "+encodeURIComponent($("reference").value):""}%0APagamento: ${encodeURIComponent($("payment").value)}%0AObservações: ${encodeURIComponent($("notes").value)}%0A%0ASubtotal: ${encodeURIComponent(brl(t.sub))}%0ATaxa: ${encodeURIComponent(brl(t.fee))}%0ATotal: ${encodeURIComponent(brl(t.total))}`;
 window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`,"_blank");
}
renderProducts();renderCart();
