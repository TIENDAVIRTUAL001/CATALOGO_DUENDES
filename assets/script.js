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
const topWhatsapp = document.getElementById('topWhatsapp');
const heroWhatsapp = document.getElementById('heroWhatsapp');

const searchInput = document.getElementById('q');
const sortSelect = document.getElementById('sort');
const randomElfBtn = document.getElementById('randomElfBtn');
const catalogCount = document.getElementById('catalogCount');
const randomModal = document.getElementById('randomModal');
const randomImage = document.getElementById('randomImage');
const randomName = document.getElementById('randomName');
const randomBuyBtn = document.getElementById('randomBuyBtn');
const randomChooseBtn = document.getElementById('randomChooseBtn');
const randomCloseBtn = document.getElementById('randomCloseBtn');
const splashOverlay = document.getElementById('splashOverlay');
const splashCloseBtn = document.getElementById('splashCloseBtn');
const contactPromo = document.getElementById('contactPromo');

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
const STATE_KEY = 'duendesCatalogo.ultra.v2';

const HAT_VARIANTS = [
  { id: 'classic', label: 'Clásico' },
  { id: 'wide', label: 'Ancho' },
  { id: 'night', label: 'Nocturno' },
  { id: 'royal', label: 'Real' },
  { id: 'wizard', label: 'Mago' },
  { id: 'pine', label: 'Pino' },
  { id: 'ice', label: 'Hielo' },
  { id: 'vintage', label: 'Vintage' },
  { id: 'pointy', label: 'Puntiagudo' },
  { id: 'party', label: 'Fiesta' },
  { id: 'minimal', label: 'Minimal' },
  { id: 'floppy', label: 'Flexible' },
  { id: 'crown', label: 'Corona' },
  { id: 'forest', label: 'Bosque' },
  { id: 'neon', label: 'Neón' },
  { id: 'sunset', label: 'Atardecer' }
];

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
let randomCandidateId = null;

function ensureRoundRect() {
  if (CanvasRenderingContext2D.prototype.roundRect) return;
  CanvasRenderingContext2D.prototype.roundRect = function (x, y, width, height, radius) {
    const r = Math.min(radius, width / 2, height / 2);
    this.beginPath();
    this.moveTo(x + r, y);
    this.arcTo(x + width, y, x + width, y + height, r);
    this.arcTo(x + width, y + height, x, y + height, r);
    this.arcTo(x, y + height, x, y, r);
    this.arcTo(x, y, x + width, y, r);
    this.closePath();
    return this;
  };
}

function initializeHatSelect() {
  hatStyle.innerHTML = '';
  HAT_VARIANTS.forEach((item, index) => {
    const option = document.createElement('option');
    option.value = item.id;
    option.textContent = item.label;
    if (index === 0) option.selected = true;
    hatStyle.appendChild(option);
  });
}

function loadInventory() {
  const raw = localStorage.getItem(STATE_KEY);
  if (!raw) {
    localStorage.setItem(STATE_KEY, JSON.stringify(INITIAL_DUENDES));
    return [...INITIAL_DUENDES];
  }

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      localStorage.setItem(STATE_KEY, JSON.stringify(INITIAL_DUENDES));
      return [...INITIAL_DUENDES];
    }

    const valid = parsed.filter((item) => item?.id && item?.name && item?.image);
    return valid;
  } catch {
    localStorage.setItem(STATE_KEY, JSON.stringify(INITIAL_DUENDES));
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
    empty.innerHTML = '<strong>No hay duendes disponibles.</strong><small>El admin puede restaurar los 19 por defecto.</small>';
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
    btn.innerHTML = '<svg class="wa-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12.04 2C6.57 2 2.12 6.45 2.12 11.92c0 1.75.46 3.47 1.33 4.98L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.47 0 9.93-4.45 9.93-9.92A9.94 9.94 0 0 0 12.04 2Zm0 18.18a8.3 8.3 0 0 1-4.22-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.26 8.26 0 0 1-1.27-4.4c0-4.58 3.73-8.31 8.32-8.31a8.3 8.3 0 0 1 8.31 8.31 8.3 8.3 0 0 1-8.36 8.26Zm4.56-6.18c-.25-.12-1.46-.72-1.69-.8-.23-.08-.39-.12-.56.12-.16.25-.64.8-.78.96-.14.16-.28.18-.53.06-.25-.12-1.05-.39-2-1.24-.73-.65-1.23-1.45-1.37-1.69-.14-.25-.02-.38.1-.5.11-.11.25-.28.37-.41.12-.14.16-.25.24-.41.08-.16.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.4-.41-.56-.42l-.48-.01c-.16 0-.43.06-.65.31-.22.25-.84.82-.84 1.99 0 1.17.86 2.31.98 2.47.12.16 1.69 2.58 4.1 3.62.57.25 1.01.39 1.36.5.57.18 1.09.16 1.5.1.46-.07 1.46-.6 1.67-1.18.2-.58.2-1.08.14-1.18-.06-.1-.22-.16-.47-.29Z"/></svg><span>WhatsApp</span>';

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
  const href = waLink(`Hola, quiero encargar el duende ${name}.`);
  if (topWhatsapp) topWhatsapp.href = href;
  if (heroWhatsapp) heroWhatsapp.href = href;
  if (contactPromo) contactPromo.href = href;
}

