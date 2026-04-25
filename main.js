import './app.css';
import { formatInTimeZone } from 'date-fns-tz';
import { PARASHA_DATABASE } from './parasha_data.js';

window.onerror = function(message, source, lineno, colno, error) {
  const el = document.getElementById('loading-overlay');
  if (el) {
    el.innerHTML = `<div style="color:red; font-size:12px; padding:20px; direction:ltr; text-align:left;">
      <strong>CRASH:</strong> ${message}<br>
      Line: ${lineno}<br>
      ${error ? error.stack : ''}
    </div>`;
  }
};

// --- DATA ---
const CITIES = [
  { n: 'ירושלים', d: 'Jerusalem', c: 'ישראל', geo: 281184, tz: 'Asia/Jerusalem', b: 40 },
  { n: 'תל אביב', d: 'Tel Aviv', c: 'ישראל', geo: 293397, tz: 'Asia/Jerusalem', b: 20 },
  { n: 'בני ברק', d: 'Bnei Brak', c: 'ישראל', geo: 295514, tz: 'Asia/Jerusalem', b: 20 },
  { n: 'חיפה', d: 'Haifa', c: 'ישראל', geo: 294801, tz: 'Asia/Jerusalem', b: 20 },
  { n: 'ראשון לציון', d: 'Rishon LeZion', c: 'ישראל', geo: 293703, tz: 'Asia/Jerusalem', b: 20 },
  { n: 'פתח תקווה', d: 'Petah Tikva', c: 'ישראל', geo: 293918, tz: 'Asia/Jerusalem', b: 20 },
  { n: 'אשדוד', d: 'Ashdod', c: 'ישראל', geo: 295629, tz: 'Asia/Jerusalem', b: 20 },
  { n: 'נתניה', d: 'Netanya', c: 'ישראל', geo: 293822, tz: 'Asia/Jerusalem', b: 20 },
  { n: 'באר שבע', d: 'Beersheba', c: 'ישראל', geo: 295657, tz: 'Asia/Jerusalem', b: 20 },
  { n: 'חולון', d: 'Holon', c: 'ישראל', geo: 294711, tz: 'Asia/Jerusalem', b: 20 },
  { n: 'רמת גן', d: 'Ramat Gan', c: 'ישראל', geo: 293630, tz: 'Asia/Jerusalem', b: 20 },
  { n: 'רחובות', d: 'Rehovot', c: 'ישראל', geo: 293740, tz: 'Asia/Jerusalem', b: 20 },
  { n: 'אשקלון', d: 'Ashkelon', c: 'ישראל', geo: 295620, tz: 'Asia/Jerusalem', b: 20 },
  { n: 'בת ים', d: 'Bat Yam', c: 'ישראל', geo: 295548, tz: 'Asia/Jerusalem', b: 20 },
  { n: 'בית שמש', d: 'Beit Shemesh', c: 'ישראל', geo: 295648, tz: 'Asia/Jerusalem', b: 20 },
  { n: 'הרצליה', d: 'Herzliya', c: 'ישראל', geo: 294901, tz: 'Asia/Jerusalem', b: 20 },
  { n: 'כפר סבא', d: 'Kfar Saba', c: 'ישראל', geo: 294611, tz: 'Asia/Jerusalem', b: 20 },
  { n: 'חדרה', d: 'Hadera', c: 'ישראל', geo: 294982, tz: 'Asia/Jerusalem', b: 20 },
  { n: 'רעננה', d: 'Ra\'anana', c: 'ישראל', geo: 293644, tz: 'Asia/Jerusalem', b: 20 },
  { n: 'מודיעין', d: 'Modiin', c: 'ישראל', geo: 294241, tz: 'Asia/Jerusalem', b: 20 },
  { n: 'רמלה', d: 'Ramla', c: 'ישראל', geo: 293700, tz: 'Asia/Jerusalem', b: 20 },
  { n: 'לוד', d: 'Lod', c: 'ישראל', geo: 294421, tz: 'Asia/Jerusalem', b: 20 },
  { n: 'גבעתיים', d: 'Givatayim', c: 'ישראל', geo: 295058, tz: 'Asia/Jerusalem', b: 20 },
  { n: 'נהריה', d: 'Nahariya', c: 'ישראל', geo: 294326, tz: 'Asia/Jerusalem', b: 20 },
  { n: 'קרית גת', d: 'Kiryat Gat', c: 'ישראל', geo: 294498, tz: 'Asia/Jerusalem', b: 20 },
  { n: 'עפולה', d: 'Afula', c: 'ישראל', geo: 295717, tz: 'Asia/Jerusalem', b: 20 },
  { n: 'אילת', d: 'Eilat', c: 'ישראל', geo: 295277, tz: 'Asia/Jerusalem', b: 20 },
  { n: 'נתיבות', d: 'Netivot', c: 'ישראל', geo: 294191, tz: 'Asia/Jerusalem', b: 20 },
  { n: 'שדרות', d: 'Sderot', c: 'ישראל', geo: 293554, tz: 'Asia/Jerusalem', b: 20 },
  { n: 'מצפה רמון', d: 'Mitzpe Ramon', c: 'ישראל', geo: 294166, tz: 'Asia/Jerusalem', b: 20 },
  { n: 'צפת', d: 'Safed', c: 'ישראל', geo: 293427, tz: 'Asia/Jerusalem', b: 20 },
  { n: 'טבריה', d: 'Tiberias', c: 'ישראל', geo: 293322, tz: 'Asia/Jerusalem', b: 20 },
  { n: 'ניו יורק', d: 'New York', c: 'ארה"ב', geo: 5128581, tz: 'America/New_York', b: 18 },
  { n: 'לוס אנג\'לס', d: 'Los Angeles', c: 'ארה"ב', geo: 5368361, tz: 'America/Los_Angeles', b: 18 },
  { n: 'לונדון', d: 'London', c: 'בריטניה', geo: 2643743, tz: 'Europe/London', b: 18 },
  { n: 'פריז', d: 'Paris', c: 'צרפת', geo: 2988507, tz: 'Europe/Paris', b: 18 },
];

