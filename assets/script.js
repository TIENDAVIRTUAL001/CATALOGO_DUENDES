const gallery = document.getElementById('gallery');
const canvas = document.getElementById('preview');
const ctx = canvas.getContext('2d');

const bgColor = document.getElementById('bgColor');
const bgColor2 = document.getElementById('bgColor2');
const bgStyle = document.getElementById('bgStyle');
const skinColor = document.getElementById('skinColor');
const hatColor = document.getElementById('hatColor');
const hatStyle = document.getElementById('hatStyle');
const clothColor = document.getElementById('clothColor');
const clothPattern = document.getElementById('clothPattern');
const eyeColor = document.getElementById('eyeColor');
const eyeStyle = document.getElementById('eyeStyle');
const browStyle = document.getElementById('browStyle');
const mouthStyle = document.getElementById('mouthStyle');
const beardStyle = document.getElementById('beardStyle');
const accessory = document.getElementById('accessory');
const frameStyle = document.getElementById('frameStyle');
const sparkle = document.getElementById('sparkle');
const labelText = document.getElementById('labelText');

const sendWhatsappBtn = document.getElementById('sendWhatsappBtn');
const whatsappLink = document.getElementById('whatsappLink');
const topWhatsapp = document.getElementById('topWhatsapp');
const heroWhatsapp = document.getElementById('heroWhatsapp');

const searchInput = document.getElementById('q');
const sortSelect = document.getElementById('sort');
const randomElfBtn = document.getElementById('randomElfBtn');
const catalogCount = document.getElementById('catalogCount');

const openAdminBtn = document.getElementById('openAdminBtn');
const adminPanel = document.getElementById('adminPanel');
const adminAuth = document.getElementById('adminAuth');
const adminContent = document.getElementById('adminContent');
const adminPassword = document.getElementById('adminPassword');
const adminLoginBtn = document.getElementById('adminLoginBtn');
const newElfName = document.getElementById('newElfName');
const newElfImage = document.getElementById('newElfImage');
const newElfFile = document.getElementById('newElfFile');
const addElfBtn = document.getElementById('addElfBtn');
const resetCatalogBtn = document.getElementById('resetCatalogBtn');
const adminList = document.getElementById('adminList');

const PHONE = '573219170363';
const ADMIN_PASSWORD = 'DuenDes123@@@';
const STATE_KEY = 'duendesCatalogo.ultra.v1';

const INITIAL_DUENDES = [
  { id: 'd1', name: 'Rodolfo', image: 'IMAGENES/1.jpeg' },
  { id: 'd2', name: 'Rigo', image: 'IMAGENES/2.jpeg' },
  { id: 'd3', name: 'Bruno', image: 'IMAGENES/3.jpeg' },
  { id: 'd4', name: 'Lino', image: 'IMAGENES/4.jpeg' },
  { id: 'd5', name: 'Tizón', image: 'IMAGENES/5.jpeg' },
  { id: 'd6', name: 'Nico', image: 'IMAGENES/6.jpeg' },
  { id: 'd7', name: 'Pipo', image: 'IMAGENES/7.jpeg' },
  { id: 'd8', name: 'Ciro', image: 'IMAGENES/8.jpeg' },
  { id: 'd9', name: 'Milo', image: 'IMAGENES/9.jpeg' },
  { id: 'd10', name: 'Teo', image: 'IMAGENES/10.jpeg' },
  { id: 'd11', name: 'Nando', image: 'IMAGENES/11.jpeg' },
  { id: 'd12', name: 'Barto', image: 'IMAGENES/12.jpeg' },
  { id: 'd13', name: 'Félix', image: 'IMAGENES/13.jpeg' },
  { id: 'd14', name: 'Galo', image: 'IMAGENES/14.jpeg' },
  { id: 'd15', name: 'Rufi', image: 'IMAGENES/15.jpeg' },
  { id: 'd16', name: 'Beto', image: 'IMAGENES/16.jpeg' },
  { id: 'd17', name: 'Timo', image: 'IMAGENES/17.jpeg' },
  { id: 'd18', name: 'Santi', image: 'IMAGENES/18.jpeg' },
  { id: 'd19', name: 'Mauro', image: 'IMAGENES/19.jpeg' }
];

let inventory = loadInventory();
let visibleInventory = [];
let selectedElf = null;
let activeCard = null;
let adminUnlocked = false;