function openRandomModal(elf) {
  randomCandidateId = elf.id;
  randomImage.src = elf.image;
  randomImage.alt = elf.name;
  randomName.textContent = elf.name;
  randomBuyBtn.href = waLink(`Hola, el duende ${elf.name} me eligió. Quiero comprarlo.`);
  randomModal.classList.remove('hidden');
  randomModal.setAttribute('aria-hidden', 'false');
}

function closeRandomModal() {
  randomModal.classList.add('hidden');
  randomModal.setAttribute('aria-hidden', 'true');
}

function chooseRandomCandidate() {
  if (!randomCandidateId) return;
  const card = gallery.querySelector(`[data-id="${randomCandidateId}"]`);
  selectElf(randomCandidateId, card);
  closeRandomModal();
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
  const style = hatStyle.value;
  ctx.fillStyle = hatColor.value;

  if (style === 'wide') {
    ctx.ellipse(centerX, 122, 95, 24, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.moveTo(centerX - 72, 116); ctx.lineTo(centerX + 72, 116); ctx.lineTo(centerX, 34); ctx.closePath(); ctx.fill();
  } else if (style === 'night') {
    ctx.beginPath(); ctx.moveTo(centerX - 58, 122); ctx.quadraticCurveTo(centerX + 105, 98, centerX + 16, 18); ctx.quadraticCurveTo(centerX - 26, 60, centerX - 58, 122); ctx.fill();
  } else if (style === 'royal') {
    ctx.beginPath(); ctx.moveTo(centerX - 78, 122); ctx.lineTo(centerX + 78, 122); ctx.lineTo(centerX + 44, 36); ctx.lineTo(centerX - 44, 36); ctx.closePath(); ctx.fill();
  } else if (style === 'wizard') {
    ctx.beginPath(); ctx.moveTo(centerX - 60, 122); ctx.lineTo(centerX + 60, 122); ctx.lineTo(centerX - 10, 18); ctx.closePath(); ctx.fill();
  } else if (style === 'pine') {
    ctx.beginPath(); ctx.moveTo(centerX - 70, 122); ctx.lineTo(centerX + 70, 122); ctx.lineTo(centerX, 32); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#ffffff'; ctx.fillRect(centerX - 6, 40, 12, 12);
    ctx.fillStyle = hatColor.value;
  } else if (style === 'ice') {
    ctx.globalAlpha = .85;
    ctx.beginPath(); ctx.moveTo(centerX - 84, 122); ctx.lineTo(centerX + 84, 122); ctx.lineTo(centerX, 26); ctx.closePath(); ctx.fill();
    ctx.globalAlpha = 1;
  } else if (style === 'vintage') {
    ctx.beginPath(); ctx.ellipse(centerX, 124, 82, 20, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillRect(centerX - 44, 56, 88, 64);
  } else if (style === 'pointy') {
    ctx.beginPath(); ctx.moveTo(centerX - 50, 122); ctx.lineTo(centerX + 50, 122); ctx.lineTo(centerX, 8); ctx.closePath(); ctx.fill();
  } else if (style === 'party') {
    ctx.beginPath(); ctx.moveTo(centerX - 64, 122); ctx.lineTo(centerX + 64, 122); ctx.lineTo(centerX, 26); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#ffd166'; ctx.beginPath(); ctx.arc(centerX, 22, 7, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = hatColor.value;
  } else if (style === 'minimal') {
    ctx.fillRect(centerX - 60, 56, 120, 66);
  } else if (style === 'floppy') {
    ctx.beginPath(); ctx.ellipse(centerX, 122, 92, 24, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.moveTo(centerX - 54, 122); ctx.quadraticCurveTo(centerX + 16, 24, centerX + 60, 118); ctx.closePath(); ctx.fill();
  } else if (style === 'crown') {
    ctx.beginPath(); ctx.moveTo(centerX - 78, 122); ctx.lineTo(centerX - 46, 66); ctx.lineTo(centerX - 18, 122); ctx.lineTo(centerX, 58); ctx.lineTo(centerX + 18, 122); ctx.lineTo(centerX + 46, 66); ctx.lineTo(centerX + 78, 122); ctx.closePath(); ctx.fill();
  } else if (style === 'forest') {
    ctx.beginPath(); ctx.moveTo(centerX - 72, 122); ctx.lineTo(centerX + 72, 122); ctx.lineTo(centerX + 8, 30); ctx.closePath(); ctx.fill();
  } else if (style === 'neon') {
    ctx.shadowColor = hatColor.value;
    ctx.shadowBlur = 16;
    ctx.beginPath(); ctx.moveTo(centerX - 68, 122); ctx.lineTo(centerX + 68, 122); ctx.lineTo(centerX, 28); ctx.closePath(); ctx.fill();
    ctx.shadowBlur = 0;
  } else if (style === 'sunset') {
    const grad = ctx.createLinearGradient(centerX - 70, 30, centerX + 70, 122);
    grad.addColorStop(0, '#ff8f5a');
    grad.addColorStop(1, hatColor.value);
    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.moveTo(centerX - 70, 122); ctx.lineTo(centerX + 70, 122); ctx.lineTo(centerX, 26); ctx.closePath(); ctx.fill();
    ctx.fillStyle = hatColor.value;
  } else {
    ctx.beginPath(); ctx.moveTo(centerX - 90, 120); ctx.lineTo(centerX + 90, 120); ctx.lineTo(centerX, 20); ctx.closePath(); ctx.fill();
  }

  ctx.fillStyle = '#ffffff';
  ctx.roundRect(centerX - 90, 116, 180, 24, 10); ctx.fill();
}

function drawEyes(centerX) {
  const leftX = centerX - 24;
  const rightX = centerX + 24;
  const y = 155;

  ctx.strokeStyle = eyeColor.value;
  ctx.fillStyle = eyeColor.value;
  ctx.lineWidth = 3;

  if (eyeStyle.value === 'happy') {
    ctx.beginPath(); ctx.arc(leftX, y, 10, Math.PI, 0); ctx.stroke();
    ctx.beginPath(); ctx.arc(rightX, y, 10, Math.PI, 0); ctx.stroke();
    return;
  }

  if (eyeStyle.value === 'sleepy') {
    ctx.beginPath(); ctx.moveTo(leftX - 11, y); ctx.lineTo(leftX + 11, y); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(rightX - 11, y); ctx.lineTo(rightX + 11, y); ctx.stroke();
    return;
  }

  if (eyeStyle.value === 'wink') {
    ctx.beginPath(); ctx.moveTo(leftX - 10, y); ctx.lineTo(leftX + 10, y); ctx.stroke();
    ctx.beginPath(); ctx.arc(rightX, y, 6, 0, Math.PI * 2); ctx.fill();
    return;
  }

  if (eyeStyle.value === 'spark') {
    ctx.beginPath(); ctx.arc(leftX, y, 6, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(rightX, y, 6, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(leftX + 2, y - 2, 2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(rightX + 2, y - 2, 2, 0, Math.PI * 2); ctx.fill();
    return;
  }

  ctx.beginPath(); ctx.arc(leftX, y, 6, 0, Math.PI * 2); ctx.arc(rightX, y, 6, 0, Math.PI * 2); ctx.fill();
}

function drawBrows(centerX) {
  const style = browStyle.value;
  const y = 138;
  const thickness = style === 'thick' ? 5 : style === 'soft' ? 2 : 3;
  const angle = style === 'soft' ? 4 : style === 'angry' ? -2 : 9;

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
    ctx.beginPath(); ctx.ellipse(centerX, 198, 14, 10, 0, 0, Math.PI * 2); ctx.fill();
    return;
  }

  if (mouthStyle.value === 'mustache') {
    ctx.fillStyle = '#593f2a';
    ctx.beginPath(); ctx.ellipse(centerX - 11, 192, 14, 6, -0.3, 0, Math.PI * 2); ctx.ellipse(centerX + 11, 192, 14, 6, 0.3, 0, Math.PI * 2); ctx.fill();
    return;
  }

  if (mouthStyle.value === 'cute') {
    ctx.strokeStyle = '#8e295c';
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(centerX, 196, 8, 0.2, Math.PI - 0.2); ctx.stroke();
    return;
  }

  ctx.strokeStyle = '#6f2b2b';
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(centerX, 195, 18, 0.1, Math.PI - 0.1); ctx.stroke();
}

function drawCloth(centerX) {
  ctx.fillStyle = clothColor.value;
  ctx.roundRect(centerX - 95, 205, 190, 160, 30); ctx.fill();

  if (clothPattern.value === 'stripes') {
    ctx.strokeStyle = 'rgba(255,255,255,.35)';
    ctx.lineWidth = 4;
    for (let x = centerX - 80; x < centerX + 90; x += 22) {
      ctx.beginPath(); ctx.moveTo(x, 214); ctx.lineTo(x, 358); ctx.stroke();
    }
  } else if (clothPattern.value === 'dots') {
    ctx.fillStyle = 'rgba(255,255,255,.35)';
    for (let y = 225; y < 350; y += 26) {
      for (let x = centerX - 78; x < centerX + 84; x += 26) {
        ctx.beginPath(); ctx.arc(x, y, 3.4, 0, Math.PI * 2); ctx.fill();
      }
    }
  } else if (clothPattern.value === 'diamond') {
    ctx.strokeStyle = 'rgba(255,255,255,.35)';
    ctx.lineWidth = 2;
    for (let y = 220; y < 360; y += 26) {
      ctx.beginPath();
      ctx.moveTo(centerX - 90, y);
      ctx.lineTo(centerX - 40, y - 16);
      ctx.lineTo(centerX + 10, y);
      ctx.lineTo(centerX + 60, y - 16);
      ctx.lineTo(centerX + 95, y);
      ctx.stroke();
    }
  }
}

function drawBeard(centerX) {
  if (beardStyle.value === 'none') return;

  ctx.fillStyle = '#fbfbfb';
  if (beardStyle.value === 'short') {
    ctx.beginPath(); ctx.ellipse(centerX, 240, 64, 40, 0, 0, Math.PI * 2); ctx.fill();
    return;
  }

  if (beardStyle.value === 'royal') {
    ctx.beginPath();
    ctx.moveTo(centerX - 66, 210);
    ctx.quadraticCurveTo(centerX - 92, 285, centerX - 18, 330);
    ctx.quadraticCurveTo(centerX, 340, centerX + 18, 330);
    ctx.quadraticCurveTo(centerX + 92, 285, centerX + 66, 210);
    ctx.closePath();
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
    ctx.beginPath(); ctx.arc(centerX + 68, 56, 12, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#9c7d18';
    ctx.beginPath(); ctx.arc(centerX + 68, 61, 3, 0, Math.PI * 2); ctx.fill();
    return;
  }

  if (accessory.value === 'snow') {
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    for (let i = 0; i < 4; i++) {
      const x = centerX + 54 + i * 10;
      const y = 48 + i * 5;
      ctx.beginPath();
      ctx.moveTo(x - 5, y); ctx.lineTo(x + 5, y);
      ctx.moveTo(x, y - 5); ctx.lineTo(x, y + 5);
      ctx.stroke();
    }
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
  } else if (frameStyle.value === 'neon') {
    ctx.strokeStyle = '#86f7ff';
    ctx.lineWidth = 10;
    ctx.shadowColor = '#86f7ff';
    ctx.shadowBlur = 12;
  } else {
    ctx.strokeStyle = 'rgba(255,255,255,.75)';
    ctx.lineWidth = 10;
  }

  ctx.strokeRect(6, 6, width - 12, height - 12);
  ctx.shadowBlur = 0;
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
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
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
  ctx.beginPath(); ctx.arc(centerX, 165, 72, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = '#e0ad84';
  ctx.beginPath(); ctx.ellipse(centerX, 185, 40, 14, 0, 0, Math.PI * 2); ctx.fill();

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
  openRandomModal(random);
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

  const ok = confirm('Esto restaura los 19 duendes por defecto. ¿Deseas continuar?');
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
      await navigator.share({ files: [file], text, title: 'Mi duende personalizado' });
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

  window.open(waLink(`${text}. Te adjunto la imagen en el siguiente mensaje.`), '_blank');
  alert('Se descargó la imagen de tu diseño. Adjunta ese archivo en WhatsApp.');
}

function bindInputRepaint(input) {
  input.addEventListener('input', () => {
    syncWhatsAppLinks();
    drawCustomizer();
  });
}

function onEnter(element, fn) {
  element.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') fn();
  });
}

ensureRoundRect();
initializeHatSelect();

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
randomCloseBtn.addEventListener('click', closeRandomModal);
randomChooseBtn.addEventListener('click', chooseRandomCandidate);
randomModal.addEventListener('click', (event) => {
  if (event.target === randomModal) closeRandomModal();
});
openAdminBtn.addEventListener('click', openAdminPanel);
adminLoginBtn.addEventListener('click', unlockAdmin);
addElfBtn.addEventListener('click', addElf);
resetCatalogBtn.addEventListener('click', resetCatalog);
sendWhatsappBtn.addEventListener('click', sendDesignToWhatsApp);
splashCloseBtn.addEventListener('click', () => splashOverlay.classList.add('hidden'));

onEnter(adminPassword, unlockAdmin);
onEnter(newElfName, addElf);
onEnter(newElfImage, addElf);

refreshCatalog();
syncWhatsAppLinks();
drawCustomizer();

setTimeout(() => {
  splashOverlay.classList.add('hidden');
}, 5000);
