'use strict';

/* ---------- helpers ---------- */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));
const inr = new Intl.NumberFormat('en-IN', {style: 'currency', currency: 'INR', minimumFractionDigits: 2, maximumFractionDigits: 2});
const inr0 = new Intl.NumberFormat('en-IN', {style: 'currency', currency: 'INR', maximumFractionDigits: 0});
const nf = new Intl.NumberFormat('en-IN');
const money = v => inr.format(Number(v || 0));
const money0 = v => inr0.format(Math.round(Number(v || 0)));
const n = v => nf.format(Number(v || 0));
const plural = (count, one, many = one + 's') => `${n(count)} ${Number(count) === 1 ? one : many}`;
const motionOK = () => !matchMedia('(prefers-reduced-motion: reduce)').matches;
const store = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch {} },
  sget(k) { try { return sessionStorage.getItem(k); } catch { return null; } },
  sset(k, v) { try { sessionStorage.setItem(k, v); } catch {} },
};

/* ---------- dates ---------- */
const DAY = 864e5;
const today0 = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };
const fromISO = s => { const [y, m, d] = String(s).slice(0, 10).split('-').map(Number); return new Date(y, m - 1, d); };
const fromDMY = s => { const [d, m, y] = String(s).split('-').map(Number); return new Date(y, m - 1, d); };
const toDMY = d => `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`;
const toISO = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const daysUntil = s => Math.round((fromISO(s) - today0()) / DAY);
const fmtDate = (d, o = {day: 'numeric', month: 'short', year: 'numeric'}) => d.toLocaleDateString('en-IN', o);
function expiryText(iso) {
  const k = daysUntil(iso);
  if (k < -1) return `Expired ${plural(-k, 'day')} ago`;
  if (k === -1) return 'Expired yesterday';
  if (k === 0) return 'Expires today';
  if (k === 1) return 'Expires tomorrow';
  if (k <= 60) return `Expires in ${plural(k, 'day')}`;
  return `Expires ${fmtDate(fromISO(iso), {month: 'short', year: 'numeric'})}`;
}
function dayName(d) {
  const k = Math.round((today0() - d) / DAY);
  if (k === 0) return 'Today';
  if (k === 1) return 'Yesterday';
  return fmtDate(d, {weekday: 'long', day: 'numeric', month: 'short'});
}

/* ---------- icons ---------- */
const ICON = {
  // product forms
  tablet: '<circle cx="8.5" cy="8.5" r="5.5"/><path d="M5 12 12 5"/><circle cx="16.5" cy="16.5" r="4.5"/><path d="M12 16.5h9"/>',
  capsule: '<g transform="rotate(-45 12 12)"><rect x="3" y="8.5" width="18" height="7" rx="3.5"/><path d="M12 8.5v7"/></g>',
  bottle: '<path d="M10 3h4v3l2.5 2.6V20a1 1 0 0 1-1 1h-7a1 1 0 0 1-1-1V8.6L10 6z"/><path d="M7.5 12.5h9"/>',
  flask: '<path d="M9.5 3h5M10.5 3v5.5l-4.8 8.8A2.4 2.4 0 0 0 7.8 21h8.4a2.4 2.4 0 0 0 2.1-3.7l-4.8-8.8V3"/><path d="M7.4 15h9.2"/>',
  tube: '<path d="M6.5 3h11"/><path d="m7.5 3 1.6 13.5h5.8L16.5 3"/><rect x="10" y="16.5" width="4" height="4.5" rx="1"/>',
  drops: '<path d="M12 3.5s6 6.4 6 10.5a6 6 0 0 1-12 0c0-4.1 6-10.5 6-10.5z"/><path d="M9.2 14.5a2.8 2.8 0 0 0 2.3 2.7"/>',
  syringe: '<path d="m17.5 2.5 4 4M19.5 4.5l-3 3M18 9l-3-3M16.5 7.5l-9 9H5v-2.5l9-9M5 19l-2.5 2.5M9 12l1.5 1.5M11.5 9.5 13 11"/>',
  sachet: '<rect x="5" y="3" width="14" height="18" rx="1.5"/><path d="M5 6.5h14M5 17.5h14M9.5 12h5"/>',
  spray: '<rect x="7" y="10" width="10" height="11" rx="2"/><path d="M9.5 10V7h5v3M12 7V4h4.5"/><path d="M19 3.5h.01M20.5 6h.01M19 8.5h.01"/>',
  box: '<path d="M3.5 7.5 12 3.2l8.5 4.3v9L12 20.8l-8.5-4.3z"/><path d="M3.5 7.5 12 12l8.5-4.5M12 12v8.8"/>',
  foil: '<rect x="4" y="4" width="16" height="16" rx="3"/><circle cx="12" cy="12" r="4.6"/><circle cx="12" cy="12" r="1.8"/>',
  teststick: '<g transform="rotate(-45 12 12)"><rect x="2" y="8.5" width="20" height="7" rx="3.5"/><rect x="8.5" y="10.5" width="5.5" height="3" rx="1"/><path d="M17 10.5v3"/></g>',
  pad: '<path d="M12 3c2.8 0 4.5 2.3 4.5 5.5v7c0 3.2-1.7 5.5-4.5 5.5s-4.5-2.3-4.5-5.5v-7C7.5 5.3 9.2 3 12 3z"/><path d="M7.5 9.5h-3v5h3M16.5 9.5h3v5h-3"/>',
  soap: '<rect x="3.5" y="9" width="17" height="10" rx="4"/><path d="M8 13.5h8"/><circle cx="8" cy="5" r="1.6"/><circle cx="12.5" cy="4" r="1"/><circle cx="16" cy="5.8" r="1.2"/>',
  pump: '<rect x="6.5" y="10" width="11" height="11" rx="2.5"/><path d="M10 10V7h4v3M12 7V4H7.5"/><path d="M9.5 15.5h5"/>',
  rollon: '<rect x="7.5" y="9.5" width="9" height="11.5" rx="2.5"/><circle cx="12" cy="6.2" r="3.2"/>',
  wipes: '<rect x="3" y="6" width="18" height="12" rx="3"/><path d="M8.5 12c0-1.3 1.6-2.2 3.5-2.2s3.5.9 3.5 2.2-1.6 2.2-3.5 2.2-3.5-.9-3.5-2.2z"/>',
  plaster: '<g transform="rotate(-45 12 12)"><rect x="1.5" y="8" width="21" height="8" rx="4"/><rect x="8.5" y="8" width="7" height="8"/></g>',
  roll: '<circle cx="9" cy="10" r="6"/><circle cx="9" cy="10" r="1.8"/><path d="M15 10v8.5a1.5 1.5 0 0 1-1.5 1.5H4"/>',
  thermo: '<path d="M3 12a2.5 2.5 0 0 1 2.5-2.5h10.5l4.5 2.5-4.5 2.5H5.5A2.5 2.5 0 0 1 3 12z"/><path d="M6.5 12h5.5"/>',
  jar: '<rect x="5" y="9.5" width="14" height="10.5" rx="2.5"/><rect x="4" y="5" width="16" height="4.5" rx="1.5"/><path d="M9 14.5h6"/>',
  lozenge: '<rect x="6.3" y="6.3" width="11.4" height="11.4" rx="3" transform="rotate(45 12 12)"/><path d="M10 12h4"/>',
  mask: '<path d="M5 8.5C7.5 7.5 9.5 7 12 7s4.5.5 7 1.5v5c-1.5 2.5-4 4-7 4s-5.5-1.5-7-4z"/><path d="M5 10H3.5a1.5 1.5 0 0 0 0 3H5.2M19 10h1.5a1.5 1.5 0 0 1 0 3h-1.7M8.5 11h7M9 14h6"/>',
  // interface
  search: '<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  x: '<path d="M6 6l12 12M18 6 6 18"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/>',
  moon: '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
  today: '<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/><circle cx="12" cy="15" r="1.6"/>',
  counter: '<path d="M6 3h12v18l-2-1.4-2 1.4-2-1.4-2 1.4-2-1.4L6 21z"/><path d="M9 8h6M9 11.5h6M9 15h3"/>',
  inventory: '<rect x="3.5" y="3.5" width="17" height="17" rx="2"/><path d="M3.5 12h17M12 3.5v17M7 8h1.5M15.5 8H17M7 16h1.5M15.5 16H17"/>',
  restock: '<path d="M12 3v10M8 9.5l4 4 4-4"/><path d="M4 14v4.5A1.5 1.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5V14"/>',
  suppliers: '<path d="M3 6.5h11v10H3zM14 10h3.5l3 3v3.5H14"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>',
  staff: '<circle cx="9" cy="8.5" r="3.2"/><path d="M3.5 19.5a5.5 5.5 0 0 1 11 0"/><circle cx="17" cy="9.5" r="2.5"/><path d="M15.6 14.6a4.5 4.5 0 0 1 4.9 4.9"/>',
  print: '<path d="M7 9V3.5h10V9"/><rect x="3.5" y="9" width="17" height="8" rx="2"/><path d="M7 14h10v6.5H7z"/>',
  phone: '<path d="M5 4h3.5L10 8 8 9.5a10 10 0 0 0 6.5 6.5l1.5-2 4 1.5V19a1.5 1.5 0 0 1-1.6 1.5A16 16 0 0 1 3.5 5.6 1.5 1.5 0 0 1 5 4z"/>',
  edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="m13.5 6.5 4 4"/>',
  list: '<path d="M8.5 6H20M8.5 12H20M8.5 18H20M4 6h.01M4 12h.01M4 18h.01"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5.5A1.5 1.5 0 0 0 14.5 4h-9A1.5 1.5 0 0 0 4 5.5v9A1.5 1.5 0 0 0 5.5 16H8"/>',
  refresh: '<path d="M20 12a8 8 0 1 1-2.3-5.6M20 4v4.5h-4.5"/>',
  chevron: '<path d="m9 6 6 6-6 6"/>',
  scan: '<path d="M4 8V5.5A1.5 1.5 0 0 1 5.5 4H8M16 4h2.5A1.5 1.5 0 0 1 20 5.5V8M20 16v2.5a1.5 1.5 0 0 1-1.5 1.5H16M8 20H5.5A1.5 1.5 0 0 1 4 18.5V16M8 9v6M11 9v6M14 9v6M16.5 9v6"/>',
  logout: '<path d="M14 4h4.5A1.5 1.5 0 0 1 20 5.5v13a1.5 1.5 0 0 1-1.5 1.5H14"/><path d="M10 8l-4 4 4 4M6 12h10"/>',
  // stock states, each a different shape so state never relies on colour alone
  'st-ok': '<circle cx="12" cy="12" r="5.5" fill="currentColor" stroke="none"/>',
  'st-soon': '<circle cx="12" cy="12" r="7.5"/><path d="M12 8v4.2l2.6 1.6"/>',
  'st-low': '<circle cx="12" cy="12" r="6.5"/><path d="M12 5.5a6.5 6.5 0 0 1 0 13z" fill="currentColor"/>',
  'st-out': '<circle cx="12" cy="12" r="6.5" stroke-dasharray="2.6 2.6"/>',
  'st-expired': '<circle cx="12" cy="12" r="7.5"/><path d="m9.3 9.3 5.4 5.4m0-5.4-5.4 5.4"/>',
};
const icon = (k, cls = '') => `<svg class="ico ${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICON[k] || ICON.box}</svg>`;
function formIcon(type) {
  const t = String(type || '').toLowerCase();
  const hit = [[/condom/, 'foil'], [/kit|test/, 'teststick'], [/pad|napkin|tampon/, 'pad'], [/soap/, 'soap'], [/saniti|pump/, 'pump'],
    [/roll/, 'rollon'], [/wipe/, 'wipes'], [/plaster|strip/, 'plaster'], [/bandage|cotton|gauze/, 'roll'], [/device|thermo|monitor/, 'thermo'],
    [/balm|jar/, 'jar'], [/lozenge/, 'lozenge'], [/mask/, 'mask'], [/paste/, 'tube'],
    [/tab/, 'tablet'], [/cap/, 'capsule'], [/syrup|susp/, 'bottle'], [/cream|gel|oint|lotion/, 'tube'], [/drop/, 'drops'],
    [/inj|infus|vial/, 'syringe'], [/powder|sachet|granule/, 'sachet'], [/spray|inhal/, 'spray'], [/sol|liquid|rinse|wash/, 'flask']].find(([r]) => r.test(t));
  return hit ? hit[1] : 'box';
}