function loadInventory() {
  const raw = localStorage.getItem(STATE_KEY);
  if (!raw) {
    localStorage.setItem(STATE_KEY, JSON.stringify(INITIAL_DUENDES));
    return [...INITIAL_DUENDES];
  }

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [...INITIAL_DUENDES];
    return parsed.filter((item) => item?.id && item?.name && item?.image);
  } catch {
    return [...INITIAL_DUENDES];
  }
}

function saveInventory() {
  localStorage.setItem(STATE_KEY, JSON.stringify(inventory));
}

function waLink(message) {
  return `https://wa.me/${PHONE}?text=${encodeURIComponent(message)}`;
}

function renderGallery(list) {
  gallery.innerHTML = '';

  if (!list.length) {
    const empty = document.createElement('div');
    empty.className = 'admin-item';
    empty.innerHTML = '<strong>No hay duendes disponibles.</strong><small>Agrégalos desde el Panel admin.</small>';
    gallery.appendChild(empty);
    catalogCount.textContent = '0 modelos';
    return;
  }

  list.forEach((elf) => {
    const card = document.createElement('article');
    card.className = 'card';

    const img = document.createElement('img');
    img.src = elf.image;
    img.alt = elf.name;
    img.loading = 'lazy';

    const meta = document.createElement('div');
    meta.className = 'meta';

    const name = document.createElement('div');
    name.className = 'name';
    name.textContent = elf.name;

    const actions = document.createElement('div');
    actions.className = 'actions';

    const btn = document.createElement('a');
    btn.href = waLink(`Hola, quiero información sobre el duende ${elf.name}.`);
    btn.target = '_blank';
    btn.rel = 'noopener noreferrer';
    btn.innerHTML = '<span class="wa-icon" aria-hidden="true">💬</span><span>WhatsApp</span>';

    actions.appendChild(btn);
    meta.appendChild(name);
    meta.appendChild(actions);
    card.appendChild(img);
    card.appendChild(meta);

    card.dataset.id = elf.id;
    card.dataset.name = elf.name.toLowerCase();
    card.addEventListener('click', () => selectElf(elf.id, card));

    gallery.appendChild(card);
  });

  catalogCount.textContent = `${list.length} modelo${list.length === 1 ? '' : 's'}`;
}

function selectElf(id, card) {
  const match = inventory.find((item) => item.id === id);
  if (!match) return;

  selectedElf = match;
  labelText.value = match.name;

  if (activeCard) activeCard.classList.remove('active');
  if (card) {
    activeCard = card;
    activeCard.classList.add('active');
  }

  syncWhatsAppLinks();
  drawCustomizer();
}

function syncWhatsAppLinks() {
  const name = labelText.value?.trim() || selectedElf?.name || 'duende personalizado';
  const message = `Hola, quiero encargar el duende ${name}.`;
  const href = waLink(message);

  if (whatsappLink) whatsappLink.href = href;
  if (topWhatsapp) topWhatsapp.href = href;
  if (heroWhatsapp) heroWhatsapp.href = href;
}

function drawBackground(width, height) {
  if (bgStyle.value === 'gradient') {
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, bgColor.value);
    gradient.addColorStop(1, bgColor2.value);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    return;
  }

  if (bgStyle.value === 'spotlight') {
    ctx.fillStyle = bgColor2.value;
    ctx.fillRect(0, 0, width, height);
    const light = ctx.createRadialGradient(width / 2, height / 3, 20, width / 2, height / 2, 220);
    light.addColorStop(0, bgColor.value);
    light.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = light;
    ctx.fillRect(0, 0, width, height);
    return;
  }

  ctx.fillStyle = bgColor.value;
  ctx.fillRect(0, 0, width, height);
}