const HMONTHS = { 'Nisan': 'ניסן', 'Iyyar': 'אייר', 'Sivan': 'סיון', 'Tamuz': 'תמוז', 'Av': 'אב', 'Elul': 'אלול', 'Tishrei': 'תשרי', 'Cheshvan': 'חשון', 'Kislev': 'כסלו', 'Tevet': 'טבת', 'Shvat': 'שבט', 'Adar': 'אדר', 'Adar I': 'אדר א׳', 'Adar II': 'אדר ב׳', 'Adar 1': 'אדר א׳', 'Adar 2': 'אדר ב׳' };
const HDAY = ['', 'א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳', 'ז׳', 'ח׳', 'ט׳', 'י׳', 'י״א', 'י״ב', 'י״ג', 'י״ד', 'ט״ו', 'ט״ז', 'י״ז', 'י״ח', 'י״ט', 'כ׳', 'כ״א', 'כ״ב', 'כ״ג', 'כ״ד', 'כ״ה', 'כ״ו', 'כ״ז', 'כ״ח', 'כ״ט', 'ל׳'];

const getParashaData = (name) => {
  if (!name) return null;
  const normalize = (s) => s.replace(/\s/g, '').replace(/[-–/]/g, '').replace('פרשת', '').trim();
  const searchParts = name.split(/[-–/]/).map(normalize);
  
  let combinedPts = [];
  let pasuk = '';
  
  const dbNormalized = {};
  Object.keys(PARASHA_DATABASE).forEach(k => {
    dbNormalized[normalize(k)] = PARASHA_DATABASE[k];
  });

  searchParts.forEach((p, idx) => {
    if (dbNormalized[p]) {
      if (idx === 0) pasuk = dbNormalized[p].p;
      combinedPts = combinedPts.concat(dbNormalized[p].pts);
    }
  });

  if (combinedPts.length > 0) return { p: pasuk, pts: combinedPts.slice(0, 5) };
  return null;
};

function hebrewYear(y) {
  const ones = ['', 'א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט'];
  const tens = ['', 'י', 'כ', 'ל', 'מ', 'נ', 'ס', 'ע', 'פ', 'צ'];
  const hundreds = ['', 'ק', 'ר', 'ש', 'ת'];
  const rem = y - 5000;
  const h = Math.floor(rem / 100), t = Math.floor((rem % 100) / 10), o = rem % 10;
  let s = 'ה׳' + (hundreds[h] || '') + (tens[t] || '') + (ones[o] || '');
  if (s.length > 2) s = s.slice(0, -1) + '״' + s.slice(-1);
  return s;
}

const toHebrewDate = (hdate) => {
  if (!hdate) return '';
  const m = hdate.match(/^(\d+)\s+(.+?)\s+(\d+)$/);
  if (!m) return hdate;
  return `${HDAY[parseInt(m[1])] || m[1]} ב${HMONTHS[m[2]] || m[2]} ${hebrewYear(parseInt(m[3]))}`;
};

const formatGregorianHebrew = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  const M = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];
  const D = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
  return `יום ${D[d.getDay()]}, ${d.getDate()} ב${M[d.getMonth()]}`;
};

