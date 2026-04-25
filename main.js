import './app.css';
import { formatInTimeZone } from 'date-fns-tz';

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
  { n: 'אילת', d: 'Eilat', c: 'ישראל', geo: 295277, tz: 'Asia/Jerusalem', b: 18 },
];

const PARASHA_DATABASE = {
  'אחרימות': { p: 'וַיְדַבֵּר ה\' אֶל מֹשֶׁה אַחֲרֵי מוֹת שְׁנֵי בְּנֵי אַהֲרֹן.', pts: [
    'השילוב בין התעלות למעשה: השילוב בין עבודת הקודש הפנימית לבין הבית והיומיום.',
    'כוחה של תשובה: היכולת לתקן ולחזור להיטהר גם אחרי רגעים קשים.',
    'יום הכיפורים: הכוח של סליחה וניקוי הלב מול הבורא.',
    'אחריות וזהירות: מנהיגות דורשת ענווה וזהירות בקדושה.'
  ]},
  'קדושים': { p: 'קְדֹשִׁים תִּהְיוּ כִּי קָדוֹשׁ אֲנִי ה\' אֱלֹהֵיכֶם.', pts: [
    'אהבת ישראל: "ואהבת לרעך כמוך" — הבסיס לכל הקדושה בחיים.',
    'קדושה בתוך החיים: להפוך את העולם הגשמי למקום שבו שורה השכינה.',
    'כבוד האדם: "לא תקלל חרש" — חובתנו לכבד כל אדם באשר הוא.',
    'דירה בתחתונים: המטרה היא להוריד את האור הרוחני לתוך המעשים הכי פשוטים.'
  ]}
};

const normalize = (s) => s ? s.replace(/\s/g, '').replace(/[-–/]/g, '').replace('פרשת', '').trim() : '';

const getParashaData = (name) => {
  if (!name) return null;
  const normalizedSearch = normalize(name);
  let combinedPts = [];
  let pasuk = '';
  
  // Check if any key in database is contained in the normalized name
  Object.keys(PARASHA_DATABASE).forEach(key => {
    if (normalizedSearch.includes(key)) {
      if (!pasuk) pasuk = PARASHA_DATABASE[key].p;
      combinedPts = combinedPts.concat(PARASHA_DATABASE[key].pts);
    }
  });

  if (combinedPts.length > 0) return { p: pasuk, pts: combinedPts.slice(0, 5) };
  return null;
};

const BLESSINGS = {
  candles: { title: 'ברכת הדלקת נרות', text: 'בָּרוּךְ אַתָּה אֲדֹנָי אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם, אֲשֶׁר קִדְּשָׁנוּ בְּמִצְוֹתָיו וְצִוָּנוּ לְהַדְלִיק נֵר שֶׁל שַׁבָּת קֹדֶשׁ.' },
  kiddush: { title: 'קידוש ליל שבת', text: 'יוֹם הַשִּׁשִּׁי. וַיְכֻלּוּ הַשָּׁמַיִם וְהָאָרֶץ... בָּרוּךְ אַתָּה אֲדֹנָי, מְקַדֵּשׁ הַשַּׁבָּת.' },
  havdala: { title: 'הבדלה', text: 'הִנֵּה אֵל יְשׁוּעָתִי אֶבְטַח וְלֹא אֶפְחָד... בָּרוּךְ אַתָּה אֲדֹנָי, הַמַּבְדִּיל בֵּין קֹדֶשׁ לְחוֹל.' },
  eishet: { title: 'אשת חיל', text: 'אֵשֶׁת חַיִל מִי יִמְצָא וְרָחֹק מִפְּנִינִים מִכְרָהּ... שֶׁקֶר הַחֵן וְהֶבֶל הַיֹּפִי אִשָּׁה יִרְאַת ה\' הִיא תִתְהַלָּל.' }
};

let state = { candle: null, havdala: null, parasha: null, sunset: null, hdate: null, allZmanim: [], currentBlessing: 'candles' };
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

  const cacheKey = `shabbat_v3_${city.geo || (city.lat + '_' + city.lng)}`;
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    const d = JSON.parse(cached);
    if (new Date(d.expiry) > new Date()) { parseData(d.data); render(); }
  }

  toggleLoading(true);
  try {
    let shabbatUrl;
    if (city.geo) shabbatUrl = `https://www.hebcal.com/shabbat?cfg=json&geonameid=${city.geo}&m=${candleMinutes}&b=${city.b || 20}&M=on&lg=he`;
    else shabbatUrl = `https://www.hebcal.com/shabbat?cfg=json&latitude=${city.lat}&longitude=${city.lng}&tzid=Asia/Jerusalem&m=${candleMinutes}&b=20&M=on&lg=he`;

    const shabbatResp = await fetch(shabbatUrl);
    const data = await shabbatResp.json();
    localStorage.setItem('shabbat_city', JSON.stringify(currentCity));
    localStorage.setItem(cacheKey, JSON.stringify({ data, expiry: new Date(Date.now() + 12 * 3600000) }));
    parseData(data);
    render();
  } catch (err) { showToast('שגיאה בחיבור'); } finally { toggleLoading(false); }
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
  state.sunset = items.find(i => i.title === 'Sunset')?.date || (state.havdala ? new Date(new Date(state.havdala).getTime() - 50 * 60000).toISOString() : null);

  const findZman = (keys) => {
    const item = items.find(i => keys.some(k => i.title && i.title.includes(k)));
    return item ? item.date : null;
  };
  state.allZmanim = [
    { label: 'עלות השחר', val: findZman(['alotHaShachar', 'Alos haShachar']) },
    { label: 'הנץ החמה', val: findZman(['sunrise', 'Sunrise']) },
    { label: 'סוף זמן ק"ש', val: findZman(['sofZmanShma', 'Krias Shema']) },
    { label: 'סוף זמן תפילה', val: findZman(['sofZmanTfilla', 'Tfila']) },
    { label: 'חצות היום', val: findZman(['chatzot', 'Chatzot']) },
    { label: 'מנחה גדולה', val: findZman(['minchaGedola', 'Mincha Gedola']) },
    { label: 'פלג המנחה', val: findZman(['plagHaMincha', 'Plag']) },
    { label: 'שקיעת החמה', val: state.sunset },
    { label: 'צאת הכוכבים', val: findZman(['tzeit', 'Tzeit']) || state.havdala },
    { label: 'יציאת שבת', val: state.havdala }
  ].filter(z => z.val);
}

