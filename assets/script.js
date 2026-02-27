const gallery = document.getElementById('gallery');
const canvas = document.getElementById('preview');
const ctx = canvas.getContext('2d');
const bgColor = document.getElementById('bgColor');
const skinColor = document.getElementById('skinColor');
const hatColor = document.getElementById('hatColor');
const clothColor = document.getElementById('clothColor');
const eyeColor = document.getElementById('eyeColor');
const eyeStyle = document.getElementById('eyeStyle');
const beardStyle = document.getElementById('beardStyle');
const accessory = document.getElementById('accessory');
const labelText = document.getElementById('labelText');
const downloadBtn = document.getElementById('downloadBtn');
const whatsappLink = document.getElementById('whatsappLink');
const searchInput = document.getElementById('q');
const sortSelect = document.getElementById('sort');
const topWhatsapp = document.getElementById('topWhatsapp');
const randomElfBtn = document.getElementById('randomElfBtn');

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
const STORAGE_KEY = 'duendesCatalogo.v2';

const BASE_DUENDES = [
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
let visibleInventory = [...inventory];
let selectedElf = null;
let activeCard = null;
let adminUnlocked = false;

function loadInventory() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [...BASE_DUENDES];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || !parsed.length) return [...BASE_DUENDES];
    return parsed;
  } catch {
    return [...BASE_DUENDES];
  }
}

function saveInventory() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(inventory));
}

function populateGallery(list) {
  gallery.innerHTML = '';
  list.forEach((elf) => {
    const card = document.createElement('article');
    card.className = 'card';

    const img = document.createElement('img');
    img.src = elf.image;
    img.loading = 'lazy';
    img.alt = elf.name;

    const meta = document.createElement('div');
    meta.className = 'meta';

    const name = document.createElement('div');
    name.className = 'name';
    name.textContent = elf.name;

    const actions = document.createElement('div');
    actions.className = 'actions';
    const btn = document.createElement('a');
    btn.href = `https://wa.me/${PHONE}?text=${encodeURIComponent('Hola, quiero información sobre el duende ' + elf.name)}`;
    btn.target = '_blank';
    btn.rel = 'noopener noreferrer';
    btn.textContent = 'WhatsApp';
    actions.appendChild(btn);

    meta.appendChild(name);
    meta.appendChild(actions);
    card.appendChild(img);
    card.appendChild(meta);

    card.dataset.name = elf.name.toLowerCase();
    card.addEventListener('click', () => selectElf(elf.id, card));
    gallery.appendChild(card);
  });
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

  updateWhatsAppLink();
  drawCustomizer();
}

function updateWhatsAppLink() {
  const baseName = labelText.value?.trim() || selectedElf?.name || 'duende personalizado';
  const msg = `Hola, quiero encargar el duende ${baseName}.`;
  const href = `https://wa.me/${PHONE}?text=${encodeURIComponent(msg)}`;
  whatsappLink.href = href;
  if (topWhatsapp) topWhatsapp.href = href;
}