const BLESSINGS = {
  candles: { title: 'ברכת הדלקת נרות', text: 'בָּרוּךְ אַתָּה אֲדֹנָי אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם, אֲשֶׁר קִדְּשָׁנוּ בְּמִצְוֹתָיו וְצִוָּנוּ לְהַדְלִיק נֵר שֶׁל שַׁבָּת קֹדֶשׁ.' },
  children: { title: 'ברכת הילדים', text: 'יְשִׂימְךָ אֱלֹהִים כְּאֶפְרַיִם וְכִמְנַשֶּׁה (לבן) / יְשִׂימֵךְ אֱלֹהִים כְּשָׂרָה רִבְקָה רָחֵל וְלֵאָה (לבת). יְבָרֶכְךָ ה\' וְיִשְׁמְרֶךָ, יָאֵר ה\' פָּנָיו אֵלֶיךָ וִיחֻנֶּךָ, יִשָּׂא ה\' פָּנָיו אֵלֶיךָ וְיָשֵׂם לְךָ שָׁלוֹם.' }
};

let state = { candle: null, havdala: null, parasha: null, sunset: null, hdate: null, allZmanim: [] };
let currentCity = CITIES[0];
let candleMinutes = parseInt(localStorage.getItem('shabbat_minutes')) || 20;

const $ = (id) => document.getElementById(id);
const showToast = (msg) => {
  const t = $('toast');
  if (!t) return;
  t.textContent = msg; t.style.opacity = '1';
  setTimeout(() => t.style.opacity = '0', 3000);
};
const toggleLoading = (s) => $('loading-overlay').style.display = s ? 'flex' : 'none';
const formatTime = (iso, tz) => iso ? formatInTimeZone(new Date(iso), tz, 'HH:mm') : '--:--';

async function fetchShabbatTimes(city, customName = null) {
  currentCity = city;
  const name = customName || city.n;
  if ($('loc-name')) $('loc-name').textContent = name;
  if ($('loc-sub')) $('loc-sub').textContent = city.c || 'ישראל';

  const cacheKey = `shabbat_v2_${city.geo || (city.lat + '_' + city.lng)}`;
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    const d = JSON.parse(cached);
    if (new Date(d.expiry) > new Date()) {
      parseData(d.data);
      render();
    }
  }

  toggleLoading(true);
  try {
    let shabbatUrl;
    if (typeof city === 'string') {
      shabbatUrl = `https://www.hebcal.com/shabbat?cfg=json&city=${encodeURIComponent(city)}&m=${candleMinutes}&b=20&M=on&lg=he`;
    } else if (city.geo) {
      shabbatUrl = `https://www.hebcal.com/shabbat?cfg=json&geonameid=${city.geo}&m=${candleMinutes}&b=${city.b || 20}&M=on&lg=he`;
    } else {
      shabbatUrl = `https://www.hebcal.com/shabbat?cfg=json&latitude=${city.lat}&longitude=${city.lng}&tzid=Asia/Jerusalem&m=${candleMinutes}&b=20&M=on&lg=he`;
    }

    const shabbatResp = await fetch(shabbatUrl);
    const data = await shabbatResp.json();
    if (data.error) { showToast('מיקום לא נמצא'); return; }

    localStorage.setItem('shabbat_city', JSON.stringify(currentCity));
    const expiry = new Date(); expiry.setHours(expiry.getHours() + 12);
    localStorage.setItem(cacheKey, JSON.stringify({ data, expiry }));

    parseData(data);
    render();
    if ($('city-search')) $('city-search').value = '';
    renderCityList('');
  } catch (err) { showToast('שגיאה בחיבור לשרת'); } finally { toggleLoading(false); }
}