/* ---------- Code 39 barcodes (bar, space, bar ... ; 1 = wide) ---------- */
const C39 = {
  '0': '000110100', '1': '100100001', '2': '001100001', '3': '101100000', '4': '000110001', '5': '100110000', '6': '001110000', '7': '000100101', '8': '100100100', '9': '001100100',
  A: '100001001', B: '001001001', C: '101001000', D: '000011001', E: '100011000', F: '001011000', G: '000001101', H: '100001100', I: '001001100', J: '000011100',
  K: '100000011', L: '001000011', M: '101000010', N: '000010011', O: '100010010', P: '001010010', Q: '000000111', R: '100000110', S: '001000110', T: '000010110',
  U: '110000001', V: '011000001', W: '111000000', X: '010010001', Y: '110010000', Z: '011010000', '-': '010000101', '.': '110000100', ' ': '011000100', '*': '010010100',
  '$': '010101000', '/': '010100010', '+': '010001010', '%': '000101010',
};
function barcodeSVG(value, height = 56) {
  const text = String(value || '').toUpperCase();
  if (!text || ![...text].every(c => C39[c] && c !== '*')) return '';
  const quiet = 10, bars = [];
  let x = quiet;
  for (const ch of `*${text}*`) {
    [...C39[ch]].forEach((bit, i) => { const w = bit === '1' ? 3 : 1; if (i % 2 === 0) bars.push(`<rect x="${x}" width="${w}" height="${height}"/>`); x += w; });
    x += 1;
  }
  const width = x - 1 + quiet;
  return `<svg class="barcode" viewBox="0 0 ${width} ${height}" width="${width * 1.5}" height="${height}" preserveAspectRatio="none" role="img" aria-label="Barcode ${esc(text)}"><g>${bars.join('')}</g></svg>`;
}

/* ---------- state ---------- */
const S = {
  csrf: '', user: null, cache: {}, data: {},
  basket: [],
  inv: {q: '', filter: 'all', view: 'list', sort: 'NAME', dir: 1},
  counter: {q: '', type: 'all', view: 'sale', active: 0},
  history: {q: '', staff: 'all'},
  restockQ: '', supplierQ: '', openSupplier: null,
};
const isAdmin = () => S.user?.id === 1;
try { S.basket = JSON.parse(store.sget('pharmacy-bill') || '[]').filter(l => l && l.barcode && l.qty > 0); } catch { S.basket = []; }
const saveBasket = () => store.sset('pharmacy-bill', JSON.stringify(S.basket.map(({barcode, qty}) => ({barcode, qty}))));

/* ---------- API ---------- */
async function api(path, data) {
  const res = await fetch('/api/' + path, {
    method: data === undefined ? 'GET' : 'POST',
    headers: {'Content-Type': 'application/json', 'X-CSRF-Token': S.csrf},
    body: data === undefined ? undefined : JSON.stringify(data),
    credentials: 'same-origin',
  });
  let body = {};
  try { body = await res.json(); } catch {}
  if (!res.ok) {
    if (res.status === 401 && path !== 'login') showLogin();
    throw new Error(body.error || `The server answered with an error (${res.status}).`);
  }
  return body;
}
function load(key, force = false) {
  const hit = S.cache[key];
  if (!force && hit && Date.now() - hit.at < 30000) return hit.promise;
  const promise = api(key).then(d => { S.data[key] = d; return d; });
  S.cache[key] = {promise, at: Date.now()};
  promise.catch(() => { if (S.cache[key]?.promise === promise) delete S.cache[key]; });
  return promise;
}
const invalidate = (...keys) => keys.forEach(k => delete S.cache[k]);
const drugBy = barcode => (S.data.drugs || []).find(d => d.BARCODE === barcode);

/* ---------- stock state ---------- */
const STATE = {ok: 'In stock', soon: 'Expires soon', low: 'Running low', out: 'Out of stock', expired: 'Expired'};
function stateOf(d) {
  const k = daysUntil(d.EXPIRATION_DATE), q = Number(d.QUANTITY);
  if (k < 0) return 'expired';
  if (q === 0) return 'out';
  if (q <= 10) return 'low';
  if (k <= 30) return 'soon';
  return 'ok';
}
const sellable = d => daysUntil(d.EXPIRATION_DATE) >= 0 && Number(d.QUANTITY) > 0;
const FILTERS = {
  all: ['All', () => true],
  instock: ['In stock', sellable],
  low: ['Low or out', d => daysUntil(d.EXPIRATION_DATE) >= 0 && Number(d.QUANTITY) <= 10],
  soon: ['Expiring within 30 days', d => { const k = daysUntil(d.EXPIRATION_DATE); return k >= 0 && k <= 30; }],
  expired: ['Expired', d => daysUntil(d.EXPIRATION_DATE) < 0],
};
const badge = d => { const s = stateOf(d); return `<span class="badge s-${s}">${icon('st-' + s)}${STATE[s]}</span>`; };
const stateIcon = s => `<span class="s-${s} state-dot">${icon('st-' + s)}</span>`;
let fillScale = 120;
function updateFillScale(drugs) {
  const q = drugs.map(d => Number(d.QUANTITY)).sort((a, b) => a - b);
  fillScale = Math.max(40, q[Math.floor(q.length * 0.5)] || 0); // median, so a healthy 30 i-pills reads as well stocked next to 150 tablets
}
const fillOf = d => Math.min(1, Number(d.QUANTITY) / fillScale);
const meter = (d, cls = '') => `<span class="meter ${cls} s-${stateOf(d)}" style="--fill:${fillOf(d).toFixed(3)}"><i></i></span>`;
const matches = (d, q) => !q || [d.NAME, d.BARCODE, d.TYPE, d.COMPANY_NAME, d.PLACE, d.CODE, d.DOSE].some(v => String(v ?? '').toLowerCase().includes(q));
const initials = name => String(name || '?').split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join('');
const cap = s => String(s || '').charAt(0).toUpperCase() + String(s || '').slice(1);

/* ---------- toasts & tooltip ---------- */
function toast(message, {tone = 'info', action} = {}) {
  const el = document.createElement('div');
  el.className = `toast t-${tone}`;
  el.innerHTML = `${icon(tone === 'error' ? 'st-expired' : tone === 'ok' ? 'check' : 'st-ok')}<span></span>`;
  $('span', el).textContent = message;
  if (action) {
    const b = document.createElement('button');
    b.className = 'toast-action'; b.type = 'button'; b.textContent = action.label;
    b.onclick = () => { action.run(); el.remove(); };
    el.append(b);
  }
  $('#toasts').append(el);
  setTimeout(() => { el.classList.add('leaving'); setTimeout(() => el.remove(), 300); }, tone === 'error' ? 6500 : 4200);
}
const tip = $('#tip');
function showTip(target, lines) {
  tip.replaceChildren(...lines.map(([text, cls]) => { const p = document.createElement('p'); p.textContent = text; if (cls) p.className = cls; return p; }));
  tip.hidden = false;
  const r = target.getBoundingClientRect(), t = tip.getBoundingClientRect();
  let x = r.left + r.width / 2 - t.width / 2, y = r.top - t.height - 10;
  if (y < 8) y = r.bottom + 10;
  x = Math.max(8, Math.min(x, innerWidth - t.width - 8));
  tip.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px)`;
}
const hideTip = () => { tip.hidden = true; };
function bindTips(root, selector, linesFor) {
  root.addEventListener('pointerover', e => { const el = e.target.closest(selector); if (el && root.contains(el)) showTip(el, linesFor(el)); });
  root.addEventListener('pointerout', e => { const el = e.target.closest(selector); if (el && !el.contains(e.relatedTarget)) hideTip(); });
  root.addEventListener('focusin', e => { const el = e.target.closest(selector); if (el) showTip(el, linesFor(el)); });
  root.addEventListener('focusout', hideTip);
}
addEventListener('scroll', hideTip, {passive: true});

/* ---------- theme ---------- */
const effectiveTheme = () => document.documentElement.dataset.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
function paintThemeButton() {
  const dark = effectiveTheme() === 'dark';
  $('#theme-toggle').innerHTML = icon(dark ? 'sun' : 'moon');
  $('#theme-toggle').setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
}
function toggleTheme() {
  const next = effectiveTheme() === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  store.set('pharmacy-theme', next);
  paintThemeButton();
  if (S.page === 'today') drawChart();
}
$('#theme-toggle').onclick = toggleTheme;

/* ---------- login ---------- */
function greeting() { const h = new Date().getHours(); return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'; }
function showLogin() {
  S.user = null; S.cache = {}; S.data = {};
  $$('dialog[open]').forEach(d => d.close());
  $('#app').hidden = true; $('#login').hidden = false;
  $('#login-greeting').textContent = greeting() + '.';
  document.title = 'Sign in | Pharmacy';
  setTimeout(() => $('#login-form [name="id"]').focus(), 50);
}
$('#pw-toggle').onclick = e => {
  const input = $('#login-form [name="password"]'), show = input.type === 'password';
  input.type = show ? 'text' : 'password';
  e.currentTarget.textContent = show ? 'Hide' : 'Show';
  e.currentTarget.setAttribute('aria-pressed', show);
  e.currentTarget.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
};
$('#login-form').addEventListener('submit', async e => {
  e.preventDefault();
  const form = e.target, button = $('button[type="submit"]', form), err = $('#login-error');
  const data = Object.fromEntries(new FormData(form));
  err.textContent = '';
  if (!/^\d+$/.test(String(data.id).trim())) { err.textContent = 'Enter your staff ID as a number.'; form.id.focus(); return; }
  if (!data.password) { err.textContent = 'Enter your password.'; form.password.focus(); return; }
  button.disabled = true; button.textContent = 'Signing in…';
  try {
    const r = await api('login', {id: String(data.id).trim(), password: data.password});
    S.user = r.user; S.csrf = r.csrf;
    form.reset();
    showApp();
  } catch (error) {
    err.textContent = error.message;
    form.classList.remove('shake'); void form.offsetWidth; form.classList.add('shake');
  } finally { button.disabled = false; button.textContent = 'Sign in'; }
});

/* ---------- shell ---------- */
const PAGES = {
  today: {title: 'Today', icon: 'today', render: renderToday},
  counter: {title: 'Counter', icon: 'counter', render: renderCounter},
  inventory: {title: 'Inventory', icon: 'inventory', render: renderInventory},
  restock: {title: 'Restock', icon: 'restock', render: renderRestock},
  suppliers: {title: 'Suppliers', icon: 'suppliers', render: renderSuppliers},
  staff: {title: 'Staff', icon: 'staff', render: renderStaff, admin: true},
};
function showApp() {
  $('#login').hidden = true; $('#app').hidden = false;
  $('#me-name').textContent = cap(S.user.name);
  $('#avatar').textContent = initials(S.user.name);
  $('#me-role').textContent = isAdmin() ? `Administrator, staff ID ${S.user.id}` : `Staff ID ${S.user.id}`;
  $('#tabs').innerHTML = Object.entries(PAGES).filter(([, p]) => !p.admin || isAdmin())
    .map(([k, p]) => `<a href="#/${k}" data-tab="${k}">${icon(p.icon)}<span>${p.title}</span>${k === 'counter' ? '<b class="tab-count" id="bill-count" hidden></b>' : ''}</a>`).join('');
  $('#palette-kbd').textContent = /Mac|iPhone|iPad/.test(navigator.platform) ? '⌘K' : 'Ctrl K';
  paintThemeButton();
  updateBillCount();
  load('drugs').catch(() => {});
  route();
}
function currentPage() {
  const p = location.hash.replace(/^#\/?/, '').split('?')[0];
  return PAGES[p] && (!PAGES[p].admin || isAdmin()) ? p : 'today';
}
function go(page) {
  const h = '#/' + page;
  if (location.hash === h) route(); else location.hash = h;
}
addEventListener('hashchange', () => { if (S.user) route(); });
let routeToken = 0;
function route() {
  const page = currentPage(), changed = S.page !== page;
  S.page = page;
  hideTip();
  $$('#tabs a').forEach(a => { if (a.dataset.tab === page) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
  document.title = `${PAGES[page].title} | Pharmacy`;
  const token = ++routeToken;
  const view = $('#view');
  if (changed) { view.classList.remove('enter'); void view.offsetWidth; view.classList.add('enter'); window.scrollTo(0, 0); }
  PAGES[page].render(() => token === routeToken && S.user);
}
function failPanel(error) {
  return `<div class="fail">${icon('st-expired')}<div><h2>Records didn't load</h2><p>${esc(error.message)}</p><button class="btn ghost" type="button" data-retry>${icon('refresh')}Try again</button></div></div>`;
}
function bindRetry(root) { const b = $('[data-retry]', root); if (b) b.onclick = () => route(); }

