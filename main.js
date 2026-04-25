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
  return `יום שישי, ${d.getDate()} ב${M[d.getMonth()]} ${d.getFullYear()}`;
};

let currentCity = JSON.parse(localStorage.getItem('shabbat_city')) || CITIES[0];
let candleMinutes = parseInt(localStorage.getItem('shabbat_minutes')) || currentCity.b || 18;
let state = { candle: null, havdala: null, sunset: null, parasha: null, hdate: null, gdate: null, allZmanim: [] };

const BLESSINGS = {
  candles: {
    title: 'ברכת הדלקת נרות',
    text: `בָּרוּךְ אַתָּה ה' אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם, אֲשֶׁר קִדְּשָׁנוּ בְּמִצְוֹתָיו וְצִוָּנוּ לְהַדְלִיק נֵר שֶׁל שַׁבָּת.`
  },
  kiddush: {
    title: 'קידוש לליל שבת',
    text: `יוֹם הַשִּׁשִּׁי. וַיְכֻלּוּ הַשָּׁמַיִם וְהָאָרֶץ וְכָל צְבָאָם. וַיְכַל אֱלֹהִים בַּיּוֹם הַשְּׁבִיעִי מְלַאכְתּוֹ אֲשֶׁר עָשָׂה, וַיִּשְׁבֹּת בַּיּוֹם הַשְּׁבִיעִי מִכָּל מְלַאכְתּוֹ אֲשֶׁר עָשָׂה. וַיְבָרֶךְ אֱלֹהִים אֶת יוֹם הַשְּׁבִיעִי וַיְקַדֵּשׁ אֹתוֹ, כִּי בוֹ שָׁבַת מִכָּל מְלַאכְתּוֹ אֲשֶׁר בָּרָא אֱלֹהִים לַעֲשׂוֹת.
    
    סַבְרִי מָרָנָן וְרַבָּנָן וְרַבּוֹתַי. בָּרוּךְ אַתָּה ה' אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם, בּוֹרֵא פְּרִי הַגָּפֶן.
    
    בָּרוּךְ אַתָּה ה' אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם, אֲשֶׁר קִדְּשָׁנוּ בְּמִצְוֹתָיו וְרָצָה בָנוּ, וְשַׁבַּת קָדְשׁוֹ בְּאַהֲבָה וּבְרָצוֹן הִנְחִילָנוּ, זִכָּרוֹן לְמַעֲשֵׂה בְרֵאשִׁית. כִּי הווא יוֹם תְּחִלָּה לְמִקְרָאֵי קֹדֶשׁ, זֵכֶר לִיצִיאַת מִצְרָיִם. כִּי בָנוּ בָחַרְתָּ וְאוֹתָנוּ קִדַּשְׁתָּ מִכָּל הָעַמִּים, וְשַׁבַּת קָדְשְׁךָ בְּאַהֲבָה וּבְרָצוֹן הִנְחִילְתָּנוּ. בָּרוּךְ אַתָּה ה', מְקַדֵּשׁ הַשַּׁבָּת.`
  },
  havdala: {
    title: 'סדר הבדלה',
    text: `הִנֵּה אֵל יְשׁוּעָתִי אֶבְטַח וְלֹא אֶפְחָד, כִּי עָזִּי וְזִמְרָת יָהּ ה' וַיְהִי לִי לִישׁוּעָה. וּשְׁאַבְתֶּם מַיִם בְּשָׂשׂוֹן מִמַּעַיְנֵי הַיְשׁוּעָה. לַה' הַיְשׁוּעָה, עַל עַמְּךָ בִרְכָתֶךָ סֶּלָה. ה' צְבָאוֹת עִמָּנוּ, מִשְׂגָּב לָנוּ אֱלֹהֵי יַעֲקֹב סֶּלָה. ה' צְבָאוֹת, אַשְׁרֵי אָדָם בֹּטֵחַ בָּךְ. ה' הוֹשִׁיעָה, הַמֶּלֶךְ יַעֲנֵנוּ בְיוֹם קָרְאֵנוּ. לַיְּהוּדִים הָיְתָה אוֹרָה וְשִׂמְחָה וְשָׂשׂוֹן וִיקָר, כֵּן תִּהְיֶה לָּנוּ. כּוֹס יְשׁוּעוֹת אֶשָּׂא וּבְשֵׁם ה' אֶקְרָא.
    
    בָּרוּךְ אַתָּה ה' אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם, בּוֹרֵא פְּרִי הַגָּפֶן.
    בָּרוּךְ אַתָּה ה' אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם, בּוֹרֵא מִינֵי בְשָׂמִים.
    בָּרוּךְ אַתָּה ה' אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם, בּוֹרֵא מְאוֹרֵי הָאֵשׁ.
    
    בָּרוּךְ אַתָּה ה' אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם, הַמַּבְדִּיל בֵּין קֹדֶשׁ לְחוֹל, בֵּין אוֹר לְחֹשֶׁךְ, בֵּין יִשְׂרָאֵל לָעַמִּים, בֵּין יוֹם הַשְּׁבִיעִי לְשֵׁשֶׁת יְמֵי הַמַּעֲשֶׂה. בָּרוּךְ אַתָּה ה', הַמַּבְדִּיל בֵּין קֹדֶשׁ לְחוֹל.`
  },
  eishet: {
    title: 'אשת חיל',
    text: `אֵשֶׁת חַיִל מִי יִמְצָא וְרָחֹק מִפְּנִינִים מִכְרָהּ.
בָּטַח בָּהּ לֵב בַּעְלָהּ וְשָׁלָל לֹא יֶחְסָר.
גְּמָלַתְהוּ טוֹב וְלֹא רָע כֹּל יְמֵי חַיֶּיהָ.
דָּרְשָׁה צֶמֶר וּפִשְׁתִּים וַתַּעַשׂ בְּחֵפֶץ כַּפֶּיהָ.
הָיְתָה כָּאֳנִיּוֹת סוֹחֵר מִמֶּרְחָק תָּבִיא לַחְמָהּ.
וַתָּקָם בְּעוֹד לַיְלָה וַתִּתֵּן טֶרֶף לְבֵיתָהּ וְחֹק לְנַעֲרֹתֶיהָ.
זָמְמָה שָׂדֶה וַתִּקָּחֵהוּ מִפְּרִי כַפֶּיהָ נָטְעָה כָּרֶם.
חָגְרָה בְעוֹז מָתְנֶיהָ וַתְּאַמֵּץ זְרוֹעוֹתֶיהָ.
פִּיהָ פָּתְחָה בְחָכְמָה וְתוֹרַת חֶסֶד עַל לְשׁוֹנָהּ.
צוֹפִיָּה הֲלִיכוֹת בֵּיתָהּ וְלֶחֶם עַצְלוּת לֹא תֹאכֵל.
קָמוּ בָנֶיהָ וַיְאַשְּׁרוּהָ בַּעְלָהּ וַיְהַלְלָהּ.
רַבּוֹת בָּנוֹת עָשׂוּ חָיִל וְאַתְּ עָלִית עַל כֻּלָּנָה.
שֶׁקֶר הַחֵן וְהֶבֶל הַיֹּפִי אִשָּׁה יִרְאַת ה' הִיא תִתְהַלָּל.
תְּנוּ לָהּ מִפְּרִי יָדֶיהָ וִיהַלְלוּהָ בַשְּׁעָרִים מַעֲשֶׂיהָ.`
  }
};

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
  if ($('loc-sub')) $('loc-sub').textContent = city.c || 'מיקום נוכחי';

  // Cache key for this city
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

    if (data.error) {
      showToast('מיקום לא נמצא');
      return;
    }

    // Update current city with server data if needed
    if (typeof city === 'string') {
      let locName = city;
      if (data.location) {
        locName = data.location.hebrew || data.location.title || city;
        if (locName.includes('°') || locName.includes('Latitude')) {
          locName = city;
        }
      }
      currentCity = { n: locName, c: data.location?.country === 'Israel' ? 'ישראל' : (data.location?.country || 'חיפוש חופשי'), lat: data.location?.latitude, lng: data.location?.longitude, tz: data.location?.tzid || 'Asia/Jerusalem' };
    } else {
      // If we used Geolocation (city.lat exists but no city.n)
      if (city.lat && !city.n) {
        currentCity = { n: customName || 'מיקום נוכחי', c: 'ישראל', tz: data.location?.tzid || 'Asia/Jerusalem', lat: city.lat, lng: city.lng };
      }
      // If we used a preset city, preserve its Hebrew name (city.n) and country (city.c)
      else if (city.n) {
        currentCity = city; 
      }
    }

    localStorage.setItem('shabbat_city', JSON.stringify(currentCity));

    // Save to cache (valid for 12 hours)
    const expiry = new Date();
    expiry.setHours(expiry.getHours() + 12);
    localStorage.setItem(cacheKey, JSON.stringify({ data, expiry }));

    parseData(data);
    render();

    if ($('city-search')) $('city-search').value = '';
    renderCityList('');

  } catch (err) {
    showToast('שגיאה בחיבור לשרת');
  } finally {
    toggleLoading(false);
  }
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

  // Calculate Sunset (approx 50 mins before havdala in Israel, or use items)
  const sunsetItem = items.find(i => i.title === 'Sunset');
  state.sunset = sunsetItem ? sunsetItem.date : (state.havdala ? new Date(new Date(state.havdala).getTime() - 50 * 60000).toISOString() : null);

  // Advanced Zmanim Lookup
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
  $('candle-time').textContent = formatTime(state.candle, tz);
  $('t-candle').textContent = formatTime(state.candle, tz);
  $('t-havdala').textContent = formatTime(state.havdala, tz);
  $('t-sunset').textContent = formatTime(state.sunset, tz);
  $('t-stars').textContent = formatTime(state.havdala, tz);

  if ($('loc-name')) $('loc-name').textContent = currentCity.n;
  if ($('loc-sub')) $('loc-sub').textContent = currentCity.c;

  if ($('candle-date')) $('candle-date').textContent = formatGregorianHebrew(state.candle);
  if ($('candle-hebrew')) $('candle-hebrew').textContent = toHebrewDate(state.hdate);

  if ($('candle-offset')) $('candle-offset').value = candleMinutes;

  // Zmanim List
  const zList = $('zmanim-list');
  if (zList) {
    zList.innerHTML = state.allZmanim.map(z => `
      <div class="zmanim-item">
        <span class="zmanim-label">${z.label}</span>
        <span class="zmanim-value">${formatTime(z.val, tz)}</span>
      </div>
    `).join('');
  }

  // Parasha
  if (state.parasha) {
    $('parasha-name').textContent = `פרשת ${state.parasha}`;
    const keys = state.parasha.split(/-|–/);
    const pts = keys.flatMap(k => window.PARASHA_FULL_DATA?.[k.trim()]?.pts || []);
    const display = pts.length ? pts.slice(0, 6) : ["השבת היא מקור הברכה.", "זמן של התבוננות וחיבור."];
    $('parasha-pts').innerHTML = display.map(p => `
      <div class="inspiration-point">
        <div class="point-bullet"></div>
        <div style="font-size: 1rem; line-height: 1.6; color: var(--text)">${p}</div>
      </div>
    `).join('');
    $('parasha-pasuk').textContent = window.PARASHA_FULL_DATA?.[keys[0].trim()]?.p || "";
  }

  updateCountdown();
  renderBlessing('candles');
}

