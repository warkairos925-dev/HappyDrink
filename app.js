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
function add(id){if(!Object.prototype.hasOwnProperty.call(productById,id))return;if(!cart[id])cart[id]={qty:0,note:''};cart[id].qty=Math.min(99,cart[id].qty+1);renderCart();if ($('cartButton').animate) $('cartButton').animate([{transform:'scale(1)'},{transform:'scale(1.12)'},{transform:'scale(1)'}],{duration:220});}
function renderCart(){const ids=Object.keys(cart).filter(id=>Object.prototype.hasOwnProperty.call(productById,id)&&cart[id].qty>0);const count=ids.reduce((s,id)=>s+cart[id].qty,0),total=ids.reduce((s,id)=>s+productById[id].price*cart[id].qty,0);$('cartCount').textContent=count;$('cartTotal').textContent=money(total);$('checkoutTotal').textContent=money(total);$('cartItems').innerHTML=ids.length?ids.map(id=>{const p=productById[id],item=cart[id];return `<div class="cart-line"><div><strong>${p.name}</strong><span>${money(p.price*item.qty)}</span></div><div><div class="qty"><button data-action="minus" data-id="${id}" aria-label="Quitar uno">−</button>${item.qty}<button data-action="plus" data-id="${id}" aria-label="Agregar uno">+</button></div></div><input class="item-note" data-note="${id}" placeholder="Nota para este producto" value="${escapeHtml(item.note)}"></div>`}).join(''):'<p>Tu carrito está vacío.</p>';document.querySelectorAll('[data-action]').forEach(b=>b.onclick=()=>{const id=b.dataset.id;cart[id].qty=Math.max(0,Math.min(99,cart[id].qty+(b.dataset.action==='plus'?1:-1)));if(cart[id].qty<=0)delete cart[id];renderCart()});document.querySelectorAll('[data-note]').forEach(el=>el.oninput=()=>{if(cart[el.dataset.note])cart[el.dataset.note].note=el.value.slice(0,300)});$('sendOrder').disabled=!count;}
function escapeHtml(s){return String(s).replace(/[&"<>]/g,c=>({'&':'&amp;','"':'&quot;','<':'&lt;','>':'&gt;'}[c]));}
function openCart(open){$('cartPanel').classList.toggle('open',open);$('cartPanel').setAttribute('aria-hidden',String(!open));$('overlay').hidden=!open;document.body.classList.toggle('cart-open',open);if(open)$('closeCart').focus();else $('cartButton').focus();}
$('cartButton').onclick=()=>openCart(true);$('closeCart').onclick=()=>openCart(false);$('overlay').onclick=()=>openCart(false);document.addEventListener('keydown',e=>{if(e.key==='Escape')openCart(false)});$('search').oninput=e=>{term=e.target.value.toLowerCase().trim();render()};$('clearCart').onclick=()=>{cart={};$('afterOrder').hidden=true;renderCart()};$('sendOrder').onclick=()=>{
 const ids=Object.keys(cart).filter(id=>Object.prototype.hasOwnProperty.call(productById,id)&&cart[id].qty>0);
 if(!ids.length)return;
 const customerName=$('customer').value.trim();
 if(!customerName){$('customer').focus();$('customer').setCustomValidity('Ingresa tu nombre para continuar.');$('customer').reportValidity();return;}
 $('customer').setCustomValidity('');
 const total=ids.reduce((sum,id)=>sum+productById[id].price*cart[id].qty,0);
 const now=new Date();
 const fecha=now.toLocaleDateString('es-MX',{day:'2-digit',month:'2-digit',year:'numeric'});
 const hora=now.toLocaleTimeString('es-MX',{hour:'2-digit',minute:'2-digit',hour12:false});
 const unique=(typeof crypto!=='undefined'&&typeof crypto.randomUUID==='function')?crypto.randomUUID().replace(/-/g,'').slice(0,8).toUpperCase():`${String(now.getMilliseconds()).padStart(3,'0')}${Math.random().toString(36).slice(2,7).toUpperCase()}`;
 const folio=`HD-${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}-${String(now.getHours()).padStart(2,'0')}${String(now.getMinutes()).padStart(2,'0')}${String(now.getSeconds()).padStart(2,'0')}-${unique}`;
 const lines=['¡Hola! Quiero realizar el siguiente pedido:','','🛍️ *PEDIDO HAPPY DRINK*',`🏷️ *Folio: ${folio}*`,`📅 *Fecha: ${fecha}*`,`🕒 *Hora: ${hora}*`,''];
 ids.forEach((id,i)=>{const p=productById[id],c=cart[id];lines.push(`${i+1}. ${c.qty} x *${p.name}*`,money(c.qty*p.price));if(c.note.trim())lines.push(`   📝 Nota: ${c.note.trim().slice(0,300)}`)});
 lines.push('',`💰 *TOTAL ESTIMADO: ${money(total)}*`,`📦 Modalidad: ${$('orderMode').value}`);
 lines.push(`👤 Nombre: ${customerName.slice(0,90)}`);
 if($('notes').value.trim().slice(0,500))lines.push(`📝 Indicaciones: ${$('notes').value.trim().slice(0,500)}`);
 lines.push('','¿Me confirman disponibilidad y el total, por favor?');
 const url=`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(lines.join('\n'))}`;
 $('afterOrder').hidden=false;const opened=window.open(url,'_blank');if(!opened)window.location.href=url;
};
$('backToMenu').onclick=()=>{openCart(false);document.querySelector('.intro').scrollIntoView({behavior:'smooth',block:'start'});};
$('newOrder').onclick=()=>{cart={};$('customer').value='';$('notes').value='';$('orderMode').selectedIndex=0;$('afterOrder').hidden=true;renderCart();openCart(false);window.scrollTo({top:0,behavior:'smooth'});};
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