/* account menu */
const meBtn = $('#me-btn'), meMenu = $('#me-menu');
function toggleMenu(open = meMenu.hidden) { meMenu.hidden = !open; meBtn.setAttribute('aria-expanded', open); if (open) $('button', meMenu).focus(); }
meBtn.onclick = () => toggleMenu();
document.addEventListener('click', e => { if (!meMenu.hidden && !e.target.closest('.me')) toggleMenu(false); });
meMenu.addEventListener('keydown', e => { if (e.key === 'Escape') { toggleMenu(false); meBtn.focus(); } });
$('#logout').onclick = signOut;
async function signOut() {
  toggleMenu(false);
  try { await api('logout', {}); } catch {}
  S.basket = []; saveBasket();
  showLogin();
  try { S.csrf = (await api('session')).csrf; } catch {}
}

/* ---------- TODAY ---------- */
let chartSeries = [];
async function renderToday(live) {
  const view = $('#view');
  view.innerHTML = `
    <section class="brief-wrap">
      <p class="greet">${esc(greeting())}, ${esc(cap(S.user.name))}. <span>${esc(fmtDate(new Date(), {weekday: 'long', day: 'numeric', month: 'long'}))}</span></p>
      <div class="brief" id="brief" aria-busy="true"><span class="skel"></span><span class="skel short"></span></div>
      <p class="brief-foot" id="brief-foot"></p>
      <div class="brief-actions">
        <a class="btn primary" href="#/counter">${icon('counter')}Start a sale</a>
        ${isAdmin() ? `<button class="btn ghost" type="button" id="today-restock">${icon('restock')}Receive stock</button>` : ''}
      </div>
    </section>
    <section class="block">
      <header class="block-head">
        <div><h2>Shelves</h2><p>Each drawer holds one product. The fill shows how much is left. Select a drawer to open it.</p></div>
        <ul class="legend" aria-label="Legend">${['ok', 'soon', 'low', 'out', 'expired'].map(s => `<li>${stateIcon(s)}${STATE[s]}</li>`).join('')}</ul>
      </header>
      <div class="wall wall-rise" id="wall"></div>
    </section>
    <div class="split">
      <section class="block">
        <header class="block-head"><div><h2>Sales, last 14 days</h2><p id="chart-sub">&nbsp;</p></div></header>
        <div class="chart" id="chart"></div>
      </section>
      <section class="block">
        <header class="block-head"><div><h2>Needs attention</h2><p id="attn-sub">&nbsp;</p></div></header>
        <ul class="attention" id="attention"></ul>
      </section>
    </div>
    <section class="block">
      <header class="block-head"><div><h2>Latest sales</h2></div><button class="btn text" type="button" id="all-sales">See all sales</button></header>
      <div id="latest"></div>
    </section>`;
  if ($('#today-restock')) $('#today-restock').onclick = () => openRestockForm();
  $('#all-sales').onclick = () => { S.counter.view = 'history'; go('counter'); };
  let ov, drugs, sales;
  try { [ov, drugs, sales] = await Promise.all([load('overview', true), load('drugs'), load('sales')]); }
  catch (e) { if (live()) { view.innerHTML = failPanel(e); bindRetry(view); } return; }
  if (!live()) return;
  updateFillScale(drugs);

  // the day in a sentence
  const todayKey = toDMY(new Date());
  const todays = sales.filter(s => s.DATE === todayKey);
  const takings = Number(ov.stats.sales_today);
  const count = k => drugs.filter(FILTERS[k][1]).length;
  const facts = [
    ['expired', count('expired'), (c, noun) => `${noun(c)} ${c === 1 ? 'has' : 'have'} expired`],
    ['low', count('low'), (c, noun) => `${noun(c)} ${c === 1 ? 'is' : 'are'} low or out of stock`],
    ['soon', count('soon'), (c, noun) => `${noun(c)} ${c === 1 ? 'expires' : 'expire'} within 30 days`],
  ].filter(f => f[1]);
  const parts = facts.map(([k, c, fn], i) => `<button type="button" class="brief-link s-${k === 'low' ? 'low' : k}" data-filter="${k}">${fn(c, i === 0 ? x => plural(x, 'product') : x => n(x))}</button>`);
  const joined = parts.length > 1 ? parts.slice(0, -1).join(', ') + ' and ' + parts.at(-1) : parts[0];
  $('#brief').innerHTML = `<p>${todays.length ? `${esc(money0(takings))} taken across ${plural(todays.length, 'sale')} today.` : 'No sales yet today.'}</p>
    <p>${parts.length ? joined + '.' : 'Every shelf is stocked and in date.'}</p>`;
  $('#brief').removeAttribute('aria-busy');
  $('#brief-foot').textContent = `${n(ov.stats.units)} units on ${plural(drugs.length, 'drawer')}, worth ${money0(ov.stats.value)} at cost.`;
  $$('#brief [data-filter]').forEach(b => b.onclick = () => { S.inv.filter = b.dataset.filter; S.inv.q = ''; go('inventory'); });

  // shelves
  $('#wall').innerHTML = wallHTML(drugs);
  bindWall($('#wall'));

  // chart
  chartSeries = salesSeries(sales, 14);
  const total14 = chartSeries.reduce((a, s) => a + s.amount, 0), count14 = chartSeries.reduce((a, s) => a + s.count, 0);
  $('#chart-sub').textContent = `${money0(total14)} from ${plural(count14, 'sale')}`;
  drawChart();
  if (!chartObserver) { chartObserver = new ResizeObserver(() => { if (S.page === 'today') drawChart(); }); }
  chartObserver.disconnect(); chartObserver.observe($('#chart'));

  // attention
  const rank = {expired: 0, out: 1, low: 2, soon: 3};
  const attn = drugs.filter(d => stateOf(d) !== 'ok').sort((a, b) => rank[stateOf(a)] - rank[stateOf(b)] || daysUntil(a.EXPIRATION_DATE) - daysUntil(b.EXPIRATION_DATE));
  $('#attn-sub').textContent = attn.length ? `${plural(attn.length, 'product')} to look at` : 'Nothing needs attention';
  $('#attention').innerHTML = attn.length ? attn.slice(0, 7).map(d => {
    const s = stateOf(d);
    const why = s === 'expired' ? expiryText(d.EXPIRATION_DATE) : s === 'soon' ? expiryText(d.EXPIRATION_DATE) : Number(d.QUANTITY) === 0 ? 'None left' : `${n(d.QUANTITY)} left`;
    const act = isAdmin() && (s === 'low' || s === 'out') ? `<button class="btn small ghost" type="button" data-restock="${esc(d.BARCODE)}">Receive stock</button>`
      : isAdmin() && s === 'expired' ? `<button class="btn small ghost" type="button" data-edit="${esc(d.BARCODE)}">Update batch</button>` : '';
    return `<li><button class="attn-main" type="button" data-open="${esc(d.BARCODE)}">${stateIcon(s)}<span><b>${esc(d.NAME)}</b><small>${esc(why)}, drawer ${esc(d.PLACE)}</small></span></button>${act}</li>`;
  }).join('') + (attn.length > 7 ? `<li class="attn-more"><button class="btn text" type="button" id="attn-all">Show all ${n(attn.length)}</button></li>` : '')
    : `<li class="empty-line">${icon('check')}Stock levels and dates all look good.</li>`;
  $('#attention').onclick = e => {
    const o = e.target.closest('[data-open]'), r = e.target.closest('[data-restock]'), ed = e.target.closest('[data-edit]');
    if (r) openRestockForm(r.dataset.restock); else if (ed) openMedicineForm(drugBy(ed.dataset.edit)); else if (o) openSheet(o.dataset.open);
    if (e.target.id === 'attn-all') { S.inv.filter = 'all'; S.inv.sort = 'STATE'; S.inv.dir = 1; go('inventory'); }
  };

  // latest
  const latest = sales.slice(0, 6);
  $('#latest').innerHTML = latest.length ? `<ul class="ledger">${latest.map(s => `<li>
      <span class="ledger-when">${esc(s.DATE === todayKey ? String(s.TIME).slice(0, 5) : fmtDate(fromDMY(s.DATE), {day: 'numeric', month: 'short'}))}</span>
      <span class="ledger-what"><b>${esc(s.NAME)}</b><small>${n(s.QUANTITY)} × ${money(s.PRICE)}, sold by ${esc(cap(s.USER_NAME))}</small></span>
      <span class="ledger-amt">${money(s.AMOUNT)}</span></li>`).join('')}</ul>`
    : `<p class="empty-line">No sales recorded yet. <a href="#/counter">Start the first sale</a>.</p>`;
}

function wallHTML(drugs, dim) {
  const rows = new Map();
  drugs.forEach(d => {
    const m = String(d.PLACE || '').trim().match(/^([A-Za-z]+)\s*[-\s]?\s*(\d+)$/);
    const key = m ? m[1].toUpperCase() : 'Other';
    if (!rows.has(key)) rows.set(key, []);
    rows.get(key).push({d, pos: m ? Number(m[2]) : 0});
  });
  const keys = [...rows.keys()].sort((a, b) => a === 'Other' ? 1 : b === 'Other' ? -1 : a.localeCompare(b));
  const cols = Math.max(...[...rows.values()].map(r => r.length), 1);
  return `<div class="wall-grid" style="--cols:${Math.min(cols, 12)}">${keys.map(k => `
    <div class="wall-row"><span class="wall-key" aria-hidden="true">${esc(k === 'Other' ? '•' : k)}</span><div class="wall-bins">${
      rows.get(k).sort((a, b) => a.pos - b.pos || a.d.NAME.localeCompare(b.d.NAME)).map(({d}) => {
        const s = stateOf(d), off = dim && !dim(d);
        return `<button type="button" class="bin s-${s}${off ? ' is-dim' : ''}" data-open="${esc(d.BARCODE)}" style="--fill:${fillOf(d).toFixed(3)}" aria-label="${esc(`Drawer ${d.PLACE}: ${d.NAME}, ${d.QUANTITY} units, ${STATE[s]}`)}">
          <span class="bin-code">${esc(d.PLACE)}</span>${icon(formIcon(d.TYPE), 'bin-form')}${s !== 'ok' ? `<span class="bin-flag">${icon('st-' + s)}</span>` : ''}</button>`;
      }).join('')}</div></div>`).join('')}</div>`;
}
function bindWall(root) {
  root.onclick = e => { const b = e.target.closest('[data-open]'); if (b) { b.classList.add('pressed'); setTimeout(() => b.classList.remove('pressed'), 220); openSheet(b.dataset.open); } };
  bindTips(root, '.bin', el => {
    const d = drugBy(el.dataset.open);
    if (!d) return [['Unknown']];
    return [[d.NAME, 'tip-strong'], [`${n(d.QUANTITY)} units, ${STATE[stateOf(d)].toLowerCase()}`], [expiryText(d.EXPIRATION_DATE), 'tip-muted']];
  });
}