function renderBlessing(key) {
  const b = BLESSINGS[key];
  if (!b) return;
  const container = $('blessing-content');
  if (container) {
    container.innerHTML = `<strong>${b.title}</strong>${b.text}`;
  }
}

function updateCountdown() {
  if (!state.candle) return;
  const diff = new Date(state.candle) - new Date();
  if (diff < 0) {
    $('countdown').innerHTML = new Date() < new Date(state.havdala) ? 'שבת שלום! <span>שבת כבר נכנסה</span>' : 'שבוע טוב! <span>השבת הסתיימה</span>';
    return;
  }
  const h = Math.floor(diff / 3600000), m = Math.floor((diff % 3600000) / 60000);
  $('countdown').innerHTML = h > 24 ? `<span>${Math.floor(h / 24)} ימים</span> עד שבת` : `<span>${h}:${String(m).padStart(2, '0')}</span> שעות להדלקת נרות`;
}

function renderCityList(filter) {
  const list = $('city-list'); if (!list) return;
  list.innerHTML = '';
  
  if (filter.length >= 2) {
    const s = document.createElement('div');
    s.className = 'glass location-pill';
    s.innerHTML = `<span class="name">חיפוש מיקום חופשי: "${filter}"</span>`;
    s.onclick = () => { 
        fetchShabbatTimes(filter); 
        $('city-panel').style.display='none'; 
    };
    list.appendChild(s);
  }

  const filtered = CITIES.filter(c => c.n.includes(filter));

  filtered.slice(0, 15).forEach(c => {
    const d = document.createElement('div');
    d.className = 'glass';
    d.style.cssText = 'padding:16px; cursor:pointer; margin-top:8px; border-radius:12px; transition:0.2s';
    d.innerHTML = `<strong>${c.n}</strong><div style="font-size:0.75rem; color:var(--text-muted)">${c.c}</div>`;
    d.onclick = () => { fetchShabbatTimes(c); $('city-panel').style.display = 'none'; };
    list.appendChild(d);
  });
}

