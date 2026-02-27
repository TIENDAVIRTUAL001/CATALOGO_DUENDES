const gallery = document.getElementById('gallery');
const canvas = document.getElementById('preview');
const ctx = canvas.getContext('2d');
const bgColor = document.getElementById('bgColor');
const tintColor = document.getElementById('tintColor');
const tintOpacity = document.getElementById('tintOpacity');
const scaleEl = document.getElementById('scale');
const rotateEl = document.getElementById('rotate');
const labelText = document.getElementById('labelText');
const labelSize = document.getElementById('labelSize');
const labelColor = document.getElementById('labelColor');
const downloadBtn = document.getElementById('downloadBtn');
const whatsappLink = document.getElementById('whatsappLink');
const searchInput = document.getElementById('q');
const sortSelect = document.getElementById('sort');
const topWhatsapp = document.getElementById('topWhatsapp');

const PHONE = '573219170363'; // número sin signos

let currentImage = new Image();
let currentSrc = null;

function populateGallery(){
  // build cards and keep data
  IMAGES.forEach(src => {
    const card = document.createElement('article');
    card.className = 'card';
    const img = document.createElement('img');
    img.src = src;
    img.loading = 'lazy';
    img.alt = src;
    const meta = document.createElement('div');
    meta.className = 'meta';
    const name = document.createElement('div');
    name.className = 'name';
    name.textContent = src.split('/').pop();
    const actions = document.createElement('div');
    actions.className = 'actions';
    const btn = document.createElement('a');
    btn.href = `https://wa.me/${PHONE}?text=${encodeURIComponent('Hola, quiero información sobre este duende: '+src.split('/').pop())}`;
    btn.target = '_blank';
    btn.textContent = 'WhatsApp';
    actions.appendChild(btn);
    meta.appendChild(name);
    meta.appendChild(actions);
    card.appendChild(img);
    card.appendChild(meta);
    card.dataset.name = name.textContent.toLowerCase();
    card.addEventListener('click', ()=> loadToEditor(src));
    gallery.appendChild(card);
  });
}

function loadToEditor(src){
  currentSrc = src;
  currentImage = new Image();
  currentImage.crossOrigin = 'anonymous';
  currentImage.onload = render;
  currentImage.src = src;
  updateWhatsAppLink();
}

function updateWhatsAppLink(){
  const desc = labelText.value || 'Duende';
  whatsappLink.href = `https://wa.me/${PHONE}?text=${encodeURIComponent('Hola, quiero encargar un duende: '+desc)}`;
  whatsappLink.textContent = 'Contactar por WhatsApp';
  topWhatsapp.href = whatsappLink.href;
}

function render(){
  // limpiar
  ctx.fillStyle = bgColor.value;
  ctx.fillRect(0,0,canvas.width,canvas.height);

  // dibujar imagen centrada con escala y rotación
  const scale = parseFloat(scaleEl.value);
  const rot = parseFloat(rotateEl.value) * Math.PI/180;

  const iw = currentImage.width;
  const ih = currentImage.height;
  const aspect = iw/ih;

  let w = canvas.width * 0.9 * scale;
  let h = w / aspect;
  if(h > canvas.height * 0.9 * scale){
    h = canvas.height * 0.9 * scale;
    w = h * aspect;
  }

  const x = (canvas.width - w)/2;
  const y = (canvas.height - h)/2;

  ctx.save();
  ctx.translate(canvas.width/2, canvas.height/2);
  ctx.rotate(rot);
  ctx.drawImage(currentImage, -w/2, -h/2, w, h);
  ctx.restore();

  // aplicar tinte si corresponde
  const tColor = tintColor.value;
  const tOp = parseFloat(tintOpacity.value);
  if(tOp > 0){
    ctx.fillStyle = hexToRgba(tColor, tOp);
    ctx.fillRect(0,0,canvas.width,canvas.height);
  }

  // texto
  const text = labelText.value;
  if(text){
    ctx.fillStyle = labelColor.value;
    ctx.font = `${parseInt(labelSize.value,10)}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(text, canvas.width/2, canvas.height - 20);
  }
}

function hexToRgba(hex, a){
  const h = hex.replace('#','');
  const bigint = parseInt(h,16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r},${g},${b},${a})`;
}

// events
[bgColor,tintColor,tintOpacity,scaleEl,rotateEl,labelText,labelSize,labelColor].forEach(el=>{
  el.addEventListener('input', ()=>{
    render();
    updateWhatsAppLink();
  });
});

if(searchInput){
  searchInput.addEventListener('input', ()=>{
    const q = searchInput.value.trim().toLowerCase();
    Array.from(gallery.children).forEach(card=>{
      card.style.display = (!q || card.dataset.name.includes(q))? 'flex' : 'none';
    });
  });
}

if(sortSelect){
  sortSelect.addEventListener('change', ()=>{
    const cards = Array.from(gallery.children);
    if(sortSelect.value === 'name'){
      cards.sort((a,b)=> a.dataset.name.localeCompare(b.dataset.name));
    }
    cards.forEach(c=>gallery.appendChild(c));
  });
}

downloadBtn.addEventListener('click', ()=>{
  const url = canvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = url;
  a.download = (labelText.value || 'duende') + '.png';
  document.body.appendChild(a);
  a.click();
  a.remove();
});

// inicializar
populateGallery();
// precargar primer imagen si existe
if(IMAGES && IMAGES.length) loadToEditor(IMAGES[0]);