/* sales chart: single series, one bar per day */
let chartObserver = null;
function salesSeries(sales, days) {
  const out = [], start = today0();
  for (let i = days - 1; i >= 0; i--) { const d = new Date(start); d.setDate(d.getDate() - i); out.push({date: d, key: toDMY(d), amount: 0, count: 0}); }
  const idx = Object.fromEntries(out.map((o, i) => [o.key, i]));
  sales.forEach(s => { const i = idx[s.DATE]; if (i !== undefined) { out[i].amount += Number(s.AMOUNT); out[i].count++; } });
  return out;
}
function niceStep(raw) {
  const p = 10 ** Math.floor(Math.log10(raw || 1)), x = raw / p;
  return (x <= 1 ? 1 : x <= 2 ? 2 : x <= 2.5 ? 2.5 : x <= 5 ? 5 : 10) * p;
}
function drawChart() {
  const el = $('#chart');
  if (!el || !chartSeries.length) return;
  const W = Math.max(280, el.clientWidth), H = 232, m = {t: 26, r: 6, b: 30, l: 56};
  const iw = W - m.l - m.r, ih = H - m.t - m.b;
  const max = Math.max(...chartSeries.map(s => s.amount), 1);
  const step = niceStep(max / 4), top = Math.ceil(max / step) * step;
  const y = v => m.t + ih - (v / top) * ih;
  const slot = iw / chartSeries.length, bw = Math.min(24, slot * 0.6);
  const every = slot < 30 ? 3 : slot < 44 ? 2 : 1;
  const ticks = []; for (let v = 0; v <= top + 1e-6; v += step) ticks.push(v);
  const peak = chartSeries.reduce((a, s, i) => s.amount > chartSeries[a].amount ? i : a, 0), last = chartSeries.length - 1;
  const short = v => v >= 1e5 ? '₹' + (v / 1e5).toFixed(v % 1e5 ? 1 : 0) + 'L' : v >= 1000 ? '₹' + (v / 1000).toFixed(v % 1000 ? 1 : 0) + 'k' : '₹' + v;
  let svg = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Daily sales for the last 14 days">`;
  svg += ticks.map(v => `<line class="grid" x1="${m.l}" x2="${W - m.r}" y1="${y(v)}" y2="${y(v)}"/><text class="tick" x="${m.l - 10}" y="${y(v) + 4}" text-anchor="end">${short(v)}</text>`).join('');
  chartSeries.forEach((s, i) => {
    const cx = m.l + slot * i + slot / 2, x0 = cx - bw / 2, h = (s.amount / top) * ih, yy = m.t + ih - h, r = Math.min(4, h);
    if (h > 0) svg += `<path class="bar${i === last ? ' is-today' : ''}" data-i="${i}" d="M${x0},${m.t + ih}V${yy + r}Q${x0},${yy} ${x0 + r},${yy}H${x0 + bw - r}Q${x0 + bw},${yy} ${x0 + bw},${yy + r}V${m.t + ih}Z"/>`;
    if ((i === last || i === peak) && s.amount > 0) svg += `<text class="cap" x="${cx}" y="${yy - 8}" text-anchor="middle">${short(Math.round(s.amount))}</text>`;
    if ((last - i) % every === 0) svg += `<text class="tick${i === last ? ' tick-now' : ''}" x="${cx}" y="${H - 9}" text-anchor="middle">${i === last ? 'Today' : s.date.getDate()}</text>`;
    svg += `<rect class="hit" data-i="${i}" x="${m.l + slot * i}" y="${m.t}" width="${slot}" height="${ih}" tabindex="0" role="img" aria-label="${esc(`${fmtDate(s.date, {weekday: 'short', day: 'numeric', month: 'short'})}: ${money(s.amount)} from ${plural(s.count, 'sale')}`)}"/>`;
  });
  svg += `<line class="axis" x1="${m.l}" x2="${W - m.r}" y1="${m.t + ih}" y2="${m.t + ih}"/></svg>`;
  el.innerHTML = svg;
  if (!el.dataset.bound) {
    el.dataset.bound = '1';
    bindTips(el, '.hit', h => {
      const s = chartSeries[h.dataset.i];
      return [[money(s.amount), 'tip-strong'], [fmtDate(s.date, {weekday: 'long', day: 'numeric', month: 'short'})], [plural(s.count, 'sale'), 'tip-muted']];
    });
    el.addEventListener('pointerover', e => { const h = e.target.closest('.hit'); $$('.bar', el).forEach(b => b.classList.toggle('is-hot', h && b.dataset.i === h.dataset.i)); });
    el.addEventListener('pointerleave', () => $$('.bar', el).forEach(b => b.classList.remove('is-hot')));
    el.addEventListener('focusin', e => { const h = e.target.closest('.hit'); $$('.bar', el).forEach(b => b.classList.toggle('is-hot', h && b.dataset.i === h.dataset.i)); });
    el.addEventListener('focusout', () => $$('.bar', el).forEach(b => b.classList.remove('is-hot')));
  }
}

/* ---------- COUNTER ---------- */
async function renderCounter(live) {
  const view = $('#view');
  const sale = S.counter.view === 'sale';
  view.innerHTML = `
    <header class="page-head">
      <div><h1>Counter</h1><p>${sale ? 'Scan a barcode or search, build the bill, then dispense.' : 'Every sale, newest first.'}</p></div>
      <div class="seg" role="tablist" aria-label="Counter view">
        <button role="tab" type="button" aria-selected="${sale}" data-cview="sale">New sale</button>
        <button role="tab" type="button" aria-selected="${!sale}" data-cview="history">Sales history</button>
      </div>
    </header>
    <div id="counter-body"><p class="loading">Opening the counter…</p></div>`;
  $$('[data-cview]', view).forEach(b => b.onclick = () => { S.counter.view = b.dataset.cview; route(); });
  try { await (sale ? load('drugs') : Promise.all([load('sales'), load('drugs')])); }
  catch (e) { if (live()) { $('#counter-body').innerHTML = failPanel(e); bindRetry(view); } return; }
  if (!live()) return;
  updateFillScale(S.data.drugs);
  if (sale) mountSale(); else mountHistory();
}

function drawFormChips() {
  const el = $('#form-chips');
  if (!el) return;
  const count = {};
  S.data.drugs.forEach(d => { count[d.TYPE] = (count[d.TYPE] || 0) + 1; });
  const types = Object.keys(count).sort((a, b) => count[b] - count[a] || a.localeCompare(b));
  if (S.counter.type !== 'all' && !count[S.counter.type]) S.counter.type = 'all';
  const LIMIT = 8;
  let shown = S.counter.allTypes || types.length <= LIMIT + 1 ? types : types.slice(0, LIMIT);
  if (S.counter.type !== 'all' && !shown.includes(S.counter.type)) shown = [...shown, S.counter.type];
  const hidden = types.length - shown.length;
  el.innerHTML = ['all', ...shown].map(t => `<button type="button" class="chip" aria-pressed="${S.counter.type === t}" data-type="${esc(t)}">${t === 'all' ? 'All forms' : `${icon(formIcon(t))}${esc(t)}`}</button>`).join('')
    + (hidden > 0 ? `<button type="button" class="chip chip-more" data-more>${n(hidden)} more forms</button>`
      : S.counter.allTypes && types.length > LIMIT + 1 ? '<button type="button" class="chip chip-more" data-more>Fewer forms</button>' : '');
}