// --- Initialization & Consent ---
const initApp = () => {
  const hasConsent = localStorage.getItem('shabbat_consent');
  if (!hasConsent) {
    const modal = $('consent-modal');
    if (modal) {
      modal.style.display = 'flex';
      $('btn-accept-all').onclick = () => {
        localStorage.setItem('shabbat_consent', 'true');
        modal.style.display = 'none';
        fetchShabbatTimes(currentCity);
      };
      $('btn-decline').onclick = () => {
        localStorage.setItem('shabbat_consent', 'partial');
        modal.style.display = 'none';
        fetchShabbatTimes(currentCity);
      };
    }
  } else {
    fetchShabbatTimes(currentCity);
  }
};

// --- Event Listeners Update ---
if ($('btn-menu')) {
  $('btn-menu').onclick = () => {
    const menu = $('side-menu');
    menu.style.display = 'flex';
    menu.querySelector('.nav-btn')?.focus();
  };
}
if ($('close-menu')) $('close-menu').onclick = () => $('side-menu').style.display = 'none';

document.querySelectorAll('.nav-btn').forEach(b => {
  b.onclick = () => {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.remove('active');
      btn.removeAttribute('aria-current');
    });
    
    const target = $(`sec-${b.dataset.sec}`);
    if (target) {
      target.classList.add('active');
      b.classList.add('active');
      b.setAttribute('aria-current', 'page');
    }
    
    $('side-menu').style.display = 'none';
    window.scrollTo(0, 0);
  };
});

