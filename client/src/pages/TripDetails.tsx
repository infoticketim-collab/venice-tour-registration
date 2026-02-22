import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useRef } from "react";

// Hotel info by region
function getHotelForRegion(region: string) {
  if (region === "מרחב חיפה, צפון ושפלה" || region === "מרחב דרום") {
    return {
      name: "Ani Grand Hotel Yerevan",
      stars: "★★★★",
      address: "65 Hanrapetutyan St, Yerevan 0010, ארמניה",
      mapLink: "https://maps.google.com/?q=Ani+Grand+Hotel+Yerevan,+65+Hanrapetutyan+St,+Yerevan",
    };
  }
  return {
    name: "Ani Plaza Hotel Yerevan",
    stars: "★★★★",
    address: "19 Sayat-Nova Ave, Yerevan 0001, ארמניה",
    mapLink: "https://maps.google.com/?q=Ani+Plaza+Hotel+Yerevan,+19+Sayat-Nova+Ave,+Yerevan",
  };
}

// Rotating gallery component
function Gallery({ images }: { images: string[] }) {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [images.length]);

  const go = (dir: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setCurrent((c) => (c + dir + images.length) % images.length);
    timerRef.current = setInterval(() => setCurrent((p) => (p + 1) % images.length), 3000);
  };

  return (
    <div className="relative w-full overflow-hidden rounded-xl bg-gray-200" style={{ height: "260px" }}>
      {images.map((src, i) => (
        <img
          key={src}
          src={src}
          alt=""
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${i === current ? "opacity-100" : "opacity-0"}`}
        />
      ))}
      <button
        onClick={() => go(-1)}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full w-9 h-9 flex items-center justify-center hover:bg-black/70 z-10 text-xl"
      >‹</button>
      <button
        onClick={() => go(1)}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full w-9 h-9 flex items-center justify-center hover:bg-black/70 z-10 text-xl"
      >›</button>
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2 h-2 rounded-full transition-colors ${i === current ? "bg-white" : "bg-white/50"}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function TripDetails() {
  const [, setLocation] = useLocation();
  const [selectedRegion, setSelectedRegion] = useState<string>("");

  useEffect(() => {
    const region = sessionStorage.getItem("selectedRegion");
    if (!region) {
      setLocation("/region-select");
      return;
    }
    setSelectedRegion(region);
  }, [setLocation]);

  const hotel = getHotelForRegion(selectedRegion);
  const isGroupA = selectedRegion === "מרחב חיפה, צפון ושפלה" || selectedRegion === "מרחב דרום";

  // Gallery images per day
  const day1Gallery = [
    "/images/armenia-2.png",
    "/images/armenia-5.png",
    "/images/armenia-6.png",
    "/images/armenia-7.png",
    "/images/armenia-9.png",
    "/images/armenia-10.png",
    "/images/armenia-11.png",
  ];

  const day23GroupAGallery = [
    "/images/armenia-1.png",
    "/images/armenia-13.png",
    "/images/armenia-14.png",
    "/images/armenia-15.png",
    "/images/armenia-16.png",
    "/images/armenia-17.png",
    "/images/armenia-19.png",
    "/images/armenia-20.png",
  ];

  const day23GroupBGallery = [
    "/images/armenia-21.png",
    "/images/armenia-22.png",
    "/images/armenia-23.png",
    "/images/armenia-24.png",
    "/images/armenia-25.png",
    "/images/armenia-26.png",
    "/images/armenia-27.png",
    "/images/armenia-29.png",
    "/images/armenia-30.png",
  ];

  const day4Gallery = [
    "/images/armenia-8.png",
    "/images/armenia-28.png",
    "/images/armenia-31.png",
    "/images/armenia-32.png",
  ];

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <div className="bg-gradient-to-b from-red-700 to-red-800 py-8 px-4">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <img src="/logo.png" alt="ההסתדרות" className="h-20 w-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold text-white text-center">
            סיור לארמניה
          </h1>
          <p className="text-red-200 text-lg mt-2 text-center">28.6.2026 – 1.7.2026 | 4 ימים / 3 לילות</p>
          {selectedRegion && (
            <p className="text-white/80 text-base mt-1 text-center">{selectedRegion}</p>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Flight Info */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-2xl">✈️</span> פרטי טיסות
          </h2>
          <div className="space-y-3 text-right">
            <div className="flex items-start gap-3 justify-end">
              <div>
                <p className="font-semibold text-gray-800">28.6.2026 – המראה לירוואן</p>
                <p className="text-gray-600 text-sm">טיסות פרטיות ישירות לירוואן במטוס ההסתדרות | המראה בשעות הבוקר המוקדמות</p>
              </div>
              <span className="text-2xl mt-0.5">🛫</span>
            </div>
            <div className="flex items-start gap-3 justify-end">
              <div>
                <p className="font-semibold text-gray-800">1.7.2026 – המראה לתל אביב</p>
                <p className="text-gray-600 text-sm">טיסות פרטיות ישירות לתל אביב במטוס ההסתדרות | המראה בשעות הערב</p>
              </div>
              <span className="text-2xl mt-0.5">🛬</span>
            </div>
          </div>
        </div>

        {/* Hotel Card */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-2xl">🏨</span> המלון שלכם
          </h2>
          <div className="text-right">
            <p className="text-xl font-bold text-red-700">{hotel.name}</p>
            <p className="text-yellow-500 text-lg mb-1">{hotel.stars}</p>
            <p className="text-gray-600 mb-1">📍 {hotel.address}</p>
            <p className="text-gray-700 text-sm mb-4">בסיס לינה וארוחת בוקר | חדרים זוגיים משותפים | תוספת לחדר יחיד בתשלום נפרד</p>
            <a
              href={hotel.mapLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-800 transition-colors text-sm"
            >
              📍 הצג במפות Google
            </a>
          </div>
        </div>

        {/* Day-by-day itinerary */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-right border-b border-gray-200 pb-4">
            תוכנית הסיור יום אחר יום
          </h2>

          {/* Day 1 */}
          <div className="mb-12 border-b border-gray-100 pb-10">
            <h3 className="text-xl font-bold text-red-700 mb-3 text-right">
              יום 1 – ראשון, 28.6.2026: הגעה לירוואן
            </h3>
            <div className="w-full rounded-xl overflow-hidden mb-5">
              <img src="/images/armenia-12.png" alt="כיכר הרפובליקה ירוואן" className="w-full object-cover" style={{ maxHeight: "340px" }} />
            </div>
            <div className="text-gray-700 leading-relaxed text-right space-y-3 mb-6">
              <p>ברוכים הבאים לירוואן, בירתה התוססת של ארמניה! המדריכים וראשי הקבוצות שלנו יקבלו את פניכם בחמימות בנמל התעופה זבארטנוץ ויסייעו בכל שירותי הקרקע.</p>
              <p>לפני תחילת הסיור, נהנה מ<strong>ארוחת צהריים ב-"Agape Refectory"</strong>. מבנה היסטורי זה הוא חדר אוכל של נזירים ששוחזר להפליא ומתוארך לשנת 1655. כיום הוא משמש כמסעדה אלגנטית המציעה מבחר מעודן של מטבח ארמני קלאסי ומודרני.</p>
              <p>זמן לחקור את <strong>הבירה הארמנית בת ה-2807</strong>, עיר מודרנית הממוקמת בצילו של הר אררט המקראי. נחקור את <strong>מתחם הקסקד</strong> האייקוני, ביקור בבית האופרה האלגנטי, <strong>שדרת הצפון</strong> התוססת, <strong>כיכר הרפובליקה</strong> המפורסמת, פארקי העיר, <strong>מוזיאון גפסיאן לאמנות</strong> וגן הפסלים המודרניים.</p>
              <p><strong>ארוחת הערב החגיגית</strong> תאורגן במרכז התרבות <strong>"שטיחי מגריאן"</strong>, כולל ביקור במפעל ובמוזיאון לשטיחים ארמניים בעבודת יד. תשתתפו ב<strong>סדנת אמן אינטראקטיבית</strong> להכנת מאכל ארמני מסורתי, בהנחיית השף המפורסם מר סדראק מומוליאן.</p>
            </div>
            <Gallery images={day1Gallery} />
            <div className="grid md:grid-cols-3 gap-4 mt-5">
              <div className="bg-red-50 rounded-lg p-4">
                <h4 className="font-bold text-red-700 mb-2 text-right text-sm">פעילויות</h4>
                <ul className="space-y-1 text-right text-sm text-gray-700">
                  <li>• סיור בעיר ירוואן</li>
                  <li>• מתחם הקסקד</li>
                  <li>• כיכר הרפובליקה</li>
                  <li>• מוזיאון גפסיאן לאמנות</li>
                  <li>• מפעל שטיחים ארמניים</li>
                  <li>• סדנת בישול עם השף מומוליאן</li>
                </ul>
              </div>
              <div className="bg-orange-50 rounded-lg p-4">
                <h4 className="font-bold text-orange-700 mb-2 text-right text-sm">ארוחות</h4>
                <ul className="space-y-1 text-right text-sm text-gray-700">
                  <li>• ארוחת צהריים ב-Agape Refectory</li>
                  <li>• ארוחת ערב חגיגית בשטיחי מגריאן</li>
                </ul>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-bold text-blue-700 mb-2 text-right text-sm">לינה</h4>
                <p className="text-sm text-gray-700 text-right">{hotel.name} {hotel.stars}</p>
              </div>
            </div>
          </div>

          {/* Day 2+3 */}
          {isGroupA ? (
            <div className="mb-12 border-b border-gray-100 pb-10">
              <h3 className="text-xl font-bold text-red-700 mb-3 text-right">
                ימים 2–3 – שני-שלישי, 29–30.6.2026: גגהארד, סימפוניית האבנות, גרני ויקב ווסקבאז
              </h3>
              <div className="w-full rounded-xl overflow-hidden mb-5">
                <img src="/images/armenia-3.png" alt="מקדש גרני" className="w-full object-cover" style={{ maxHeight: "340px" }} />
              </div>
              <div className="text-gray-700 leading-relaxed text-right space-y-3 mb-6">
                <p>ארוחת בוקר במלון. היום מתחיל בנסיעה נופית לכפרים גוטי וגרני. התחנה הראשונה היא <strong>מנזר גגהארד</strong>, קומפלקס ימי-ביניימי מדהים החצוב בחלקו בצוקים הסמוכים – <strong>אתר מורשת עולמית של אונסק"ו</strong>. תהיה לכם הזדמנות ייחודית לחוות הופעה של מקהלה מוכשרת באחד מחדרי המנזר, הידוע באקוסטיקה יוצאת הדופן שלו.</p>
                <p>לאחר מכן, ממשיכים ל<strong>סימפוניית האבנות</strong> – עמודי בזלת משושים המתנשאים לגובה של עד 50 מטרים, דומים לצינורות של אורגן כנסייה ענק.</p>
                <p>הזדמנות ייחודית לקחת חלק ב<strong>סדנת אמן לאפיית לחם הלאבאש הארמני</strong> המסורתי, שנאפה בתנור טוניר – מוכר על ידי אונסק"ו כחלק מהמורשת התרבותית הבלתי מוחשית של האנושות.</p>
                <p>ביקור ב<strong>מקדש גרני</strong> – המקדש הפגאני בעל העמודים בסגנון יווני-רומי היחיד שנותר עומד בארמניה, שנבנה במאה ה-1 לספירה. כאן נהנה מ<strong>הופעה חיה של דודוק</strong>, כלי נגינה ארמני עתיק העשוי מעץ משמש.</p>
                <p>ביקור ב<strong>אנדרטת האלפבית הארמני</strong>, ולסיום – <strong>טעימות יין ביקב "ווסקבאז"</strong> עם ארוחת ערב חגיגית.</p>
              </div>
              <Gallery images={day23GroupAGallery} />
              <div className="grid md:grid-cols-3 gap-4 mt-5">
                <div className="bg-red-50 rounded-lg p-4">
                  <h4 className="font-bold text-red-700 mb-2 text-right text-sm">פעילויות</h4>
                  <ul className="space-y-1 text-right text-sm text-gray-700">
                    <li>• מנזר גגהארד (אונסק"ו)</li>
                    <li>• הופעת מקהלה במנזר</li>
                    <li>• סימפוניית האבנות</li>
                    <li>• סדנת אפיית לאבאש</li>
                    <li>• מקדש גרני</li>
                    <li>• הופעת דודוק</li>
                    <li>• אנדרטת האלפבית הארמני</li>
                    <li>• טעימות יין ביקב ווסקבאז</li>
                  </ul>
                </div>
                <div className="bg-orange-50 rounded-lg p-4">
                  <h4 className="font-bold text-orange-700 mb-2 text-right text-sm">ארוחות</h4>
                  <ul className="space-y-1 text-right text-sm text-gray-700">
                    <li>• ארוחת בוקר במלון</li>
                    <li>• ארוחת ערב ביקב ווסקבאז</li>
                  </ul>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-bold text-blue-700 mb-2 text-right text-sm">לינה</h4>
                  <p className="text-sm text-gray-700 text-right">{hotel.name} {hotel.stars}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-12 border-b border-gray-100 pb-10">
              <h3 className="text-xl font-bold text-red-700 mb-3 text-right">
                ימים 2–3 – שני-שלישי, 29–30.6.2026: שוק ורניסאז', שוק GUM ואנדרטת אמא ארמניה
              </h3>
              <div className="w-full rounded-xl overflow-hidden mb-5">
                <img src="/images/armenia-12.png" alt="ירוואן" className="w-full object-cover" style={{ maxHeight: "340px" }} />
              </div>
              <div className="text-gray-700 leading-relaxed text-right space-y-3 mb-6">
                <p>ארוחת בוקר במלון. היום מתחיל בחוויית קניות סוחפת המציגה את התרבות היומיומית התוססת של ירוואן. נתחיל בביקור ב<strong>שוק הפשפשים ורניסאז'</strong> – שוק פתוח ותוסס שבו אמנים מקומיים מציגים עבודות יד, מזכרות מסורתיות, תכשיטים, ציורים, שטיחים ומזכרות ייחודיות.</p>
                <p>החוויה ממשיכה ב<strong>שוק GUM</strong>, שוק אוכל מקומי אהוב מלא בצבעים, ניחוחות וטעמים – פירות יבשים, אגוזים, תבלינים, ממתקים ומומחיות אזורית.</p>
                <p>לאחר מכן, נבקר ב<strong>אנדרטת אמא ארמניה</strong> – אחד מסימני ההיכר האייקוניים של ירוואן, הניצבת גבוה מעל העיר ומציעה נופים פנורמיים גורפים.</p>
                <p><strong>ארוחת הערב הפרידה</strong> תתקיים ב-<strong>"Tavern Yerevan Riverside"</strong>, עם תפריט עשיר של מאכלים ארמניים אותנטיים, מוזיקת פולקלור והופעות חיות.</p>
              </div>
              <Gallery images={day23GroupBGallery} />
              <div className="grid md:grid-cols-3 gap-4 mt-5">
                <div className="bg-red-50 rounded-lg p-4">
                  <h4 className="font-bold text-red-700 mb-2 text-right text-sm">פעילויות</h4>
                  <ul className="space-y-1 text-right text-sm text-gray-700">
                    <li>• שוק הפשפשים ורניסאז'</li>
                    <li>• שוק GUM</li>
                    <li>• אנדרטת אמא ארמניה</li>
                  </ul>
                </div>
                <div className="bg-orange-50 rounded-lg p-4">
                  <h4 className="font-bold text-orange-700 mb-2 text-right text-sm">ארוחות</h4>
                  <ul className="space-y-1 text-right text-sm text-gray-700">
                    <li>• ארוחת בוקר במלון</li>
                    <li>• ארוחת ערב ב-Tavern Yerevan Riverside</li>
                  </ul>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-bold text-blue-700 mb-2 text-right text-sm">לינה</h4>
                  <p className="text-sm text-gray-700 text-right">{hotel.name} {hotel.stars}</p>
                </div>
              </div>
            </div>
          )}

          {/* Day 4 */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-red-700 mb-3 text-right">
              יום 4 – רביעי, 1.7.2026: הפארק היהודי, Grand Candy, קניון דלמה גרדן ועזיבה
            </h3>
            <div className="w-full rounded-xl overflow-hidden mb-5">
              <img src="/images/armenia-4.png" alt="קניון דלמה גרדן עם הר אררט" className="w-full object-cover" style={{ maxHeight: "220px" }} />
            </div>
            <div className="text-gray-700 leading-relaxed text-right space-y-3 mb-6">
              <p>ארוחת בוקר במלון. היום מתחיל בביקור תרבותי משמעותי המציע תובנה עמוקה למורשת ולקהילה היהודית בארמניה. בסביבת פארק רגועה, האורחים ילמדו על הנוכחות ההיסטורית של הקהילה היהודית במדינה. הביקור ממשיך ל<strong>בית הכנסת המקומי</strong>.</p>
              <p>עצירה מתוקה ב<strong>חנות השוקולד Grand Candy</strong> – יעד מקומי אהוב שבו האורחים יכולים לגלות את מסורות המגדנאות הארמניות ולרכוש פינוקים ומתנות.</p>
              <p>זמן חופשי ב<strong>קניון דלמה גרדן (Dalma Garden Mall)</strong> לקניות של הרגע האחרון, חקירת מותגים מקומיים ובינלאומיים, וסיום מהנה לפני העזיבה.</p>
              <p>היום מסתיים בהעברה לשדה התעופה. נתראה בקרוב בארמניה!</p>
            </div>
            <Gallery images={day4Gallery} />
            <div className="grid md:grid-cols-2 gap-4 mt-5">
              <div className="bg-red-50 rounded-lg p-4">
                <h4 className="font-bold text-red-700 mb-2 text-right text-sm">פעילויות</h4>
                <ul className="space-y-1 text-right text-sm text-gray-700">
                  <li>• הפארק היהודי ובית הכנסת</li>
                  <li>• חנות השוקולד Grand Candy</li>
                  <li>• קניון דלמה גרדן</li>
                  <li>• העברה לשדה התעופה</li>
                </ul>
              </div>
              <div className="bg-orange-50 rounded-lg p-4">
                <h4 className="font-bold text-orange-700 mb-2 text-right text-sm">ארוחות</h4>
                <ul className="space-y-1 text-right text-sm text-gray-700">
                  <li>• ארוחת בוקר במלון</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
          <Button
            onClick={() => setLocation("/register/1")}
            size="lg"
            className="text-xl px-12 py-6 bg-red-700 hover:bg-red-800"
          >
            אני מעוניין להירשם
          </Button>
          <Button
            variant="outline"
            onClick={() => setLocation("/region-select")}
            size="lg"
            className="text-xl px-8 py-6"
          >
            ← חזרה
          </Button>
        </div>
      </div>
    </div>
  );
}