function mountSale() {
  $('#counter-body').innerHTML = `
    <div class="counter">
      <section class="picker" aria-label="Find products">
        <label class="search big">${icon('scan')}<span class="sr">Scan a barcode or search products</span>
          <input id="pick-q" value="${esc(S.counter.q)}" placeholder="Scan a barcode or type a name" autocomplete="off" spellcheck="false" role="combobox" aria-expanded="true" aria-controls="pick-list" aria-autocomplete="list"></label>
        <div class="chips" id="form-chips" role="group" aria-label="Filter by form"></div>
        <ul class="pick-list" id="pick-list" role="listbox" aria-label="Products"></ul>
      </section>
      <aside class="bill" id="bill" aria-label="Bill"></aside>
    </div>`;
  const q = $('#pick-q');
  q.oninput = () => { S.counter.q = q.value; S.counter.active = 0; drawPicks(); };
  q.onkeydown = e => {
    const opts = $$('#pick-list [data-add]:not([aria-disabled="true"])');
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (!opts.length) return;
      S.counter.active = (S.counter.active + (e.key === 'ArrowDown' ? 1 : -1) + opts.length) % opts.length;
      markActive(true);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const code = q.value.trim().toUpperCase();
      const exact = S.data.drugs.find(d => d.BARCODE.toUpperCase() === code || String(d.CODE).toUpperCase() === code);
      const target = exact || (opts[S.counter.active] && drugBy(opts[S.counter.active].dataset.add));
      if (target && addToBill(target.BARCODE)) { if (exact) { q.value = ''; S.counter.q = ''; drawPicks(); } }
    } else if (e.key === 'Escape' && q.value) { q.value = ''; S.counter.q = ''; drawPicks(); }
  };
  drawFormChips();
  $('#form-chips').onclick = e => {
    const c = e.target.closest('.chip');
    if (!c) return;
    if (c.hasAttribute('data-more')) { S.counter.allTypes = !S.counter.allTypes; drawFormChips(); $('#form-chips [data-more]')?.focus(); return; }
    S.counter.type = c.dataset.type; S.counter.active = 0;
    $$('#form-chips .chip[data-type]').forEach(x => x.setAttribute('aria-pressed', x === c));
    drawPicks();
  };
  $('#pick-list').onclick = e => { const li = e.target.closest('[data-add]'); if (li && li.getAttribute('aria-disabled') !== 'true') { addToBill(li.dataset.add); } else if (li) openSheet(li.dataset.add); };
  drawPicks(); drawBill();
  if (matchMedia('(pointer: fine)').matches) q.focus();
}
function drawPicks() {
  const list = $('#pick-list');
  if (!list) return;
  const q = S.counter.q.trim().toLowerCase();
  const items = S.data.drugs.filter(d => (S.counter.type === 'all' || d.TYPE === S.counter.type) && matches(d, q))
    .sort((a, b) => (sellable(b) - sellable(a)) || a.NAME.localeCompare(b.NAME));
  if (!items.length) { list.innerHTML = `<li class="empty-line">Nothing matches “${esc(S.counter.q)}”. Check the spelling, or scan the barcode instead.</li>`; return; }
  const inBill = Object.fromEntries(S.basket.map(l => [l.barcode, l.qty]));
  list.innerHTML = items.map(d => {
    const ok = sellable(d), s = stateOf(d), held = inBill[d.BARCODE] || 0;
    const note = !ok ? (s === 'expired' ? 'Expired, cannot be sold' : 'Out of stock') : `${n(d.QUANTITY - held)} left`;
    return `<li role="option" class="pick${ok ? '' : ' is-off'}" data-add="${esc(d.BARCODE)}" aria-disabled="${!ok}" aria-selected="false" id="pk-${esc(d.BARCODE)}">
      <span class="pick-form">${icon(formIcon(d.TYPE))}</span>
      <span class="pick-main"><b>${esc(d.NAME)}</b><small>${esc(d.TYPE)}, ${esc(d.DOSE)}, drawer ${esc(d.PLACE)}</small></span>
      <span class="pick-stock s-${s}">${ok && s !== 'ok' ? icon('st-' + s) : ''}${esc(note)}</span>
      <span class="pick-price">${money(d.SELLING_PRICE)}</span>
      <span class="pick-add" aria-hidden="true">${held ? `<b>${n(held)}</b>` : icon('plus')}</span></li>`;
  }).join('');
  markActive(false);
}
function markActive(scroll) {
  const opts = $$('#pick-list [data-add]:not([aria-disabled="true"])');
  opts.forEach((o, i) => o.setAttribute('aria-selected', i === S.counter.active));
  const cur = opts[S.counter.active];
  $('#pick-q')?.setAttribute('aria-activedescendant', cur ? cur.id : '');
  if (cur && scroll) cur.scrollIntoView({block: 'nearest'});
}
function addToBill(barcode, qty = 1) {
  const d = drugBy(barcode);
  if (!d) { toast('That product is not in the inventory.', {tone: 'error'}); return false; }
  if (!sellable(d)) { toast(`${d.NAME} ${stateOf(d) === 'expired' ? 'has expired and cannot be sold' : 'is out of stock'}.`, {tone: 'error'}); return false; }
  const line = S.basket.find(l => l.barcode === barcode);
  const have = line ? line.qty : 0;
  if (have + qty > Number(d.QUANTITY)) { toast(`Only ${n(d.QUANTITY)} of ${d.NAME} on the shelf.`, {tone: 'error'}); bump(`[data-line="${CSS.escape(barcode)}"]`, 'shake'); return false; }
  if (line) { line.qty += qty; delete line.error; } else S.basket.push({barcode, qty});
  saveBasket(); updateBillCount(true);
  if (S.page === 'counter' && $('#bill')) { drawBill(barcode); drawPicks(); }
  else toast(`${d.NAME} added to the bill.`, {tone: 'ok', action: {label: 'Open bill', run: () => { S.counter.view = 'sale'; go('counter'); }}});
  return true;
}
function bump(selector, cls) { const el = $(selector); if (!el) return; el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); }
function updateBillCount(pop) {
  const el = $('#bill-count');
  if (!el) return;
  const c = S.basket.reduce((a, l) => a + l.qty, 0);
  el.hidden = !c; el.textContent = c || '';
  el.setAttribute('aria-label', c ? `${plural(c, 'item')} on the bill` : '');
  if (pop && c) bump('#bill-count', 'pop');
}
function drawBill(fresh) {
  const bill = $('#bill');
  if (!bill) return;
  S.basket = S.basket.filter(l => drugBy(l.barcode));
  const lines = S.basket.map(l => ({...l, d: drugBy(l.barcode)}));
  const total = lines.reduce((a, l) => a + Number(l.d.SELLING_PRICE) * l.qty, 0);
  const units = lines.reduce((a, l) => a + l.qty, 0);
  bill.innerHTML = `
    <header class="bill-head"><h2>Bill</h2><span>${units ? plural(units, 'item') : ''}</span>${lines.length ? '<button class="btn text" type="button" id="clear-bill">Clear</button>' : ''}</header>
    ${lines.length ? `<ul class="bill-lines">${lines.map(l => `
      <li class="line${l.barcode === fresh ? ' is-new' : ''}${l.error ? ' has-error' : ''}" data-line="${esc(l.barcode)}">
        <div class="line-main"><b>${esc(l.d.NAME)}</b><small>${money(l.d.SELLING_PRICE)} each</small></div>
        <div class="stepper">
          <button type="button" data-step="-1" aria-label="One less ${esc(l.d.NAME)}">${icon('minus')}</button>
          <input value="${l.qty}" inputmode="numeric" aria-label="Quantity of ${esc(l.d.NAME)}" data-qty>
          <button type="button" data-step="1" aria-label="One more ${esc(l.d.NAME)}">${icon('plus')}</button>
        </div>
        <b class="line-total">${money(Number(l.d.SELLING_PRICE) * l.qty)}</b>
        <button type="button" class="icon-btn small" data-remove aria-label="Remove ${esc(l.d.NAME)}">${icon('x')}</button>
        ${l.error ? `<p class="line-error">${esc(l.error)}</p>` : ''}
      </li>`).join('')}</ul>`
      : `<div class="bill-empty">${icon('counter')}<p>The bill is empty.</p><small>Scan a barcode or pick a product to add it.</small></div>`}
    <footer class="bill-foot">
      <div class="bill-total"><span>Total</span><strong>${money(total)}</strong></div>
      <button type="button" class="btn go full" id="dispense" ${lines.length ? '' : 'disabled'}>Dispense${lines.length ? ' ' + money(total) : ''}</button>
      <p class="fine">Each product is saved as its own sale and taken off the shelf straight away.</p>
    </footer>`;
  if ($('#clear-bill')) $('#clear-bill').onclick = () => { S.basket = []; saveBasket(); updateBillCount(); drawBill(); drawPicks(); };
  $('#dispense').onclick = dispense;
  bill.onclick = e => {
    const li = e.target.closest('[data-line]');
    if (!li) return;
    const line = S.basket.find(l => l.barcode === li.dataset.line);
    if (e.target.closest('[data-remove]')) { S.basket = S.basket.filter(l => l !== line); }
    else if (e.target.closest('[data-step]')) {
      const step = Number(e.target.closest('[data-step]').dataset.step), d = drugBy(line.barcode);
      if (line.qty + step > Number(d.QUANTITY)) { toast(`Only ${n(d.QUANTITY)} of ${d.NAME} on the shelf.`, {tone: 'error'}); bump(`[data-line="${CSS.escape(line.barcode)}"]`, 'shake'); return; }
      line.qty += step;
      if (line.qty <= 0) S.basket = S.basket.filter(l => l !== line);
    } else return;
    saveBasket(); updateBillCount(); drawBill(); drawPicks();
  };
  bill.onchange = e => {
    if (!e.target.matches('[data-qty]')) return;
    const li = e.target.closest('[data-line]'), line = S.basket.find(l => l.barcode === li.dataset.line), d = drugBy(line.barcode);
    let v = Math.floor(Number(e.target.value));
    if (!Number.isFinite(v) || v < 0) v = line.qty;
    if (v > Number(d.QUANTITY)) { toast(`Only ${n(d.QUANTITY)} of ${d.NAME} on the shelf.`, {tone: 'error'}); v = Number(d.QUANTITY); }
    line.qty = v;
    if (!v) S.basket = S.basket.filter(l => l !== line);
    saveBasket(); updateBillCount(); drawBill(); drawPicks();
  };
}
async function dispense() {
  const btn = $('#dispense'), lines = [...S.basket];
  if (!lines.length) return;
  btn.disabled = true;
  const done = [];
  for (const [i, l] of lines.entries()) {
    btn.textContent = lines.length > 1 ? `Dispensing ${i + 1} of ${lines.length}…` : 'Dispensing…';
    try {
      const r = await api('sales', {BARCODE: l.barcode, QUANTITY: l.qty});
      done.push(r.receipt); l.done = true;
    } catch (e) {
      l.error = e.message;
      if (!S.user) return;
    }
  }
  S.basket = S.basket.filter(l => !l.done);
  saveBasket(); updateBillCount();
  invalidate('drugs', 'sales', 'overview');
  try { await load('drugs', true); } catch {}
  drawBill(); drawPicks();
  if (done.length) showReceipt(done);
  if (S.basket.length) toast(`${plural(S.basket.length, 'product')} could not be dispensed. The reason is shown on the bill.`, {tone: 'error'});
}
function showReceipt(lines) {
  const total = lines.reduce((a, r) => a + Number(r.amount), 0);
  const now = new Date();
  $('#slip').innerHTML = `
    <header class="slip-head"><svg class="brand-mark" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="9"/><path d="M13 6.5h6v6.5h6.5v6H19v6.5h-6V19H6.5v-6H13z"/></svg><b>Pharmacy</b>
      <span>${esc(fmtDate(now))}, ${esc(now.toLocaleTimeString('en-IN', {hour: '2-digit', minute: '2-digit'}))}</span><span>Served by ${esc(cap(lines[0].staff))}</span></header>
    <ul class="slip-lines">${lines.map(r => `<li><span class="slip-name">${esc(r.name)}</span><span class="slip-qty">${n(r.quantity)} × ${money(r.price)}</span><span class="slip-amt">${money(r.amount)}</span></li>`).join('')}</ul>
    <div class="slip-total"><span>Total</span><b>${money(total)}</b></div>
    <p class="slip-count">${plural(lines.reduce((a, r) => a + Number(r.quantity), 0), 'item')} on ${plural(lines.length, 'line')}</p>
    <p class="slip-note">Transaction receipt. Not a GST tax invoice.</p>
    <div class="stamp" aria-hidden="true"><span>Dispensed</span><small>${esc(fmtDate(now, {day: '2-digit', month: 'short', year: 'numeric'}))}</small></div>`;
  const dlg = $('#receipt');
  dlg.classList.remove('stamped');
  dlg.showModal();
  requestAnimationFrame(() => setTimeout(() => dlg.classList.add('stamped'), motionOK() ? 380 : 0));
  $('#next-sale').focus();
}
$('#print-receipt').onclick = () => window.print();
$('#next-sale').onclick = () => { $('#receipt').close(); $('#pick-q')?.focus(); };

function mountHistory() {
  const sales = S.data.sales;
  const staff = [...new Set(sales.map(s => s.USER_NAME))].sort();
  $('#counter-body').innerHTML = `
    <div class="toolbar">
      <label class="search">${icon('search')}<span class="sr">Search sales</span><input id="hist-q" value="${esc(S.history.q)}" placeholder="Search product or barcode" autocomplete="off"></label>
      <label class="select"><span class="sr">Staff member</span><select id="hist-staff"><option value="all">Everyone</option>${staff.map(s => `<option value="${esc(s)}" ${S.history.staff === s ? 'selected' : ''}>${esc(cap(s))}</option>`).join('')}</select></label>
      <span class="toolbar-note" id="hist-note"></span>
    </div>
    <div id="hist"></div>`;
  $('#hist-q').oninput = e => { S.history.q = e.target.value; drawHistory(); };
  $('#hist-staff').onchange = e => { S.history.staff = e.target.value; drawHistory(); };
  drawHistory();
}
function drawHistory() {
  const q = S.history.q.trim().toLowerCase();
  const rows = S.data.sales.filter(s => (S.history.staff === 'all' || s.USER_NAME === S.history.staff) && (!q || [s.NAME, s.BARCODE, s.TYPE].some(v => String(v).toLowerCase().includes(q))));
  const total = rows.reduce((a, s) => a + Number(s.AMOUNT), 0);
  $('#hist-note').textContent = `${plural(rows.length, 'sale')}, ${money0(total)}${S.data.sales.length >= 1000 ? ' (latest 1,000 shown)' : ''}`;
  if (!rows.length) { $('#hist').innerHTML = `<p class="empty-line">No sales match. Clear the search or choose everyone.</p>`; return; }
  const days = new Map();
  rows.forEach(s => { if (!days.has(s.DATE)) days.set(s.DATE, []); days.get(s.DATE).push(s); });
  $('#hist').innerHTML = [...days].map(([date, list]) => `
    <section class="day">
      <header class="day-head"><h3>${esc(dayName(fromDMY(date)))}</h3><span>${plural(list.length, 'sale')}</span><b>${money(list.reduce((a, s) => a + Number(s.AMOUNT), 0))}</b></header>
      <ul class="ledger">${list.map(s => `<li>
        <span class="ledger-when">${esc(String(s.TIME).slice(0, 5))}</span>
        <span class="ledger-what"><b>${esc(s.NAME)}</b><small>${n(s.QUANTITY)} × ${money(s.PRICE)}, sold by ${esc(cap(s.USER_NAME))}</small></span>
        <span class="ledger-amt">${money(s.AMOUNT)}</span></li>`).join('')}</ul>
    </section>`).join('');
}