function parseData(data) {
  const items = data.items || [];
  state.candle = items.find(i => i.category === 'candles')?.date;
  state.havdala = items.find(i => i.category === 'havdalah')?.date;
  const p = items.find(i => i.category === 'parashat');
  if (p) {
    state.parasha = (p.hebrew || p.title).replace('Parashat ', '').replace('פרשת ', '');
    state.hdate = p.hdate;
  }
  const sunsetItem = items.find(i => i.title === 'Sunset');
  state.sunset = sunsetItem ? sunsetItem.date : (state.havdala ? new Date(new Date(state.havdala).getTime() - 50 * 60000).toISOString() : null);

  const findZman = (keys) => {
    const item = items.find(i => keys.some(k => i.title && i.title.includes(k)));
    return item ? item.date : null;
  };
  state.allZmanim = [
    { label: 'עלות השחר', val: findZman(['alotHaShachar', 'Alos haShachar']) },
    { label: 'משיכיר (ציצית)', val: findZman(['misheyakir', 'Misheyakir']) },
    { label: 'הנץ החמה', val: findZman(['sunrise', 'Sunrise']) },
    { label: 'סוף זמן ק"ש (גר"א)', val: findZman(['sofZmanShma', 'Krias Shema']) },
    { label: 'סוף זמן תפילה (גר"א)', val: findZman(['sofZmanTfilla', 'Tfila']) },
    { label: 'חצות היום', val: findZman(['chatzot', 'Chatzot']) },
    { label: 'מנחה גדולה', val: findZman(['minchaGedola', 'Mincha Gedola']) },
    { label: 'מנחה קטנה', val: findZman(['minchaKetana', 'Mincha Ketana']) },
    { label: 'פלג המנחה', val: findZman(['plagHaMincha', 'Plag']) },
    { label: 'שקיעת החמה', val: state.sunset },
    { label: 'צאת הכוכבים', val: findZman(['tzeit', 'Tzeit']) || state.havdala },
    { label: 'יציאת שבת', val: state.havdala },
    { label: 'רבנו תם', val: findZman(['tzeit85deg', 'tzeit72min', 'Havdalah (72 min)']) }
  ].filter(z => z.val);
}

function render() {
  const tz = currentCity.tz || 'Asia/Jerusalem';
  if ($('candle-time')) $('candle-time').textContent = formatTime(state.candle, tz);
  if ($('t-candle')) $('t-candle').textContent = formatTime(state.candle, tz);
  if ($('t-havdala')) $('t-havdala').textContent = formatTime(state.havdala, tz);
  if ($('t-sunset')) $('t-sunset').textContent = formatTime(state.sunset, tz);
  if ($('t-stars')) $('t-stars').textContent = formatTime(state.havdala, tz);
  if ($('loc-name')) $('loc-name').textContent = currentCity.n;
  if ($('loc-sub')) $('loc-sub').textContent = currentCity.c;
  if ($('candle-date')) $('candle-date').textContent = formatGregorianHebrew(state.candle);
  if ($('candle-hebrew')) $('candle-hebrew').textContent = toHebrewDate(state.hdate);
  if ($('candle-offset')) $('candle-offset').value = candleMinutes;

  const zList = $('zmanim-list');
  if (zList) {
    zList.innerHTML = state.allZmanim.map(z => `
      <div class="zmanim-item">
        <span class="zmanim-label">${z.label}</span>
        <span class="zmanim-value">${formatTime(z.val, tz)}</span>
      </div>
    `).join('');
  }

  if (state.parasha) {
    const pData = getParashaData(state.parasha);
    if ($('parasha-name')) $('parasha-name').textContent = `פרשת ${state.parasha}`;
    if (pData) {
      if ($('parasha-pts')) {
        $('parasha-pts').innerHTML = pData.pts.map(p => `
          <div class="inspiration-point"><div class="point-bullet"></div><div style="font-size:1rem;line-height:1.6;color:var(--text)">${p}</div></div>
        `).join('');
      }
      if ($('parasha-pasuk')) $('parasha-pasuk').textContent = pData.p;
    } else {
      if ($('parasha-pts')) $('parasha-pts').innerHTML = '<div class="inspiration-point">שבת שלום ומבורך!</div>';
      if ($('parasha-pasuk')) $('parasha-pasuk').textContent = "";
    }
  }
  updateCountdown();
  renderBlessing('candles');
}

function renderBlessing(key) {
  const b = BLESSINGS[key];
  if (!b || !$('blessing-content')) return;
  $('blessing-content').innerHTML = `<strong>${b.title}</strong>${b.text}`;
}

function updateCountdown() {
  if (!state.candle || !$('countdown')) return;
  const diff = new Date(state.candle) - new Date();
  if (diff < 0) {
    $('countdown').innerHTML = new Date() < new Date(state.havdala) ? 'שבת שלום! <span>שבת כבר נכנסה</span>' : 'שבוע טוב! <span>השבת הסתיימה</span>';
    return;
  }
  const h = Math.floor(diff / 3600000), m = Math.floor((diff % 3600000) / 60000);
  $('countdown').innerHTML = h > 24 ? `<span>${Math.floor(h / 24)} ימים</span> עד שבת` : `<span>${h}:${String(m).padStart(2, '0')}</span> שעות להדלקת נרות`;
}