function drawCustomizer() {
  const width = canvas.width;
  const height = canvas.height;
  const centerX = width / 2;

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = bgColor.value;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = clothColor.value;
  ctx.beginPath();
  ctx.roundRect(centerX - 95, 205, 190, 160, 30);
  ctx.fill();

  ctx.fillStyle = skinColor.value;
  ctx.beginPath();
  ctx.arc(centerX, 165, 72, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#e0ad84';
  ctx.beginPath();
  ctx.ellipse(centerX, 185, 40, 14, 0, 0, Math.PI * 2);
  ctx.fill();

  drawEyes(centerX);
  drawMouth(centerX);
  drawHat(centerX);
  drawBeard(centerX);
  drawAccessory(centerX);

  const name = labelText.value?.trim();
  if (name) {
    ctx.fillStyle = '#11253c';
    ctx.font = '700 24px Segoe UI';
    ctx.textAlign = 'center';
    ctx.fillText(name, centerX, 390);
  }
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

  ctx.beginPath();
  ctx.arc(leftX, y, 6, 0, Math.PI * 2);
  ctx.arc(rightX, y, 6, 0, Math.PI * 2);
  ctx.fill();
}

function drawMouth(centerX) {
  ctx.strokeStyle = '#6f2b2b';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(centerX, 195, 18, 0.1, Math.PI - 0.1);
  ctx.stroke();
}

function drawHat(centerX) {
  ctx.fillStyle = hatColor.value;
  ctx.beginPath();
  ctx.moveTo(centerX - 90, 120);
  ctx.lineTo(centerX + 90, 120);
  ctx.lineTo(centerX, 20);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.roundRect(centerX - 90, 116, 180, 24, 10);
  ctx.fill();
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

function applyFilters() {
  const q = searchInput.value.trim().toLowerCase();
  const filtered = inventory.filter((elf) => !q || elf.name.toLowerCase().includes(q));

  if (sortSelect.value === 'name') {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  }

  visibleInventory = filtered;
  populateGallery(filtered);

  if (selectedElf) {
    const stillVisible = filtered.find((item) => item.id === selectedElf.id);
    if (!stillVisible) {
      selectedElf = null;
      activeCard = null;
      updateWhatsAppLink();
    } else {
      const cards = Array.from(gallery.children);
      const matchCard = cards.find((card) => card.dataset.name === stillVisible.name.toLowerCase());
      if (matchCard) selectElf(stillVisible.id, matchCard);
    }
  }
}

function chooseRandomElf() {
  if (!visibleInventory.length) return;
  const randomIndex = Math.floor(Math.random() * visibleInventory.length);
  const randomElf = visibleInventory[randomIndex];
  const cards = Array.from(gallery.children);
  const randomCard = cards[randomIndex] || cards.find((card) => card.dataset.name === randomElf.name.toLowerCase());
  selectElf(randomElf.id, randomCard);
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

    const label = document.createElement('strong');
    label.textContent = `${elf.name}`;

    const removeBtn = document.createElement('button');
    removeBtn.className = 'btn';
    removeBtn.type = 'button';
    removeBtn.textContent = 'Eliminar';
    removeBtn.addEventListener('click', () => removeElf(elf.id));

    row.appendChild(label);
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
  const url = newElfImage.value.trim();
  const file = newElfFile.files[0];

  if (!name) {
    alert('Escribe un nombre para el duende.');
    return;
  }

  let image = url;
  if (!image && file) {
    image = await readFileAsDataUrl(file);
  }

  if (!image) {
    alert('Agrega una URL o selecciona una imagen.');
    return;
  }

  const item = {
    id: `custom-${Date.now()}`,
    name,
    image
  };

  inventory.unshift(item);
  saveInventory();
  applyFilters();
  renderAdminList();

  newElfName.value = '';
  newElfImage.value = '';
  newElfFile.value = '';
}

function removeElf(id) {
  if (!adminUnlocked) return;

  inventory = inventory.filter((item) => item.id !== id);
  saveInventory();
  applyFilters();
  renderAdminList();

  if (selectedElf?.id === id) {
    selectedElf = null;
    labelText.value = '';
    updateWhatsAppLink();
    drawCustomizer();
  }
}

function resetCatalog() {
  if (!adminUnlocked) return;
  const ok = confirm('¿Seguro que quieres restablecer el catálogo base?');
  if (!ok) return;

  inventory = [...BASE_DUENDES];
  saveInventory();
  applyFilters();
  renderAdminList();
}

[bgColor, skinColor, hatColor, clothColor, eyeColor, eyeStyle, beardStyle, accessory, labelText].forEach((el) => {
  el.addEventListener('input', () => {
    updateWhatsAppLink();
    drawCustomizer();
  });
});

searchInput.addEventListener('input', applyFilters);
sortSelect.addEventListener('change', applyFilters);
randomElfBtn.addEventListener('click', chooseRandomElf);
openAdminBtn.addEventListener('click', openAdminPanel);
adminLoginBtn.addEventListener('click', unlockAdmin);
addElfBtn.addEventListener('click', addElf);
resetCatalogBtn.addEventListener('click', resetCatalog);

actionOnEnter(adminPassword, unlockAdmin);
actionOnEnter(newElfName, addElf);
actionOnEnter(newElfImage, addElf);

function actionOnEnter(element, callback) {
  element.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') callback();
  });
}

applyFilters();
if (inventory.length) {
  selectedElf = inventory[0];
  labelText.value = selectedElf.name;
  const firstCard = gallery.firstElementChild;
  if (firstCard) selectElf(selectedElf.id, firstCard);
}
updateWhatsAppLink();
drawCustomizer();
