/* ── 초기 샘플 데이터 ── */
const INITIAL_TIPS = [
  { id: 1, category: 'dorm', title: '세탁 꿀팁', likes: 12, liked: false,
    desc: '빨래는 화요일 오전 6시가 제일 한산해요! 세탁기 8번이 가장 빨리 돌아요 😊', image: null, emoji: '🧺' },
  { id: 2, category: 'dorm', title: '냉방 절약법', likes: 8, liked: false,
    desc: '문 아래 수건 끼워 두면 냉기 새는 거 막을 수 있어요. 전기 절약 + 쾌적함!', image: null, emoji: '❄️' },
  { id: 3, category: 'dorm', title: '간식 보관법', likes: 21, liked: false,
    desc: '벌레 방지하려면 과자 다 먹고 집게로 잘 막아두세요. 지퍼백도 필수!', image: null, emoji: '🍪' },
  { id: 4, category: 'dorm', title: '취침 루틴', likes: 5, liked: false,
    desc: '11시 점호 전에 내일 교복 미리 세팅해두면 아침이 10배 편해져요!', image: null, emoji: '😴' },
  { id: 5, category: 'dorm', title: '독서실 자리', likes: 15, liked: false,
    desc: '3층 제일 안쪽 자리가 조용하고 콘센트도 있어서 최고의 자리예요!', image: null, emoji: '📚' },
  { id: 6, category: 'campus', title: '급식 꿀자리', likes: 33, liked: false,
    desc: '4교시 끝나기 5분 전 화장실 다녀오면 급식 줄 빠르게 설 수 있어요!', image: null, emoji: '🍱' },
  { id: 7, category: 'campus', title: '선생님 공략', likes: 19, liked: false,
    desc: '○○ 선생님은 필기를 꼼꼼히 하면 좋아하세요. 내신 플러스 알파!', image: null, emoji: '📝' },
  { id: 8, category: 'campus', title: '체육복 분실 방지', likes: 7, liked: false,
    desc: '체육복에 이름표 안 보이게 안쪽에 붙여두면 잃어버려도 찾기 쉬워요.', image: null, emoji: '👟' },
  { id: 9, category: 'campus', title: '도서관 예약', likes: 11, liked: false,
    desc: '도서관 열람실은 점심시간 직전 앱으로 예약하면 자리 맡기 편해요!', image: null, emoji: '📖' },
];

/* ── 상태 ── */
let tips = [...INITIAL_TIPS];
let nextId = 10;
let selectedCategory = 'dorm';
let currentDetailId = null;

/* ── DOM 참조 ── */
const dormCards1 = document.getElementById('dormCards1');
const dormCards2 = document.getElementById('dormCards2');
const campusCards1 = document.getElementById('campusCards1');
const campusCards2 = document.getElementById('campusCards2');
const formModal = document.getElementById('formModal');
const detailModal = document.getElementById('detailModal');
const openFormBtn = document.getElementById('openFormBtn');
const closeFormBtn = document.getElementById('closeFormBtn');
const closeDetailBtn = document.getElementById('closeDetailBtn');
const tipTitle = document.getElementById('tipTitle');
const tipDesc = document.getElementById('tipDesc');
const imageFile = document.getElementById('imageFile');
const imageUploadArea = document.getElementById('imageUploadArea');
const uploadPlaceholder = document.getElementById('uploadPlaceholder');
const imagePreview = document.getElementById('imagePreview');
const submitTipBtn = document.getElementById('submitTipBtn');
const searchInput = document.getElementById('searchInput');
const catBtns = document.querySelectorAll('.cat-btn');
const navLinks = document.querySelectorAll('.nav-link');

/* ── 유틸 ── */
function randomTilt(min = -8, max = 8) {
  return (Math.random() * (max - min) + min).toFixed(2);
}
function getCategoryLabel(cat) {
  return cat === 'dorm' ? '🏠 기숙사' : '🏫 학교';
}

