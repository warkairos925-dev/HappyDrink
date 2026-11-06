'use strict';
const WHATSAPP='525645249140';
let products=[];
let categories=['Todos'];
const $=id=>document.getElementById(id);
let active='Todos',term='',cart={};
let productById={};
const money=n=>'$'+n.toLocaleString('es-MX');
function render(){const visible=products.filter(p=>(active==='Todos'||p.category===active)&&(p.name+' '+p.description).toLowerCase().includes(term));const groups=active==='Todos'?categories.slice(1):[active];$('catalog').innerHTML=groups.map(g=>{const items=visible.filter(p=>p.category===g);if(!items.length)return '';return `<section class="category"><h2>${escapeHtml(g)}</h2><div class="products">${items.map(p=>`<article class="product">${p.image?`<img loading="lazy" src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}">`:`<div class="photo-pending" role="img" aria-label="Fotografía de ${escapeHtml(p.name)} pendiente"><span>Fotografía en actualización</span></div>`}<div class="product-info"><h3>${escapeHtml(p.name)}</h3><div class="desc">${escapeHtml(p.description||'Disponible para ordenar')}</div><div class="price">${escapeHtml(p.display)}</div><button class="add" data-id="${escapeHtml(p.id)}">+ Agregar</button></div></article>`).join('')}</div></section>`}).join('')||'<p>No encontramos productos con esa búsqueda.</p>';document.querySelectorAll('.add').forEach(b=>b.onclick=()=>add(b.dataset.id));}
function filters(){$('filters').innerHTML=categories.map(c=>`<button data-cat="${c}" class="${c===active?'active':''}">${c}</button>`).join('');document.querySelectorAll('[data-cat]').forEach(b=>b.onclick=()=>{active=b.dataset.cat;filters();render()});}
function add(id){if(orderSent){alert('Tu pedido ya se registró. Selecciona Hacer otro pedido para empezar una nueva orden.');return;}if(!Object.prototype.hasOwnProperty.call(productById,id))return;if(!cart[id])cart[id]={qty:0,note:''};cart[id].qty=Math.min(99,cart[id].qty+1);renderCart();if ($('cartButton').animate) $('cartButton').animate([{transform:'scale(1)'},{transform:'scale(1.12)'},{transform:'scale(1)'}],{duration:220});}
function renderCart(){const ids=Object.keys(cart).filter(id=>Object.prototype.hasOwnProperty.call(productById,id)&&cart[id].qty>0);const count=ids.reduce((s,id)=>s+cart[id].qty,0),total=ids.reduce((s,id)=>s+productById[id].price*cart[id].qty,0);$('cartCount').textContent=count;$('cartTotal').textContent=money(total);$('checkoutTotal').textContent=money(total);$('cartItems').innerHTML=ids.length?ids.map(id=>{const p=productById[id],item=cart[id];return `<div class="cart-line"><div><strong>${p.name}</strong><span>${money(p.price*item.qty)}</span></div><div><div class="qty"><button data-action="minus" data-id="${id}" aria-label="Quitar uno">−</button>${item.qty}<button data-action="plus" data-id="${id}" aria-label="Agregar uno">+</button></div></div><input class="item-note" data-note="${id}" placeholder="Nota para este producto" value="${escapeHtml(item.note)}"></div>`}).join(''):'<p>Tu carrito está vacío.</p>';document.querySelectorAll('[data-action]').forEach(b=>b.onclick=()=>{const id=b.dataset.id;cart[id].qty=Math.max(0,Math.min(99,cart[id].qty+(b.dataset.action==='plus'?1:-1)));if(cart[id].qty<=0)delete cart[id];renderCart()});document.querySelectorAll('[data-note]').forEach(el=>el.oninput=()=>{if(cart[el.dataset.note])cart[el.dataset.note].note=el.value.slice(0,300)});$('sendOrder').disabled=!count || orderSent || submittingOrder;}
function escapeHtml(s){return String(s).replace(/[&"<>]/g,c=>({'&':'&amp;','"':'&quot;','<':'&lt;','>':'&gt;'}[c]));}
function openCart(open){$('cartPanel').classList.toggle('open',open);$('cartPanel').setAttribute('aria-hidden',String(!open));$('overlay').hidden=!open;document.body.classList.toggle('cart-open',open);if(open)$('closeCart').focus();else $('cartButton').focus();}
$('cartButton').onclick=()=>openCart(true);$('closeCart').onclick=()=>openCart(false);$('overlay').onclick=()=>openCart(false);document.addEventListener('keydown',e=>{if(e.key==='Escape')openCart(false)});$('search').oninput=e=>{term=e.target.value.toLowerCase().trim();render()};$('clearCart').onclick=()=>{cart={};$('afterOrder').hidden=true;resetSubmitted();renderCart()};// La operación principal ahora registra un pedido en D1 antes de ofrecer WhatsApp.
const ORDERS_API='https://happy-drink-api.war-kairos925.workers.dev/api/public/orders';
let orderSent=false,submittingOrder=false;
let lastWhatsAppURL='';
const sendButton=$('sendOrder');
sendButton.textContent='Registrar pedido en Happy Drink';
const confirmation=$('afterOrder');
const confirmationText=confirmation.querySelector('p');
const whatsappButton=document.createElement('button');
whatsappButton.type='button';whatsappButton.className='secondary-action';
whatsappButton.textContent='Enviar copia por WhatsApp ↗';
whatsappButton.hidden=true;
confirmation.appendChild(whatsappButton);
whatsappButton.onclick=()=>{if(lastWhatsAppURL)window.open(lastWhatsAppURL,'_blank','noopener,noreferrer');};
const orderStatus=document.createElement('div');
orderStatus.setAttribute('role','status');orderStatus.setAttribute('aria-live','polite');
orderStatus.style.cssText='font-weight:700;margin:12px 0;line-height:1.4';
sendButton.insertAdjacentElement('afterend',orderStatus);
function newPending(fingerprint){
 let saved=null;
 try{saved=JSON.parse(sessionStorage.getItem('hd_pending_menu_order')||'null')}catch{}
 if(saved && saved.fingerprint===fingerprint && /^HD-\d{8}-\d{6}-[A-Z0-9]{8}$/.test(saved.folio))return saved.folio;
 const now=new Date();
 const date=[now.getFullYear(),String(now.getMonth()+1).padStart(2,'0'),String(now.getDate()).padStart(2,'0')].join('');
 const time=[String(now.getHours()).padStart(2,'0'),String(now.getMinutes()).padStart(2,'0'),String(now.getSeconds()).padStart(2,'0')].join('');
 const rnd=crypto.getRandomValues(new Uint8Array(4));
 const hex=Array.from(rnd,b=>b.toString(16).padStart(2,'0')).join('').toUpperCase();
 const folio=`HD-${date}-${time}-${hex}`;
 try{sessionStorage.setItem('hd_pending_menu_order',JSON.stringify({fingerprint,folio}))}catch{}
 return folio;
}
function resetSubmitted(){
 orderSent=false;submittingOrder=false;lastWhatsAppURL='';
 sendButton.disabled=false;sendButton.textContent='Registrar pedido en Happy Drink';
 orderStatus.textContent='';whatsappButton.hidden=true;
 try{sessionStorage.removeItem('hd_pending_menu_order')}catch{}
}
function whatsappURL(folio,items,customerName,mode,note,total,orderId){
 const now=new Date();
 const fecha=now.toLocaleDateString('es-MX',{day:'2-digit',month:'2-digit',year:'numeric'});
 const hora=now.toLocaleTimeString('es-MX',{hour:'2-digit',minute:'2-digit',hour12:false});
 const lines=['¡Hola! Quiero confirmar el siguiente pedido:','','🛍️ *PEDIDO HAPPY DRINK*',
  `🏷️ *Folio: ${folio}*`,`🧾 *Orden PV: #${orderId}*`,`📅 *Fecha: ${fecha}*`,`🕒 *Hora: ${hora}*`,''];
 items.forEach((it,i)=>{const p=productById[String(it.id)];lines.push(`${i+1}. ${it.quantity} x *${p.name}*`,money(p.price*it.quantity));if(it.note)lines.push(`   📝 Nota: ${it.note}`)});
 lines.push('',`💰 *TOTAL: ${money(total)}*`,`📦 Modalidad: ${mode}`,`👤 Nombre: ${customerName}`);
 if(note)lines.push(`📝 Indicaciones: ${note}`);
 lines.push('','El pedido ya fue registrado en el Punto de Venta. ¿Me confirman disponibilidad?');
 return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(lines.join('\n'))}`;
}
$('sendOrder').onclick=async()=>{
 if(submittingOrder || orderSent)return;
 const ids=Object.keys(cart).filter(id=>Object.prototype.hasOwnProperty.call(productById,id)&&cart[id].qty>0);
 if(!ids.length)return;
 const customerName=$('customer').value.trim();
 if(!customerName){$('customer').focus();$('customer').setCustomValidity('Ingresa tu nombre para continuar.');$('customer').reportValidity();return;}
 $('customer').setCustomValidity('');
 const mode=$('orderMode').value;
 const note=$('notes').value.trim().slice(0,250);
 const items=ids.map(id=>({id:Number(id),quantity:cart[id].qty,note:cart[id].note.trim().slice(0,200)}));
 const fingerprint=JSON.stringify({customerName,mode,note,items});
 const folio=newPending(fingerprint);
 submittingOrder=true;sendButton.disabled=true;sendButton.textContent='Registrando pedido…';
 orderStatus.textContent='Conectando con el Punto de Venta…';
 try{
  const response=await fetch(ORDERS_API,{method:'POST',mode:'cors',cache:'no-store',
   headers:{'Content-Type':'application/json'},
   body:JSON.stringify({folio,customer_name:customerName,mode,note,items})});
  const result=await response.json();
  if(!response.ok || !result.ok)throw Error(result.error||`No se pudo registrar (HTTP ${response.status})`);
  const total=result.total_cents/100;
  if(!Number.isFinite(total))throw Error('Respuesta inválida del Punto de Venta');
  orderSent=true;
  try{sessionStorage.removeItem('hd_pending_menu_order')}catch{}
  orderStatus.textContent=`Pedido #${result.order_id} registrado en el PV. Folio: ${folio}. Total: ${money(total)}.`;
  confirmation.hidden=false;
  const h=confirmation.querySelector('h3');if(h)h.textContent='Pedido recibido en el Punto de Venta';
  confirmationText.textContent='Tu pedido quedó registrado. WhatsApp es opcional y no es necesario para que el personal lo vea.';
  lastWhatsAppURL=whatsappURL(folio,items,customerName,mode,note,total,result.order_id);
  whatsappButton.hidden=false;
  sendButton.textContent='Pedido registrado';
 }catch(error){
  orderStatus.textContent=`No se registró el pedido: ${error.message}. Vuelve a intentarlo.`;
  sendButton.disabled=false;sendButton.textContent='Reintentar registro de pedido';
 }finally{submittingOrder=false; if(orderSent)sendButton.disabled=true;}
};
$('backToMenu').onclick=()=>{openCart(false);document.querySelector('.intro').scrollIntoView({behavior:'smooth',block:'start'});};
$('newOrder').onclick=()=>{resetSubmitted();cart={};$('customer').value='';$('notes').value='';$('orderMode').selectedIndex=0;$('afterOrder').hidden=true;renderCart();openCart(false);window.scrollTo({top:0,behavior:'smooth'});};
document.querySelectorAll('[data-copy]').forEach(button=>button.addEventListener('click',async()=>{const value=$(button.dataset.copy).textContent.trim();try{await navigator.clipboard.writeText(value);$('copyStatus').textContent='Dato copiado correctamente.';}catch(e){$('copyStatus').textContent='Selecciona el número y cópialo manualmente.';}}));

async function refreshCatalog(){
 try{
  const response=await fetch('https://happy-drink-api.war-kairos925.workers.dev/api/public/catalog',{cache:'no-store'});
  if(!response.ok)throw Error('Catálogo no disponible');
  const payload=await response.json();
  if(!Array.isArray(payload.products))throw Error('Respuesta inválida');
  products=payload.products.map(p=>({
   id:String(p.id),name:String(p.name),display:money(p.price_cents/100),
   category:String(p.category),description:String(p.description||''),
   price:p.price_cents/100,image:p.image_url||null
  }));
  categories=['Todos',...new Set(products.map(p=>p.category))];
  productById=Object.fromEntries(products.map(p=>[p.id,p]));
  for(const id of Object.keys(cart))if(!productById[id])delete cart[id];
  if(!categories.includes(active))active='Todos';
  filters();render();renderCart();
 }catch(error){
  products=[];categories=['Todos'];productById={};cart={};
  filters();render();renderCart();
  $('catalog').textContent='No se pudo cargar el catálogo. Intenta nuevamente en unos momentos.';
 }
}

refreshCatalog();setInterval(refreshCatalog,60000);
const introText=document.querySelector('.intro p:not(.eyebrow)');if(introText)introText.textContent='Elige tus productos y registra tu pedido directamente en Happy Drink. Puedes enviar una copia por WhatsApp si lo deseas.';