/* ---------- INVENTORY ---------- */
async function renderInventory(live) {
  const view = $('#view');
  view.innerHTML = `
    <header class="page-head">
      <div><h1>Inventory</h1><p id="inv-sub">&nbsp;</p></div>
      <div class="page-actions">${isAdmin() ? `<button class="btn primary" type="button" id="add-med">${icon('plus')}Add product</button>` : ''}</div>
    </header>
    <div class="toolbar">
      <label class="search">${icon('search')}<span class="sr">Search inventory</span><input id="inv-q" value="${esc(S.inv.q)}" placeholder="Search name, barcode, supplier or drawer" autocomplete="off"></label>
      <div class="seg small" role="group" aria-label="Layout">
        <button type="button" aria-pressed="${S.inv.view === 'list'}" data-iview="list">${icon('list')}List</button>
        <button type="button" aria-pressed="${S.inv.view === 'wall'}" data-iview="wall">${icon('inventory')}Shelves</button>
      </div>
    </div>
    <div class="chips" id="inv-chips" role="group" aria-label="Filter by status"></div>
    <div id="inv-body"><p class="loading">Counting the shelves…</p></div>`;
  if ($('#add-med')) $('#add-med').onclick = () => openMedicineForm();
  $('#inv-q').oninput = e => { S.inv.q = e.target.value; drawInventory(); };
  $$('[data-iview]', view).forEach(b => b.onclick = () => { S.inv.view = b.dataset.iview; $$('[data-iview]').forEach(x => x.setAttribute('aria-pressed', x === b)); drawInventory(); });
  try { await load('drugs'); } catch (e) { if (live()) { $('#inv-body').innerHTML = failPanel(e); bindRetry(view); } return; }
  if (!live()) return;
  updateFillScale(S.data.drugs);
  const drugs = S.data.drugs, shelves = new Set(drugs.map(d => String(d.PLACE).split(/[-\s]/)[0]));
  $('#inv-sub').textContent = `${plural(drugs.length, 'product')} across ${plural(shelves.size, 'shelf', 'shelves')}`;
  drawInventory();
}
function drawInventory() {
  const drugs = S.data.drugs;
  if (!drugs) return;
  const q = S.inv.q.trim().toLowerCase();
  $('#inv-chips').innerHTML = Object.entries(FILTERS).map(([k, [label, fn]]) => `<button type="button" class="chip${k !== 'all' ? ' s-' + k : ''}" aria-pressed="${S.inv.filter === k}" data-f="${k}">${k !== 'all' && k !== 'instock' ? icon('st-' + k) : ''}${label}<span class="chip-n">${n(drugs.filter(fn).length)}</span></button>`).join('');
  $$('#inv-chips .chip').forEach(c => c.onclick = () => { S.inv.filter = c.dataset.f; drawInventory(); });
  const pass = d => FILTERS[S.inv.filter][1](d) && matches(d, q);
  const body = $('#inv-body');
  if (S.inv.view === 'wall') {
    const hits = drugs.filter(pass).length;
    body.innerHTML = `<p class="toolbar-note">${hits === drugs.length ? 'Showing every drawer.' : `${plural(hits, 'drawer')} match. The rest are faded.`}</p><div class="wall">${wallHTML(drugs, pass)}</div>`;
    bindWall(body);
    return;
  }
  const rank = {expired: 0, out: 1, low: 2, soon: 3, ok: 4};
  const key = {NAME: d => d.NAME.toLowerCase(), PLACE: d => d.PLACE, QUANTITY: d => Number(d.QUANTITY), SELLING_PRICE: d => Number(d.SELLING_PRICE), EXPIRATION_DATE: d => d.EXPIRATION_DATE, STATE: d => rank[stateOf(d)], COMPANY_NAME: d => d.COMPANY_NAME.toLowerCase()}[S.inv.sort] || (d => d.NAME);
  const rows = drugs.filter(pass).sort((a, b) => { const x = key(a), y = key(b); return (x < y ? -1 : x > y ? 1 : 0) * S.inv.dir || a.NAME.localeCompare(b.NAME); });
  if (!rows.length) { body.innerHTML = `<p class="empty-line">No products match. ${S.inv.filter !== 'all' ? '<button class="btn text" type="button" id="clear-f">Show all products</button>' : 'Try a shorter search.'}</p>`; if ($('#clear-f')) $('#clear-f').onclick = () => { S.inv.filter = 'all'; drawInventory(); }; return; }
  const th = (k, label, cls = '') => `<th class="${cls}" aria-sort="${S.inv.sort === k ? (S.inv.dir > 0 ? 'ascending' : 'descending') : 'none'}"><button type="button" data-sort="${k}">${label}<span class="sort-mark" aria-hidden="true">${S.inv.sort === k ? (S.inv.dir > 0 ? '↑' : '↓') : ''}</span></button></th>`;
  body.innerHTML = `<div class="table-wrap"><table class="tbl inv">
    <thead><tr>${th('NAME', 'Product')}${th('PLACE', 'Drawer', 'c-place')}${th('COMPANY_NAME', 'Supplier', 'c-sup')}${th('QUANTITY', 'Stock')}${th('SELLING_PRICE', 'Price', 'num c-price')}${th('EXPIRATION_DATE', 'Expiry', 'c-exp')}${th('STATE', 'Status', 'c-state')}</tr></thead>
    <tbody>${rows.map(d => `<tr data-open="${esc(d.BARCODE)}" tabindex="0">
      <td><span class="med">${icon(formIcon(d.TYPE), 'med-form')}<span><b>${esc(d.NAME)}</b><small>${esc(d.TYPE)}, ${esc(d.DOSE)}</small></span></span></td>
      <td class="c-place"><span class="drawer-tag">${esc(d.PLACE)}</span></td>
      <td class="c-sup">${esc(d.COMPANY_NAME)}</td>
      <td><span class="stock">${meter(d)}<span>${n(d.QUANTITY)}</span></span></td>
      <td class="num c-price">${money(d.SELLING_PRICE)}</td>
      <td class="c-exp"><span class="exp s-${stateOf(d)}">${esc(expiryText(d.EXPIRATION_DATE))}</span></td>
      <td class="c-state">${badge(d)}</td></tr>`).join('')}</tbody></table></div>`;
  $$('[data-sort]', body).forEach(b => b.onclick = () => { const k = b.dataset.sort; S.inv.dir = S.inv.sort === k ? -S.inv.dir : 1; S.inv.sort = k; drawInventory(); $(`[data-sort="${k}"]`)?.focus(); });
  const tbody = $('tbody', body);
  tbody.onclick = e => { const tr = e.target.closest('[data-open]'); if (tr) openSheet(tr.dataset.open); };
  tbody.onkeydown = e => { const tr = e.target.closest('[data-open]'); if (tr && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); openSheet(tr.dataset.open); } };
}

/* ---------- product sheet ---------- */
async function openSheet(barcode) {
  const d = drugBy(barcode);
  if (!d) return;
  hideTip();
  const s = stateOf(d), margin = Number(d.SELLING_PRICE) > 0 ? (1 - Number(d.COST_PRICE) / Number(d.SELLING_PRICE)) * 100 : 0;
  const code = barcodeSVG(d.BARCODE);
  $('#sheet-body').innerHTML = `
    <header class="sheet-head">
      <span class="sheet-form">${icon(formIcon(d.TYPE))}</span>
      <div><h2 id="sheet-title">${esc(d.NAME)}</h2><p>${esc(d.TYPE)}, ${esc(d.DOSE)}</p></div>
      <button type="button" class="icon-btn" data-close aria-label="Close">${icon('x')}</button>
    </header>
    <div class="sheet-scroll">
      <section class="sheet-stock">
        <div class="sheet-stock-top"><p class="big-n">${n(d.QUANTITY)}<span> ${Number(d.QUANTITY) === 1 ? 'unit' : 'units'} on the shelf</span></p>${badge(d)}</div>
        ${meter(d, 'lg')}
        <p class="sheet-exp s-${s}">${esc(expiryText(d.EXPIRATION_DATE))}</p>
        <p class="sheet-sold" id="sheet-sold"></p>
      </section>
      <dl class="facts">
        <div><dt>Drawer</dt><dd><span class="drawer-tag">${esc(d.PLACE)}</span></dd></div>
        <div><dt>Supplier</dt><dd>${esc(d.COMPANY_NAME)}</dd></div>
        <div><dt>Selling price</dt><dd>${money(d.SELLING_PRICE)}</dd></div>
        <div><dt>Cost price</dt><dd>${money(d.COST_PRICE)}</dd></div>
        <div><dt>Margin</dt><dd>${margin.toFixed(0)}%</dd></div>
        <div><dt>Stock value at cost</dt><dd>${money(Number(d.COST_PRICE) * Number(d.QUANTITY))}</dd></div>
        <div><dt>Made on</dt><dd>${esc(fmtDate(fromISO(d.PRODUCTION_DATE)))}</dd></div>
        <div><dt>Use before</dt><dd>${esc(fmtDate(fromISO(d.EXPIRATION_DATE)))}</dd></div>
        <div><dt>Product code</dt><dd>${esc(d.CODE)}</dd></div>
      </dl>
      <figure class="label-card">${code || ''}<figcaption><span>${esc(d.BARCODE)}</span><button type="button" class="btn text small" id="copy-code">${icon('copy')}Copy</button></figcaption></figure>
    </div>
    <footer class="sheet-actions">
      ${sellable(d) ? `<button type="button" class="btn go" id="sheet-sell">${icon('plus')}Add to bill</button>` : ''}
      ${isAdmin() && s !== 'expired' ? `<button type="button" class="btn ghost" id="sheet-restock">${icon('restock')}Receive stock</button>` : ''}
      ${isAdmin() ? `<button type="button" class="btn ghost" id="sheet-edit">${icon('edit')}Edit</button>` : ''}
    </footer>`;
  const sheet = $('#sheet');
  if (!sheet.open) sheet.showModal();
  $('#sheet-sell')?.addEventListener('click', () => { if (addToBill(d.BARCODE)) closeDialog(sheet); });
  $('#sheet-restock')?.addEventListener('click', () => { closeDialog(sheet); openRestockForm(d.BARCODE); });
  $('#sheet-edit')?.addEventListener('click', () => { closeDialog(sheet); openMedicineForm(d); });
  $('#copy-code').onclick = async () => { try { await navigator.clipboard.writeText(d.BARCODE); toast('Barcode copied.', {tone: 'ok'}); } catch { toast('Copying is blocked in this browser.', {tone: 'error'}); } };
  try {
    const sales = await load('sales');
    const since = today0() - 29 * DAY;
    const sold = sales.filter(x => x.BARCODE === d.BARCODE && fromDMY(x.DATE) >= since).reduce((a, x) => a + Number(x.QUANTITY), 0);
    const el = $('#sheet-sold');
    if (el && $('#sheet-title')?.textContent === d.NAME) el.textContent = sold ? `${plural(sold, 'unit')} sold in the last 30 days.` : 'None sold in the last 30 days.';
  } catch {}
}

/* dialogs: close on backdrop click, animate out */
function closeDialog(dlg) {
  if (!dlg.open) return;
  if (!motionOK()) { dlg.close(); return; }
  dlg.classList.add('closing');
  setTimeout(() => { dlg.classList.remove('closing'); dlg.close(); }, 160);
}
$$('dialog').forEach(dlg => {
  dlg.addEventListener('click', e => {
    if (e.target.closest('[data-close]')) { closeDialog(dlg); return; }
    if (e.target === dlg) { const r = dlg.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) closeDialog(dlg); }
  });
  dlg.addEventListener('cancel', e => { e.preventDefault(); closeDialog(dlg); });
});