function drawHat(centerX) {
  ctx.fillStyle = hatColor.value;

  if (hatStyle.value === 'wide') {
    ctx.beginPath();
    ctx.ellipse(centerX, 122, 95, 24, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(centerX - 72, 116);
    ctx.lineTo(centerX + 72, 116);
    ctx.lineTo(centerX, 34);
    ctx.closePath();
    ctx.fill();
  } else if (hatStyle.value === 'night') {
    ctx.beginPath();
    ctx.moveTo(centerX - 58, 122);
    ctx.quadraticCurveTo(centerX + 105, 98, centerX + 16, 18);
    ctx.quadraticCurveTo(centerX - 26, 60, centerX - 58, 122);
    ctx.fill();
  } else {
    ctx.beginPath();
    ctx.moveTo(centerX - 90, 120);
    ctx.lineTo(centerX + 90, 120);
    ctx.lineTo(centerX, 20);
    ctx.closePath();
    ctx.fill();
  }

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.roundRect(centerX - 90, 116, 180, 24, 10);
  ctx.fill();
}

function drawEyes(centerX) {
  const leftX = centerX - 24;
  const rightX = centerX + 24;
  const y = 155;

  ctx.strokeStyle = eyeColor.value;
  ctx.fillStyle = eyeColor.value;
  ctx.lineWidth = 3;

  if (eyeStyle.value === 'happy') {
    ctx.beginPath();
    ctx.arc(leftX, y, 10, Math.PI, 0);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(rightX, y, 10, Math.PI, 0);
    ctx.stroke();
    return;
  }

  if (eyeStyle.value === 'sleepy') {
    ctx.beginPath();
    ctx.moveTo(leftX - 11, y);
    ctx.lineTo(leftX + 11, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(rightX - 11, y);
    ctx.lineTo(rightX + 11, y);
    ctx.stroke();
    return;
  }

  if (eyeStyle.value === 'wink') {
    ctx.beginPath();
    ctx.moveTo(leftX - 10, y);
    ctx.lineTo(leftX + 10, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(rightX, y, 6, 0, Math.PI * 2);
    ctx.fill();
    return;
  }

  ctx.beginPath();
  ctx.arc(leftX, y, 6, 0, Math.PI * 2);
  ctx.arc(rightX, y, 6, 0, Math.PI * 2);
  ctx.fill();
}

function drawBrows(centerX) {
  const style = browStyle.value;
  const y = 138;
  const thickness = style === 'thick' ? 5 : style === 'soft' ? 2 : 3;
  const angle = style === 'soft' ? 4 : 9;

  ctx.strokeStyle = '#3d2b1f';
  ctx.lineWidth = thickness;
  ctx.beginPath();
  ctx.moveTo(centerX - 38, y + angle);
  ctx.lineTo(centerX - 12, y);
  ctx.moveTo(centerX + 12, y);
  ctx.lineTo(centerX + 38, y + angle);
  ctx.stroke();
}

function drawMouth(centerX) {
  if (mouthStyle.value === 'open') {
    ctx.fillStyle = '#b02a2a';
    ctx.beginPath();
    ctx.ellipse(centerX, 198, 14, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    return;
  }

  if (mouthStyle.value === 'mustache') {
    ctx.fillStyle = '#593f2a';
    ctx.beginPath();
    ctx.ellipse(centerX - 11, 192, 14, 6, -0.3, 0, Math.PI * 2);
    ctx.ellipse(centerX + 11, 192, 14, 6, 0.3, 0, Math.PI * 2);
    ctx.fill();
    return;
  }

  ctx.strokeStyle = '#6f2b2b';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(centerX, 195, 18, 0.1, Math.PI - 0.1);
  ctx.stroke();
}

function drawCloth(centerX) {
  ctx.fillStyle = clothColor.value;
  ctx.beginPath();
  ctx.roundRect(centerX - 95, 205, 190, 160, 30);
  ctx.fill();

  if (clothPattern.value === 'stripes') {
    ctx.strokeStyle = 'rgba(255,255,255,.35)';
    ctx.lineWidth = 4;
    for (let x = centerX - 80; x < centerX + 90; x += 22) {
      ctx.beginPath();
      ctx.moveTo(x, 214);
      ctx.lineTo(x, 358);
      ctx.stroke();
    }
  }

  if (clothPattern.value === 'dots') {
    ctx.fillStyle = 'rgba(255,255,255,.35)';
    for (let y = 225; y < 350; y += 26) {
      for (let x = centerX - 78; x < centerX + 84; x += 26) {
        ctx.beginPath();
        ctx.arc(x, y, 3.4, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
}

function drawBeard(centerX) {
  if (beardStyle.value === 'none') return;

  ctx.fillStyle = '#fbfbfb';
  if (beardStyle.value === 'short') {
    ctx.beginPath();
    ctx.ellipse(centerX, 240, 64, 40, 0, 0, Math.PI * 2);
    ctx.fill();
    return;
  }

  ctx.beginPath();
  ctx.moveTo(centerX - 58, 210);
  ctx.quadraticCurveTo(centerX - 80, 300, centerX, 338);
  ctx.quadraticCurveTo(centerX + 80, 300, centerX + 58, 210);
  ctx.closePath();
  ctx.fill();
}

function drawAccessory(centerX) {
  if (accessory.value === 'none') return;

  if (accessory.value === 'star') {
    ctx.fillStyle = '#f1c40f';
    drawStar(centerX + 74, 52, 5, 18, 8);
    return;
  }

  if (accessory.value === 'bell') {
    ctx.fillStyle = '#f4d03f';
    ctx.beginPath();
    ctx.arc(centerX + 68, 56, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#9c7d18';
    ctx.beginPath();
    ctx.arc(centerX + 68, 61, 3, 0, Math.PI * 2);
    ctx.fill();
    return;
  }

  ctx.fillStyle = '#e74c3c';
  ctx.beginPath();
  ctx.moveTo(centerX + 68, 58);
  ctx.bezierCurveTo(centerX + 54, 40, centerX + 34, 57, centerX + 68, 83);
  ctx.bezierCurveTo(centerX + 102, 57, centerX + 82, 40, centerX + 68, 58);
  ctx.fill();
}

function drawStar(cx, cy, spikes, outerRadius, innerRadius) {
  let rot = (Math.PI / 2) * 3;
  const step = Math.PI / spikes;

  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i++) {
    ctx.lineTo(cx + Math.cos(rot) * outerRadius, cy + Math.sin(rot) * outerRadius);
    rot += step;
    ctx.lineTo(cx + Math.cos(rot) * innerRadius, cy + Math.sin(rot) * innerRadius);
    rot += step;
  }
  ctx.closePath();
  ctx.fill();
}

function drawFrame(width, height) {
  if (frameStyle.value === 'none') return;

  if (frameStyle.value === 'gold') {
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 12;
  } else {
    ctx.strokeStyle = 'rgba(255,255,255,.75)';
    ctx.lineWidth = 10;
  }

  ctx.strokeRect(6, 6, width - 12, height - 12);
}

function drawSparkles(width, height) {
  const level = Number(sparkle.value) / 100;
  const amount = Math.floor(8 + level * 28);
  const alpha = 0.15 + level * 0.55;

  ctx.fillStyle = `rgba(255,255,255,${alpha})`;
  for (let i = 0; i < amount; i++) {
    const x = ((i * 53) % (width - 20)) + 10;
    const y = ((i * 37) % (height - 20)) + 10;
    const r = (i % 3) + 1;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawCustomizer() {
  const width = canvas.width;
  const height = canvas.height;
  const centerX = width / 2;

  ctx.clearRect(0, 0, width, height);
  drawBackground(width, height);
  drawCloth(centerX);

  ctx.fillStyle = skinColor.value;
  ctx.beginPath();
  ctx.arc(centerX, 165, 72, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#e0ad84';
  ctx.beginPath();
  ctx.ellipse(centerX, 185, 40, 14, 0, 0, Math.PI * 2);
  ctx.fill();

  drawBrows(centerX);
  drawEyes(centerX);
  drawMouth(centerX);
  drawHat(centerX);
  drawBeard(centerX);
  drawAccessory(centerX);
  drawSparkles(width, height);
  drawFrame(width, height);

  const name = labelText.value?.trim();
  if (name) {
    ctx.fillStyle = '#152039';
    ctx.font = '700 24px Outfit';
    ctx.textAlign = 'center';
    ctx.fillText(name, centerX, 390);
  }
}

function refreshCatalog() {
  const query = searchInput.value.trim().toLowerCase();
  let filtered = inventory.filter((item) => !query || item.name.toLowerCase().includes(query));

  if (sortSelect.value === 'name') {
    filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
  }

  visibleInventory = filtered;
  renderGallery(filtered);

  if (!filtered.length) {
    selectedElf = null;
    activeCard = null;
    syncWhatsAppLinks();
    drawCustomizer();
    return;
  }

  if (!selectedElf || !filtered.some((item) => item.id === selectedElf.id)) {
    const first = filtered[0];
    const firstCard = gallery.querySelector(`[data-id="${first.id}"]`);
    selectElf(first.id, firstCard);
    return;
  }

  const currentCard = gallery.querySelector(`[data-id="${selectedElf.id}"]`);
  if (currentCard) selectElf(selectedElf.id, currentCard);
}

function chooseRandomElf() {
  if (!visibleInventory.length) return;
  const random = visibleInventory[Math.floor(Math.random() * visibleInventory.length)];
  const card = gallery.querySelector(`[data-id="${random.id}"]`);
  selectElf(random.id, card);
}

function openAdminPanel() {
  adminPanel.classList.toggle('hidden');
}

function unlockAdmin() {
  if (adminPassword.value !== ADMIN_PASSWORD) {
    alert('Contraseña incorrecta.');
    return;
  }

  adminUnlocked = true;
  adminAuth.classList.add('hidden');
  adminContent.classList.remove('hidden');
  renderAdminList();
}

function renderAdminList() {
  adminList.innerHTML = '';

  inventory.forEach((elf) => {
    const row = document.createElement('div');
    row.className = 'admin-item';

    const info = document.createElement('div');
    info.innerHTML = `<strong>${elf.name}</strong><small>ID: ${elf.id}</small>`;

    const removeBtn = document.createElement('button');
    removeBtn.className = 'btn soft';
    removeBtn.type = 'button';
    removeBtn.textContent = 'Eliminar del catálogo';
    removeBtn.addEventListener('click', () => deleteElf(elf.id));

    row.appendChild(info);
    row.appendChild(removeBtn);
    adminList.appendChild(row);
  });
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function addElf() {
  if (!adminUnlocked) return;

  const name = newElfName.value.trim();
  const imageUrl = newElfImage.value.trim();
  const file = newElfFile.files[0];

  if (!name) {
    alert('Escribe un nombre para el duende.');
    return;
  }

  let image = imageUrl;
  if (!image && file) {
    image = await readFileAsDataUrl(file);
  }

  if (!image) {
    alert('Debes agregar una URL o subir una imagen.');
    return;
  }

  inventory.unshift({
    id: `elf-${Date.now()}`,
    name,
    image
  });

  saveInventory();
  refreshCatalog();
  renderAdminList();

  newElfName.value = '';
  newElfImage.value = '';
  newElfFile.value = '';
}

function deleteElf(id) {
  if (!adminUnlocked) return;

  inventory = inventory.filter((item) => item.id !== id);
  saveInventory();
  refreshCatalog();
  renderAdminList();
}

function resetCatalog() {
  if (!adminUnlocked) return;

  const ok = confirm('Esto restaura solo el catálogo inicial de imágenes base. ¿Deseas continuar?');
  if (!ok) return;

  inventory = [...INITIAL_DUENDES];
  saveInventory();
  refreshCatalog();
  renderAdminList();
}

async function sendDesignToWhatsApp() {
  const name = labelText.value?.trim() || selectedElf?.name || 'Duende personalizado';
  const text = `Hola, aquí está mi diseño de duende: ${name}`;
  const dataUrl = canvas.toDataURL('image/png');

  try {
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    const file = new File([blob], `${name.replace(/\s+/g, '-')}.png`, { type: 'image/png' });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        files: [file],
        text,
        title: 'Mi duende personalizado'
      });
      return;
    }
  } catch {
  }

  const download = document.createElement('a');
  download.href = dataUrl;
  download.download = `${name.replace(/\s+/g, '-')}.png`;
  document.body.appendChild(download);
  download.click();
  download.remove();

  window.open(waLink(`${text}. Te envío la imagen adjunta.`), '_blank');
  alert('Tu imagen se descargó. Adjunta ese archivo en WhatsApp para enviarlo.');
}

function bindInputRepaint(input) {
  input.addEventListener('input', () => {
    syncWhatsAppLinks();
    drawCustomizer();
  });
}

[
  bgColor,
  bgColor2,
  bgStyle,
  skinColor,
  hatColor,
  hatStyle,
  clothColor,
  clothPattern,
  eyeColor,
  eyeStyle,
  browStyle,
  mouthStyle,
  beardStyle,
  accessory,
  frameStyle,
  sparkle,
  labelText
].forEach(bindInputRepaint);

searchInput.addEventListener('input', refreshCatalog);
sortSelect.addEventListener('change', refreshCatalog);
randomElfBtn.addEventListener('click', chooseRandomElf);
openAdminBtn.addEventListener('click', openAdminPanel);
adminLoginBtn.addEventListener('click', unlockAdmin);
addElfBtn.addEventListener('click', addElf);
resetCatalogBtn.addEventListener('click', resetCatalog);
sendWhatsappBtn.addEventListener('click', sendDesignToWhatsApp);

function onEnter(element, fn) {
  element.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') fn();
  });
}

onEnter(adminPassword, unlockAdmin);
onEnter(newElfName, addElf);
onEnter(newElfImage, addElf);

refreshCatalog();
syncWhatsAppLinks();
drawCustomizer();