function render() {
  const tz = currentCity.tz || 'Asia/Jerusalem';
  const setVal = (id, val) => { if ($(id)) $(id).textContent = val; };
  setVal('candle-time', formatTime(state.candle, tz));
  setVal('t-candle', formatTime(state.candle, tz));
  setVal('t-havdala', formatTime(state.havdala, tz));
  setVal('t-sunset', formatTime(state.sunset, tz));
  setVal('t-stars', formatTime(state.havdala, tz));
  if ($('loc-name')) $('loc-name').textContent = currentCity.n;
  if ($('loc-sub')) $('loc-sub').textContent = currentCity.c;
  if ($('candle-date')) $('candle-date').textContent = formatGregorian(state.candle);
  if ($('candle-offset')) $('candle-offset').value = candleMinutes;

  const zList = $('zmanim-list');
  if (zList) {
    zList.innerHTML = state.allZmanim.map(z => `<div class="zmanim-item"><span class="zmanim-label">${z.label}</span><span class="zmanim-value">${formatTime(z.val, tz)}</span></div>`).join('');
  }

  if (state.parasha) {
    const pData = getParashaData(state.parasha);
    if ($('parasha-name')) $('parasha-name').textContent = `פרשת ${state.parasha}`;
    if (pData) {
      if ($('parasha-pts')) $('parasha-pts').innerHTML = pData.pts.map(p => `<div class="inspiration-point"><div class="point-bullet"></div><div style="font-size:1rem;line-height:1.6;color:var(--text)">${p}</div></div>`).join('');
      if ($('parasha-pasuk')) $('parasha-pasuk').textContent = pData.p;
    } else {
      if ($('parasha-pts')) $('parasha-pts').innerHTML = '<div class="inspiration-point">שבת שלום ומבורך!</div>';
      if ($('parasha-pasuk')) $('parasha-pasuk').textContent = "";
    }
  }
  updateCountdown();
  renderBlessing(state.currentBlessing);
}

function renderBlessing(key) {
  const b = BLESSINGS[key];
  if (!b || !$('blessing-content')) return;
  $('blessing-content').innerHTML = `<strong>${b.title}</strong><br>${b.text}`;
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

function formatGregorian(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const M = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];
  const D = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
  return `יום ${D[d.getDay()]}, ${d.getDate()} ב${M[d.getMonth()]}`;
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
  if (!consent && modal) modal.style.display = 'flex';
  else fetchShabbatTimes(currentCity);
};

// Listeners
if ($('btn-accept-all')) $('btn-accept-all').onclick = () => { localStorage.setItem('shabbat_consent', 'true'); $('consent-modal').style.display = 'none'; fetchShabbatTimes(currentCity); };
if ($('btn-decline')) $('btn-decline').onclick = () => { localStorage.setItem('shabbat_consent', 'partial'); $('consent-modal').style.display = 'none'; fetchShabbatTimes(currentCity); };
if ($('btn-menu')) $('btn-menu').onclick = () => { $('side-menu').style.display = 'flex'; };
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
document.querySelectorAll('.bless-tab').forEach(tab => tab.onclick = () => {
  document.querySelectorAll('.bless-tab').forEach(t => t.classList.remove('active'));
  tab.classList.add('active');
  state.currentBlessing = tab.dataset.tab;
  renderBlessing(state.currentBlessing);
});
if ($('btn-share-main')) $('btn-share-main').onclick = () => {
  const text = `שבת שלום! הדלקת נרות ב${currentCity.n}: ${formatTime(state.candle, currentCity.tz)}. יציאת שבת: ${formatTime(state.havdala, currentCity.tz)}.`;
  if (navigator.share) navigator.share({ title: 'זמני השבת', text });
  else { navigator.clipboard.writeText(text); showToast('הזמנים הועתקו'); }
};
if ($('btn-locate')) $('btn-locate').onclick = () => {
  if (!navigator.geolocation) return showToast('זיהוי מיקום לא נתמך');
  toggleLoading(true); navigator.geolocation.getCurrentPosition((pos) => fetchShabbatTimes({ lat: pos.coords.latitude, lng: pos.coords.longitude }, 'מיקום נוכחי'), () => { showToast('גישה למיקום נדחתה'); toggleLoading(false); });
};
if ($('candle-offset')) $('candle-offset').onchange = (e) => { candleMinutes = parseInt(e.target.value); localStorage.setItem('shabbat_minutes', candleMinutes); fetchShabbatTimes(currentCity); };

if ($('btn-notify')) {
  $('btn-notify').onclick = async () => {
    if (!('Notification' in window)) return showToast('הדפדפן שלך לא תומך בהתראות');
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      showToast('התראות הופעלו! תקבלי תזכורת לפני הדלקת נרות');
      new Notification('נרות שבת', { body: 'מעולה! נזכיר לך להדליק נרות בזמן.', icon: '/favicon.ico' });
    } else { showToast('יש לאשר התראות בהגדרות הדפדפן'); }
  };
}

initApp();
setInterval(updateCountdown, 60000);
if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js'));