/* ---------- forms ---------- */
let formSubmit = null;
function field(name, label, {value = '', type = 'text', max, min, step, hint, list, wide, readonly, attrs = ''} = {}) {
  const lim = type === 'number' ? `min="${min ?? 0}" max="1000000000" step="${step ?? '0.01'}" inputmode="decimal"` : type === 'date' ? '' : `maxlength="${max ?? 50}"`;
  return `<label class="field${wide ? ' wide' : ''}"><span>${label}</span><input name="${name}" type="${type}" value="${esc(value)}" ${lim} ${list ? `list="${list}"` : ''} ${readonly ? 'readonly' : ''} required ${attrs}>${hint ? `<small>${hint}</small>` : ''}</label>`;
}
function openForm(title, submitLabel, html, onSubmit, after) {
  $('#form-title').textContent = title;
  $('#form-submit').textContent = submitLabel;
  $('#form-fields').innerHTML = html;
  $('#form-error').textContent = '';
  formSubmit = onSubmit;
  const dlg = $('#form-dialog');
  if (!dlg.open) dlg.showModal();
  after?.();
  $('#form-fields input:not([readonly]), #form-fields select')?.focus();
}
$('#record-form').addEventListener('submit', async e => {
  e.preventDefault();
  const form = e.target, err = $('#form-error'), btn = $('#form-submit');
  err.textContent = '';
  const bad = $$('input, select', form).find(i => !i.checkValidity());
  if (bad) { err.textContent = `${bad.closest('label')?.querySelector('span')?.textContent || 'A field'}: ${bad.validationMessage}`; bad.focus(); return; }
  const label = btn.textContent;
  btn.disabled = true; btn.textContent = 'Saving…';
  try { await formSubmit(Object.fromEntries(new FormData(form))); closeDialog($('#form-dialog')); }
  catch (error) { err.textContent = error.message; }
  finally { btn.disabled = false; btn.textContent = label; }
});

async function openMedicineForm(d) {
  let companies;
  try { [companies] = await Promise.all([load('companies'), load('drugs')]); } catch (e) { toast(e.message, {tone: 'error'}); return; }
  const editing = Boolean(d);
  d = d || {};
  if (!companies.length) { toast('Add a supplier first, then add the product.', {tone: 'error', action: {label: 'Add supplier', run: () => openSupplierForm()}}); return; }
  const types = [...new Set(S.data.drugs.map(x => x.TYPE))].sort();
  const inYear = new Date(); inYear.setFullYear(inYear.getFullYear() + 1);
  openForm(editing ? `Edit ${d.NAME}` : 'Add product', editing ? 'Save changes' : 'Add product', `
    <div class="form-grid">
      ${field('NAME', 'Name', {value: d.NAME, max: 50, wide: true})}
      ${field('TYPE', 'Form', {value: d.TYPE || 'Tablet', max: 20, list: 'types-list', hint: 'Keep it to 10 characters or fewer so it can be sold.'})}
      ${field('DOSE', 'Strength or size', {value: d.DOSE, max: 10, hint: 'For example 500mg, 50ml or 10 pcs'})}
      ${field('BARCODE', 'Barcode', {value: d.BARCODE, max: 20, readonly: editing, hint: editing ? 'Barcodes cannot be changed.' : ''})}
      ${field('CODE', 'Product code', {value: d.CODE, max: 10})}
      ${field('PLACE', 'Drawer', {value: d.PLACE, max: 20, hint: 'Shelf letter and number, like B-04'})}
      <label class="field"><span>Supplier</span><select name="COMPANY_NAME" required><option value="">Choose a supplier</option>${companies.map(c => `<option ${c.NAME === d.COMPANY_NAME ? 'selected' : ''}>${esc(c.NAME)}</option>`).join('')}</select></label>
      ${field('COST_PRICE', 'Cost price (₹)', {value: d.COST_PRICE ?? '', type: 'number'})}
      ${field('SELLING_PRICE', 'Selling price (₹)', {value: d.SELLING_PRICE ?? '', type: 'number'})}
      <p class="calc wide" id="margin-out" aria-live="polite"></p>
      ${field('QUANTITY', 'Units in stock', {value: d.QUANTITY ?? 0, type: 'number', step: 1})}
      ${field('PRODUCTION_DATE', 'Made on', {value: d.PRODUCTION_DATE || toISO(new Date()), type: 'date'})}
      ${field('EXPIRATION_DATE', 'Use before', {value: d.EXPIRATION_DATE || toISO(inYear), type: 'date'})}
    </div>
    <datalist id="types-list">${types.map(t => `<option value="${esc(t)}">`).join('')}</datalist>
    ${editing ? `<input type="hidden" name="original_barcode" value="${esc(d.BARCODE)}">` : ''}`,
  async data => {
    await api('drugs', data);
    invalidate('drugs', 'overview', 'purchases');
    await load('drugs', true).catch(() => {});
    toast(editing ? `${data.NAME} updated.` : `${data.NAME} added to drawer ${data.PLACE}.`, {tone: 'ok'});
    route();
  },
  () => {
    const f = $('#record-form');
    const calc = () => {
      const c = Number(f.COST_PRICE.value), s = Number(f.SELLING_PRICE.value);
      $('#margin-out').textContent = s > 0 && c >= 0 ? (s < c ? `Selling below cost: you lose ${money(c - s)} on each unit.` : `Margin ${money(s - c)} per unit (${((1 - c / s) * 100).toFixed(0)}%).`) : '';
      $('#margin-out').classList.toggle('warn', s > 0 && s < c);
    };
    f.COST_PRICE.oninput = f.SELLING_PRICE.oninput = calc; calc();
  });
}

async function openRestockForm(barcode) {
  let drugs;
  try { drugs = await load('drugs'); } catch (e) { toast(e.message, {tone: 'error'}); return; }
  const options = drugs.filter(d => daysUntil(d.EXPIRATION_DATE) >= 0).sort((a, b) => a.NAME.localeCompare(b.NAME));
  if (!options.length) { toast('Every product has expired. Update a batch before receiving stock.', {tone: 'error'}); return; }
  openForm('Receive stock', 'Receive stock', `
    <div class="form-grid">
      <label class="field wide"><span>Product</span><select name="BARCODE" required><option value="">Choose a product</option>${options.map(d => `<option value="${esc(d.BARCODE)}" ${d.BARCODE === barcode ? 'selected' : ''}>${esc(d.NAME)} (${esc(d.PLACE)}, ${n(d.QUANTITY)} in stock)</option>`).join('')}</select></label>
      ${field('QUANTITY', 'Units received', {value: '', type: 'number', step: 1, min: 1})}
      ${field('PRICE', 'Cost per unit (₹)', {value: '', type: 'number'})}
      <p class="calc wide" id="restock-out" aria-live="polite">Choose a product to see the new stock level.</p>
    </div>
    <p class="fine">Expired products are not listed. Update their batch dates first.</p>`,
  async data => {
    await api('purchases', data);
    const d = drugBy(data.BARCODE);
    invalidate('drugs', 'overview', 'purchases');
    await load('drugs', true).catch(() => {});
    toast(`${plural(Number(data.QUANTITY), 'unit')} of ${d?.NAME || 'stock'} received.`, {tone: 'ok'});
    route();
  },
  () => {
    const f = $('#record-form');
    const sync = prefill => {
      const d = drugBy(f.BARCODE.value), q = Math.max(0, Math.floor(Number(f.QUANTITY.value) || 0));
      if (prefill && d) f.PRICE.value = d.COST_PRICE;
      $('#restock-out').textContent = !d ? 'Choose a product to see the new stock level.'
        : q ? `${n(d.QUANTITY)} + ${n(q)} = ${n(Number(d.QUANTITY) + q)} units in drawer ${d.PLACE}. This delivery costs ${money(q * Number(f.PRICE.value || 0))}.`
        : `${n(d.QUANTITY)} units in drawer ${d.PLACE} now. Enter how many arrived.`;
    };
    f.BARCODE.onchange = () => sync(true);
    f.QUANTITY.oninput = f.PRICE.oninput = () => sync(false);
    sync(true);
    if (barcode) setTimeout(() => f.QUANTITY.focus(), 30);
  });
}

function openSupplierForm() {
  openForm('Add supplier', 'Add supplier', `
    <div class="form-grid">
      ${field('NAME', 'Company name', {max: 50, wide: true})}
      ${field('PHONE', 'Phone', {max: 20, type: 'tel', attrs: 'inputmode="tel"'})}
      ${field('ADDRESS', 'Area or address', {max: 50})}
    </div>`,
  async data => {
    await api('companies', data);
    invalidate('companies');
    toast(`${data.NAME} added to suppliers.`, {tone: 'ok'});
    route();
  });
}

/* ---------- RESTOCK ---------- */
async function renderRestock(live) {
  const view = $('#view');
  view.innerHTML = `
    <header class="page-head">
      <div><h1>Restock</h1><p id="rs-sub">&nbsp;</p></div>
      <div class="page-actions">${isAdmin() ? `<button class="btn primary" type="button" id="receive">${icon('restock')}Receive stock</button>` : ''}</div>
    </header>
    <div class="toolbar">
      <label class="search">${icon('search')}<span class="sr">Search deliveries</span><input id="rs-q" value="${esc(S.restockQ)}" placeholder="Search product or supplier" autocomplete="off"></label>
      ${isAdmin() ? '' : '<span class="toolbar-note">Only the administrator can receive stock.</span>'}
    </div>
    <div id="rs-body"><p class="loading">Opening the delivery book…</p></div>`;
  if ($('#receive')) $('#receive').onclick = () => openRestockForm();
  $('#rs-q').oninput = e => { S.restockQ = e.target.value; drawRestock(); };
  try { await Promise.all([load('purchases'), load('drugs')]); } catch (e) { if (live()) { $('#rs-body').innerHTML = failPanel(e); bindRetry(view); } return; }
  if (!live()) return;
  updateFillScale(S.data.drugs);
  const p = S.data.purchases;
  $('#rs-sub').textContent = `${money0(p.reduce((a, r) => a + Number(r.AMOUNT), 0))} spent on ${plural(p.length, 'product')} so far`;
  drawRestock();
}
function drawRestock() {
  const q = S.restockQ.trim().toLowerCase();
  const rows = S.data.purchases.filter(r => !q || [r.NAME, r.BARCODE, r.COMPANY_NAME].some(v => String(v).toLowerCase().includes(q)));
  const body = $('#rs-body');
  if (!rows.length) { body.innerHTML = `<p class="empty-line">${S.data.purchases.length ? 'No deliveries match that search.' : 'No stock received yet.'}</p>`; return; }
  body.innerHTML = `<div class="table-wrap"><table class="tbl">
    <thead><tr><th>Product</th><th class="c-sup">Supplier</th><th class="num">Received in total</th><th class="num c-price">Last cost per unit</th><th class="num">Spent</th><th>On the shelf now</th></tr></thead>
    <tbody>${rows.map(r => { const d = drugBy(r.BARCODE); return `<tr ${d ? `data-open="${esc(r.BARCODE)}" tabindex="0"` : ''}>
      <td><span class="med">${icon(formIcon(r.TYPE), 'med-form')}<span><b>${esc(r.NAME)}</b><small>${esc(r.BARCODE)}</small></span></span></td>
      <td class="c-sup">${esc(r.COMPANY_NAME)}</td>
      <td class="num">${n(r.QUANTITY)}</td>
      <td class="num c-price">${money(r.PRICE)}</td>
      <td class="num"><b>${money(r.AMOUNT)}</b></td>
      <td>${d ? `<span class="stock">${meter(d)}<span>${n(d.QUANTITY)}</span></span>` : '<span class="muted">Not in inventory</span>'}</td></tr>`; }).join('')}</tbody></table></div>
    <p class="fine">Each product keeps one running delivery record. New deliveries add to its totals, and the cost shown is the most recent one.</p>`;
  const tbody = $('tbody', body);
  tbody.onclick = e => { const tr = e.target.closest('[data-open]'); if (tr) openSheet(tr.dataset.open); };
  tbody.onkeydown = e => { const tr = e.target.closest('[data-open]'); if (tr && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); openSheet(tr.dataset.open); } };
}