/* ── 카드 생성 ── */
function createCardEl(tip, isNew = false) {
  const tilt = randomTilt();
  const card = document.createElement('div');
  card.className = `polaroid-card ${tip.category}-card${isNew ? ' new-card' : ''}`;
  card.dataset.id = tip.id;
  card.style.setProperty('--base-tilt', `rotate(${tilt}deg)`);
  card.style.transform = `rotate(${tilt}deg)`;

  const photoContent = tip.image
    ? `<img src="${tip.image}" alt="${tip.title}" />`
    : `<div class="card-photo-placeholder">${tip.emoji || '📌'}</div>`;

  card.innerHTML = `
    <div class="card-inner">
      <div class="card-photo">${photoContent}</div>
      <div class="card-text">
        <p class="card-title">${tip.title}</p>
      </div>
    </div>
    <div class="card-stats">
      <span class="stat-badge"><span class="heart">❤️</span> <span class="like-count">${tip.likes}</span></span>
      <span class="stat-badge">💬 0</span>
    </div>
  `;

  card.addEventListener('click', () => openDetail(tip.id));
  return card;
}

/* ── 빈 슬롯 ── */
function createEmptySlot() {
  const slot = document.createElement('div');
  slot.className = 'empty-slot';
  slot.style.transform = `rotate(${randomTilt(-4, 4)}deg)`;
  slot.innerHTML = `
    <div class="card-inner">
      <div class="card-photo"></div>
      <div class="card-text"><p class="card-title"></p></div>
    </div>
  `;
  return slot;
}

/* ── 렌더링 ── */
function renderBoard(filteredTips = null) {
  const source = filteredTips || tips;
  const dormTips = source.filter(t => t.category === 'dorm');
  const campusTips = source.filter(t => t.category === 'campus');
  renderRow(dormCards1, dormTips.slice(0, 4), 4);
  renderRow(dormCards2, dormTips.slice(4, 8), 4);
  renderRow(campusCards1, campusTips.slice(0, 4), 4);
  renderRow(campusCards2, campusTips.slice(4, 8), 4);
}

function renderRow(container, rowTips, slots) {
  container.innerHTML = '';
  rowTips.forEach(tip => container.appendChild(createCardEl(tip)));
  for (let i = 0; i < slots - rowTips.length; i++) {
    container.appendChild(createEmptySlot());
  }
}

/* ── 새 카드 추가 ── */
function addCard(tip) {
  tips.unshift(tip);
  const dormTips = tips.filter(t => t.category === 'dorm');
  const campusTips = tips.filter(t => t.category === 'campus');

  if (tip.category === 'dorm') {
    renderRow(dormCards1, dormTips.slice(0, 4), 4);
    renderRow(dormCards2, dormTips.slice(4, 8), 4);
    const first = dormCards1.querySelector('.polaroid-card');
    if (first) { first.classList.add('new-card'); setTimeout(() => first.classList.remove('new-card'), 600); }
  } else {
    renderRow(campusCards1, campusTips.slice(0, 4), 4);
    renderRow(campusCards2, campusTips.slice(4, 8), 4);
    const first = campusCards1.querySelector('.polaroid-card');
    if (first) { first.classList.add('new-card'); setTimeout(() => first.classList.remove('new-card'), 600); }
  }
}

/* ── 상세 팝업 ── */
function openDetail(id) {
  const tip = tips.find(t => t.id === id);
  if (!tip) return;
  currentDetailId = id;

  document.getElementById('detailCat').textContent = getCategoryLabel(tip.category);
  document.getElementById('detailTitle').textContent = tip.title;
  document.getElementById('detailDesc').textContent = tip.desc;
  document.getElementById('detailLikes').textContent = `❤️ ${tip.likes}`;

  const img = document.getElementById('detailImage');
  const noImg = document.getElementById('detailNoImage');
  if (tip.image) {
    img.src = tip.image; img.classList.remove('hidden'); noImg.classList.add('hidden');
  } else {
    img.src = ''; img.classList.add('hidden');
    noImg.textContent = tip.emoji || '📌'; noImg.classList.remove('hidden');
  }

  document.getElementById('detailLikeBtn').className = 'like-btn' + (tip.liked ? ' liked' : '');
  detailModal.classList.add('active');
}

function closeDetail() {
  detailModal.classList.remove('active');
  currentDetailId = null;
}

/* ── 좋아요 ── */
document.getElementById('detailLikeBtn').addEventListener('click', () => {
  if (currentDetailId === null) return;
  const tip = tips.find(t => t.id === currentDetailId);
  if (!tip) return;
  tip.liked = !tip.liked;
  tip.likes += tip.liked ? 1 : -1;
  document.getElementById('detailLikes').textContent = `❤️ ${tip.likes}`;
  document.getElementById('detailLikeBtn').className = 'like-btn' + (tip.liked ? ' liked' : '');
  const cardEl = document.querySelector(`.polaroid-card[data-id="${currentDetailId}"]`);
  if (cardEl) { const c = cardEl.querySelector('.like-count'); if (c) c.textContent = tip.likes; }
});

