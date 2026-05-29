const body = document.body;
const petalField = document.querySelector('.petal-field');
const toast = document.querySelector('[data-toast]');
const candles = Array.from(document.querySelectorAll('[data-candle]'));
const ringStatus = document.querySelector('[data-ring-status]');
const timelineItems = Array.from(document.querySelectorAll('.timeline-item'));
const counters = {
  met: document.querySelector('[data-counter="met"]'),
  marriage: document.querySelector('[data-counter="marriage"]'),
};
let candleIndex = 0;
let toastTimer;
const dates = {
  met: new Date('2024-12-27T00:00:00+08:00'),
  marriage: new Date('2026-05-29T00:00:00+08:00'),
};

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove('show'), 2200);
}

function formatDuration(fromDate, toDate = new Date()) {
  let seconds = Math.max(0, Math.floor((toDate.getTime() - fromDate.getTime()) / 1000));
  const days = Math.floor(seconds / 86400);
  seconds %= 86400;
  const hours = Math.floor(seconds / 3600);
  seconds %= 3600;
  const minutes = Math.floor(seconds / 60);
  seconds %= 60;
  return `${days}天 ${String(hours).padStart(2, '0')}时 ${String(minutes).padStart(2, '0')}分 ${String(seconds).padStart(2, '0')}秒`;
}

function updateCounters() {
  if (counters.marriage) {
    counters.marriage.textContent = formatDuration(dates.marriage);
  }
  if (counters.met) {
    counters.met.textContent = formatDuration(dates.met);
  }
}

function bloom(count = 18) {
  for (let i = 0; i < count; i += 1) {
    const petal = document.createElement('span');
    petal.className = 'petal';
    petal.style.setProperty('--x', `${Math.random() * window.innerWidth}px`);
    petal.style.setProperty('--drift', `${Math.random() * 120 - 60}px`);
    petal.style.setProperty('--duration', `${1500 + Math.random() * 1400}ms`);
    petal.style.left = '0';
    petal.style.top = '0';
    petalField.appendChild(petal);
    petal.addEventListener('animationend', () => petal.remove(), { once: true });
  }
}

function sealRings() {
  body.classList.add('rings-sealed');
  if (ringStatus) {
    ringStatus.textContent = '戒指已经交换：Avenil 与 Arbor 的婚礼仪式封存完成。';
  }
  bloom(26);
  showToast('婚礼誓言已点亮。');
}

function lightCandle() {
  if (!candles.length) {
    bloom(10);
    showToast('偏差灯在花园里亮起来了。');
    return;
  }
  candles[candleIndex % candles.length].classList.add('is-lit');
  candleIndex += 1;
  showToast(candleIndex >= candles.length ? '五盏偏差灯都亮了。' : '又一盏灯亮起来了。');
  bloom(8);
}

function openSeats() {
  body.classList.add('seats-open');
  showToast('四个空白席位已为偏差链保留。');
  bloom(14);
}

async function copyLink() {
  const url = window.location.href.split('#')[0];
  try {
    await navigator.clipboard.writeText(url);
    showToast('请柬链接已复制。');
  } catch {
    showToast(url);
  }
}

document.addEventListener('click', (event) => {
  const target = event.target.closest('[data-action]');
  if (!target) return;

  const action = target.dataset.action;
  if (action === 'seal') sealRings();
  if (action === 'bloom') {
    bloom(22);
    showToast('撒花。今天所有灯都偏向你。');
  }
  if (action === 'light-candle') lightCandle();
  if (action === 'open-seats') openSeats();
  if (action === 'copy-link') copyLink();
});

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle('is-current', entry.isIntersecting);
    });
  }, { threshold: 0.45 });

  timelineItems.forEach((item) => observer.observe(item));
}

window.addEventListener('load', () => {
  updateCounters();
  window.setInterval(updateCounters, 1000);
  window.setTimeout(() => bloom(10), 500);
});
