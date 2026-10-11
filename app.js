'use strict';
const WHATSAPP='525645249140';
const products=[
['001','Michelada Mega','$120','Alcohol','Corona o Victoria',120],
['002','Latón de cerveza','$70','Alcohol','Modelo, Victoria, High Life o Heineken',70],
['003','Cantarito chico 473 ml','$80','Alcohol','Cítricos y escarchado',80],
['004','Cantarito 1 litro','$150','Alcohol','Presentación de 1 litro',150],
['005','Paloma 16 oz','$80','Alcohol','Bebida refrescante de toronja',80],
['006','Azulito 1 litro','$100','Alcohol','Bebida azul preparada',100],
['007','Happy Drink Red 1 litro','$110','Alcohol','Especialidad de la casa',110],
['008','Happy Frost','$100','Alcohol','Mora azul o fresa',100],
['009','Mojito 1 litro','$110','Alcohol','Tradicional, frutos rojos, Yakult, fresa, coco, pica fresa o uva',110],
['010','Piña colada 16 oz','$120','Alcohol','Piña y coco',120],
['011','Peñafiel preparada 16 oz','$60','Bebidas frías','Bebida preparada',60],
['012','Soda italiana 16 oz','$60','Bebidas frías','Mora azul, manzana verde, mango, fresa o frutos rojos. Perlas extras +$15',60],
['013','Frappé 16 oz','$80','Bebidas frías','Cajeta, Oreo, mazapán, Nutella, capuchino moka, fresa con mazapán, licholatte con fresa, taro, red velvet, blueberry o fresas con crema. Tapioca +$10',80],
['014','Coca-Cola Zero','$30','Refrescos','',30],
['015','Coca-Cola clásica','$30','Refrescos','',30],
['016','Jarritos (sabores)','$25','Refrescos','Consultar sabores disponibles',25],
['017','Boing (sabores)','$25','Refrescos','Botella de vidrio',25],
['018','Agua natural 1 litro','$18','Refrescos','Botella de 1 litro',18],
['019','Chocolate caliente 355 ml','$35','Bebidas calientes','Con bombones',35],
['020','Capuchino moka 355 ml','$35','Bebidas calientes','',35],
['021','Capuchino clásico 355 ml','$35','Bebidas calientes','',35],
['022','Capuchino vainilla 355 ml','$35','Bebidas calientes','',35],
['023','Alitas con papas','$120','Snacks','',120],
['024','Boneless con papas','$120','Snacks','',120],
['025','Tenders de pollo con papas','$140','Snacks','',140],
['026','Costillas','$150','Snacks','Salsas: mango, piña habanero, mango habanero, BBQ, wings o búfalo',150],
['027','Papas a la francesa','$60','Snacks','',60],
['028','Maruchan','$35','Snacks','',35]
].map(([id,name,display,category,description,price])=>({id,name,display,category,description,price,image:`HD-${id}.webp`}));
const categories=['Todos','Alcohol','Bebidas frías','Refrescos','Bebidas calientes','Snacks'];
const $=id=>document.getElementById(id);
let active='Todos',term='',cart={};
const productById=Object.fromEntries(products.map(p=>[p.id,p]));
const money=n=>'$'+n.toLocaleString('es-MX');
function render(){const visible=products.filter(p=>(active==='Todos'||p.category===active)&&(p.name+' '+p.description).toLowerCase().includes(term));const groups=active==='Todos'?categories.slice(1):[active];$('catalog').innerHTML=groups.map(g=>{const items=visible.filter(p=>p.category===g);if(!items.length)return '';return `<section class="category"><h2>${g}</h2><div class="products">${items.map(p=>`<article class="product"><img loading="lazy" src="${p.image}" alt="${p.name}"><div class="product-info"><h3>${p.name}</h3><div class="desc">${p.description||'Disponible para ordenar'}</div><div class="price">${p.display}</div><button class="add" data-id="${p.id}">+ Agregar</button></div></article>`).join('')}</div></section>`}).join('')||'<p>No encontramos productos con esa búsqueda.</p>';document.querySelectorAll('.add').forEach(b=>b.onclick=()=>add(b.dataset.id));}
function filters(){$('filters').innerHTML=categories.map(c=>`<button data-cat="${c}" class="${c===active?'active':''}">${c}</button>`).join('');document.querySelectorAll('[data-cat]').forEach(b=>b.onclick=()=>{active=b.dataset.cat;filters();render()});}
function add(id){if(!cart[id])cart[id]={qty:0,note:''};cart[id].qty++;renderCart();if ($('cartButton').animate) $('cartButton').animate([{transform:'scale(1)'},{transform:'scale(1.12)'},{transform:'scale(1)'}],{duration:220});}
function renderCart(){const ids=Object.keys(cart).filter(id=>cart[id].qty>0);const count=ids.reduce((s,id)=>s+cart[id].qty,0),total=ids.reduce((s,id)=>s+productById[id].price*cart[id].qty,0);$('cartCount').textContent=count;$('cartTotal').textContent=money(total);$('checkoutTotal').textContent=money(total);$('cartItems').innerHTML=ids.length?ids.map(id=>{const p=productById[id],item=cart[id];return `<div class="cart-line"><div><strong>${p.name}</strong><span>${money(p.price*item.qty)}</span></div><div><div class="qty"><button data-action="minus" data-id="${id}" aria-label="Quitar uno">−</button>${item.qty}<button data-action="plus" data-id="${id}" aria-label="Agregar uno">+</button></div></div><input class="item-note" data-note="${id}" placeholder="Nota para este producto" value="${escapeHtml(item.note)}"></div>`}).join(''):'<p>Tu carrito está vacío.</p>';document.querySelectorAll('[data-action]').forEach(b=>b.onclick=()=>{const id=b.dataset.id;cart[id].qty+=b.dataset.action==='plus'?1:-1;if(cart[id].qty<=0)delete cart[id];renderCart()});document.querySelectorAll('[data-note]').forEach(el=>el.oninput=()=>{cart[el.dataset.note].note=el.value});$('sendOrder').disabled=!count;}
function escapeHtml(s){return String(s).replace(/[&"<>]/g,c=>({'&':'&amp;','"':'&quot;','<':'&lt;','>':'&gt;'}[c]));}
function openCart(open){$('cartPanel').classList.toggle('open',open);$('cartPanel').setAttribute('aria-hidden',String(!open));$('overlay').hidden=!open;document.body.classList.toggle('cart-open',open);if(open)$('closeCart').focus();else $('cartButton').focus();}
$('cartButton').onclick=()=>openCart(true);$('closeCart').onclick=()=>openCart(false);$('overlay').onclick=()=>openCart(false);document.addEventListener('keydown',e=>{if(e.key==='Escape')openCart(false)});$('search').oninput=e=>{term=e.target.value.toLowerCase().trim();render()};$('clearCart').onclick=()=>{cart={};renderCart()};$('sendOrder').onclick=()=>{
 const ids=Object.keys(cart).filter(id=>cart[id].qty>0);
 if(!ids.length)return;
 const total=ids.reduce((sum,id)=>sum+productById[id].price*cart[id].qty,0);
 const now=new Date();
 const fecha=now.toLocaleDateString('es-MX',{day:'2-digit',month:'2-digit',year:'numeric'});
 const hora=now.toLocaleTimeString('es-MX',{hour:'2-digit',minute:'2-digit',hour12:false});
 const folio=`HD-${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}-${String(now.getHours()).padStart(2,'0')}${String(now.getMinutes()).padStart(2,'0')}${String(now.getSeconds()).padStart(2,'0')}`;
 const lines=['¡Hola! Quiero realizar el siguiente pedido:','','🛍️ *PEDIDO HAPPY DRINK*',`🏷️ *Folio: ${folio}*`,`📅 *Fecha: ${fecha}*`,`🕒 *Hora: ${hora}*`,''];
 ids.forEach((id,i)=>{const p=productById[id],c=cart[id];lines.push(`${i+1}. ${c.qty} x *${p.name}*`,money(c.qty*p.price));if(c.note.trim())lines.push(`   📝 Nota: ${c.note.trim()}`)});
 lines.push('',`💰 *TOTAL ESTIMADO: ${money(total)}*`,`📦 Modalidad: ${$('orderMode').value}`);
 if($('customer').value.trim())lines.push(`👤 Nombre: ${$('customer').value.trim()}`);
 if($('notes').value.trim())lines.push(`📝 Indicaciones: ${$('notes').value.trim()}`);
 lines.push('','¿Me confirman disponibilidad y el total, por favor?');
 const url=`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(lines.join('\n'))}`;
 const opened=window.open(url,'_blank','noopener,noreferrer');if(!opened)window.location.href=url;
};filters();render();renderCart();