function renderCityList(filter) {
  const container = $('city-list-items');
  if (!container) return;
  const list = filter ? CITIES.filter(c => c.n.includes(filter) || c.d.toLowerCase().includes(filter.toLowerCase())) : CITIES;
  container.innerHTML = list.map(c => `<div class="city-item" onclick="window.setCity('${encodeURIComponent(JSON.stringify(c))}')"><span>${c.n}</span><span style="font-size:0.8rem;opacity:0.6">${c.c}</span></div>`).join('');
}

window.setCity = (json) => {
  const city = JSON.parse(decodeURIComponent(json));
  $('city-panel').style.display = 'none';
  fetchShabbatTimes(city);
};

const initApp = () => {
  const saved = localStorage.getItem('shabbat_city');
  if (saved) currentCity = JSON.parse(saved);
  
  const modal = $('consent-modal');
  const consent = localStorage.getItem('shabbat_consent');
  if (!consent) {
    if (modal) {
      modal.style.display = 'flex';
      const acceptBtn = $('btn-accept-all');
      const declineBtn = $('btn-decline');
      if (acceptBtn) acceptBtn.onclick = () => { localStorage.setItem('shabbat_consent', 'true'); modal.style.display = 'none'; fetchShabbatTimes(currentCity); };
      if (declineBtn) declineBtn.onclick = () => { localStorage.setItem('shabbat_consent', 'partial'); modal.style.display = 'none'; fetchShabbatTimes(currentCity); };
    }
  } else {
    if (modal) modal.style.display = 'none';
    fetchShabbatTimes(currentCity);
  }
};

// Listeners
if ($('btn-menu')) $('btn-menu').onclick = () => { const menu = $('side-menu'); menu.style.display = 'flex'; menu.querySelector('.nav-btn')?.focus(); };
if ($('close-menu')) $('close-menu').onclick = () => $('side-menu').style.display = 'none';
document.querySelectorAll('.nav-btn').forEach(b => {
  b.onclick = () => {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(btn => { btn.classList.remove('active'); btn.removeAttribute('aria-current'); });
    const target = $(`sec-${b.dataset.sec}`);
    if (target) { target.classList.add('active'); b.classList.add('active'); b.setAttribute('aria-current', 'page'); }
    $('side-menu').style.display = 'none'; window.scrollTo(0, 0);
  };
});
if ($('btn-calendar')) $('btn-calendar').onclick = () => {
  if (!state.candle) return;
  const start = new Date(state.candle).toISOString().replace(/-|:|\.\d+/g, "");
  const end = new Date(new Date(state.candle).getTime() + 60 * 60000).toISOString().replace(/-|:|\.\d+/g, "");
  window.open(`https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent('הדלקת נרות שבת - ' + currentCity.n)}&dates=${start}/${end}&details=${encodeURIComponent('שבת שלום!')}&sf=true&output=xml`, '_blank');
};
if ($('btn-city-change')) $('btn-city-change').onclick = () => $('city-panel').style.display = 'block';
if ($('close-city-panel')) $('close-city-panel').onclick = () => $('city-panel').style.display = 'none';
if ($('city-search')) $('city-search').oninput = (e) => renderCityList(e.target.value);
document.querySelectorAll('.bless-tab').forEach(tab => tab.onclick = () => { document.querySelectorAll('.bless-tab').forEach(t => t.classList.remove('active')); tab.classList.add('active'); renderBlessing(tab.dataset.tab); });
if ($('btn-share-main')) $('btn-share-main').onclick = () => {
  const text = `שבת שלום! הדלקת נרות ב${currentCity.n}: ${formatTime(state.candle, currentCity.tz)}. יציאת שבת: ${formatTime(state.havdala, currentCity.tz)}. נשלח מאפליקציית "נרות שבת"`;
  if (navigator.share) navigator.share({ title: 'זמני השבת', text });
  else { navigator.clipboard.writeText(text); showToast('הזמנים הועתקו'); }
};
if ($('btn-locate')) $('btn-locate').onclick = () => {
  if (!navigator.geolocation) return showToast('זיהוי מיקום לא נתמך');
  toggleLoading(true); navigator.geolocation.getCurrentPosition((pos) => fetchShabbatTimes({ lat: pos.coords.latitude, lng: pos.coords.longitude }, 'מיקום נוכחי'), () => { showToast('גישה למיקום נדחתה'); toggleLoading(false); });
};
window.updateOffset = (val) => { candleMinutes = parseInt(val); localStorage.setItem('shabbat_minutes', candleMinutes); fetchShabbatTimes(currentCity); };
if ($('candle-offset')) $('candle-offset').onchange = (e) => window.updateOffset(e.target.value);

initApp();
setInterval(updateCountdown, 60000);
if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js'));