/* ---------- SUPPLIERS ---------- */
async function renderSuppliers(live) {
  const view = $('#view');
  view.innerHTML = `
    <header class="page-head">
      <div><h1>Suppliers</h1><p id="sp-sub">&nbsp;</p></div>
      <div class="page-actions">${isAdmin() ? `<button class="btn primary" type="button" id="add-sup">${icon('plus')}Add supplier</button>` : ''}</div>
    </header>
    <div class="toolbar"><label class="search">${icon('search')}<span class="sr">Search suppliers</span><input id="sp-q" value="${esc(S.supplierQ)}" placeholder="Search name, area or phone" autocomplete="off"></label></div>
    <div id="sp-body"><p class="loading">Looking up suppliers…</p></div>`;
  if ($('#add-sup')) $('#add-sup').onclick = openSupplierForm;
  $('#sp-q').oninput = e => { S.supplierQ = e.target.value; drawSuppliers(); };
  try { await Promise.all([load('companies'), load('drugs')]); } catch (e) { if (live()) { $('#sp-body').innerHTML = failPanel(e); bindRetry(view); } return; }
  if (!live()) return;
  $('#sp-sub').textContent = `${plural(S.data.companies.length, 'company', 'companies')} supply your shelves`;
  drawSuppliers();
}
function drawSuppliers() {
  const q = S.supplierQ.trim().toLowerCase();
  const list = S.data.companies.filter(c => !q || [c.NAME, c.ADDRESS, c.PHONE].some(v => String(v).toLowerCase().includes(q)));
  const body = $('#sp-body');
  if (!list.length) { body.innerHTML = `<p class="empty-line">No suppliers match that search.</p>`; return; }
  body.innerHTML = `<ul class="suppliers">${list.map(c => {
    const meds = S.data.drugs.filter(d => d.COMPANY_NAME === c.NAME), open = S.openSupplier === c.NAME;
    const value = meds.reduce((a, d) => a + Number(d.COST_PRICE) * Number(d.QUANTITY), 0);
    const flagged = meds.filter(d => stateOf(d) !== 'ok').length;
    return `<li class="supplier${open ? ' is-open' : ''}">
      <button type="button" class="supplier-row" data-sup="${esc(c.NAME)}" aria-expanded="${open}">
        <span class="mono-badge" aria-hidden="true">${esc(initials(c.NAME))}</span>
        <span class="supplier-name"><b>${esc(c.NAME)}</b><small>${esc(c.ADDRESS)}</small></span>
        <span class="supplier-stat"><b>${plural(meds.length, 'product')}</b><small>${money0(value)} on the shelves${flagged ? `, ${n(flagged)} flagged` : ''}</small></span>
        ${icon('chevron', 'chev')}
      </button>
      <div class="supplier-more" ${open ? '' : 'hidden'}>
        <p class="supplier-contact"><a href="tel:${esc(String(c.PHONE).replace(/[^\d+]/g, ''))}">${icon('phone')}${esc(c.PHONE)}</a></p>
        ${meds.length ? `<div class="med-pills">${meds.map(d => `<button type="button" class="med-pill" data-open="${esc(d.BARCODE)}">${stateIcon(stateOf(d))}${esc(d.NAME)}</button>`).join('')}</div>` : '<p class="muted">No products from this supplier yet.</p>'}
      </div></li>`;
  }).join('')}</ul>`;
  body.onclick = e => {
    const o = e.target.closest('[data-open]'); if (o) { openSheet(o.dataset.open); return; }
    const row = e.target.closest('[data-sup]'); if (!row) return;
    S.openSupplier = S.openSupplier === row.dataset.sup ? null : row.dataset.sup;
    drawSuppliers();
    $(`[data-sup="${CSS.escape(row.dataset.sup)}"]`)?.focus();
  };
}

/* ---------- STAFF ---------- */
async function renderStaff(live) {
  const view = $('#view');
  view.innerHTML = `
    <header class="page-head"><div><h1>Staff</h1><p id="st-sub">&nbsp;</p></div></header>
    <div id="st-body"><p class="loading">Fetching the staff list…</p></div>`;
  let users, sales;
  try { [users, sales] = await Promise.all([load('users'), load('sales')]); } catch (e) { if (live()) { $('#st-body').innerHTML = failPanel(e); bindRetry(view); } return; }
  if (!live()) return;
  const since = today0() - 29 * DAY;
  const by = {};
  sales.forEach(s => { if (fromDMY(s.DATE) >= since) { const k = s.USER_NAME; by[k] = by[k] || {amount: 0, count: 0}; by[k].amount += Number(s.AMOUNT); by[k].count++; } });
  const top = Math.max(1, ...Object.values(by).map(v => v.amount));
  $('#st-sub').textContent = `${plural(users.length, 'person', 'people')} on the team. Sales cover the last 30 days.`;
  $('#st-body').innerHTML = `<div class="table-wrap"><table class="tbl staff">
    <thead><tr><th>Name</th><th>Sales, last 30 days</th><th class="c-sup">Phone</th><th class="c-exp">Area</th><th class="c-place">Born</th><th class="num c-price">Salary</th></tr></thead>
    <tbody>${users.map(u => { const r = by[u.NAME] || {amount: 0, count: 0}; return `<tr>
      <td><span class="med"><span class="mono-badge" aria-hidden="true">${esc(initials(u.NAME))}</span><span><b>${esc(cap(u.NAME))}</b><small>Staff ID ${esc(u.ID)}${u.ID === 1 ? ', administrator' : ''}</small></span></span></td>
      <td><span class="perf"><span class="meter s-series" style="--fill:${(r.amount / top).toFixed(3)}"><i></i></span><span><b>${money0(r.amount)}</b><small>${plural(r.count, 'sale')}</small></span></span></td>
      <td class="c-sup"><a href="tel:${esc(String(u.PHONE).replace(/[^\d+]/g, ''))}">${esc(u.PHONE)}</a></td>
      <td class="c-exp">${esc(u.ADDRESS)}</td>
      <td class="c-place">${esc(u.DOB)}</td>
      <td class="num c-price">${money0(u.SALARY)}</td></tr>`; }).join('')}</tbody></table></div>`;
}

/* ---------- command palette ---------- */
const pal = $('#palette'), palQ = $('#palette-q'), palList = $('#palette-list');
let palItems = [], palActive = 0;
function paletteSource() {
  const pages = Object.entries(PAGES).filter(([, p]) => !p.admin || isAdmin()).map(([k, p]) => ({group: 'Go to', label: p.title, icon: p.icon, run: () => go(k)}));
  pages.splice(2, 0, {group: 'Go to', label: 'Sales history', icon: 'counter', run: () => { S.counter.view = 'history'; go('counter'); }});
  const actions = [
    {group: 'Actions', label: 'Start a sale', icon: 'counter', run: () => { S.counter.view = 'sale'; go('counter'); }},
    ...(isAdmin() ? [
      {group: 'Actions', label: 'Add product', icon: 'plus', run: () => openMedicineForm()},
      {group: 'Actions', label: 'Receive stock', icon: 'restock', run: () => openRestockForm()},
      {group: 'Actions', label: 'Add supplier', icon: 'suppliers', run: () => openSupplierForm()},
    ] : []),
    {group: 'Actions', label: 'Show expired products', icon: 'st-expired', run: () => { S.inv.filter = 'expired'; S.inv.q = ''; go('inventory'); }},
    {group: 'Actions', label: 'Show products that are low or out', icon: 'st-low', run: () => { S.inv.filter = 'low'; S.inv.q = ''; go('inventory'); }},
    {group: 'Actions', label: `Switch to ${effectiveTheme() === 'dark' ? 'light' : 'dark'} theme`, icon: effectiveTheme() === 'dark' ? 'sun' : 'moon', run: toggleTheme},
    {group: 'Actions', label: 'Sign out', icon: 'logout', run: signOut},
  ];
  const meds = (S.data.drugs || []).map(d => ({group: 'Products', label: d.NAME, sub: `${d.PLACE}, ${n(d.QUANTITY)} left`, icon: formIcon(d.TYPE), state: stateOf(d), barcode: d.BARCODE, hay: `${d.NAME} ${d.BARCODE} ${d.CODE} ${d.TYPE} ${d.PLACE} ${d.COMPANY_NAME}`.toLowerCase(), run: () => openSheet(d.BARCODE)}));
  return {pages, actions, meds};
}
function score(label, hay, q) {
  const l = label.toLowerCase();
  if (l === q) return 100;
  if (l.startsWith(q)) return 80;
  if (l.split(/[\s(-]+/).some(w => w.startsWith(q))) return 60;
  if (l.includes(q)) return 40;
  if (hay && hay.includes(q)) return 20;
  let i = 0; for (const c of l) if (c === q[i]) i++;
  return i === q.length ? 5 : 0;
}
function drawPalette() {
  const q = palQ.value.trim().toLowerCase();
  const {pages, actions, meds} = paletteSource();
  if (!q) palItems = [...pages, ...actions];
  else {
    const rank = list => list.map(it => ({it, s: score(it.label, it.hay, q)})).filter(x => x.s).sort((a, b) => b.s - a.s).map(x => x.it);
    palItems = [...rank(meds).slice(0, 8), ...rank(pages), ...rank(actions)];
  }
  palActive = Math.min(palActive, Math.max(0, palItems.length - 1));
  if (!palItems.length) { palList.innerHTML = `<li class="palette-empty">Nothing found for “${esc(palQ.value)}”.</li>`; return; }
  let last = '';
  palList.innerHTML = palItems.map((it, i) => {
    const head = it.group !== last ? `<li class="palette-group" role="presentation">${esc(it.group)}</li>` : '';
    last = it.group;
    return `${head}<li role="option" id="pal-${i}" data-i="${i}" aria-selected="${i === palActive}" class="palette-item">
      <span class="palette-ico${it.state ? ' s-' + it.state : ''}">${icon(it.icon)}</span><span class="palette-label">${esc(it.label)}</span>${it.sub ? `<small>${esc(it.sub)}</small>` : ''}${it.state ? stateIcon(it.state) : ''}</li>`;
  }).join('');
  palQ.setAttribute('aria-activedescendant', 'pal-' + palActive);
}
function openPalette() {
  if (!S.user) return;
  hideTip();
  $$('dialog[open]').forEach(d => d !== pal && d.close());
  palQ.value = ''; palActive = 0; drawPalette();
  if (!pal.open) pal.showModal();
  palQ.focus();
  if (!S.data.drugs) load('drugs').then(drawPalette).catch(() => {});
}
function runPalette(i, shift) {
  const it = palItems[i];
  if (!it) return;
  closeDialog(pal);
  if (shift && it.barcode) addToBill(it.barcode); else it.run();
}
palQ.oninput = () => { palActive = 0; drawPalette(); };
palQ.onkeydown = e => {
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    e.preventDefault();
    if (!palItems.length) return;
    palActive = (palActive + (e.key === 'ArrowDown' ? 1 : -1) + palItems.length) % palItems.length;
    $$('.palette-item').forEach(li => li.setAttribute('aria-selected', Number(li.dataset.i) === palActive));
    palQ.setAttribute('aria-activedescendant', 'pal-' + palActive);
    $(`#pal-${palActive}`)?.scrollIntoView({block: 'nearest'});
  } else if (e.key === 'Enter') { e.preventDefault(); runPalette(palActive, e.shiftKey); }
};
palList.onclick = e => { const li = e.target.closest('[data-i]'); if (li) runPalette(Number(li.dataset.i), e.shiftKey); };
palList.onpointermove = e => {
  const li = e.target.closest('[data-i]');
  if (li && Number(li.dataset.i) !== palActive) { palActive = Number(li.dataset.i); $$('.palette-item').forEach(x => x.setAttribute('aria-selected', x === li)); }
};
$('#open-palette').onclick = openPalette;
document.addEventListener('keydown', e => {
  if (!S.user) return;
  const typing = e.target.closest('input, textarea, select, [contenteditable="true"]');
  if ((e.key === 'k' || e.key === 'K') && (e.ctrlKey || e.metaKey)) { e.preventDefault(); pal.open ? closeDialog(pal) : openPalette(); return; }
  if (e.key === '/' && !typing && !$('dialog[open]')) {
    e.preventDefault();
    const pageSearch = $('#view .search input');
    if (pageSearch) { pageSearch.focus(); pageSearch.select(); } else openPalette();
  }
});

/* ---------- start ---------- */
(async () => {
  try {
    const s = await api('session');
    S.csrf = s.csrf; S.user = s.user;
    if (S.user) showApp(); else showLogin();
  } catch {
    showLogin();
    $('#login-error').textContent = 'The pharmacy server is not answering. Start it with start-mysql-web.bat, then reload this page.';
  }
})();