/* ── 모달 이벤트 ── */
openFormBtn.addEventListener('click', () => { formModal.classList.add('active'); resetForm(); });
closeFormBtn.addEventListener('click', () => formModal.classList.remove('active'));
closeDetailBtn.addEventListener('click', closeDetail);
formModal.addEventListener('click', e => { if (e.target === formModal) formModal.classList.remove('active'); });
detailModal.addEventListener('click', e => { if (e.target === detailModal) closeDetail(); });

/* ── 카테고리 ── */
catBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    catBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedCategory = btn.dataset.cat;
  });
});

/* ── 이미지 업로드 ── */
imageUploadArea.addEventListener('click', () => imageFile.click());
imageFile.addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    imagePreview.src = ev.target.result;
    imagePreview.classList.remove('hidden');
    uploadPlaceholder.classList.add('hidden');
  };
  reader.readAsDataURL(file);
});

imageUploadArea.addEventListener('dragover', e => { e.preventDefault(); imageUploadArea.style.borderColor = '#ff6b6b'; });
imageUploadArea.addEventListener('dragleave', () => { imageUploadArea.style.borderColor = ''; });
imageUploadArea.addEventListener('drop', e => {
  e.preventDefault(); imageUploadArea.style.borderColor = '';
  const file = e.dataTransfer.files[0];
  if (!file || !file.type.startsWith('image/')) return;
  const reader = new FileReader();
  reader.onload = ev => {
    imagePreview.src = ev.target.result;
    imagePreview.classList.remove('hidden');
    uploadPlaceholder.classList.add('hidden');
  };
  reader.readAsDataURL(file);
});

/* ── 폼 제출 ── */
submitTipBtn.addEventListener('click', () => {
  const title = tipTitle.value.trim();
  const desc = tipDesc.value.trim();

  if (!title) { tipTitle.focus(); tipTitle.style.borderColor = '#ff6b6b'; setTimeout(() => tipTitle.style.borderColor = '', 1500); return; }
  if (!desc) { tipDesc.focus(); tipDesc.style.borderColor = '#ff6b6b'; setTimeout(() => tipDesc.style.borderColor = '', 1500); return; }

  const newTip = {
    id: nextId++, category: selectedCategory,
    title, desc, likes: 0, liked: false,
    image: imagePreview.src && !imagePreview.classList.contains('hidden') ? imagePreview.src : null,
    emoji: selectedCategory === 'dorm' ? '🏠' : '🏫',
  };

  submitTipBtn.textContent = '📌 게시 완료!';
  submitTipBtn.disabled = true;
  setTimeout(() => {
    formModal.classList.remove('active');
    addCard(newTip);
    submitTipBtn.textContent = '📌 게시판에 붙이기!';
    submitTipBtn.disabled = false;
  }, 700);
});

/* ── 폼 초기화 ── */
function resetForm() {
  tipTitle.value = ''; tipDesc.value = '';
  imageFile.value = ''; imagePreview.src = '';
  imagePreview.classList.add('hidden');
  uploadPlaceholder.classList.remove('hidden');
  selectedCategory = 'dorm';
  catBtns.forEach(b => b.classList.remove('active'));
  catBtns[0].classList.add('active');
}

/* ── 검색 ── */
searchInput.addEventListener('input', () => {
  const q = searchInput.value.trim().toLowerCase();
  if (!q) { renderBoard(); return; }
  renderBoard(tips.filter(t => t.title.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q)));
});

/* ── 사이드 필터 ── */
navLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    navLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');
    const filter = link.dataset.filter;
    const filtered =
      filter === 'newest'  ? [...tips].sort((a,b) => b.id - a.id) :
      filter === 'popular' ? [...tips].sort((a,b) => b.likes - a.likes) :
      filter === 'mine'    ? tips.filter(t => t.id >= 10) : tips;
    renderBoard(filtered);
  });
});

/* ── ESC ── */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { formModal.classList.remove('active'); closeDetail(); }
});

/* ── 초기 렌더 ── */
renderBoard();