if ($('btn-calendar')) {
  $('btn-calendar').onclick = () => {
    if (!state.candle) return;
    const start = new Date(state.candle).toISOString().replace(/-|:|\.\d+/g, "");
    const end = new Date(new Date(state.candle).getTime() + 60 * 60000).toISOString().replace(/-|:|\.\d+/g, "");
    const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent('הדלקת נרות שבת - ' + currentCity.n)}&dates=${start}/${end}&details=${encodeURIComponent('שבת שלום!')}&sf=true&output=xml`;
    window.open(url, '_blank');
  };
}

if ($('btn-city-change')) $('btn-city-change').onclick = () => $('city-panel').style.display = 'block';
if ($('close-city-panel')) $('close-city-panel').onclick = () => $('city-panel').style.display = 'none';
if ($('city-search')) $('city-search').oninput = (e) => renderCityList(e.target.value);

document.querySelectorAll('.bless-tab').forEach(tab => tab.onclick = () => {
  document.querySelectorAll('.bless-tab').forEach(t => t.classList.remove('active'));
  tab.classList.add('active');
  renderBlessing(tab.dataset.tab);
});

if ($('btn-share-main')) {
  $('btn-share-main').onclick = () => {
    const text = `שבת שלום! 
הדלקת נרות ב${currentCity.n}: ${formatTime(state.candle, currentCity.tz)}
יציאת שבת: ${formatTime(state.havdala, currentCity.tz)}
נשלח מאפליקציית "נרות שבת"`;
    if (navigator.share) navigator.share({ title: 'זמני השבת', text });
    else { navigator.clipboard.writeText(text); showToast('הזמנים הועתקו'); }
  };
}

if ($('btn-locate')) {
  $('btn-locate').onclick = () => {
    if (!navigator.geolocation) return showToast('זיהוי מיקום לא נתמך');
    toggleLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => fetchShabbatTimes({ lat: pos.coords.latitude, lng: pos.coords.longitude }, 'מיקום נוכחי'),
      () => { showToast('גישה למיקום נדחתה'); toggleLoading(false); }
    );
  };
}

window.updateOffset = (val) => {
  candleMinutes = parseInt(val);
  localStorage.setItem('shabbat_minutes', candleMinutes);
  fetchShabbatTimes(currentCity);
};

if ($('candle-offset')) {
  $('candle-offset').onchange = (e) => window.updateOffset(e.target.value);
}

// Initial Load Trigger
initApp();
setInterval(updateCountdown, 60000);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js'));
}

window.PARASHA_FULL_DATA = {
  'בראשית': { p: 'בְּרֵאשִׁית בָּרָא אֱלֹהִים', pts: ['התחלה חדשה: ה\' ברא את העולם בשישה ימים ושבת בשביעי.', 'בחירה חופשית: אדם וחוה בגן עדן מלמדים אותנו שלכל רגע יש משמעות.', 'אחריות אישית: "השומר אחי אנכי?" — אנחנו ערבים זה לזה.', 'כל דור ושליחותו: עשרה דורות מאדם לנח — תהליך של תיקון.'] },
  'נח': { p: 'נֹחַ אִישׁ צַדִּיק תָּמִים', pts: ['עוצמה פנימית: נח היה צדיק גם כשכולם סביבו טעו.', 'השבת כתיבה: תיבת נח הגנה מהמבול — השבת היא התיבה שלנו.', 'הבטחה ותקווה: הקשת בענן היא ברית נצחית — יש תמיד תקווה.', 'אחדות ופירוד: מגדל בבל מלמד שגאווה מפרידה וענווה מחברת.'] },
  'לך לך': { p: 'לֶךְ לְךָ מֵאַרְצְךָ', pts: ['אמונה במסע: אברהם יוצא לדרך חדשה — אף פעם לא מאוחר להגשים ייעוד.', 'זהות יהודית: ברית המילה היא סימן נצחי של קשר עם הבורא.', 'חוזק בנדודים: גם בגלות וברעב, אברהם ושרה שמרו על ערכי החסד.', 'חלום הדורות: הבטחת הארץ — אנחנו חלק מסיפור גדול לנצח.'] },
  'וירא': { p: 'וַיֵּרָא אֵלָיו יְיָ', pts: ['חסד ואירוח: אברהם רץ לאורחים למרות כאבו. חסד קודם לכל.', 'תפילה על אחרים: אברהם נאבק על הצלת סדום — צדיק דואג לכולם.', 'עמידה בניסיון: העקדה מלמדת על כוח האמונה והביטחון בבורא.', 'השגחה פרטית: לידת יצחק בגיל זקנה מוכיחה שאין דבר בלתי אפשרי.'] },
  'חיי שרה': { p: 'וַיִּהְיוּ חַיֵּי שָׂרָה', pts: ['ניצול הזמן: חיים נמדדים בתוכן ומשמעות, לא רק בזמן שחלף.', 'קביעות בארץ: קניית מערת המכפלה — הצעד הראשון של בעלות קבועה.', 'עשייה ושידוך: רבקה נבחרת בזכות חסד — הבסיס לבית יהודי.', 'המשכיות: יצחק מביא את רבקה לאוהל שרה — האור של האמא ממשיך.'] },
  'תולדות': { p: 'וְאֵלֶּה תּוֹלְדֹת יִצְחָק', pts: ['מאבק פנימי: יעקב ועשו מלמדים שצריך לנהל את הכוחות המנוגדים בתוכנו.', 'ערך הבכורה: מי שמעריך את הרוחניות יזכה לה, ומי שמזלזל יאבד אותה.', 'ראייה אמהית: לרבקה יש "עין רוחנית" חדה להבין את מהות בניה.', 'כוח הברכה: המילים שאנחנו אומרים לילדינו מעצבות את עתידם.'] },
  'ויצא': { p: 'וַיֵּצֵא יַעֲקֹב מִבְּאֵר שָׁבַע', pts: ['סולם בחיים: הרגליים על האדמה אבל הראש שואף לשמים.', 'תפילת הדרך: הקדוש ברוך הוא נמצא איתנו גם בדרכים ובמקומות זרים.', 'כוח האהבה: אהבה אמיתית נותנת כוח להתגבר על כל קושי בדרך.', 'עמידה מול קושי: יעקב שומר על יושרו גם בבית לבן המאתגר.'] },
  'וישלח': { p: 'וַיִּשְׁלַח יַעֲקֹב מַלְאָכִים', pts: ['מאבק עם מלאך: ההתמודדות בלילה מלמדת שהפחדים הם הזדמנות לצמיחה.', 'שינוי שם: מ"יעקב" ל"ישראל" — שינוי המהות מעבדות לעוצמה.', 'פיוס אחים: לפעמים אחרי שנים של נתק, אפשר למצוא דרך לסליחה.', 'אבל ובניין: בתוך הכאב של האובדן תמיד יש ניצוץ של חיים חדשים.'] },
  'וישב': { p: 'וַיֵּשֶׁב יַעֲקֹב', pts: ['סכנת הקנאה: שנאת האחים ליוסף מזהירה אותנו מהרס חברתי ומשפחתי.', 'חלומות ושליחות: החלומות שלנו הם המצפן שלנו בחיים.', 'יושר בניסיון: עמידת יוסף מול אשת פוטיפר מלמדת נאמנות לערכים.', 'ירידה לצורך עלייה: לפעמים המקום הכי נמוך הוא ההכנה לשיא.'] },
  'מקץ': { p: 'וַיְהִי מִקֵּץ שְׁנָתַיִם יָמִים', pts: ['השגחה בנסתר: יוסף יוצא מהבור למלוכה ברגע אחד — ישועה כהרף עין.', 'תכנון וכלכלה: אגירת המזון מלמדת אותנו להיות מוכנים לימים מאתגרים.', 'ענווה בשלטון: יוסף מחזיר את הקרדיט לבורא ולא לוקח לעצמו.', 'מבחן האחים: היכולת להשתפר ולהתחרט היא המדד האמיתי לאדם.'] },
  'ויגש': { p: 'וַיִּגַּשׁ אֵלָיו יְהוּדָה', pts: ['ערבות הדדית: יהודה מוכן להישאר עבד במקום בנימין — אחד בשביל השני.', 'סליחה מוחלטת: יוסף אומר "אני יוסף אחיכם" — רק רצון להתאחד.', 'תוכנית אלוהית: מבט לאחור מגלה שגם הסבל היה חלק מתוכנית גדולה.', 'איחוד המשפחה: פגישת יעקב ויוסף — דמעות שמחה אחרי שנים של כאב.'] },
  'ויחי': { p: 'וַיְחִי יַעֲקֹב', pts: ['ברכת הנכדים: המסורת עוברת הלאה גם לדור השלישי באהבה.', 'אישיות ייחודית: לכל ילד יש כוח ומקום מיוחד משלו.', 'נאמנות לשורשים: גם בגלות, הלב תמיד פונה אל ארץ ישראל.', 'שלמות החיים: אדם נמדד במשפחתו המאוחדת ובדרך שהנחיל.'] },
  'שמות': { p: 'וְאֵלֶּה שְׁמוֹת', pts: ['גבורה נשית: המיילדות מסרבות לפקודה לא מוסרית — מצפון קודם לפחד.', 'אמהות וביטחון: יוכבד משחררת ובוטחת שה\' ישמור על בנה.', 'מנהיגות מהשטח: משה רואה בסבל אחיו — מנהיג מרגיש את כאב הזולת.', 'הסנה הבוער: הקדושה נמצאת גם במקומות הכי כואבים ולא צפויים.'] },
  'וארא': { p: 'וָאֵרָא אֶל אַבְרָהָם', pts: ['לשונות גאולה: הגאולה היא תהליך הדרגתי של שחרור וצמיחה.', 'סבלנות באמונה: דווקא כשנראה שחשוך ביותר, האור מתחיל להפציע.', 'מכות מצרים: שיעור לעולם שיש דין ויש דיין וכל הטבע בידי הבורא.', 'קשיחות הלב: מי שאוטם לבו לסבל אחרים מאבד את חירותו שלו.'] },
  'בא': { p: 'בֹּא אֶל פַּרְעֹה', pts: ['יציאת מצרים: המעבר מעבדות לחירות מתחיל קודם כל בנפש פנימה.', 'מצוות החודש: היהודי הוא אדון לזמן שלו — אנחנו קובעים את הקדושה.', 'גבורת האמונה: עמידה מול הפחד והמוסכמות של מצרים בשם האמת.', 'זכירה לדורות: הכוח שלנו הוא בסיפור הזיכרון שעובר מאב לבן.'] },
  'בשלח': { p: 'וַיְהִי בְּשַׁלַּח פַּרְעֹה', pts: ['קריעת ים סוף: אמונה מוחלטת יוצרת מציאות חדשה ובוקעת ימים.', 'שירת הלב: להודות ולשיר על הניסים ולא לקבל אותם כמובן מאליו.', 'ניסיון המן: לבטוח בפרנסה יומיומית ולא לצבור בדאגה למחר.', 'מלחמת עמלק: המלחמה בספק ובייאוש דורשת הרמת ידיים לשמים.'] },
  'יתרו': { p: 'וַיִּשְׁמַע יִתְרוֹ', pts: ['קבלת דעות: גם מנהיג גדול יכול ללמוד ולהקשיב לאדם מבחוץ.', 'מעמד הר סיני: ברית נצחית בין עם לתורה — הרגע הגדול בהיסטוריה.', 'עשרת הדיברות: הבסיס המוסרי המאחד אמונה בבורא ויחסים חברתיים.', 'כבוד המשפחה: הבסיס לחברה בריאה הוא הכרת הטוב להורים ולשורשים.'] },
  'משפטים': { p: 'וְאֵלֶּה הַמִּשְׁפָּטִים', pts: ['רוחניות בפרטים: התורה נמצאת בתוך הכיס, במסחר וביושר היומיומי.', 'רגישות לחלש: הגנה מיוחדת על מי שאין לו קול בחברה.', 'צדק חברתי: חברה נמדדת ביושר של בתי המשפט שלה ואיסור שוחד.', 'נעשה ונשמע: האמון בבורא גדול מהצורך להבין כל פרט מראש.'] },
  'תרומה': { p: 'וְיִקְחוּ לִי תְּרוּמָה', pts: ['נדיבות הלב: המשכן נבנה מרצון טוב ולא מכפייה — לב פתוח מביא שכינה.', 'מקדש בתוכנו: ה\' גר בתוך הלבבות של הקהילה, לא רק בבניין.', 'הארון והכרובים: התורה היא המרכז ממנו יוצא הקול והקשר.', 'המנורה: אחדות של דעות שונות שמפיצות יחד אור אחד גדול.'] },
  'תצוה': { p: 'וְאַתָּה תְּצַוֶּה', pts: ['אור נצחי: נר התמיד מלמד על התמדה ככוח האמיתי של הקדושה.', 'בגדי כבוד: לבוש מייצג תפקיד ואחריות — "בגדי קודש לכבוד ולתפארת".', 'אבני הזיכרון: מנהיג נושא את השמות והכאב של כל הקהילה על לבו.', 'מזבח הקטורת: תפילה שיוצאת מהלב ועולה למעלה בנחת ובריח טוב.'] },
  'כי תשא': { p: 'כִּי תִשָּׂא אֶת רֹאשׁ', pts: ['מחצית השקל: כולנו שווים — כל נשמה חשובה באותה מידה בבסיס.', 'סכנת העגל: כשמאבדים סבלנות ומחפשים קיצורי דרך חומריים נופלים.', 'מנהיגות מסורה: משה מוכן להקריב הכל למען העם והקהילה שלו.', 'לוחות שניים: גם אחרי שבירה יש תיקון — תמיד אפשר להתחיל מחדש.'] },
  'ויקהל': { p: 'וַיַּקְהֵל מֹשֶׁה', pts: ['כוח הקהילה: האחדות היא התנאי לבניית משהו גדול וקדוש.', 'שבת לפני הכל: המנוחה הרוחנית חשובה אפילו מהעשייה הכי קדושה.', 'חכמת לב: אומנות ויצירה הן מתנות שצריך להקדיש לטוב ולרוח.', 'נתינה נשית: כוח הנתינה של נשות ישראל הוא המנוע של המשכן.'] },
  'פקודי': { p: 'אֵלֶּה פְקוּדֵי', pts: ['שקיפות ויושר: אמון הציבור נבנה על דין וחשבון ויושר מוחלט.', 'סיום בשלמות: ביצוע מדויק באהבה מביא את השראת השכינה.', 'כבוד המשכן: כשמסיימים עבודה רוחנית במאמץ זוכים להרגיש נוכחות.', 'מטרה לחופש: המטרה של החירות היא ליצור תוכן ובית לבורא.'] },
  'ויקרא': { p: 'וַיִּקְרָא אֶל מֹשֶׁה', pts: ['קריאה אישית: לכל אחד יש תפקיד וקריאה אישית ייחודית בעולם.', 'קרבנות והתקרבות: ויתור על האגואיזם שלנו כדי להתקרב לאמת ולבורא.', 'ענווה במנהיגות: גם המנהיג הכי גדול הוא אדם שיכול לטעות וחייב לתקן.', 'ערך העני: הלב הוא שקובע, לא המחיר של המנחה.'] },
  'צו': { p: 'צַו אֶת אַהֲרֹן', pts: ['אש תמיד: צריך לשמור על הניצוץ שבלב דולק ללא הפסקה.', 'ניקוי הדשן: גם העבודות הפשוטות הן חלק בלתי נפרד מעבודת הקודש.', 'קרבן תודה: הזיכרון להודות על חסד והצלה הוא מפתח לאושר.', 'חינוך והכשרה: כל תפקיד משמעותי דורש הכנה, לימוד והתמדה.'] },
  'שמיני': { p: 'וַיְהִי בַּיּוֹם הַשְּׁמִינִי', pts: ['שמחה וטרגדיה: החיים מורכבים מרגעים של שיא ותהום המשולבים יחד.', 'שתיקת אהרן: יש רגעים שהשתיקה היא התגובה הכי עוצמתית ומכובדת.', 'כשרות המזון: מה שאנחנו מכניסים לגוף משפיע על הטוהר של הנפש.', 'הבדלה: היכולת להבחין בין טוב לרע היא הכוח המקדש אותנו.'] },
  'תזריע': { p: 'אִשָּׁה כִּי תַזְרִיעַ', pts: ['פלא הבריאה: קדושת החיים החדשים והכוח הרוחני המיוחד של האישה.', 'נגעי הצרעת: דיבור רע הורס עולמות — הדיבור שלנו בונה מציאות.', 'מבט של חסד: הכהן מאבחן בחסד — מבט נכון יכול לרפא אדם.', 'בידוד לתיקון: לפעמים צריך שקט ובדידות כדי לעשות חשבון נפש אמיתי.'] },
  'מצורע': { p: 'זֹאת תִּהְיֶה תּוֹרַת הַמְּצֹרָע', pts: ['תהליך הטהרה: היכולת להשתחרר מהעבר השלילי ולצאת לדרך חדשה.', 'חסד מחוץ למחנה: לא משאירים אף אחד לבד בחוץ — תמיד מושיטים יד.', 'נגעי הבית: הקירות סופגים את האווירה — כדאי למלא את הבית באור.', 'חזרה לקהילה: האמון נבנה מחדש צעד אחר צעד בסבלנות.'] },
  'אחרי מות': { p: 'וַיְדַבֵּר ה\' אַחֲרֵי מוֹת', pts: ['קדושת הבית: שמירה על טוהר המשפחה וגבולות המכבדים את הזולת.', 'התמודדות עם משברים: היכולת לצמוח מתוך אובדן ולבחור בחיים.', 'יום הכיפורים: הכוח של סליחה, ניקוי הלב והתחלה חדשה מול הבורא.'] },
  'קדושים': { p: 'קְדֹשִׁים תִּהְיוּ', pts: ['ואהבת לרעך כמוך: הקדושה היהודית מתחילה במעשים חברתיים של חסד וצדק.', 'כבוד האדם: "לא תקלל חרש" — חובתנו לכבד כל אדם, גם כשאינו שומע או רואה.', 'קדושת היומיום: להפוך את המעשים הרגילים (עבודה, מסחר) למוסריים וערכיים.'] },
  'אמור': { p: 'וַיֹּאמֶר ה\' אֱמֹר', pts: ['לוח שנה מקודש: השבת והחגים הם תחנות זמן לעצירה וחיבור למהות.', 'ספירת העומר: תהליך של צמיחה אישית מיום ליום לקראת קבלת התורה.', 'שלמות הכוונה: אנחנו צריכים להביא את הכוונות הכי שלמות לעבודת ה\'.', 'קידוש השם: ההתנהגות שלנו קובעת איך העולם רואה את האמונה.'] },
  'בהר': { p: 'וַיְדַבֵּר ה\' בְּהַר סִינַי', pts: ['שביתת הארץ: השמיטה מלמדת שהאדמה של הבורא ואנחנו רק דיירים.', 'שנת היובל: חזרה לשורשים ושחרור — אין עוני או עבדות נצחיים.', 'איסור אונאה: איסור לנצל חולשה של אדם אחר בממון או במילים.', 'עזרה לאח: האחריות החברתית היא לדאוג שלכולם יהיה מקום מכובד.'] },
  'בחוקותי': { p: 'אִם בְּחֻקֹּתַי תֵּלֵכוּ', pts: ['ברכת השפע: כשאנחנו בדרך הנכונה הטבע כולו משתף פעולה איתנו.', 'אחריות ותוצאה: המציאות היא מראה לבחירות ולמעשים שלנו בעולם.', 'זיכרון הברית: תמיד יש דרך חזרה — ה\' לעולם לא שוכח את הברית.', 'חתימת ויקרא: כל חיינו יכולים להיות שיר של קדושה אם נבחר בכך.'] },
  'במדבר': { p: 'וַיְדַבֵּר ה\' בְּמִדְבַּר', pts: ['כל אחד נספר: לכל אדם יש חשיבות ייחודית ושם משלו בעיני ה\'.', 'אחדות ללא אחידות: לכל שבט יש דגל ומקום מיוחד בתוך הכלל.', 'מרכזיות הרוח: כשהרוחניות במרכז (המשכן) הכל מסתדר מסביב.', 'צמיחה בשקט: לפעמים דווקא בשקט של המדבר מוצאים את הקול הפנימי.'] },
  'נשא': { p: 'נָשֹׂא אֶת רֹאשׁ', pts: ['ברכת כהנים: הברכה העתיקה המבטיחה שמירה, חן ושלום לכל אחד.', 'גבולות לצמיחה: לפעמים הצבת גבולות עצמיים עוזרת להתעלות ולגדול.', 'שלום בית: חשיבות השלום בין איש לאשתו קודמת להכל.', 'תרומה אישית: כל נתינה, גם אם היא דומה לאחרת, היא עולם ומלואו.'] },
  'בהעלותך': { p: 'בְּהַעֲלֹתְךָ אֶת הַנֵּרֹת', pts: ['להעלות את הנר: תפקידנו לעזור לאחרים להאיר בכוחות עצמם.', 'הזדמנות שנייה: פסח שני מלמד שתמיד אפשר לתקן ואין דבר אבוד.', 'ענוות אמת: ככל שאדם גדול יותר הוא מרגיש פשוט יותר מול הבורא.', 'זהירות מתלונות: הערכה למה שיש לנו מונעת געגוע שווא לעבדות הנוחה.'] },
  'שלח': { p: 'שְׁלַח לְךָ אֲנָשִׁים', pts: ['ראייה חיובית: הפחד מעוות את המציאות — צריך להסתכל בעין טובה.', 'כוח הדיבור: מילים רעות על הארץ ועל אנשים יכולות לעכב דור שלם.', 'עמידה מול הזרם: אומץ לעמוד על האמת גם כשאתה במיעוט.', 'ציצית כתזכורת: סימנים חיצוניים שעוזרים לנו לזכור את הייעוד שלנו.'] },
  'קרח': { p: 'וַיִּקַּח קֹרַח', pts: ['סכנת המחלוקת: גאווה ורדיפת כבוד הורסות כל חלקה טובה בקהילה.', 'מנהיגות של שלום: משה מנסה למנוע מחלוקת — מנהיג נמדד בסבלנותו.', 'צמיחה בשקט: הקדושה האמיתית צומחת בפריחה שקטה, לא ברעש.', 'זכות ואחריות: מעמד הוא הזדמנות לשירות ונתינה, לא לשליטה.'] },
  'חקת': { p: 'זֹאת חֻקַּת הַתּוֹרָה', pts: ['מעל ההיגיון: יש דברים בחיים שמקבלים באמונה גם ללא הבנה מלאה.', 'כוח המילים: שיעור על הכוח של המילה לעומת הכוח הפיזי המכה.', 'פרידת מנהיגים: זיכרון של דמויות שהובילו אותנו והשאירו מורשת.', 'מבט למעלה: הריפוי מגיע כשמסתכלים למעלה ומתחברים למקור.'] },
  'בלק': { p: 'וַיַּרְא בָּלָק', pts: ['מה טובו אהליך: ה\' הופך כוונות רעות לברכה גדולה עבורנו.', 'האתון שרואה: לפעמים דווקא הפשוטים רואים את האמת שהגאים מחמיצים.', 'זהות ייחודית: עם לבדד ישכון — לשמור על הייחודיות שלנו בעולם.', 'סכנת הפיתוי: כשנכשלים בכוח מנסים להכשיל בפיתויים — צריך ערנות.'] },
  'פינחס': { p: 'פִּינְחָס בֶּן אֶלְעָזָר', pts: ['ברית שלום: מעשה של אכפתיות מוחלטת מביא בסופו של דבר לשלום.', 'בנות צלפחד: כוחן של נשים לשנות מתוך אהבת הארץ והשורשים.', 'העברת הלפיד: מינוי יהושע — העברת מנהיגות בצורה מעצימה לדור הבא.', 'קשר קבוע: לוח המועדים מלמד על קשר מתמיד ומתחדש עם הבורא.'] },
  'מטות': { p: 'וַיְדַבֵּר מֹשֶׁה אֶל רָאשֵׁי', pts: ['קדושת הדיבור: המילה שלנו היא ההתחייבות והכבוד שלנו.', 'ערבות הדדית: אין זכויות בלי חובות ועזרה לאחים בכיבוש הארץ.', 'זיכוך וטהרה: גם חפצים גשמיים צריכים ניקוי כדי לשמש לקדושה.', 'הנהגה של הסכמות: ניהול משא ומתן מורכב למען האחדות של כולם.'] },
  'מסעי': { p: 'אֵלֶּה מַסְעֵי', pts: ['הדרך היא היעד: כל תחנה בחיים, גם הקשה, היא חלק מהמסע הגדול.', 'קשר לאדמה: הפירוט המדויק מלמד על הקשר הממשי והעמוק לארץ.', 'רחמים בדין: ערי מקלט מלמדות על ערך החיים והבחנה בכוונות הלב.', 'סיום מוכן: מסע של 40 שנה נחתם — אנחנו מוכנים להיכנס אל הייעוד.'] },
  'דברים': { p: 'אֵלֶּה הַדְּבָרִים', pts: ['זיכרון לעתיד: כדי להתקדם חייבים להבין ולזכור את הדרך שעברנו.', 'תוכחה מאהבה: ביקורת בונה חייבת לבוא מתוך אכפתיות וקשר עמוק.', 'צדק ללא משוא פנים: כולם שווים בפני החוק והמשפט.', 'אל תירא: הביטחון העצמי והלאומי שלנו מגיע מתוך אמונה פנימית.'] },
  'ואתחנן': { p: 'וָאֶתְחַנַּן אֶל ה\'', pts: ['כוח התפילה: גם כשלא מקבלים הכל, התפילה פועלת ומשנה את הלב.', 'שמע ישראל: הצהרת האחדות היהודית בכל מצב ובכל זמן.', 'ואהבת: עבודת ה\' צריכה להיות מתוך רגש, שמחה ואהבה גדולה.', 'תורה נצחית: האמת היא מוחלטת ואינה משתנה לפי אופנות חולפות.'] },
  'עקב': { p: 'וְהָיָה עֵקֶב תִּשְׁמְעוּן', pts: ['מצוות קטנות: לשים לב למעשים הקטנים שנוטים לזלזל בהם — הכל משפיע.', 'שבח הארץ: הכרת הטוב על יופייה ושפעה המיוחד של ארץ ישראל.', 'סכנת הגאווה: לזכור שהכוח וההצלחה הגיעו כמתנה ולא רק בגללנו.', 'ברכת המזון: להודות אחרי שנהנים — המפתח לשמירה על השפע.'] },
  'ראה': { p: 'רְאֵה אָנֹכִי נֹתֵן', pts: ['חופש בחירה: הכל פתוח והבחירה בברכה נמצאת בידיים שלך בלבד.', 'מרכז רוחני: השאיפה למקום שמאחד את כל העם סביב ערכים משותפים.', 'פתוח תפתח: נתינה לאחר היא הדרך להרגיש חלק מהשלם.', 'שמחת החג: השמחה היא מצווה רוחנית גבוהה המעלה את האדם.'] },
  'שופטים': { p: 'שֹׁפְטִים וְשֹׁטְרִים', pts: ['צדק צדק תרדוף: לא מספיק לרצות צדק, צריך לפעול להשיגו באמת.', 'מנהיגות מוגבלת: איש אינו מעל החוק — ענווה היא חובה למנהיג.', 'עדות ודיוק: חשיבות האמת והבדיקה לפני שחורצים דין על אדם.', 'בל תשחית: כבוד לטבע ולמשאבים שמזינים אותנו גם בזמן מאבק.'] },
  'כי תצא': { p: 'כִּי תֵצֵא לַמִּלְחָמָה', pts: ['מוסר במלחמה: גם ברגעי קיצון חובה לשמור על צלם אנוש וערכים.', 'השבת אבידה: אכפתיות מרכוש הזולת היא חובה דתית ומוסרית.', 'מעקה לגג: בטיחות קודמת לכל — אנחנו אחראים למנוע סכנות.', 'זכירת עמלק: לא לשכוח את הרוע כדי לדעת תמיד לבחור בטוב.'] },
  'כי תבוא': { p: 'וְהָיָה כִּי תָבוֹא', pts: ['הכרת הטוב: להגיד תודה על פירות העמל ולא לקחת דבר כמובן מאליו.', 'ווידוי מעשרות: סיפוק ויושר בעשייה חברתית נכונה ומדויקת.', 'ברכות וקללות: החיים הם סדרה של השלכות לבחירות ולמעשים שלנו.', 'עם סגולה: ברית של אהבה ומחויבות הדדית בין העם לבוראו.'] },
  'נצבים': { p: 'אַתֶּם נִצָּבִים הַיּוֹם', pts: ['כולנו ניצבים: בברית הזו כולם שווים וחשובים ללא הבדל מעמד.', 'ובחרת בחיים: החיים הם בחירה אקטיבית יומיומית בטוב ובצמיחה.', 'התורה קרובה: הרוחניות נגישה לכל אחד בפיך ובלבבך לעשותו.', 'כוח התשובה: תמיד אפשר לחזור ולהתחבר מחדש למקור האמת.'] },
  'וילך': { p: 'וַיֵּלֶךְ מֹשֶׁה', pts: ['המשכיות: דור הולך ודור בא והתורה נשארת נצחית ומחברת.', 'מצוות הקהל: האחדות הלאומית היא הכוח המלכד של עם ישראל.', 'חזק ואמץ: קריאה לאומץ וביטחון בעתיד כי ה\' איתנו תמיד.', 'כתיבת תורה: לכל אחד יש חלק אישי וייחודי בסיפור ובתורה.'] },
  'האזינו': { p: 'הַאֲזִינוּ הַשָּׁמַיִם', pts: ['שירת ההיסטוריה: הכל מכוון מלמעלה גם כשקשה להבין בזמן אמת.', 'צור תמים פעלו: אמונה בעולם שמתנהל ביושר ובצדק אלוקי.', 'זכור ימות עולם: לימוד מהעבר מגן עלינו מטעויות בעתיד.', 'התחדשות: דברי תורה צריכים לרדת עלינו כגשם שמחייה את הנפש.'] },
  'וזאת הברכה': { p: 'וְזֹאת הַבְּרָכָה', pts: ['ברכת הסיום: מילים אחרונות של אהבה והעצמה לכל אחד ואחת.', 'מורשה: התורה היא ירושה יקרה ושייכת לכל אחד מאיתנו.', 'מות משה: סיום חיים בנשיקה אלוהית — המנהיג עוזב אך הרוח נשארת.', 'סיום והתחלה: מסיימים ומתחילים מיד מבראשית — הלימוד לא נגמר.'] },
};
