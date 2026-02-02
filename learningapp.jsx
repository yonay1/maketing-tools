import React, { useState, useEffect } from 'react';
import {
    Book,
    Zap,
    ChevronLeft,
    Check,
    // Info changed to InfoIcon to prevent naming collisions
    Info as InfoIcon,
    Star,
    Menu,
    X,
    Target,
    DollarSign,
    Briefcase,
    Award
} from 'lucide-react';

/**
 * ---------------------------------------------------------------------
 * VISUALIZATION COMPONENTS (Diagrams & Math)
 * ---------------------------------------------------------------------
 */

const MathFormula = ({ formula }) => {
    const cleanFormula = formula.trim();

    // טיפול בנוסחאות שבר (כמו CLV)
    // זיהוי תבנית: Variable = \frac{Numerator}{Denominator}
    if (cleanFormula.includes('\\frac')) {
        const parts = cleanFormula.split('=');
        const leftSide = parts[0] ? parts[0].trim() + ' =' : '';
        const rightSideRaw = parts[1] || '';

        const match = rightSideRaw.match(/\\frac\{(.+?)\}\{(.+?)\}/);
        if (match) {
            const num = match[1].replace(/\\times/g, '×').replace(/\\cdot/g, '⋅');
            const den = match[2].replace(/\\times/g, '×').replace(/\\cdot/g, '⋅');

            return (
                <div className="flex items-center justify-center my-8 text-slate-800" dir="ltr">
                    <div className="text-xl font-serif font-bold italic mr-4">
                        {leftSide}
                    </div>
                    <div className="flex flex-col items-center justify-center">
                        <div className="border-b-2 border-slate-800 px-4 pb-1 mb-1 text-lg font-serif font-medium">
                            {num}
                        </div>
                        <div className="text-lg font-serif font-medium">
                            {den}
                        </div>
                    </div>
                </div>
            );
        }
    }

    // טיפול בנוסחאות רגילות (סכום, כפל)
    const display = cleanFormula
        .replace(/\\sum/g, '∑')
        .replace(/\\times/g, '×')
        .replace(/\\cdot/g, '⋅');

    return (
        <div className="flex justify-center my-8" dir="ltr">
            <div className="bg-gradient-to-r from-slate-50 to-blue-50 border border-blue-100 px-8 py-4 rounded-xl shadow-sm transform hover:scale-105 transition-transform duration-300">
                <span className="text-xl font-serif font-bold text-slate-800 tracking-wide">
                    {display}
                </span>
            </div>
        </div>
    );
};

const CourseDiagram = ({ type }) => {
    const baseClass = "w-full max-w-lg mx-auto my-8 p-4 bg-white rounded-xl shadow-sm border border-slate-200";

    switch (type) {
        case 'VALUE_EXCHANGE':
            return (
                <div className={baseClass}>
                    <h4 className="text-center font-bold text-slate-700 mb-4">מודל חליפין של ערך</h4>
                    <svg viewBox="0 0 400 150" className="w-full">
                        {/* Firm */}
                        <circle cx="60" cy="75" r="40" fill="#3b82f6" opacity="0.1" />
                        <text x="60" y="80" textAnchor="middle" className="text-sm font-bold" fill="#1e40af">הפירמה</text>

                        {/* Customer */}
                        <circle cx="340" cy="75" r="40" fill="#10b981" opacity="0.1" />
                        <text x="340" y="80" textAnchor="middle" className="text-sm font-bold" fill="#047857">הצרכן</text>

                        {/* Arrows */}
                        <path d="M 110 50 Q 200 10 290 50" fill="none" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#arrowhead-blue)" />
                        <text x="200" y="35" textAnchor="middle" className="text-xs" fill="#3b82f6">ערך (מוצר/שירות)</text>

                        <path d="M 290 100 Q 200 140 110 100" fill="none" stroke="#10b981" strokeWidth="2" markerEnd="url(#arrowhead-green)" />
                        <text x="200" y="135" textAnchor="middle" className="text-xs" fill="#10b981">ערך (כסף/מידע/נאמנות)</text>

                        <defs>
                            <marker id="arrowhead-blue" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                                <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
                            </marker>
                            <marker id="arrowhead-green" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                                <polygon points="0 0, 10 3.5, 0 7" fill="#10b981" />
                            </marker>
                        </defs>
                    </svg>
                </div>
            );

        case 'CUSTOMER_PYRAMID':
            return (
                <div className={baseClass}>
                    <h4 className="text-center font-bold text-slate-700 mb-4">פירמידת הלקוחות (CLV)</h4>
                    <svg viewBox="0 0 300 220" className="w-full">
                        {/* Platinum */}
                        <path d="M 150 10 L 210 60 L 90 60 Z" fill="#e0f2fe" stroke="#0ea5e9" strokeWidth="2" />
                        <text x="150" y="45" textAnchor="middle" className="text-xs font-bold" fill="#0369a1">פלטינה</text>
                        <text x="240" y="45" textAnchor="start" className="text-[10px]" fill="#64748b">הכי רווחיים, נאמנים</text>

                        {/* Gold */}
                        <path d="M 90 60 L 210 60 L 240 110 L 60 110 Z" fill="#fef3c7" stroke="#d97706" strokeWidth="2" />
                        <text x="150" y="90" textAnchor="middle" className="text-xs font-bold" fill="#b45309">זהב</text>
                        <text x="260" y="90" textAnchor="start" className="text-[10px]" fill="#64748b">רווחיים, רגישים למחיר</text>

                        {/* Iron */}
                        <path d="M 60 110 L 240 110 L 270 160 L 30 160 Z" fill="#f1f5f9" stroke="#64748b" strokeWidth="2" />
                        <text x="150" y="140" textAnchor="middle" className="text-xs font-bold" fill="#475569">ברזל</text>
                        <text x="280" y="140" textAnchor="start" className="text-[10px]" fill="#64748b">המסה הקריטית</text>

                        {/* Lead */}
                        <path d="M 30 160 L 270 160 L 300 210 L 0 210 Z" fill="#fee2e2" stroke="#ef4444" strokeWidth="2" />
                        <text x="150" y="190" textAnchor="middle" className="text-xs font-bold" fill="#991b1b">עופרת</text>
                        <text x="310" y="190" textAnchor="start" className="text-[10px]" fill="#64748b">מפסידים</text>
                    </svg>
                </div>
            );

        case 'COMPETITION_LEVELS':
            return (
                <div className={baseClass}>
                    <h4 className="text-center font-bold text-slate-700 mb-4">ארבע רמות התחרות</h4>
                    <svg viewBox="0 0 300 300" className="w-full">
                        <circle cx="150" cy="150" r="140" fill="#f8fafc" stroke="#94a3b8" strokeDasharray="4" />
                        <text x="150" y="30" textAnchor="middle" className="text-xs font-bold" fill="#64748b">תקציב (הארנק)</text>

                        <circle cx="150" cy="150" r="100" fill="#e2e8f0" stroke="#64748b" />
                        <text x="150" y="70" textAnchor="middle" className="text-xs font-bold" fill="#475569">כללית (הצורך)</text>

                        <circle cx="150" cy="150" r="60" fill="#cbd5e1" stroke="#334155" />
                        <text x="150" y="110" textAnchor="middle" className="text-xs font-bold" fill="#1e293b">קטגוריה</text>

                        <circle cx="150" cy="150" r="30" fill="#3b82f6" stroke="#1d4ed8" />
                        <text x="150" y="155" textAnchor="middle" className="text-xs font-bold" fill="white">מותג</text>
                    </svg>
                </div>
            );

        case 'PERCEPTUAL_MAP':
            return (
                <div className={baseClass}>
                    <h4 className="text-center font-bold text-slate-700 mb-4">מפה תפיסתית: שוק הרכב (דוגמה)</h4>
                    <svg viewBox="0 0 300 200" className="w-full bg-slate-50 rounded border border-slate-100">
                        {/* Axes */}
                        <line x1="20" y1="100" x2="280" y2="100" stroke="#94a3b8" strokeWidth="2" />
                        <line x1="150" y1="20" x2="150" y2="180" stroke="#94a3b8" strokeWidth="2" />

                        {/* Labels */}
                        <text x="280" y="100" textAnchor="end" dy="-5" className="text-[10px]" fill="#64748b">יוקרה/מחיר גבוה</text>
                        <text x="20" y="100" textAnchor="start" dy="-5" className="text-[10px]" fill="#64748b">עממי/זול</text>
                        <text x="150" y="20" textAnchor="middle" dx="5" className="text-[10px]" fill="#64748b">ספורטיבי</text>
                        <text x="150" y="180" textAnchor="middle" dx="5" dy="10" className="text-[10px]" fill="#64748b">משפחתי/שמרני</text>

                        {/* Brands */}
                        <circle cx="240" cy="40" r="5" fill="#ef4444" />
                        <text x="240" y="30" textAnchor="middle" className="text-[10px] font-bold" fill="#ef4444">BMW</text>

                        <circle cx="230" cy="150" r="5" fill="#3b82f6" />
                        <text x="230" y="140" textAnchor="middle" className="text-[10px] font-bold" fill="#3b82f6">Mercedes</text>

                        <circle cx="60" cy="140" r="5" fill="#10b981" />
                        <text x="60" y="130" textAnchor="middle" className="text-[10px] font-bold" fill="#10b981">Toyota</text>

                        <circle cx="100" cy="50" r="5" fill="#f59e0b" />
                        <text x="100" y="40" textAnchor="middle" className="text-[10px] font-bold" fill="#f59e0b">Mazda</text>
                    </svg>
                </div>
            );

        case 'IMPORTANCE_PERFORMANCE':
            return (
                <div className={baseClass}>
                    <h4 className="text-center font-bold text-slate-700 mb-4">מפת חשיבות-תפקוד (תיעדוף)</h4>
                    <svg viewBox="0 0 300 300" className="w-full bg-slate-50 rounded border border-slate-100">
                        {/* Background colors for quadrants */}
                        <rect x="20" y="20" width="130" height="130" fill="#fee2e2" opacity="0.3" /> {/* Top Left - Critical */}
                        <rect x="150" y="20" width="130" height="130" fill="#dcfce7" opacity="0.3" /> {/* Top Right - Keep Up */}
                        <rect x="20" y="150" width="130" height="130" fill="#f1f5f9" opacity="0.3" /> {/* Bottom Left - Low Prio */}
                        <rect x="150" y="150" width="130" height="130" fill="#fef9c3" opacity="0.3" /> {/* Bottom Right - Overkill */}

                        {/* Axes */}
                        <line x1="20" y1="150" x2="280" y2="150" stroke="#334155" strokeWidth="2" />
                        <line x1="150" y1="20" x2="150" y2="280" stroke="#334155" strokeWidth="2" />

                        {/* Axis Labels */}
                        <text x="280" y="150" textAnchor="end" dy="-10" className="text-xs font-bold" fill="#334155">ביצוע גבוה</text>
                        <text x="20" y="150" textAnchor="start" dy="-10" className="text-xs font-bold" fill="#334155">ביצוע נמוך</text>
                        <text x="150" y="20" textAnchor="middle" dx="10" className="text-xs font-bold" fill="#334155">חשיבות גבוהה</text>
                        <text x="150" y="280" textAnchor="middle" dx="10" dy="-5" className="text-xs font-bold" fill="#334155">חשיבות נמוכה</text>

                        {/* Quadrant Labels */}
                        <text x="85" y="85" textAnchor="middle" className="text-xs font-bold" fill="#991b1b">שיפור קריטי</text>
                        <text x="215" y="85" textAnchor="middle" className="text-xs font-bold" fill="#166534">שימור חוזקות</text>
                        <text x="85" y="215" textAnchor="middle" className="text-xs font-bold" fill="#64748b">עדיפות נמוכה</text>
                        <text x="215" y="215" textAnchor="middle" className="text-xs font-bold" fill="#854d0e">השקעת יתר</text>
                    </svg>
                </div>
            );

        case 'PRICING_THERMOMETER':
            return (
                <div className={baseClass}>
                    <h4 className="text-center font-bold text-slate-700 mb-4">מדחום המחרת ערך</h4>
                    <div className="flex items-center justify-center gap-4">
                        <div className="w-16 h-48 bg-gradient-to-t from-slate-200 via-blue-200 to-green-200 rounded-full border border-slate-300 relative">
                            {/* Levels lines */}
                            <div className="absolute bottom-10 left-0 right-0 border-t-2 border-dashed border-slate-600"></div>
                            <div className="absolute top-20 left-0 right-0 border-t-2 border-dashed border-blue-600"></div>
                            <div className="absolute top-5 left-0 right-0 border-t-2 border-dashed border-green-600"></div>
                        </div>
                        <div className="h-48 flex flex-col justify-between py-2 text-sm">
                            <div className="text-green-700 font-bold">TEV (ערך אקונומי אמיתי)</div>
                            <div className="text-blue-700 font-bold">ערך נתפס (תקרה)</div>
                            <div className="text-slate-500 font-bold">מחיר המוצר</div>
                            <div className="text-red-700 font-bold">COGS (עלות - רצפה)</div>
                        </div>
                    </div>
                </div>
            );

        case 'BAV_MODEL':
            return (
                <div className={baseClass}>
                    <h4 className="text-center font-bold text-slate-700 mb-4">מודל BAV: רשת הכוח (Power Grid)</h4>
                    <svg viewBox="0 0 300 300" className="w-full bg-slate-50 rounded border border-slate-100">
                        {/* Quadrants */}
                        <rect x="20" y="20" width="130" height="130" fill="#dcfce7" opacity="0.3" /> {/* Top Left - Momentum/Niche */}
                        <rect x="150" y="20" width="130" height="130" fill="#dbeafe" opacity="0.3" /> {/* Top Right - Leadership */}
                        <rect x="20" y="150" width="130" height="130" fill="#f1f5f9" opacity="0.3" /> {/* Bottom Left - New/Unknown */}
                        <rect x="150" y="150" width="130" height="130" fill="#fee2e2" opacity="0.3" /> {/* Bottom Right - Erosion */}

                        {/* Axes */}
                        <line x1="20" y1="150" x2="280" y2="150" stroke="#334155" strokeWidth="2" markerEnd="url(#arrow-right)" />
                        <line x1="150" y1="280" x2="150" y2="20" stroke="#334155" strokeWidth="2" markerEnd="url(#arrow-up)" />

                        {/* Labels */}
                        <text x="280" y="170" textAnchor="end" className="text-[10px] font-bold" fill="#334155">מעמד מותג (Stature)</text>
                        <text x="280" y="185" textAnchor="end" className="text-[9px]" fill="#64748b">(הערכה + ידע)</text>

                        <text x="140" y="20" textAnchor="end" className="text-[10px] font-bold" fill="#334155">חוזק מותג (Strength)</text>
                        <text x="140" y="35" textAnchor="end" className="text-[9px]" fill="#64748b">(בידול + רלוונטיות)</text>

                        {/* Quadrant Titles */}
                        <text x="85" y="85" textAnchor="middle" className="text-xs font-bold" fill="#166534">מומנטום/נישה</text>
                        <text x="215" y="85" textAnchor="middle" className="text-xs font-bold" fill="#1e40af">מנהיגות</text>
                        <text x="85" y="215" textAnchor="middle" className="text-xs font-bold" fill="#64748b">חדש/לא ידוע</text>
                        <text x="215" y="215" textAnchor="middle" className="text-xs font-bold" fill="#991b1b">שחיקה/דעיכה</text>

                        <defs>
                            <marker id="arrow-right" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                                <polygon points="0 0, 10 3.5, 0 7" fill="#334155" />
                            </marker>
                            <marker id="arrow-up" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                                <polygon points="0 0, 10 3.5, 0 7" fill="#334155" />
                            </marker>
                        </defs>
                    </svg>
                </div>
            );

        case 'BRAND_HIERARCHY':
            return (
                <div className={baseClass}>
                    <h4 className="text-center font-bold text-slate-700 mb-4">היררכיית מותגים</h4>
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-full bg-slate-800 text-white p-3 rounded-lg text-center shadow-md">
                            <div className="font-bold text-sm">מותג חברה (Corporate)</div>
                            <div className="text-xs text-slate-300">"שטראוס גרופ"</div>
                        </div>
                        <div className="w-0.5 h-4 bg-slate-300"></div>
                        <div className="w-3/4 bg-blue-600 text-white p-3 rounded-lg text-center shadow-md">
                            <div className="font-bold text-sm">משפחת מותגים (Family)</div>
                            <div className="text-xs text-blue-200">"עלית"</div>
                        </div>
                        <div className="w-0.5 h-4 bg-slate-300"></div>
                        <div className="w-1/2 bg-indigo-500 text-white p-3 rounded-lg text-center shadow-md">
                            <div className="font-bold text-sm">מותג בודד (Individual)</div>
                            <div className="text-xs text-indigo-200">"שוקולד פרה"</div>
                        </div>
                        <div className="w-0.5 h-4 bg-slate-300"></div>
                        <div className="w-1/3 bg-slate-100 text-slate-700 border border-slate-300 p-2 rounded-lg text-center text-xs">
                            <div className="font-bold">פריט (Modifier)</div>
                            <div>"מריר 70%"</div>
                        </div>
                    </div>
                </div>
            );

        default:
            return null;
    }
};

/**
 * ---------------------------------------------------------------------
 * DATA SECTION
 * ---------------------------------------------------------------------
 */

// 1. COURSE MAP (Sidebar Menu)
const COURSE_STRUCTURE = [
    {
        category: "יסודות ואסטרטגיה",
        topics: [
            { id: "intro_marketing", title: "מבוא והתפתחות החשיבה" },
            { id: "customer_value", title: "ערך ללקוח (Customer Value)" },
            { id: "segmentation", title: "פילוח שוק (Segmentation)" },
            { id: "targeting_clv", title: "שוק מטרה ו-CLV" },
            { id: "positioning", title: "ניתוח תחרות ומיצוב" }
        ]
    },
    {
        category: "ניהול המותג וההצעה",
        topics: [
            { id: "product_decisions", title: "החלטות מוצר" },
            { id: "brand_decisions", title: "החלטות מותג" },
            { id: "pricing_decisions", title: "החלטות המחרה" }
        ]
    }
];

// 2. CONTENT DATABASE
const CONTENT_DB = {
    "intro_marketing": {
        title: "מבוא והתפתחות החשיבה השיווקית",
        phaseA: {
            scenario: "חברת 'פילם-טק' שלטה בשוק הצילום במשך עשורים בזכות סרטי הצילום האיכותיים שלה. כשהחלו להופיע מצלמות דיגיטליות, המהנדסים של פילם-טק זלזלו בהן: 'האיכות גרועה, הלקוחות שלנו אוהבים לפתח תמונות'. החברה המשיכה לשפר את הכימיה של סרטי הצילום שלה, אך פשטה רגל תוך 5 שנים.",
            question: "מדוע נכשלה החברה למרות שהמוצר שלה היה האיכותי ביותר בשוק?",
            reveal: "החברה פעלה בגישה **ממוקדת מוצר (Product Centric)** במקום **ממוקדת לקוח (Customer Centric)**. הלקוחות לא חיפשו 'סרט צילום', הם חיפשו 'לשמור זיכרונות'. הטכנולוגיה השתנתה, אך הצורך נשאר."
        },
        phaseB: {
            theory: `
### מבוא: שיווק כחליפין של ערך (Exchange of Value)
בראייה ניהולית רחבה, שיווק מוגדר כתהליך שמטרתו היא חליפין של ערך. במסגרת תהליך זה, מתבצעת החלפה דו-כיוונית: הפירמה נותנת ערך לצרכן (מוצר, שירות, מותג), והצרכן נותן ערך לחברה (כסף, נאמנות, מידע).
כדי שחליפין של ערך יתקיים לאורך זמן, חייב להיווצר שיווי משקל תפיסתי מיוחד: כל צד צריך להרגיש שהוא קיבל יותר ממה שהוא נתן. זהו מצב של **Win-Win סובייקטיבי**.

[DIAGRAM: VALUE_EXCHANGE]

### הגדרת ערך (Value)
הערך מוגדר בצורה הפשוטה ביותר כמשוואה: **תועלת פחות עלות**.
* **תועלת:** אינה רק פונקציונלית, אלא סך כל התועלות שהצרכן מפיק, כגון הנאה, נוחות, מענה על צורך או תועלת פסיכולוגית.
* **עלות:** אינה רק המחיר הכספי, אלא "סל של עלויות" הכולל זמן, מאמץ פיזי ומנטלי שהצרכן משקיע.

### חמש ההחלטות הניהוליות
כדי לנהל את תהליך חליפין הערך, מנהלים צריכים לקבל החלטות בחמש קבוצות עיקריות:
1. **עם מי? (With Whom):** ההחלטה הראשונה והקריטית ביותר. עם מי החברה רוצה להחליף ערך? זה כולל פילוח שוק, בחירת שוק מטרה ומיקוד בלקוחות ספציפיים.
2. **מה? (What):** איזה ערך מחליפים? החלטות הקשורות למוצר, למותג, לייחודיות ולערך המוסף.
3. **בכמה? (How Much):** החלטות המחרה – כמה עולה לצרכן וכמה החברה מרוויחה.
4. **איפה? (Where):** החלטות הפצה – היכן מתבצע החליפין (פיזי, אונליין, חנויות מתמחות וכו').
5. **איך? (How):** תקשורת שיווקית – איך מתקשרים את הערך ללקוח.
ההחלטה **"עם מי"** נחשבת לבעלת משקל רב, שכן היא משפיעה על כל שאר ההחלטות ועל יכולת החברה לבנות קשרים ארוכי טווח.

### התפתחות החשיבה השיווקית
מטרת הפירמה נותרה קבועה לאורך השנים: **מקסום רווחים**. עם זאת, הדרך להשיג מטרה זו והמנגנון שמניע אותה השתנו מהותית – ממיקוד במוצר למיקוד בלקוח.

### 1. הגישה הממוקדת מוצר (Product Centric)
גישה זו שלטה עד לפני כ-30-50 שנה ועדיין נפוצה היום.
* **הנחת היסוד:** כדי למקסם רווחים, יש להגדיל את נתח השוק (Market Share).
* **אסטרטגיה:** למכור כמה שיותר מוצרים לכמה שיותר לקוחות. הצמיחה מושגת דרך המוצר – הרחבת קווי מוצרים ופנייה לכלל השוק.
* **מבנה ארגוני:** מוכוון מוצר. החברה מחולקת לחטיבות לפי סוגי מוצרים (למשל, חטיבת חיתולים וחטיבת מוצרי ניקוי), כך שלקוח אחד עשוי להיות מטופל על ידי יחידות שונות שאינן מתקשרות ביניהן.
* **יתרון תחרותי:** מומחיות במוצר – ייצור המוצר הטוב ביותר במחיר האטרקטיבי ביותר.

### 2. הגורמים לשינוי הגישה
בשנות ה-90 החלו להופיע "סדקים" בגישת המוצר, בעקבות ארבעה תהליכים מרכזיים:
1. **קומודיטיזציה (Commoditization):** המוצרים בשוק הפכו דומים מאוד זה לזה באיכותם וביכולותיהם. כשכל החברות מצטיינות בייצור, קשה להשיג יתרון תחרותי המבוסס על המוצר בלבד.
2. **דרגולציה (Deregulation):** צמצום הרגולציה והפיקוח אפשר למתחרים להעתיק מוצרים בקלות ולהציף את השוק, מה ששחק את היתרון של מוצרים ייחודיים.
3. **כלכלת שירותים:** הלקוחות הפסיקו להסכים לסרבול של ארגונים מוכווני-מוצר. הם דרשו פתרון הוליסטי וטיפול אחוד בצרכיהם, במקום להתנהל מול מחלקות נפרדות עבור כל מוצר.
4. **טכנולוגיה ודאטה:** היכולת הטכנולוגית לאסוף ולשמור נתונים ברמת הלקוח הבודד (ולא רק ברמת המוצר) אפשרה לחברות להבין מי הלקוחות שלהן ולנהל איתם קשר אישי.

### 3. הגישה הממוקדת לקוח (Customer Centric)
בעקבות השינויים, עבר המוקד מהמוצר ללקוח.
* **הנחת היסוד:** הלקוח הוא המפתח לרווחיות. לא כל הלקוחות שווים – יש לקוחות רווחיים ויש כאלה שלא.
* **אסטרטגיה:** הבחנה בין לקוחות (Differentiation). החברה אומרת "כן" ללקוחות רווחיים ו"לא" ללקוחות שאינם רווחיים. הדגש עובר ממקסום נתח שוק לפיתוח מערכות יחסים ארוכות טווח עם הלקוחות הנכונים.
* **מבנה ארגוני:** מוכוון לקוח. התמחות בלקוחות ולא במוצרים (למשל, חלוקה ל"משפחות", "לקוחות עסקיים", "צעירים").
* **יתרון תחרותי:** נובע מהיכרות עמוקה ומומחיות בלקוח, מה שיוצר נאמנות גבוהה ("לקוחות הולכים אחרי המומחה").

### לסיכום
בעוד שמטרת העל נותרה מקסום רווחים, המעבר לגישה ממוקדת לקוח שינה את המיקוד הניהולי: במקום לחפש מוצרים חדשים לכלל השוק, החברות מחפשות את הלקוחות הנכונים ומנסות להתאים להם את הפתרונות המדויקים ביותר לאורך זמן.
      `,
            highlights: ["Exchange of Value", "Win-Win", "תועלת - עלות", "5 ההחלטות הניהוליות", "Product Centric", "Customer Centric", "קומודיטיזציה"]
        },
        phaseC: [
            {
                level: "בדיקת הבנה",
                question: "מהי ההגדרה הבסיסית של 'ערך' בשיווק?",
                options: [
                    { id: 1, text: "המחיר הנמוך ביותר בשוק ביחס למתחרים בקטגוריה", correct: false, feedback: "המחיר הוא רק מרכיב אחד של העלות, ואינו משקף את התמונה המלאה." },
                    { id: 2, text: "ההפרש בין סך התועלות שהלקוח מקבל לבין סך העלויות שהוא משקיע", correct: true },
                    { id: 3, text: "היכולת של החברה לייצר מוצר איכותי בעלות נמוכה לאורך זמן", correct: false, feedback: "זהו מדד ליעילות תפעולית של החברה, לא לערך שהלקוח מקבל." }
                ]
            },
            {
                level: "המלכודת",
                question: "חברה מחליטה להוסיף פיצ'ר טכנולוגי מתקדם למוצר שלה כי 'המהנדסים הצליחו לפתח אותו בזול'. איזו גישה זו משקפת?",
                options: [
                    { id: 1, text: "גישה ממוקדת לקוח (Customer Centric), כיוון שהיא מעניקה לו יותר תכונות באותו מחיר", correct: false, feedback: "לא בהכרח. אם הלקוח לא צריך את זה, זה לא נחשב ערך." },
                    { id: 2, text: "גישה ממוקדת מוצר (Product Centric), המניחה ששיפור טכנולוגי שווה ערך ללקוח באופן אוטומטי", correct: true },
                    { id: 3, text: "גישה של קומודיטיזציה (Commoditization), הנובעת מהצורך להתחרות במוצרים דומים בשוק", correct: false, feedback: "קומודיטיזציה היא מצב שוק, לא החלטה ניהולית כזו." }
                ]
            },
            {
                level: "שליטה",
                question: "כיצד השימוש בנתונים (Data) תורם למעבר לגישה ממוקדת לקוח?",
                options: [
                    { id: 1, text: "הוא מאפשר לייעל את קווי הייצור ולהוזיל את עלויות המכר (COGS) בצורה משמעותית", correct: false, feedback: "זה נכון תפעולית, אך לא המהות של מיקוד בלקוח." },
                    { id: 2, text: "הוא מאפשר לזהות צרכים אישיים ולהתאים פתרונות ספציפיים (Personalization) לכל לקוח בנפרד", correct: true },
                    { id: 3, text: "הוא עוזר למנהלים להתמקד במוצרים הרווחיים ביותר (Product Portfolio) ולהפסיק לייצר מוצרים מפסידים", correct: false, feedback: "זה חלק מניהול פורטפוליו, אך המיקוד האמיתי בלקוח הוא בהתאמה האישית." }
                ]
            }
        ],
        test: [
            {
                question: "מהי הנוסחה הבסיסית להגדרת 'ערך' (Value) בעיני הצרכן?",
                options: [
                    { id: 1, text: "תועלת (Benefits) פחות עלות (Cost)", correct: true },
                    { id: 2, text: "מחיר המכירה (Price) פחות עלות הייצור (Production Cost)", correct: false },
                    { id: 3, text: "איכות המוצר (Quality) חלקי המחיר לצרכן (Price)", correct: false },
                    { id: 4, text: "סך כל התכונות הפונקציונליות (Features) במוצר", correct: false }
                ]
            },
            {
                question: "איזו מבין חמש ההחלטות הניהוליות נחשבת לקריטית ביותר ומשפיעה על כל השאר?",
                options: [
                    { id: 1, text: "בכמה? (How Much - החלטות המחרה ורווחיות)", correct: false },
                    { id: 2, text: "עם מי? (With Whom - בחירת שוק המטרה והלקוחות)", correct: true },
                    { id: 3, text: "איך? (How - בניית הקמפיין והתקשורת השיווקית)", correct: false },
                    { id: 4, text: "איפה? (Where - בחירת ערוצי ההפצה והמכירה)", correct: false }
                ]
            },
            {
                question: "מה היה המאפיין הבולט של הגישה הממוקדת מוצר (Product Centric)?",
                options: [
                    { id: 1, text: "התמקדות בשימור לקוחות (Retention) לאורך זמן ובניית נאמנות", correct: false },
                    { id: 2, text: "שאיפה להגדלת נתח שוק (Market Share) דרך מכירה המונית", correct: true },
                    { id: 3, text: "התאמה אישית (Customization) של מוצרים לצרכים הייחודיים של כל לקוח", correct: false },
                    { id: 4, text: "ארגון המחלקות בחברה סביב פלחי הלקוחות (Segments) השונים", correct: false }
                ]
            },
            {
                question: "מהי קומודיטיזציה (Commoditization) וכיצד היא השפיעה על השיווק?",
                options: [
                    { id: 1, text: "תהליך שבו מוצרים הופכים דומים מאוד זה לזה, מה שמקשה על הבידול (Differentiation)", correct: true },
                    { id: 2, text: "עלייה חדה במחירי חומרי הגלם שחייבה העלאת מחירים (Price Hike) לצרכן", correct: false },
                    { id: 3, text: "מעבר לייצור במדינות מתפתחות (Outsourcing) כדי להוזיל את עלויות העבודה", correct: false },
                    { id: 4, text: "ירידה בביקוש (Demand Drop) למוצרים ושירותים בעקבות משבר כלכלי עולמי", correct: false }
                ]
            },
            {
                question: "מהו העיקרון המנחה המרכזי בגישה הממוקדת לקוח (Customer Centric)?",
                options: [
                    { id: 1, text: "כל הלקוחות שווים (Equality) וצריך לתת שירות מצוין לכולם באותה מידה", correct: false },
                    { id: 2, text: "המוצר הוא המרכז והלקוח צריך להבין את היתרונות הטכנולוגיים (Specs) שלו", correct: false },
                    { id: 3, text: "יש שונות בין לקוחות ברווחיות (Profitability), ולכן יש לבחור במי להשקיע", correct: true },
                    { id: 4, text: "המטרה העיקרית היא למקסם את הרווח מכל עסקה בודדת (Transaction) באופן מיידי", correct: false }
                ]
            },
            {
                question: "מהו התנאי ההכרחי לקיום חליפין של ערך (Exchange) לאורך זמן?",
                options: [
                    { id: 1, text: "החברה חייבת להפסיד קצת בטווח הקצר כדי שהלקוח ירוויח בטווח הארוך (Long Term)", correct: false },
                    { id: 2, text: "תחושת Win-Win סובייקטיבית אצל שני הצדדים המעורבים בעסקה", correct: true },
                    { id: 3, text: "המחיר לצרכן (Price) חייב להיות הנמוך ביותר בהשוואה לכל המתחרים בשוק", correct: false },
                    { id: 4, text: "המוצר חייב להיות הטוב ביותר מבחינה טכנולוגית (State of the Art) ללא פשרות", correct: false }
                ]
            }
        ]
    },

    "customer_value": {
        title: "ערך ללקוח (Customer Value)",
        phaseA: {
            scenario: "דני קונה שעון יוקרה ב-50,000 ש\"ח, למרות שהשעון בטלפון שלו מדויק יותר. רונית קונה אותו שעון בדיוק, אבל רק כי הוא עמיד למים עד 100 מטר והיא צוללנית. יוסי קונה את השעון כי הוא יודע שאם ירצה למכור אותו בעתיד, הערך שלו יישמר.",
            question: "שלושתם קנו את אותו המוצר. האם הם קנו את אותו 'ערך'?",
            reveal: "לא. כל אחד חיפש סוג ערך אחר: דני חיפש **ערך סימבולי** (סטטוס), רונית חיפשה **ערך פונקציונלי** (עמידות למים), ויוסי חיפש **ערך כלכלי/שימור**."
        },
        phaseB: {
            theory: `
### מבוא: מהו ערך ללקוח?
ערך ללקוח מוגדר כהפרש בין סך התועלות (Benefits) שהלקוח מקבל מהמוצר או השירות לבין סך העלויות (Costs) הכרוכות בהשגתו. התועלות אינן רק פיזיות אלא גם פסיכולוגיות וסוציולוגיות, והן נובעות לא רק מהצריכה עצמה אלא גם מהרכישה והבעלות. העלויות כוללות לא רק כסף, אלא גם זמן, מאמץ ואי-נוחות.
**הדגש הקריטי:** מדובר בתפיסה סובייקטיבית. הערך האובייקטיבי פחות חשוב; מה שקובע הוא כיצד הצרכן תופס את הערך שהוא מקבל ביחס למה שהוא נותן. כדי שתהיה עסקת חליפין (Exchange), הצרכן צריך להרגיש שהוא מקבל ערך גבוה יותר מהמחיר שהוא משלם.

### שלושת סוגי הערך (Customer Value Drivers)
נהוג לחלק את הערך שהצרכן תופס לשלושה סוגים עיקריים: ערך פונקציונלי, ערך סימבולי וערך שימור.

#### 1. ערך פונקציונלי (Functional Value)
מתייחס להערכת הצרכן את הביצועים (Performance) של המוצר או השירות. זהו המימד התכליתי והפרקטי ביותר.
* **איכות (Quality):** האם המוצר עובד טוב? האם הוא עמיד? (למשל, ג'ינס של Levi's או מעיל של פטגוניה).
* **נוחות (Convenience):** כמה קל ונוח לרכוש ולהשתמש במוצר? (למשל, בנק המדגיש שירות דיגיטלי, או אתר המרכז מוצרים).
* **מחיר (Price):** עד כמה המחיר אטרקטיבי ביחס לתמורה? (לרוב מחיר נמוך מעלה ערך, אך ביוקרה מחיר גבוה מאותת איכות).
* **מתי קריטי?** כאשר יש יתרון ביצועי מובהק, בשוקי B2B, או במוצרי חיפוש (Search Goods).

#### 2. ערך סימבולי (Symbolic Value)
זהו ערך רגשי ופסיכולוגי. הוא עוסק בשאלה: "מה המוצר גורם לי להרגיש?" או "מה השימוש במוצר אומר עליי?".
* **רגשות וסגנון חיים:** מוצרים המקושרים לחוויות, שמחה או "טירוף" (למשל, "פנטה בטירוף שלנו").
* **זהות ושייכות:** השימוש במוצר מאפשר לצרכן להגדיר את עצמו או להשתייך לקבוצה חברתית.
* **מערכות יחסים עם מותגים:** הצרכנים מפתחים קשרים רגשיים עם מותגים (למשל: "חברי ילדות" כמו במבה, או "רומנים אסורים").
* **מתי קריטי?** כאשר אין הבדלים פונקציונליים משמעותיים (קוקה-קולה מול פפסי), במוצרי התנסות (Experience Goods) כמו מלון, או במצבים של מעורבות נמוכה ("מהבטן").

#### 3. ערך שימור (Retention Value)
ערך שהצרכן מקבל מעצם המשך היחסים עם החברה לאורך זמן. המאפיין המרכזי הוא **תועלת דחויה (Delayed Utility)** – הערך מתקבל בעתיד.
* **תוכניות נאמנות:** צבירת נקודות או "מיילים" למימוש עתידי.
* **חסמי מעבר ונוחות נצברת:** אתר שזוכר את פרטי המשלוח וההעדפות חוסך זמן בקנייה הבאה.
* **יחס מיוחד וקהילה:** יחס אישי ללקוח ותיק או שייכות לקהילה אקסקלוסיבית.
* **התוצאה:** ללקוח "לא משתלם" לעזוב, כי הוא יאבד זכויות או נוחות שצבר.

### המודל הלינארי המפצה (Compensatory Model)
כדי לכמת את תפיסת הערך, משתמשים בפונקציית התועלת המבוססת על המודל הלינארי המפצה. המודל נקרא "מפצה" כי חיסרון בתכונה אחת יכול להיות "מפוצה" על ידי יתרון בתכונה אחרת.

**נוסחת התועלת והפרמטרים:**
$$ Total Utility = \\sum (W \\times B) $$
התועלת הכללית מורכבת מסכום של "שווי חלקים", כאשר לכל תכונה יש שני פרמטרים:
1. **B (תפיסת הביצוע / Score):** הציון הסובייקטיבי שהצרכן נותן לביצועים של המוצר בתכונה מסוימת.
2. **W (חשיבות התכונה / Weight):** המשקל או החשיבות שהצרכן מייחס לתכונה זו בהחלטת הקנייה. פרמטר שהצרכן "מביא מהבית".

האתגר המרכזי הוא לחלץ את ה-W (חשיבות), לרוב באמצעות שיטות מחקר כמו **Conjoint Analysis**.
      `,
            highlights: ["ערך פונקציונלי", "ערך סימבולי", "ערך שימור", "מודל מפצה", "W ו-B"]
        },
        phaseC: [
            {
                level: "בדיקת הבנה",
                question: "קניית תיק של לואי ויטון כדי להרגיש שייך למעמד העליון היא דוגמה ל:",
                options: [
                    { id: 1, text: "ערך פונקציונלי (Functional Value), שכן התיק עשוי מחומרים עמידים ומחזיק מעמד שנים רבות", correct: false, feedback: "אמנם האיכות קיימת, אבל המניע העיקרי שתואר הוא תחושת השייכות והסטטוס." },
                    { id: 2, text: "ערך סימבולי (Symbolic Value), הנובע מהסטטוס החברתי ותחושת השייכות שהמותג מעניק", correct: true },
                    { id: 3, text: "ערך שימור (Retention Value), כי הקנייה יוצרת מחויבות למותג ומעודדת קנייה חוזרת", correct: false, feedback: "ערך שימור מתייחס לתועלת עתידית, כמו נקודות, ולא לרגש הנוכחי." }
                ]
            },
            {
                level: "יישום",
                question: "לפי המודל המפצה (Compensatory Model), אם למסעדה יש אוכל בינוני (ציון נמוך) אבל מיקום מעולה (ציון גבוה), והלקוח מייחס למיקום חשיבות כפולה - האם הוא יבחר בה?",
                options: [
                    { id: 1, text: "לא, כי האוכל הוא הפרמטר החשוב ביותר (Core Product) במסעדה באופן אובייקטיבי", correct: false, feedback: "במודל המפצה, אין 'אובייקטיבי'. הכל תלוי במשקולות (W) של הלקוח הספציפי." },
                    { id: 2, text: "כן, הציון המשוקלל (Weighted Score) עשוי להיות גבוה מספיק בזכות המשקל הגבוה של המיקום", correct: true },
                    { id: 3, text: "זה תלוי אך ורק במחיר המנה (Price) ביחס למתחרים באזור הגאוגרפי", correct: false, feedback: "המחיר הוא רק עוד תכונה במודל, לא הגורם הבלעדי." }
                ]
            }
        ],
        test: [
            {
                question: "מותג קפה פרימיום משיק קו מוצרים 'ירוק' ומדגיש סחר הוגן ושמירה על הסביבה. איזה סוג ערך הוא מדגיש בעיקר?",
                options: [
                    { id: 1, text: "ערך פונקציונלי (Functional Value) - הקפה טעים יותר ואיכותי יותר", correct: false },
                    { id: 2, text: "ערך סימבולי (Symbolic Value) - תחושת מצפון, ערכיות וזהות עצמית", correct: true },
                    { id: 3, text: "ערך שימור (Retention Value) - הלקוח יחזור בגלל מועדון הלקוחות", correct: false },
                    { id: 4, text: "גם פונקציונלי וגם שימור במידה שווה, ללא הבדל", correct: false }
                ]
            },
            {
                question: "לחברה המספקת ארוחות יש 3 פלחים. איזה מהם צפוי להיות בעל ה-CLV הגבוה ביותר?",
                options: [
                    { id: 1, text: "פלח א' (הייטק) - משלמים פרמיה גבוהה אך מחליפים ספקים תדיר (Low Retention)", correct: false },
                    { id: 2, text: "פלח ב' (משפחות) - קונים בתדירות גבוהה אך רגישים מאוד למחיר (Price Sensitive)", correct: false },
                    { id: 3, text: "פלח ג' (מתעמלים) - קונים בקביעות ושומרים אמונים לאורך זמן (High Retention)", correct: true },
                    { id: 4, text: "אין הבדל מהותי, הערך זהה לכל הלקוחות בשוק הארוחות", correct: false }
                ]
            },
            {
                question: "יצרן יין עבר לפקק הברגה (נתפס פחות איכותי). לפי המודל המפצה, איך כדאי לפצות על הירידה בערך?",
                options: [
                    { id: 1, text: "להתעלם מהשינוי ולהמשיך לשווק כרגיל ללא התייחסות", correct: false },
                    { id: 2, text: "להוריד מחיר (שיפור ציון המחיר B) כדי שהתועלת הכוללת (Total Utility) תישמר", correct: true },
                    { id: 3, text: "להעלות מחיר כדי לאותת על יוקרה למרות הפקק הפשוט", correct: false },
                    { id: 4, text: "לנסות לשכנע את הלקוחות שהפקק לא חשוב (שינוי ה-Weight - W)", correct: false }
                ]
            },
            {
                question: "אתר איקומרס שומר את פרטי המשלוח והאשראי לנוחות בקנייה הבאה. איזה סוג ערך זה מייצר?",
                options: [
                    { id: 1, text: "ערך פונקציונלי (Functional) הקשור לביצועי המוצר עצמו ולמפרט הטכני", correct: false },
                    { id: 2, text: "ערך סימבולי (Symbolic) הקשור לסטטוס החברתי של הלקוח באתר", correct: false },
                    { id: 3, text: "ערך שימור (Retention Value) הנובע מנוחות, חיסכון בזמן וחסמי מעבר", correct: true },
                    { id: 4, text: "ערך כספי ישיר (Monetary Value) כמו הנחה במחיר הקנייה", correct: false }
                ]
            },
            {
                question: "בניתוח Conjoint, אם 'ארץ מוצא: אוסטרליה' קיבלה ערך גבוה יותר מצרפת עבור צרכן, והחשיבות (W) קבועה לתכונה, מה המסקנה?",
                options: [
                    { id: 1, text: "תפיסת הביצוע (Score - B) של אוסטרליה גבוהה יותר בעיני הצרכן", correct: true },
                    { id: 2, text: "החשיבות (Weight - W) של ארץ המוצר גבוהה יותר עבור הצרכן הספציפי", correct: false },
                    { id: 3, text: "היין האוסטרלי בהכרח זול יותר מהיין הצרפתי בחנויות", correct: false },
                    { id: 4, text: "הצרכן אינו מבדיל בין סוגי היינות השונים ובוחר באקראי", correct: false }
                ]
            },
            {
                question: "עבור 'מוצר חיפוש' (Search Good) כמו מכונת כביסה עם מפרט טכני ברור, באיזה ערך כדאי להתמקד בשיווק?",
                options: [
                    { id: 1, text: "ערך סימבולי (Symbolic) - רגש, זהות עצמית ושייכות חברתית", correct: false },
                    { id: 2, text: "ערך פונקציונלי (Functional) - ביצועים, מפרט טכני, אמינות ומחיר", correct: true },
                    { id: 3, text: "ערך שימור בלבד (Retention) - מועדון לקוחות וצבירת נקודות", correct: false },
                    { id: 4, text: "ערך חברתי (Social Value) - מה יגידו השכנים על המותג", correct: false }
                ]
            }
        ]
    },

    "segmentation": {
        title: "פילוח שוק (Segmentation)",
        phaseA: {
            scenario: "רשת בתי קפה החליטה לצאת במבצע 'קפה חינם לסטודנטים בין 8:00-10:00'. לאחר חודש התברר שהמכירות ירדו. הסיבה: אנשי עסקים (שמשלמים מחיר מלא) הפסיקו לבוא בשעות הבוקר כי המקום היה רועש ועמוס בסטודנטים.",
            question: "מה הטעות האסטרטגית של רשת בתי הקפה?",
            reveal: "כישלון ב**פילוח**. הם ניסו לפנות לפלח אחד (סטודנטים) אך פגעו בערך של פלח אחר רווחי יותר (אנשי עסקים), ללא הפרדה ברורה ביניהם."
        },
        phaseB: {
            theory: `
### הגדרה ומטרות הפילוח
פילוח שוק מוגדר כחלוקת שוק הטרוגני (מגוון) לתת-שווקים הומוגניים (אחידים). פלח שוק הוא קבוצת צרכנים בעלי מכנה משותף כלשהו המסביר הבדלים בהתנהגות הצרכנית שלהם. המטרה הכללית היא ליצור חליפין של ערך שבו שני הצדדים מרוויחים.

**שלוש מטרות מרכזיות בתהליך החלוקה:**
1. **הומוגניות תוך-קבוצתית (Intra-group homogeneity):** השאיפה היא שחברי הפלח יהיו דומים ככל האפשר זה לזה בצרכים וברצונות, כדי שניתן יהיה לפנות אליהם במסר אחיד.
2. **הטרוגניות בין-קבוצתית (Inter-group heterogeneity):** השאיפה היא שהפלחים השונים יהיו שונים זה מזה ככל האפשר, כדי להצדיק אסטרטגיות שיווק נפרדות לכל פלח.
3. **יישומיות:** המטרה היא ליצור פילוח שקל ליישם אותו בפועל.

### תהליך הפילוח (The Segmentation Process)
תהליך סיסטמטי המורכב משלושה שלבים:
1. **שלב הסקירה (Survey):** איסוף מידע רחב על כלל השוק. מתחיל במחקר איכותני לסינון משתנים, וממשיך בשאלון למדגם מייצג.
2. **שלב הניתוח (Analysis):**
   * **ניתוח גורמים (Factor Analysis):** צמצום עשרות שאלות למספר קטן של "גורמי על" (למשל, קיבוץ שאלות דומות לגורם אחד).
   * **ניתוח אשכולות (Cluster Analysis):** אלגוריתם המחלק את הצרכנים לקבוצות (אשכולות) כך שיש מינימום שונות בתוך הקבוצה ומקסימום שונות בין הקבוצות.
3. **בניית פרופילים (Profiling):** אפיון הפלחים שנוצרו (מתן שם, דמוגרפיה, התנהגות) כדי להבין לעומק מי הם האנשים בכל קבוצה.

### קריטריונים לפילוח יעיל
* **מדידות (Measurability):** היכולת למדוד גודל וכוח קנייה.
* **נגישות (Accessibility):** היכולת לבודד את הפלח ולהגיע אליו טכנית ושיווקית.
* **ניתנות לזיהוי (Identifiability):** היכולת לזהות לאיזה פלח שייך צרכן ספציפי שעומד מולנו.
* **רלוונטיות (Relevance):** המשתנה המבחין חייב להיות רלוונטי להתנהגות הקנייה.

### בסיסי פילוח והקונפליקט המרכזי
ניתן לחלק את בסיסי הפילוח ל:
* **מי (Who):** דמוגרפיה (גיל, הכנסה). קל לזיהוי.
* **מה (What):** התנהגות בפועל (קניות עבר).
* **למה (Why):** צרכים ותועלות. זהו המנבא החזק ביותר.

**הקונפליקט:** פילוח לפי **"למה"** (צרכים) הוא הכי **רלוונטי** אך הכי פחות **ניתן לזיהוי** (קשה לדעת מה הלקוח צריך ממבט בלבד). לעומת זאת, פילוח לפי **"מי"** קל לזיהוי אך פחות רלוונטי.
**הפתרון:** שילוב (התחלה בצרכים ואפיון דמוגרפי) או התמקדות ב"מה" (התנהגות) כפשרה טובה.
      `,
            highlights: ["הומוגניות והטרוגניות", "Factor & Cluster Analysis", "מדידות/נגישות/זיהוי", "הקונפליקט מי/מה/למה"]
        },
        phaseC: [
            {
                level: "בדיקת הבנה",
                question: "איזה בסיס פילוח נחשב למנבא הטוב ביותר של התנהגות עתידית, אך הקשה ביותר לזיהוי בשטח?",
                options: [
                    { id: 1, text: "פילוח גיאוגרפי (איפה) - קל למדידה אך נותן מידע מוגבל מאוד על העדפות הצרכן", correct: false, feedback: "קל למדידה אך מנבא חלש." },
                    { id: 2, text: "פילוח על בסיס צרכים ותועלות (למה) - רלוונטי מאוד אך קשה לזיהוי חיצוני", correct: true },
                    { id: 3, text: "פילוח דמוגרפי (גיל/מין) - נתונים שקל להשיג אך לא תמיד מסבירים את המניע לקנייה", correct: false, feedback: "קל למדידה אך לא תמיד מסביר למה אנשים קונים." }
                ]
            },
            {
                level: "המלכודת",
                question: "חברה מחלקת את השוק ל'נשים' ו'גברים'. האם זה פילוח יעיל?",
                options: [
                    { id: 1, text: "כן, זה מאוד מדיד (Measurable), נגיש וקל ליישום בשיווק המוני", correct: false, feedback: "זה נכון טכנית, אבל האם כל הנשים רוצות אותו דבר? חסרה הומוגניות בצרכים." },
                    { id: 2, text: "רק אם יש הבדל מובהק ורלוונטי בצרכים (Relevance) בין המינים עבור המוצר הספציפי", correct: true },
                    { id: 3, text: "לא, פילוח מגדרי נחשב למיושן (Outdated) ולא רלוונטי בעולם המודרני", correct: false, feedback: "הוא עדיין רלוונטי אם הוא מסביר שונות בהתנהגות צרכנית." }
                ]
            }
        ],
        test: [
            {
                question: "מהן שתי המטרות המרכזיות בתהליך פילוח שוק יעיל?",
                options: [
                    { id: 1, text: "הומוגניות תוך-קבוצתית (דמיון פנימי) והטרוגניות בין-קבוצתית (שוני חיצוני)", correct: true },
                    { id: 2, text: "הטרוגניות תוך-קבוצתית (גיוון פנימי) והומוגניות בין-קבוצתית (דמיון חיצוני)", correct: false },
                    { id: 3, text: "מקסום גודל הפלח ללא התחשבות בשונות, ומינימום עלויות שיווק ומכירה", correct: false },
                    { id: 4, text: "יצירת מספר רב ככל האפשר של פלחים קטנים (Micro-Segments) כדי לכסות את כל השוק", correct: false }
                ]
            },
            {
                question: "מהם שלושת השלבים העיקריים בתהליך הפילוח הסיסטמטי?",
                options: [
                    { id: 1, text: "סקירה (Survey), ניתוח סטטיסטי (Analysis), ובניית פרופילים (Profiling)", correct: true },
                    { id: 2, text: "פילוח גיאוגרפי (Geography), בחירת שוק מטרה (Targeting), וקביעת תמחור (Pricing)", correct: false },
                    { id: 3, text: "איסוף דאטה ראשוני, ביצוע מכירות בפועל ללקוחות, ושימור לקוחות (Retention)", correct: false },
                    { id: 4, text: "ניתוח מתחרים (Competitors), קביעת אסטרטגיה פרסומית, והפצה (Distribution)", correct: false }
                ]
            },
            {
                question: "מה ההבדל בין ניתוח גורמים (Factor Analysis) לניתוח אשכולות (Cluster Analysis)?",
                options: [
                    { id: 1, text: "ניתוח גורמים מצמצם משתנים/שאלות; ניתוח אשכולות מחלק אנשים לקבוצות", correct: true },
                    { id: 2, text: "ניתוח גורמים מחלק אנשים לקבוצות על בסיס דמוגרפי; ניתוח אשכולות מצמצם שאלות", correct: false },
                    { id: 3, text: "ניתוח גורמים מיועד למחקר איכותני בלבד; ניתוח אשכולות למחקר כמותי מורכב", correct: false },
                    { id: 4, text: "אין הבדל מהותי, אלו שמות נרדפים לאותו אלגוריתם סטטיסטי בסיסי", correct: false }
                ]
            },
            {
                question: "מהו התפקיד בשלב בניית הפרופילים (Profiling) בתהליך הפילוח?",
                options: [
                    { id: 1, text: "לתת שם לפלח ולאפיין אותו עמוקות באמצעות דמוגרפיה, התנהגות ופסיכוגרפיה", correct: true },
                    { id: 2, text: "להריץ את האלגוריתם הסטטיסטי שיחלק את האוכלוסייה לקבוצות שונות", correct: false },
                    { id: 3, text: "לסנן את השאלות הלא רלוונטיות בשאלון הראשוני לפני הפצתו ללקוחות", correct: false },
                    { id: 4, text: "לקבוע את המחיר הסופי לצרכן עבור כל פלח שוק שזוהה", correct: false }
                ]
            },
            {
                question: "מהם ארבעת הקריטריונים לפילוח יעיל?",
                options: [
                    { id: 1, text: "מדידות (Measurability), נגישות (Accessibility), ניתנות לזיהוי, ורלוונטיות", correct: true },
                    { id: 2, text: "רווחיות גבוהה (Profitability), צמיחה מהירה, סיכון נמוך, ותחרות מועטה", correct: false },
                    { id: 3, text: "מחיר נמוך (Low Price), איכות גבוהה, זמינות במלאי, ושירות טוב", correct: false },
                    { id: 4, text: "אמינות המותג (Reliability), מקצועיות העובדים, שירותיות, ואיכות המוצר", correct: false }
                ]
            },
            {
                question: "מהו הקונפליקט המרכזי בבחירת בסיסי פילוח (מי, מה, למה)?",
                options: [
                    { id: 1, text: "רלוונטיות (צרכים - 'למה') מול ניתנות לזיהוי ונגישות (דמוגרפיה - 'מי')", correct: true },
                    { id: 2, text: "עלות המחקר הגבוהה (Cost) מול הצורך בדיוק מירבי בתוצאות (Accuracy)", correct: false },
                    { id: 3, text: "הרצון של ההנהלה לפלח לפי מוצר מול הרצון של הלקוחות ליחס אישי", correct: false },
                    { id: 4, text: "הצורך בשיווק דיגיטלי מודרני מול שיטות שיווק מסורתיות ומיושנות", correct: false }
                ]
            },
            {
                question: "כיצד המקרה של תרופת ההרזיה 'Metabical' מדגים פתרון לקונפליקט הפילוח?",
                options: [
                    { id: 1, text: "פילוח לפי תועלת ('למה') ואפיון הפלח באמצעות דמוגרפיה ('מי') כקירוב", correct: true },
                    { id: 2, text: "ויתור מוחלט על פילוח ופנייה לכל השוק (Mass Marketing) כדי לחסוך בעלויות", correct: false },
                    { id: 3, text: "שימוש בטכנולוגיית זיהוי פנים מתקדמת כדי לאתר לקוחות פוטנציאליים ברחוב", correct: false },
                    { id: 4, text: "התמקדות בלעדית בלקוחות עשירים מאוד שיכולים להרשות לעצמם את התרופה היקרה", correct: false }
                ]
            },
            {
                question: "מדוע בסיס הפילוח של 'מה' (התנהגות) הופך למשמעותי בעידן הדיגיטלי?",
                options: [
                    { id: 1, text: "הוא קל לזיהוי דיגיטלית (עקבות דיגיטליים) ויש לו מתאם גבוה עם צרכים ('למה')", correct: true },
                    { id: 2, text: "כי אנשים הפסיקו למלא שאלונים דמוגרפיים ואי אפשר לדעת בני כמה הם", correct: false },
                    { id: 3, text: "כי זה הבסיס היחיד שחוקי להשתמש בו לפי תקנות הפרטיות החדשות (GDPR)", correct: false },
                    { id: 4, text: "כי התנהגות צרכנים היא הדבר היחיד שקבוע ולא משתנה לאורך זמן", correct: false }
                ]
            }
        ]
    },

    "targeting_clv": {
        title: "בחירת שוק מטרה ו-CLV",
        phaseA: {
            scenario: "חברת סלולר גילתה שלקוח ממוצע מכניס לה 100 ש\"ח בחודש. היא החליטה להשקיע 1200 ש\"ח כדי לגייס כל לקוח חדש, מתוך מחשבה שבשנה הראשונה תחזיר את ההשקעה. למרות זאת, החברה הפסידה כסף. הסתבר ש-50% מהלקוחות החדשים עוזבים אחרי 6 חודשים.",
            question: "איזה נתון קריטי היה חסר בחישוב של החברה?",
            reveal: "שיעור השימור (Retention Rate). החברה התעלמה מ**ערך חיי הלקוח (CLV)** וחשבה במונחים של הכנסה רגעית. אם הלקוח עוזב מהר, ההשקעה בגיוס לא מחזירה את עצמה."
        },
        phaseB: {
            theory: `
### חלק א': שיקולים בבחירת שוק מטרה
הגישה המסורתית (Top-Down) של חיזוי ביקוש לפי גודל שוק נחשבת כיום לפחות מתאימה בגלל התנודתיות והשונות הגדולה בין לקוחות. גודל השוק לבדו אינו מספר את סיפור הרווחיות.
במקום זאת, ישנם שלושה שיקולים עיקריים בקבלת החלטה על Targeting:
1. **מאפייני הפלח:** גודל הפלח, קצב הצמיחה שלו והרווחיות הצפויה ממנו.
2. **התאמת החברה (Company Fit):** האם לחברה יש את המשאבים והיכולות לספק מענה לצרכי הפלח? האם הפלח תואם למטרות ארוכות הטווח (למשל, בחירה בנישה לבניית יכולות)?
3. **תחרות:** בחינת התחרות הנוכחית והעתידית. פלח גדול וצומח עשוי למשוך מתחרים רבים ולהוביל למלחמת מחירים, ולכן לעיתים עדיף פלח קטן ("אוקיינוס כחול").

### חלק ב': מודל ערך חיי לקוח (CLV)
המעבר הוא מניתוח שוק לניתוח הלקוח הבודד.
**הגדרה:** סך הרווח המהוון שהחברה צופה לקבל מלקוח בודד בטווח הארוך (בעתיד).
**שלושת המרכיבים:**
1. **רווח תקופתי (P):** הכנסות פחות הוצאות ישירות ועקיפות.
2. **שיעור שימור (R):** ההסתברות שהלקוח יישאר בתקופה הבאה.
3. **שיעור היוון (D):** המקדם שמתרגם כסף עתידי לערכו הנוכחי (סיכון וריבית).

**הנוסחה לחישוב (לאינסוף):**
$$CLV = \\frac{P \\times R}{1 + D - R}$$
*תנאי שימוש:* הנחה שהפרמטרים (P, R, D) קבועים, אופק אינסופי, תקופות בדידות, ונטישת Lost-for-good (לקוח שעזב אבוד לתמיד).

### חלק ג': אסטרטגיה וניהול לקוחות
**חוק פרטו (80/20):** 80% מהרווחים מגיעים מ-20% מהלקוחות. הדילמה: אי אפשר לוותר על שאר הלקוחות (לקוחות "ברזל") כי הם מספקים את **"המסה הקריטית"** ונפח הפעילות של החברה. הפתרון הוא התאמת רמת השירות וההשקעה לכל רמה.
**פירמידת הלקוחות:**
* **פלטינה:** הרווחיים ביותר, נאמנים, קונים הרבה.
* **זהב:** טובים אך פחות רווחיים/נאמנים מהפלטינה.
* **ברזל:** הרוב הגדול. מספקים נפח פעילות אך רווחיות נמוכה. השקעה נמוכה.
* **עופרת:** לקוחות מפסידים שיש להיפטר מהם.

[DIAGRAM: CUSTOMER_PYRAMID]

**הון לקוחות (Customer Equity):** סכום ה-CLV של כל הלקוחות (קיימים ועתידיים). הנכס המרכזי המעיד על שווי החברה.

### חלק ד': פוטנציאל צמיחה
**נתח ארנק (Share of Wallet):** אחוז ההוצאה של הלקוח אצלנו מתוך סך הקטגוריה.
בעוד CLV משקף רווחיות צפויה מפעילות קיימת, נתח ארנק מצביע על **פוטנציאל צמיחה**. (לקוח רווחי עם נתח ארנק נמוך = פוטנציאל אדיר).
**אסטרטגיות צמיחה:**
* **Upselling:** שדרוג למוצר יקר יותר (באותה קטגוריה).
* **Cross-selling:** מכירת מוצרים משלימים (מקטגוריות אחרות). תורם גם לרווח וגם לשימור (חסמי מעבר).
      `,
            highlights: ["CLV", "Retention Rate", "פירמידת הלקוחות", "נתח ארנק", "Upselling/Cross-selling"]
        },
        phaseC: [
            {
                level: "בדיקת הבנה",
                question: "מהם שלושת השיקולים המרכזיים בבחירת שוק מטרה (Targeting)?",
                options: [
                    { id: 1, text: "קביעת המחיר (Pricing), עיצוב המוצר (Product) ובחירת ערוצי ההפצה (Place)", correct: false, feedback: "אלו החלטות של תמהיל השיווק (4Ps), לא שיקולי בחירת שוק." },
                    { id: 2, text: "ניתוח מאפייני הפלח, בדיקת התאמת החברה (Fit), והערכת התחרות", correct: true },
                    { id: 3, text: "חישוב גודל השוק הפוטנציאלי (Total Market Size) והתעלמות מהמתחרים", correct: false, feedback: "זו הגישה הישנה והמסוכנת, שמתעלמת מהתחרות ומהתאמת החברה." }
                ]
            },
            {
                level: "המלכודת",
                question: "חברה מזהה ש-80% מהלקוחות שלה ('לקוחות ברזל') מכניסים מעט רווח יחסית. המנכ\"ל מציע לפטר אותם ולהישאר רק עם ה-20% הרווחיים. האם הוא צודק?",
                options: [
                    { id: 1, text: "כן, הם סתם יוצרים עומס תפעולי (Overhead) על מערכות החברה ללא תמורה", correct: false, feedback: "טעות. ללא נפח הפעילות שלהם ('מסה קריטית'), החברה לא תוכל לכסות הוצאות קבועות." },
                    { id: 2, text: "לא, הם מספקים את 'המסה הקריטית' (Critical Mass) המאפשרת את קיום החברה", correct: true },
                    { id: 3, text: "תלוי ב-CLV שלהם, אם הוא חיובי אפילו במעט אז כדאי להשאיר אותם", correct: false, feedback: "גם אם ה-CLV נמוך, הנפח שלהם קריטי לקיום המערכת כולה." }
                ]
            },
            {
                level: "שליטה",
                question: "ללקוח א' יש CLV גבוה ונתח ארנק של 90%. ללקוח ב' יש CLV בינוני ונתח ארנק של 30%. למי יש פוטנציאל צמיחה גדול יותר?",
                options: [
                    { id: 1, text: "לקוח א' - כי הוא כבר הוכיח שהוא לקוח רווחי, נאמן וקונה בסכומים גבוהים", correct: false, feedback: "הוא כבר קונה אצלנו כמעט הכל, קשה להצמיח אותו עוד." },
                    { id: 2, text: "לקוח ב' - כי הוא מוציא את רוב כספו אצל המתחרים, ויש פוטנציאל לגידול", correct: true },
                    { id: 3, text: "הפוטנציאל זהה, כי שניהם לקוחות קיימים של החברה ומכירים את המוצרים", correct: false, feedback: "נתח הארנק הוא המדד שמבדיל את פוטנציאל הצמיחה ביניהם." }
                ]
            }
        ],
        test: [
            {
                question: "מהי הנוסחה לחישוב CLV לאינסוף (בהנחת פרמטרים קבועים)?",
                options: [
                    { id: 1, text: "(P * R) / (1 + D - R)", correct: true },
                    { id: 2, text: "P / (1 + D * R)", correct: false },
                    { id: 3, text: "(P * R) - (D * R)", correct: false },
                    { id: 4, text: "(R * D) / (1 + P)", correct: false }
                ]
            },
            {
                question: "איזה שיקול בבחירת שוק מטרה עוסק בשאלה 'האם הפלח תואם למטרות ארוכות הטווח שלנו'?",
                options: [
                    { id: 1, text: "מאפייני הפלח (Segment Characteristics)", correct: false },
                    { id: 2, text: "התאמת החברה (Company Fit)", correct: true },
                    { id: 3, text: "ניתוח עוצמת התחרות (Competition)", correct: false },
                    { id: 4, text: "חיזוי הביקוש הכללי (Total Demand)", correct: false }
                ]
            },
            {
                question: "מהו ההבדל העיקרי בין Upselling ל-Cross-selling?",
                options: [
                    { id: 1, text: "Upselling מיועד ללקוחות חדשים, בעוד Cross-selling מיועד ללקוחות קיימים", correct: false },
                    { id: 2, text: "Upselling הוא שדרוג באותה קטגוריה, Cross-selling הוא מכירת מוצר מקטגוריה משלימה", correct: true },
                    { id: 3, text: "Upselling מקטין את הרווחיות בטווח הקצר, Cross-selling מגדיל אותה", correct: false },
                    { id: 4, text: "אין הבדל ממשי, אלו מונחים נרדפים לאותה פעולה שיווקית", correct: false }
                ]
            },
            {
                question: "כיצד מגדירים 'לקוחות עופרת' בפירמידת הלקוחות?",
                options: [
                    { id: 1, text: "לקוחות נאמנים מאוד שרוכשים בהיקפים קטנים אך קבועים", correct: false },
                    { id: 2, text: "לקוחות שמספקים את המסה הקריטית לפעילות החברה השוטפת", correct: false },
                    { id: 3, text: "לקוחות הפסדיים שגוזלים משאבים ויש לשקול להיפרד מהם", correct: true },
                    { id: 4, text: "לקוחות חדשים שטרם ביצעו רכישה שניה בחברה", correct: false }
                ]
            },
            {
                question: "מדוע הון לקוחות (Customer Equity) נחשב לנכס אסטרטגי מרכזי?",
                options: [
                    { id: 1, text: "כי הוא מודד את שביעות הרצון הרגעית של הלקוחות בסקרי דעת קהל", correct: false },
                    { id: 2, text: "כי הוא משקף את הערך הכלכלי האמיתי והעתידי של הפירמה כולה", correct: true },
                    { id: 3, text: "כי הוא נתון חשבונאי פשוט לחישוב שמופיע במאזן החברה", correct: false },
                    { id: 4, text: "כי הוא תמיד גבוה יותר משווי השוק של החברה בבורסה לניירות ערך", correct: false }
                ]
            },
            {
                question: "מהי ההנחה לגבי נטישת לקוחות במודל CLV הבסיסי שנלמד?",
                options: [
                    { id: 1, text: "לקוחות נוטשים וחוזרים באופן דינמי לאורך זמן (Random Churn)", correct: false },
                    { id: 2, text: "Lost-for-good: לקוח שעזב נחשב אבוד לתמיד ולא יחזור", correct: true },
                    { id: 3, text: "אין נטישה בכלל במודל, כל הלקוחות נשארים לנצח (Zero Churn)", correct: false },
                    { id: 4, text: "שיעור הנטישה משתנה משנה לשנה באופן אקראי ולא צפוי", correct: false }
                ]
            }
        ]
    },

    "positioning": {
        title: "ניתוח תחרות ומיצוב (Positioning)",
        phaseA: {
            scenario: "חברת התעופה Southwest רצתה להגדיל את נתח השוק שלה בקרב סטודנטים. במקום לנסות לנצח חברות תעופה אחרות במחיר, המנהלים הבינו שהמתחרה האמיתי של הסטודנט הוא לא טיסה אחרת, אלא נסיעה ברכב פרטי או באוטובוס. בעקבות זאת, הם הציעו מחירים ותדירות שמתחרים בתחבורה יבשתית.",
            question: "באיזו רמת תחרות בחרה החברה להתמקד?",
            reveal: "תחרות כללית (Generic Competition) או תחרות על הצורך. הם יצאו מתוך 'המשקפיים של הלקוח' (הצורך להגיע הביתה) ולא מתוך 'המשקפיים של המוצר' (חברות תעופה)."
        },
        phaseB: {
            theory: `
### ניתוח תחרות: ארבע רמות
כדי להבין את הזירה התחרותית, נהוג לנתח ארבע רמות היררכיות:
1. **תחרות מותג (Brand Form):** מוצרים דומים מאוד, לאותם לקוחות ובאותו מחיר (AirPods מול Sony Earbuds).
2. **תחרות קטגוריה (Category):** כל המוצרים באותה קטגוריה, גם אם הביצועים שונים (AirPods מול כל אוזניה חוטית/אלחוטית).
3. **תחרות כללית/הצורך (Generic):** מוצרים שונים המספקים מענה לאותו צורך בסיסי. (אם הצורך באוזניות הוא "בידור", המתחרה הוא נטפליקס. אם הצורך הוא "שקט", המתחרה הוא אטמי אוזניים). דוגמה: תמי 4 מתחרה בבקבוקי מים מינרליים.
4. **תחרות על התקציב (Budget):** כל מוצר שמתחרה על אותו "כיס" של הלקוח. (חופשה בחו"ל מול שיפוץ מטבח).

[DIAGRAM: COMPETITION_LEVELS]

**מיקוד במוצר מול לקוח:** רמות 1-2 מסתכלות דרך המוצר. רמות 3-4 מסתכלות דרך הלקוח וקבלת ההחלטות שלו.

### מפות תפיסתיות (Perceptual Maps)
כלי ויזואלי למיפוי תפיסות הצרכנים.
**שתי גישות לבנייה:**
1. **מבוססת תכונות (Attribute-based):** מזהים מראש תכונות (מחיר, איכות) ומבקשים מצרכנים לדרג. מתאים כשיודעים מה חשוב לצרכן.
2. **מבוססת דמיון (Similarity-based / MDS):** מבקשים מצרכנים לדרג רק "דמיון" בין זוגות מותגים, ללא שמות של תכונות. האלגוריתם (MDS) מייצר מפה, והחוקר צריך "לנחש" בדיעבד מה משמעות הצירים (למשל ע"י קורלציה למחיר).

[DIAGRAM: PERCEPTUAL_MAP]

### החלטות מיצוב
1. **שיוך לקטגוריה (Category Membership):** ההחלטה הראשונה – "מה אני?". (למשל: יקב Yellow Tail מיצב את עצמו מול בירות ולא מול יינות יוקרה).
2. **נקודות שוויון (POP):** תכונות שחייבים כדי להיות "במשחק". משווים למתחרים כדי לקבל לגיטימציה (יונדאי משווה ל-BMW כדי לשדר יוקרה).
3. **בידול (Differentiation):** מציאת המיקום הייחודי במפה שבו אנו עדיפים על המתחרים ("השטח הפנוי").
      `,
            highlights: ["Generic Competition", "MDS", "נקודות שוויון (POP)", "Budget Competition"]
        },
        phaseC: [
            {
                level: "הבנה",
                question: "כיצד הפרסומת של \"תמי 4\" (\"להפסיק לסחוב בקבוקים\") מדגימה חשיבה של תחרות ברמה הכללית (Generic Competition)?",
                options: [
                    { id: 1, text: "היא התמקדה בהורדת המחיר ביחס למתחרים הישירים בשוק ברי המים המסוננים", correct: false, feedback: "המחיר הוא שיקול, אך המסר המרכזי היה סביב הצורך בנוחות." },
                    { id: 2, text: "היא זיהתה שהצורך הוא \"מים נקיים וזמינים\" ומיצבה עצמה מול האלטרנטיבה הישנה (בקבוקים)", correct: true },
                    { id: 3, text: "היא פנתה לתקציב המותרות של המשפחה והציעה מוצר יוקרתי למטבח", correct: false, feedback: "מים הם צורך בסיסי, לא מותרות, והמסר היה פרקטי." }
                ]
            },
            {
                level: "יישום",
                question: "מתי נעדיף להשתמש בשיטת MDS (מבוססת דמיון) לבניית מפה תפיסתית?",
                options: [
                    { id: 1, text: "כשאנחנו יודעים בדיוק אילו תכונות חשובות ללקוח ורוצים למדוד את הביצועים בהן", correct: false, feedback: "במקרה כזה עדיף להשתמש במפה מבוססת תכונות (Attribute-based)." },
                    { id: 2, text: "כאשר לא יודעים מראש מהם המימדים החשובים לצרכן, או כשהוא אינו יודע להסביר אותם", correct: true },
                    { id: 3, text: "תמיד, כיוון שזו השיטה המהירה, הזולה והמדויקת ביותר למחקר שוק", correct: false, feedback: "לכל שיטה יש יתרונות וחסרונות בהתאם למטרת המחקר." }
                ]
            },
            {
                level: "בדיקת ידע",
                question: "מה ההבדל המהותי במיקוד בין שתי רמות התחרות הראשונות (מותג/קטגוריה) לבין שתי העליונות (כללית/תקציב)?",
                options: [
                    { id: 1, text: "הראשונות ממוקדות במוצר (Product Focused), בעוד העליונות ממוקדות בלקוח (Customer Focused)", correct: true },
                    { id: 2, text: "הראשונות ממוקדות בלקוח ובצרכיו, בעוד העליונות ממוקדות במוצר ובתכונותיו", correct: false, feedback: "ההפך הוא הנכון." },
                    { id: 3, text: "אין הבדל מהותי, ההבדל הוא רק בגודל השוק הגיאוגרפי שהן מכסות", correct: false, feedback: "יש הבדל בנקודת המוצא לניתוח." }
                ]
            }
        ],
        test: [
            {
                question: "בשיטת MDS, המחשב מייצר מפה עם צירים חסרי שם. אילו דרכים משמשות לפרשנות הצירים בדיעבד?",
                options: [
                    { id: 1, text: "המחשב מנתח את נתוני השוק ונותן שמות לצירים באופן אוטומטי ומדויק", correct: false },
                    { id: 2, text: "עדות צרכנים, אינטואיציה ניהולית, ומתאם סטטיסטי עם מאפיינים ידועים", correct: true },
                    { id: 3, text: "החוקר קובע את שמות הצירים מראש לפני ביצוע הסקר בשטח", correct: false },
                    { id: 4, text: "שימוש קבוע בפרמטרים של 'מחיר' ו'איכות' כברירת מחדל בכל המחקרים", correct: false }
                ]
            },
            {
                question: "כיצד המותג Yellow Tail השתמש ב\"גמישות בשיוך לקטגוריה\"?",
                options: [
                    { id: 1, text: "הציג את עצמו כיין יוקרתי במיוחד כדי להתחרות ביינות צרפתיים יקרים", correct: false },
                    { id: 2, text: "מיצב את עצמו כמתחרה במשקאות קלילים ובירות, ולא ביינות יוקרה כבדים", correct: true },
                    { id: 3, text: "יצר קטגוריה חדשה לגמרי של משקאות אנרגיה מבוססי ענבים", correct: false },
                    { id: 4, text: "התמקד בשיווק למסעדות יוקרה בלבד כדי לבנות תדמית אקסקלוסיבית", correct: false }
                ]
            },
            {
                question: "מדוע יונדאי בחרה להשוות את עצמה ל-BMW ולקסוס בפרסומות שלה?",
                options: [
                    { id: 1, text: "כדי להדגיש שהיא זולה משמעותית מהן ולפנות לקהל חסכן במיוחד", correct: false },
                    { id: 2, text: "כדי ליצור \"נקודות שוויון\" (POP) ולאותת לצרכנים שהיא שייכת לקטגוריית היוקרה", correct: true },
                    { id: 3, text: "כדי ללעוג למתחרים ולטעון שהם גובים מחיר גבוה ללא כל הצדקה", correct: false },
                    { id: 4, text: "כדי להבליט את ההבדלים הטכנולוגיים המהותיים בינה לבינן", correct: false }
                ]
            },
            {
                question: "כיצד מותג פותר את המתח בין הצורך להיות \"כמו כולם\" (שייכות) לבין הצורך להיות \"שונה\" (בידול)?",
                options: [
                    { id: 1, text: "הוא בוחר באסטרטגיה אחת בלבד ומתמקד בה לאורך כל חיי המוצר", correct: false },
                    { id: 2, text: "הדמיון (POP) והשוני (POD) נעשים על סטים שונים של תכונות מוצר", correct: true },
                    { id: 3, text: "הוא מחליף אסטרטגיה כל כמה חודשים כדי לבלבל את המתחרים", correct: false },
                    { id: 4, text: "זהו מתח בלתי פתיר שמוביל בהכרח לכישלון שיווקי בטווח הארוך", correct: false }
                ]
            }
        ]
    },

    "product_decisions": {
        title: "החלטות מוצר",
        phaseA: {
            scenario: "יצרן רכב רוצה לתכנן את הדגם הבא. ההתלבטות: מנוע חזק יותר ב-20% או מערכת מולטימדיה טובה יותר? כל שיפור עולה אותו דבר לייצור.",
            question: "איך מחליטים מה הלקוח מעדיף מבלי לנחש?",
            reveal: "משתמשים ב**ניתוח קונג'וינט (Conjoint Analysis)**. מציגים ללקוחות חבילות מוצר שונות ובודקים על מה הם מוכנים לוותר. כך מחלצים את ה'תועלת החלקית' של כל תכונה."
        },
        phaseB: {
            theory: `
### הגדרה רחבה: מהו מוצר?
באופן מסורתי, "מוצר" נתפס כאובייקט פיזי. בקורס זה, ההגדרה רחבה ומתייחסת לערך המוחלף: סך התועלות הפיזיות, הפסיכולוגיות והסוציולוגיות שהקונה מקבל מהרכישה, הבעלות והצריכה.

### מודל התועלת ו-Part-worths
כדי לנתח תועלת, משתמשים בפונקציה המורכבת מ"תועלות חלקיות" (Part-worths). כל ביטוי מורכב ממכפלה של שני פרמטרים:
1. **$B$ (Performance/Score):** הציון שהצרכן נותן לרמה ספציפית של התכונה (למשל, "אדום" מקבל ציון 7).
2. **$W$ (Importance/Weight):** המשקל שהצרכן מייחס לתכונה זו בהחלטה (למשל, חשיבות הצבע היא 30%).

$$ Total Utility = \\sum (W \\times B) $$

### ניתוח קונג'וינט (Conjoint Analysis)
הבעיה המרכזית היא לחלץ את ה-$W$ (חשיבות), כי צרכנים לא תמיד יודעים לומר מה חשוב להם.
**השיטה:** מציגים לצרכנים "פרופילים" (שילובים של תכונות, כמו עט אדום במחיר X מול עט כחול במחיר Y) ומבקשים מהם לבחור. באמצעות ניתוח סטטיסטי של הבחירות, מחלצים את החשיבות ($W$) ואת תפיסת הביצוע ($B$).

**חישוב חשיבות תכונה:**
כדי להבין איזו תכונה הכי חשובה, מחשבים את ה**טווח (Range)** של כל תכונה (ההפרש בין ה-Part-worth הגבוה לנמוך ביותר שלה).
$$ Importance \\% = \\frac{Range(Attribute)}{\\sum All Ranges} $$
תכונה עם טווח גדול = תכונה חשובה (שינוי בה משפיע דרמטית על התועלת).

### המודל המפצה (Compensatory Model)
פונקציית התועלת היא "מפצה". תכונה עם ציון נמוך יכולה להיות "מפוצה" על ידי תכונה אחרת עם ציון גבוה.
**דוגמה:** מעבר לפקק הברגה ביין מוריד ערך (תפיסה נמוכה). היצרן יכול "לפצות" על כך על ידי הורדת מחיר, כך שהתועלת הכוללת תישמר.

### מפת חשיבות-תפקוד (Importance-Performance)
כלי לתיעדוף החלטות. ממקמים כל תכונה על שני צירים:
* **ציר X:** ביצוע נתפס (כמה אנחנו טובים בזה?)
* **ציר Y:** חשיבות התכונה (כמה זה חשוב ללקוח?)

[DIAGRAM: IMPORTANCE_PERFORMANCE]

**ארבעת הרביעים:**
1. **שיפור קריטי (High Imp, Low Perf):** הלקוח רוצה את זה ואנחנו גרועים בזה. דורש טיפול מיידי (שינוי מוצר או מיצוב).
2. **שימור (High Imp, High Perf):** החוזקות שלנו. לשמור על המצב.
3. **השקעת יתר (Low Imp, High Perf):** אנחנו מצטיינים במשהו שלא מעניין את הלקוח. אפשר להפחית השקעה או להעלות מחיר.
4. **עדיפות נמוכה (Low Imp, Low Perf):** לא חשוב ולא טובים בזה. לא דורש טיפול.
      `,
            highlights: ["Conjoint Analysis", "Part-worths", "Compensatory Model", "Importance Calculation", "Importance-Performance Map"]
        },
        phaseC: [
            {
                level: "הבנה",
                question: "כיצד מוגדר \"מוצר\" בקורס זה, ובמה הגדרה זו שונה מההגדרה הקונבנציונלית?",
                options: [
                    { id: 1, text: "סך התועלות הפיזיות, הפסיכולוגיות והסוציולוגיות שהקונה מקבל משלושה שלבים: רכישה, בעלות (Ownership) וצריכה.", correct: true },
                    { id: 2, text: "האובייקט הפיזי בלבד והתכונות הטכניות שלו (Features), תוך התעלמות מחוויית הקנייה.", correct: false, feedback: "הגדרה זו מתעלמת מהרבדים הרגשיים והחברתיים של המוצר." },
                    { id: 3, text: "השירותים הנלוים למוצר העיקרי, כגון אחריות ותמיכה טכנית (Support), ללא המוצר הפיזי.", correct: false, feedback: "המוצר כולל גם את האובייקט הפיזי עצמו, לא רק את השירותים." }
                ]
            },
            {
                level: "המלכודת",
                question: "מדוע קשה לחלץ את חשיבות התכונות (W) ישירות מהצרכנים (\"כמה חשוב לך מחיר?\"), וכיצד ניתוח קונג'וינט פותר זאת?",
                options: [
                    { id: 1, text: "צרכנים לא יודעים חשבון מספיק טוב; קונג'וינט מבצע את החישוב המתמטי עבורם בצורה אוטומטית.", correct: false, feedback: "הקושי הוא לא ביכולת המתמטית של הצרכן, אלא במודעות להעדפות." },
                    { id: 2, text: "צרכנים לא תמיד מודעים להעדפותיהם או מסתירים אותן; קונג'וינט מסיק חשיבות מתוך בחירה בין פרופילים (Trade-offs).", correct: true },
                    { id: 3, text: "אי אפשר לשאול על חשיבות ישירות כי זה מנוגד לחוקי הגנת הצרכן; קונג'וינט הוא כלי עקיף חוקי.", correct: false, feedback: "אין מניעה חוקית לשאול על חשיבות, אך זה לא תמיד יעיל." }
                ]
            },
            {
                level: "שליטה",
                question: "מהו \"המודל המפצה\" (Compensatory Model) וכיצד הוא מסייע למנהלים להתמודד עם חולשה בתכונה מסוימת?",
                options: [
                    { id: 1, text: "המודל מחייב את החברה לשפר את כל התכונות לרמה המקסימלית כדי למנוע נטישת לקוחות.", correct: false, feedback: "זהו מודל לא מפצה, שבו כל תכונה חייבת להיות ברמה גבוהה." },
                    { id: 2, text: "החברה חייבת לפצות כספית (Financial Compensation) כל לקוח שאינו מרוצה מתכונה מסוימת במוצר.", correct: false, feedback: "המודל המפצה מתייחס לתועלת הנתפסת, לא לפיצוי כספי." },
                    { id: 3, text: "ציון נמוך בתכונה אחת יכול להיות \"מפוצה\" על ידי ציון גבוה בתכונה אחרת (כמו מחיר נמוך המפצה על פקק הברגה).", correct: true }
                ]
            }
        ],
        test: [
            {
                question: "ממה מורכב ביטוי ה-\"Part-worth\" (תועלת חלקית) בפונקציית התועלת של הצרכן?",
                options: [
                    { id: 1, text: "מכפלה של תפיסת הביצוע ברמה ספציפית (B - Performance) בחשיבות התכונה (W - Importance).", correct: true },
                    { id: 2, text: "סכום של מחיר המוצר (Price) ואיכות המוצר (Quality) בעיני הצרכן.", correct: false },
                    { id: 3, text: "היחס בין העלות השולית של הייצור לבין המחיר הסופי לצרכן.", correct: false },
                    { id: 4, text: "הממוצע המשוקלל של כל התכונות המתחרות בשוק באותה קטגוריה.", correct: false }
                ]
            },
            {
                question: "כיצד מחשבים את אחוז החשיבות של תכונה ספציפית מתוך נתוני ה-Part-worths?",
                options: [
                    { id: 1, text: "מחשבים את הממוצע האריתמטי של כל ערכי ה-Part-worths עבור אותה תכונה.", correct: false },
                    { id: 2, text: "מחלקים את טווח התועלות (Range) של התכונה הספציפית בסכום הטווחים של כל התכונות.", correct: true },
                    { id: 3, text: "לוקחים את הערך הגבוה ביותר (Max Value) של התכונה ומחלקים אותו במחיר המוצר.", correct: false },
                    { id: 4, text: "מכפילים את מספר הרמות של התכונה בערך הממוצע שלה.", correct: false }
                ]
            },
            {
                question: "במפת תפקוד-חשיבות (Importance-Performance Map), אילו תכונות דורשות את הטיפול הניהולי הדחוף ביותר?",
                options: [
                    { id: 1, text: "תכונות בחשיבות גבוהה (High Importance) וביצוע נמוך (Low Performance).", correct: true },
                    { id: 2, text: "תכונות בחשיבות נמוכה וביצוע גבוה (השקעת יתר).", correct: false },
                    { id: 3, text: "תכונות בחשיבות גבוהה וביצוע גבוה (שימור).", correct: false },
                    { id: 4, text: "תכונות בחשיבות נמוכה וביצוע נמוך (עדיפות נמוכה).", correct: false }
                ]
            },
            {
                question: "מהי המשמעות הניהולית של תכונה הממוקמת ברביע \"השקעת יתר\" (חשיבות נמוכה, תפקוד גבוה)?",
                options: [
                    { id: 1, text: "זהו מצב אידיאלי המבטיח יתרון תחרותי לטווח ארוך ויש לשמר אותו בכל מחיר.", correct: false },
                    { id: 2, text: "החברה מבזבזת משאבים; יש להפסיק לשפר את התכונה או לשקול העלאת מחיר (Harvesting).", correct: true },
                    { id: 3, text: "יש להשקיע מיד בשיפור נוסף של התכונה כדי להפוך אותה לחשובה בעיני הצרכן.", correct: false },
                    { id: 4, text: "זהו סימן שהמתחרים עומדים לעקוף אותנו ויש לצאת למלחמת מחירים.", correct: false }
                ]
            }
        ]
    },

    "brand_decisions": {
        title: "החלטות מותג",
        phaseA: {
            scenario: "כשאומרים 'וולוו', רוב האנשים חושבים מיד על 'בטיחות'. כשאומרים 'טויוטה', חושבים על 'אמינות'. כשאומרים את שם החברה שלך, הלקוחות לא חושבים על כלום, או גרוע מכך - מתבלבלים עם המתחרה.",
            question: "מה חסר לחברה שלך?",
            reveal: "חסרה לה **נכסיות מותג (Brand Equity)** ומיקום ברור ב**רשת האסוציאטיבית** בזיכרון של הצרכן."
        },
        phaseB: {
            theory: `
### חלק א': מהות המותג ותפיסתו בזיכרון
**מותג (Brand):** מוצר שנוספו לו סימני זיהוי שמטרתם לבדל אותו ממתחרים. המותג הוא כלי לתקשור הערך באמצעות בניית סט אסוציאציות.
**רשת אסוציאטיבית:** קוגניטיבית, המותג הוא "צומת" בזיכרון המקושרת לאסוציאציות אחרות. עירור המותג (העלאה למודעות) מפעיל את שאר הרשת.

**סוגי אסוציאציות:**
* **פונקציונליות:** תכונות וביצועים (נורה = אור).
* **סימבוליות:** ערכים רגשיים/חברתיים (רכב יוקרה = סטטוס).
*דוגמה:* במבחני טעימה עיוורת לבירה, צרכנים לא הבדילו בין טעמים. כשידעו את המותג, הדירוג השתנה דרמטית. המותג הסימבולי משפיע על החוויה הפיזית!

### חלק ב': נכסיות מותג (Brand Equity)
הערך המוסף שהמותג מעניק למוצר מעבר לתכונותיו הפיזיות.
**CBBE (Customer-Based Brand Equity):** הפרמיה שהלקוח מוכן לשלם רק בגלל המותג.

**מודל BAV (של Young & Rubicam):**
מודל המודד בריאות מותג לפי 4 עמודי תווך:
1. **בידול (Differentiation):** היכולת לבלוט (הראשון שנבנה).
2. **רלוונטיות (Relevance):** התאמה לצרכי הלקוח.
3. **הערכה (Esteem):** כבוד ואיכות נתפסת.
4. **ידע (Knowledge):** הבנה עמוקה של זהות המותג (האחרון שנבנה).

[DIAGRAM: BAV_MODEL]

**מטריצת הכוח (Power Grid):**
* **חוזק מותג (Strength):** בידול + רלוונטיות (צופה פני עתיד/צמיחה).
* **מעמד מותג (Stature):** הערכה + ידע (משקף סטטוס נוכחי).
* **מותג בצמיחה:** חוזק גבוה (בידול), מעמד נמוך.
* **מותג שחוק:** מעמד גבוה (כולם מכירים), חוזק נמוך (לא מיוחד).

### חלק ג': ניהול מערך מותגים
ניהול הפורטפוליו למניעת קניבליזציה ובזבוז.

**היררכיית מותגים:**
1. **מותג חברה:** (שטראוס) תדמית התאגיד.
2. **משפחת מותגים:** (עלית) מטרייה לקטגוריה רחבה.
3. **מותג בודד:** (שוקולד פרה) מותג ספציפי למוצר.
4. **פריט/מודל:** (מריר 70%) זיהוי הגרסה.

[DIAGRAM: BRAND_HIERARCHY]

**אסטרטגיות להשקת מוצרים:**
* **הרחבת קו (Line Extension):** אותו מותג, אותה קטגוריה (יוגורט תות -> יוגורט בננה). סיכון נמוך.
* **מתיחת מותג (Brand Extension):** אותו מותג, קטגוריה חדשה (סוגת קמח -> פתיתים). סיכון: כישלון פוגע במותג האב. דוגמה לכישלון: דגני בוקר של "במבה".
* **מיתוג משותף (Co-branding):** שילוב שני מותגים (Milka עם Oreo).
* **מותגים חדשים:** יצירת שם חדש לקטגוריה חדשה (כשפלאפון רצתה לפנות לצעירים היא הקימה את ESC כדי לא לפגוע בתדמית העסקית).

**קניבליזציה:** כשהמוצר החדש "אוכל" את המכירות של הישן.

### חלק ד': מרכיבי המותג (Brand Elements)
שם, לוגו, צבע, סלוגן.
**קריטריונים לבחירה:**
* **זכירות (Memorability):** קל לשליפה.
* **משמעותיות (Meaningfulness):** מרמז על התועלת/קטגוריה.
* **יכולת העברה (Transferability):** מתאים לקטגוריות/תרבויות אחרות (Pajero בספרדית = קללה).
* **יכולת הגנה (Protectability):** רישום משפטי.
* **יכולת התאמה (Adaptability):** אפשרות למודרניזציה (לוגו שמשתנה עם הזמן).
      `,
            highlights: ["נכסיות מותג (CBBE)", "BAV Model", "מתיחת מותג", "קניבליזציה", "רשת אסוציאטיבית"]
        },
        phaseC: [
            {
                level: "הבנה",
                question: "במבחן טעימה עיוורת (Blind Test), צרכנים לא הבדילו בין מותגי בירה, אך כשראו את התוויות הדירוג השתנה לחלוטין. מה זה מוכיח?",
                options: [
                    { id: 1, text: "שהטעם הוא המרכיב החשוב ביותר, והמותג הוא שולי.", correct: false, feedback: "בדיוק ההפך - המותג שינה את התפיסה למרות שהטעם היה זהה." },
                    { id: 2, text: "שהאסוציאציות הסימבוליות של המותג משפיעות על החוויה הפונקציונלית והערך הנתפס.", correct: true },
                    { id: 3, text: "שצרכנים תמיד מעדיפים את הבירה הזולה יותר כשהם לא יודעים מה הם שותים.", correct: false, feedback: "הניסוי עסק בהבדלי טעם ודירוג איכות, לא במחיר." }
                ]
            },
            {
                level: "המלכודת",
                question: "חברת 'קוקה קולה' משיקה 'קולה וניל'. איזו אסטרטגיה זו?",
                options: [
                    { id: 1, text: "מתיחת מותג (Brand Extension) - כי זה מוצר חדש.", correct: false, feedback: "מתיחה היא כניסה לקטגוריה חדשה (כמו חולצות קוקה קולה). כאן נשארנו במשקאות." },
                    { id: 2, text: "הרחבת קו (Line Extension) - תכונה חדשה (טעם) באותה קטגוריה תחת אותו מותג.", correct: true },
                    { id: 3, text: "מיתוג משותף (Co-branding) - שיתוף פעולה עם חברת הוניל.", correct: false, feedback: "זהו טעם, לא מותג שותף." }
                ]
            },
            {
                level: "שליטה - מודל BAV",
                question: "מותג נמצא בפינה השמאלית העליונה של רשת הכוח (Power Grid): יש לו 'חוזק' גבוה (בידול) אבל 'מעמד' נמוך (ידע/הערכה). מה מצבו?",
                options: [
                    { id: 1, text: "מותג שחוק/דועך - כולם מכירים אותו אבל הוא לא מיוחד.", correct: false, feedback: "זה תיאור של פינה ימנית תחתונה (מעמד גבוה, חוזק נמוך)." },
                    { id: 2, text: "מותג בצמיחה/מומנטום - הוא בולט ומיוחד, ועדיין בונה את ההיכרות בשוק.", correct: true },
                    { id: 3, text: "מותג מנהיג (Leadership) - שולט בכל המדדים.", correct: false, feedback: "מנהיג נמצא בפינה הימנית העליונה (גבוה בהכל)." }
                ]
            }
        ],
        test: [
            {
                question: "מהי נכסיות מותג מבוססת לקוח (CBBE)?",
                options: [
                    { id: 1, text: "השווי הכספי הכולל של מניות החברה בבורסה.", correct: false },
                    { id: 2, text: "התגובה השונה (הפרמיה) של לקוח למוצר כשהוא מכיר את המותג, לעומת מוצר זהה ללא שם.", correct: true },
                    { id: 3, text: "סכום ההשקעה של החברה בפרסום ושיווק המותג לאורך השנים.", correct: false },
                    { id: 4, text: "מדד המבוסס אך ורק על נתח השוק הכמותי של המותג.", correct: false }
                ]
            },
            {
                question: "חברת 'במבה' נכשלה בניסיון לשווק 'דגני בוקר במבה'. מדוע נכשל מהלך 'מתיחת המותג' הזה?",
                options: [
                    { id: 1, text: "הלוגו לא היה קריא מספיק על אריזות הקרטון הגדולות.", correct: false },
                    { id: 2, text: "הייתה התנגשות באסוציאציות: במבה נתפסת כחטיף מלוח, מה שלא התאים לקטגוריית דגני בוקר עם חלב.", correct: true },
                    { id: 3, text: "החברה השתמשה באסטרטגיית 'הרחבת קו' במקום 'מתיחת מותג'.", correct: false },
                    { id: 4, text: "המחיר של המוצר היה גבוה מדי ביחס למתחרים.", correct: false }
                ]
            },
            {
                question: "במודל BAV, איזה מימד הוא האחרון שנבנה ומייצג את ההבנה העמוקה ביותר של הצרכן?",
                options: [
                    { id: 1, text: "בידול (Differentiation)", correct: false },
                    { id: 2, text: "ידע (Knowledge)", correct: true },
                    { id: 3, text: "רלוונטיות (Relevance)", correct: false },
                    { id: 4, text: "אנרגיה (Energy)", correct: false }
                ]
            },
            {
                question: "מהו סיכון ה'קניבליזציה' בניהול פורטפוליו מותגים?",
                options: [
                    { id: 1, text: "שהמתחרים יעתיקו את המוצר החדש שלנו.", correct: false },
                    { id: 2, text: "שהמוצר החדש שהשקנו ינגוס במכירות של מוצר קיים שלנו, ללא הגדלת העוגה הכוללת.", correct: true },
                    { id: 3, text: "שהמותג שלנו יהפוך לגנרי (כמו ג'יפ או פריג'ידר).", correct: false },
                    { id: 4, text: "שעלויות הייצור של המותג החדש יהיו גבוהות מהצפוי.", correct: false }
                ]
            },
            {
                question: "מדוע השם 'Pajero' של מיצובישי נחשב לבעייתי מבחינת קריטריון 'יכולת ההעברה' (Transferability)?",
                options: [
                    { id: 1, text: "כי הוא ארוך מדי וקשה לזכירה.", correct: false },
                    { id: 2, text: "כי יש לו משמעות שלילית (קללה) בספרדית, מה שמגביל שיווק גלובלי.", correct: true },
                    { id: 3, text: "כי הוא דומה מדי לשם של מותג מתחרה.", correct: false },
                    { id: 4, text: "כי אי אפשר לרשום אותו כסימן מסחרי מוגן.", correct: false }
                ]
            }
        ]
    },

    "pricing_decisions": {
        title: "החלטות המחרה",
        phaseA: {
            scenario: "תרופה מצילת חיים עולה לייצור 1 ש\"ח. חברת התרופות מוכרת אותה ב-1000 ש\"ח. הציבור זועם, אבל בתי החולים קונים.",
            question: "לפי איזו גישת המחרה החברה פועלת?",
            reveal: "המחרה מבוססת ערך (Value-based). המחיר לא נקבע לפי העלות (1 ש\"ח) אלא לפי הערך של 'הצלת חיים' בעיני הלקוח."
        },
        phaseB: {
            theory: `
### החלטות המחרה: הקדמה
החלטות המחרה עוסקות בשאלה "בכמה אנו מחליפים את הערך?". זוהי החלטה אסטרטגית לחלוקת הערך בין הצרכן לפירמה. המטרה: שהערך ללקוח יהיה גבוה מספיק לקנייה, ושהחברה תכסה עלויות ותרוויח. למחיר השפעה ישירה וקריטית על שורת הרווח (Bottom Line).

### 1. שיטות המחרה (Pricing Methods)
קיימות שלוש גישות מרכזיות:

**א. המחרה על פי עלות (Cost-Plus Pricing):**
מסתכלים פנימה. מחשבים עלות ייצור ומוסיפים מרווח רווח (למשל עלות + 25%).
* **יתרונות:** קלה לחישוב ולהצדקה (נתפסת כהוגנת).
* **חסרונות:** "משאירה כסף על השולחן". מתעלמת מנכונות הלקוח לשלם (WTP).

**ב. המחרה על פי מתחרים (Competitor-Based Pricing):**
מסתכלים החוצה. מחקים את "המחיר המקובל" בשוק.
* **יתרונות:** פשוטה ומפחיתה סיכון.
* **חסרונות:** עדיין עלולה להשאיר כסף על השולחן; מתעלמת מההבדלים בעלויות או בערך הייחודי של הפירמה.

**ג. המחרה מבוססת ערך (Value-Based Pricing):**
**השיטה המומלצת.** ביסוס המחיר על תפיסת הערך בעיני הלקוח.
* **השאלה המנחה:** "האם המחיר משקף את הערך ללקוח?"
* מחקרים מצביעים על רווחיות גבוהה יותר בכ-20%.

### 2. מדחום המחרת ערך (Value Pricing Thermometer)
מודל לקביעת טווח המחיר:

1.  **TEV (ערך אקונומי אמיתי):** התקרה התיאורטית. השווי שצרכן רציונלי לחלוטין היה נותן למוצר (בהשוואה לאלטרנטיבה).
2.  **ערך נתפס (Perceived Value - PV):** התקרה המעשית. כמה הצרכן *חושב* שזה שווה (לרוב נמוך מ-TEV בגלל סקפטיות או חוסר ידע).
3.  **מחיר (Price):** נקבע בין ה-PV ל-COGS.
4.  **COGS (עלות המכר):** הרצפה. מתחת לזה מפסידים.

[DIAGRAM: PRICING_THERMOMETER]

**חלוקת תמריצים:**
* **תמריץ לחברה:** מחיר פחות עלות (רווח).
* **תמריץ ללקוח:** ערך נתפס פחות מחיר (ה"דיל" שהלקוח מרגיש שעשה).

### 3. חישוב TEV וניהול פערים
הנוסחה:
$$TEV = Price_{Alternative} + \\Delta Value$$
* **דוגמה:** אם מתחרה עולה 75,000$ והמערכת שלנו חוסכת עוד 6,500$ בהוצאות תפעול, ה-TEV הוא 81,500$.

**ניהול הפער (TEV vs PV):** הצרכן סקפטי. תפקיד השיווק הוא "לחנך את השוק" ולהרים את הערך הנתפס (PV) לכיוון הערך האמיתי (TEV).

### 4. טקטיקות השפעה פסיכולוגיות
1.  **EDLP (מחיר נמוך קבוע):** חוסך לצרכן את עלות החיפוש (רמי לוי, וולמארט). חיסרון: עלול לפגוע בתדמית האיכות.
2.  **High-Low Pricing:** מחיר רגיל גבוה ומבצעים עמוקים. יוצר ריגוש של "ציד" מציאות ותפיסת איכות גבוהה.
3.  **אפקט ה-99:** מחיר 9.99 נתפס כ-9 ולא כ-10 (עיגול למטה משמאל לימין).
4.  **מחיר התייחסות (Reference Price):** הצגת המחיר הישן (הגבוה) כעוגן, מה שהופך את המחיר הנוכחי להזדמנות.
5.  **Piling (מערום):** ערימת מוצרים משדרת "חיסול" ומעודדת קנייה אימפולסיבית.
      `,
            highlights: ["TEV", "ערך נתפס", "Cost-plus", "פסיכולוגיית מחיר", "EDLP vs High-Low"]
        },
        phaseC: [
            {
                level: "הבנה",
                question: "מהו החיסרון העיקרי של שיטת ה'קוסט פלוס' (Cost-Plus Pricing)?",
                options: [
                    { id: 1, text: "היא מסובכת מאוד לחישוב ודורשת מידע מודיעיני על המתחרים.", correct: false, feedback: "ההפך, היא השיטה הקלה ביותר לחישוב כי העלויות ידועות לחברה." },
                    { id: 2, text: "היא 'משאירה כסף על השולחן' כי היא מתעלמת מנכונות הלקוח לשלם ערך גבוה יותר.", correct: true },
                    { id: 3, text: "היא גורמת להפסדים מיידיים כי המחיר תמיד נמוך מעלות הייצור.", correct: false, feedback: "בשיטה זו מוסיפים רווח על העלות, ולכן לא מפסידים (לפחות על הנייר)." }
                ]
            },
            {
                level: "יישום - חישוב TEV",
                question: "המתחרה מוכר תוכנה ב-100$. התוכנה שלנו זהה למתחרה, אך חוסכת ללקוח 20$ בשנה בחשמל. מהו ה-TEV של התוכנה שלנו?",
                options: [
                    { id: 1, text: "100$ - כי זה מחיר השוק.", correct: false, feedback: "זה מתעלם מהערך הנוסף שהמוצר שלנו נותן." },
                    { id: 2, text: "120$ - מחיר האלטרנטיבה (100) ועוד הערך המוסף (20).", correct: true },
                    { id: 3, text: "80$ - אנחנו צריכים להיות זולים יותר כדי לחדור לשוק.", correct: false, feedback: "זה אולי מחיר חדירה אסטרטגי, אבל הערך האקונומי האמיתי (TEV) הוא גבוה יותר." }
                ]
            },
            {
                level: "שליטה - פסיכולוגיה",
                question: "חנות בגדים מציגה שלט 'במקום 400 ש\"ח, רק 200 ש\"ח'. באיזו טקטיקה היא משתמשת?",
                options: [
                    { id: 1, text: "EDLP (Everyday Low Price) - מחיר נמוך קבוע ללא הפתעות.", correct: false, feedback: "EDLP לא מדגיש מבצעים או מחירים קודמים." },
                    { id: 2, text: "מחיר התייחסות (Reference Price) - שימוש במחיר הגבוה כעוגן להגדלת האטרקטיביות.", correct: true },
                    { id: 3, text: "קוסט פלוס - המחיר נקבע לפי עלות הבגד.", correct: false, feedback: "אין כאן מידע על העלות, אלא מניפולציה פסיכולוגית על המחיר." }
                ]
            }
        ],
        test: [
            {
                question: "ב'מדחום המחרת הערך', מה קובע את הרצפה (הגבול התחתון) למחיר?",
                options: [
                    { id: 1, text: "הערך הנתפס (Perceived Value) בעיני הלקוח.", correct: false },
                    { id: 2, text: "עלות המכר (COGS) - העלות לייצר את המוצר.", correct: true },
                    { id: 3, text: "המחיר של המתחרה הזול ביותר בשוק.", correct: false },
                    { id: 4, text: "הערך האקונומי האמיתי (TEV).", correct: false }
                ]
            },
            {
                question: "מהו ההבדל המרכזי בין שיטת High-Low לבין EDLP?",
                options: [
                    { id: 1, text: "High-Low מיועדת למוצרי יוקרה בלבד, בעוד EDLP למוצרי צריכה בסיסיים.", correct: false },
                    { id: 2, text: "EDLP מציעה יציבות וחיסכון בחיפוש, בעוד High-Low מסתמכת על מבצעים עמוקים וריגוש.", correct: true },
                    { id: 3, text: "EDLP תמיד יקרה יותר בטווח הארוך משיטת High-Low.", correct: false },
                    { id: 4, text: "אין הבדל, אלו שמות נרדפים לאותה אסטרטגיה.", correct: false }
                ]
            },
            {
                question: "מדוע הערך הנתפס (PV) לרוב נמוך מהערך האקונומי האמיתי (TEV)?",
                options: [
                    { id: 1, text: "כי המוצר באמת פחות טוב מהאלטרנטיבות בשוק.", correct: false },
                    { id: 2, text: "בגלל פערי מידע וסקפטיות של הלקוח לגבי הבטחות החברה.", correct: true },
                    { id: 3, text: "כי הלקוחות תמיד מעדיפים את המוצר הזול ביותר.", correct: false },
                    { id: 4, text: "כי המתחרים מורידים את המחירים שלהם באופן קבוע.", correct: false }
                ]
            },
            {
                question: "מהי מטרת טקטיקת ה-'Piling' (ערימת מוצרים)?",
                options: [
                    { id: 1, text: "לחסוך מקום במדפים בחנות.", correct: false },
                    { id: 2, text: "לשדר תחושת 'חיסול' או 'מציאה' ולעודד קנייה אימפולסיבית.", correct: true },
                    { id: 3, text: "להסתיר מוצרים פגומים בתחתית הערימה.", correct: false },
                    { id: 4, text: "להקל על הסדרנים בסידור החנות בסוף היום.", correct: false }
                ]
            },
            {
                question: "אם חברה פועלת לפי גישת המחרה מבוססת ערך (Value-Based), מהו הצעד הראשון שעליה לעשות?",
                options: [
                    { id: 1, text: "לחשב את עלויות הייצור המדויקות של המוצר.", correct: false },
                    { id: 2, text: "להבין לעומק את הצרכים והתועלות של הלקוח בשוק המטרה.", correct: true },
                    { id: 3, text: "לבדוק מה המחיר הממוצע אצל כל המתחרים.", correct: false },
                    { id: 4, text: "לקבוע את אחוז הרווח הרצוי לבעלי המניות.", correct: false }
                ]
            }
        ]
    }
};

/**
 * ---------------------------------------------------------------------
 * APP LOGIC
 * ---------------------------------------------------------------------
 */

// 1. Sidebar Component
const Sidebar = ({ isOpen, toggleSidebar, activeTopic, onSelectTopic, completedTopics }) => {
    return (
        <>
            {/* Mobile Backdrop Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-50 md:hidden animate-fade-in"
                    onClick={toggleSidebar}
                />
            )}

            <div className={`fixed inset-y-0 right-0 z-[60] w-72 bg-slate-900 text-slate-100 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} md:relative md:translate-x-0 border-l border-slate-700 flex flex-col shadow-2xl md:shadow-none`}>
                <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800">
                    <h2 className="font-bold text-lg flex items-center gap-2">
                        {Target && <Target className="w-5 h-5 text-blue-400" />}
                        מפת הקורס
                    </h2>
                    <button onClick={toggleSidebar} className="md:hidden p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-white transition-colors">
                        {X && <X className="w-6 h-6" />}
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
                    {COURSE_STRUCTURE.map((section, idx) => (
                        <div key={idx}>
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                                {idx === 0
                                    ? (Briefcase ? <Briefcase className="w-3 h-3" /> : null)
                                    : (DollarSign ? <DollarSign className="w-3 h-3" /> : null)
                                }
                                {section.category}
                            </h3>
                            <ul className="space-y-1">
                                {section.topics.map(topic => {
                                    const isCompleted = completedTopics.includes(topic.id);
                                    const isActive = activeTopic === topic.id;

                                    return (
                                        <li key={topic.id}>
                                            <button
                                                onClick={() => {
                                                    onSelectTopic(topic.id);
                                                    if (window.innerWidth < 768) toggleSidebar();
                                                }}
                                                className={`w-full text-right px-3 py-2 rounded-md text-sm transition-colors flex items-center justify-between group
                          ${isActive ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-300'}
                        `}
                                            >
                                                <span className="truncate">{topic.title}</span>
                                                {isCompleted && Check && <Check className="w-4 h-4 text-green-400 flex-shrink-0" />}
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="p-4 border-t border-slate-700 text-xs text-slate-500 text-center">
                    Marketing Master Class v1.0
                </div>
            </div>
        </>
    );
};

const PHASE_ORDER = ['A', 'B', 'C1', 'C2', 'C3', 'TEST', 'DONE'];

// 2. Phase Manager Component
const PhaseManager = ({ topicId, onCompleteTopic }) => {
    const [currentPhase, setCurrentPhase] = useState('A');
    const [maxPhaseIndex, setMaxPhaseIndex] = useState(0);
    const [content, setContent] = useState(null);
    const [feedback, setFeedback] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [testCurrentQuestion, setTestCurrentQuestion] = useState(0);
    const [testScore, setTestScore] = useState(0);
    const [testAnswers, setTestAnswers] = useState({}); // Track user answers for test

    useEffect(() => {
        // Default fallback if topic doesn't exist
        const data = CONTENT_DB[topicId] || {
            title: "נושא בבנייה",
            phaseA: { scenario: "תוכן יעודכן בקרוב.", question: "", reveal: "" },
            phaseB: { theory: "הנושא עדיין לא זמין.", highlights: [] },
            phaseC: [],
            test: []
        };
        setContent(data);
        setCurrentPhase('A');
        setMaxPhaseIndex(0);
        setFeedback(null);
        setSelectedOption(null);
        setTestCurrentQuestion(0);
        setTestScore(0);
        setTestAnswers({});
    }, [topicId]);

    if (!content) return <div>Loading...</div>;

    const navigateToPhase = (phaseId) => {
        const newIdx = PHASE_ORDER.indexOf(phaseId);
        if (newIdx > maxPhaseIndex) {
            setMaxPhaseIndex(newIdx);
        }
        setCurrentPhase(phaseId);
        setFeedback(null);
        setSelectedOption(null);
    };

    const completePhaseA = () => navigateToPhase('B');
    const completePhaseB = () => navigateToPhase('C1');

    const handleQuizAnswer = (option, targetPhase) => {
        setSelectedOption(option.id);
        if (option.correct) {
            setFeedback({ type: 'success', text: "מצוין! תשובה נכונה." });
            setTimeout(() => {
                setFeedback(null);
                setSelectedOption(null);
                if (targetPhase === 'DONE') {
                    // Not used anymore as we go to TEST first
                    navigateToPhase('TEST');
                } else {
                    navigateToPhase(targetPhase);
                }
            }, 1500);
        } else {
            setFeedback({
                type: 'error',
                text: option.feedback || "תשובה שגויה. נסה שוב.",
                guide: true
            });
        }
    };

    const handleTestAnswer = (optionId, isCorrect) => {
        // Record answer
        const newAnswers = { ...testAnswers, [testCurrentQuestion]: optionId };
        setTestAnswers(newAnswers);

        // Calculate score on the fly (or can be done at end)
        if (isCorrect) {
            setTestScore(prev => prev + 1);
        }

        // Show immediate feedback/move to next
        setTimeout(() => {
            if (testCurrentQuestion < (content.test.length - 1)) {
                setTestCurrentQuestion(prev => prev + 1);
            } else {
                onCompleteTopic(topicId);
                navigateToPhase('DONE');
            }
        }, 500);
    };

    const renderFormattedText = (text) => {
        if (!text) return null;
        const parts = text.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, index) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return (
                    <span key={index} className="font-bold text-blue-700 bg-blue-50 px-1 rounded-md mx-0.5 shadow-sm">
                        {part.slice(2, -2)}
                    </span>
                );
            }
            return part;
        });
    };

    const renderProgressBar = () => {
        const steps = [
            { id: 'A', label: 'דילמה', icon: Zap },
            { id: 'B', label: 'תיאוריה', icon: Book },
            { id: 'C1', label: 'יישום', icon: Check },
            { id: 'C2', label: 'עומק', icon: InfoIcon },
            { id: 'C3', label: 'שליטה', icon: Star },
            { id: 'TEST', label: 'מבחן', icon: Award }
        ];

        const getCurrentIndex = () => {
            if (currentPhase === 'DONE') return 6;
            if (currentPhase === 'TEST') return 5;
            if (currentPhase.startsWith('C')) return 2 + parseInt(currentPhase[1]) - 1;
            if (currentPhase === 'B') return 1;
            return 0;
        }

        const currIdx = getCurrentIndex();

        return (
            <div className="flex items-center justify-between mb-8 px-2" dir="rtl">
                {steps.map((step, idx) => {
                    const Icon = step.icon;
                    return (
                        <div key={step.id} className="flex flex-col items-center relative z-10 flex-1">
                            <button
                                onClick={() => {
                                    // Unrestricted navigation:
                                    if (step.id === 'TEST') setCurrentPhase('TEST');
                                    else if (step.id.startsWith('C')) setCurrentPhase(step.id);
                                    else if (step.id === 'B') setCurrentPhase('B');
                                    else setCurrentPhase('A');
                                }}
                                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 cursor-pointer
                      ${idx < currIdx ? 'bg-green-500 text-white hover:bg-green-600' :
                                        idx === currIdx ? 'bg-blue-600 text-white ring-4 ring-blue-100' :
                                            'bg-slate-300 text-slate-700 hover:bg-slate-400'}
                    `}
                            >
                                {idx < currIdx
                                    ? (Check ? <Check className="w-5 h-5" /> : null)
                                    : (Icon ? <Icon className="w-4 h-4" /> : null)
                                }
                            </button>
                            <span className={`text-[10px] sm:text-xs mt-2 font-medium transition-colors ${idx === currIdx ? 'text-blue-700' : 'text-slate-600'}`}>
                                {step.label}
                            </span>
                            {idx !== steps.length - 1 && (
                                <div className={`absolute top-4 right-1/2 w-full h-1 -z-10 transition-colors
                    ${idx < currIdx ? 'bg-green-500' : 'bg-slate-200'}`}
                                />
                            )}
                        </div>
                    );
                })}
            </div>
        );
    };

    const renderPhaseA = () => (
        <div className="animate-fade-in space-y-6 max-w-2xl mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-purple-500">
                <div className="flex items-center gap-3 mb-4 text-purple-700">
                    {Zap && <Zap className="w-6 h-6" />}
                    <h2 className="text-xl font-bold">האתגר הניהולי (The Hook)</h2>
                </div>
                <p className="text-lg leading-relaxed text-slate-700 mb-8">
                    {renderFormattedText(content.phaseA.scenario)}
                </p>
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-100 mb-6">
                    <p className="font-semibold text-purple-900">{renderFormattedText(content.phaseA.question)}</p>
                </div>

                {feedback?.revealed ? (
                    <div className="animate-slide-up bg-slate-50 p-6 rounded-lg border border-slate-200 mb-6">
                        <h3 className="font-bold text-slate-900 mb-2">הפיצוח:</h3>
                        <p className="text-slate-700">{renderFormattedText(content.phaseA.reveal)}</p>
                    </div>
                ) : null}

                {!feedback?.revealed ? (
                    <button
                        onClick={() => setFeedback({ revealed: true })}
                        className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold transition-colors"
                    >
                        גלה את התשובה
                    </button>
                ) : (
                    <button
                        onClick={completePhaseA}
                        className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold flex items-center justify-center gap-2"
                    >
                        <span>עבור לתיאוריה</span>
                        {ChevronLeft && <ChevronLeft className="w-5 h-5" />}
                    </button>
                )}
            </div>
        </div>
    );

    const renderPhaseB = () => (
        <div className="animate-fade-in max-w-3xl mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-blue-500">
                <div className="flex items-center gap-3 mb-6 text-blue-700">
                    {Book && <Book className="w-6 h-6" />}
                    <h2 className="text-xl font-bold">מודל עבודה ותיאוריה</h2>
                </div>

                <div className="prose prose-slate max-w-none text-slate-700 mb-8 leading-loose">
                    {content.phaseB.theory.split('\n').map((line, i) => {
                        if (line.trim() === '') return null;
                        if (line.trim().startsWith('[DIAGRAM:')) {
                            const diagramType = line.match(/\[DIAGRAM: (.*?)\]/)?.[1];
                            return <CourseDiagram key={i} type={diagramType} />;
                        }
                        if (line.startsWith('###')) return <h3 key={i} className="text-xl font-bold text-slate-800 mt-6 mb-3 border-b pb-2">{renderFormattedText(line.replace('###', ''))}</h3>;

                        // Uses MathFormula for $$ lines
                        if (line.startsWith('$$')) return <MathFormula key={i} formula={line.replace(/\$\$/g, '').trim()} />;

                        if (line.startsWith('####')) return <h4 key={i} className="text-lg font-bold text-blue-700 mt-4 mb-2">{renderFormattedText(line.replace('####', ''))}</h4>;
                        if (line.startsWith('*')) return <li key={i} className="mr-4 marker:text-blue-500 pr-2 list-disc list-inside">{renderFormattedText(line.replace('*', ''))}</li>;
                        if (/^\d+\./.test(line)) return <p key={i} className="mr-4 font-medium mt-2 text-slate-900">{renderFormattedText(line)}</p>;
                        return <p key={i} className="mb-2 leading-relaxed">{renderFormattedText(line)}</p>;
                    })}
                </div>

                <div className="flex flex-wrap gap-2 mb-8 border-t pt-4">
                    <span className="text-xs font-bold text-slate-400 ml-2 mt-1">מושגי מפתח:</span>
                    {content.phaseB.highlights.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm font-medium border border-slate-200">
                            {tag}
                        </span>
                    ))}
                </div>

                <button
                    onClick={completePhaseB}
                    className="w-full py-4 bg-gradient-to-l from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-200 flex items-center justify-center gap-2 transform transition hover:scale-[1.02]"
                >
                    {Zap && <Zap className="w-6 h-6" />}
                    <span>הבנתי, בוא נתרגל</span>
                </button>
            </div>
        </div>
    );

    const renderPhaseC = (levelIndex, targetPhase) => {
        // Graceful handling if fewer questions exist
        if (!content.phaseC || !content.phaseC[levelIndex]) {
            if (targetPhase === 'TEST') {
                // If we skip the last question, go to test
                setTimeout(() => navigateToPhase('TEST'), 0);
                return <div>Loading Test...</div>;
            }
            // Skip to next phase automatically
            setTimeout(() => navigateToPhase(targetPhase), 0);
            return <div>Loading next question...</div>;
        }

        const drill = content.phaseC[levelIndex];

        return (
            <div className="animate-fade-in max-w-2xl mx-auto">
                <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-slate-200">
                    <div className={`p-4 text-white flex justify-between items-center
                    ${levelIndex === 0 ? 'bg-emerald-500' : levelIndex === 1 ? 'bg-orange-500' : 'bg-red-600'}
                `}>
                        <div className="flex items-center gap-2 font-bold">
                            {levelIndex === 0 ? (Check ? <Check /> : null) : levelIndex === 1 ? (InfoIcon ? <InfoIcon /> : null) : (Star ? <Star /> : null)}
                            <span>אתגר {levelIndex + 1}: {drill.level}</span>
                        </div>
                        <span className="text-xs bg-white/20 px-2 py-1 rounded">
                            שאלה {levelIndex + 1}
                        </span>
                    </div>

                    <div className="p-8">
                        <p className="text-lg font-medium text-slate-800 mb-8">
                            {renderFormattedText(drill.question)}
                        </p>

                        <div className="space-y-3">
                            {drill.options.map(option => (
                                <button
                                    key={option.id}
                                    disabled={!!feedback && feedback.type === 'success'}
                                    onClick={() => handleQuizAnswer(option, targetPhase)}
                                    className={`w-full text-right p-4 rounded-lg border transition-all duration-200 flex items-start gap-3
                                    ${selectedOption === option.id
                                            ? (option.correct ? 'bg-green-50 border-green-500 ring-1 ring-green-500' : 'bg-red-50 border-red-500 ring-1 ring-red-500')
                                            : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                                        }
                                    ${!!feedback && feedback.type === 'success' && !option.correct ? 'opacity-50' : ''}
                                `}
                                >
                                    <div className={`mt-1 w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0
                                     ${selectedOption === option.id
                                            ? (option.correct ? 'border-green-600 text-green-600' : 'border-red-600 text-red-600')
                                            : 'border-slate-300'
                                        }
                                `}>
                                        {selectedOption === option.id && <div className={`w-2.5 h-2.5 rounded-full ${option.correct ? 'bg-green-600' : 'bg-red-600'}`} />}
                                    </div>
                                    <span className="text-slate-700">{renderFormattedText(option.text)}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {feedback && (
                        <div className={`p-6 border-t ${feedback.type === 'success' ? 'bg-green-50 border-green-100' : 'bg-amber-50 border-amber-100'}`}>
                            <div className="flex gap-3">
                                {feedback.type === 'success' ? (
                                    Check && <Check className="w-6 h-6 text-green-600 flex-shrink-0" />
                                ) : (
                                    Zap && <Zap className="w-6 h-6 text-amber-600 flex-shrink-0" />
                                )}
                                <div>
                                    <h4 className={`font-bold mb-1 ${feedback.type === 'success' ? 'text-green-800' : 'text-amber-800'}`}>
                                        {feedback.type === 'success' ? 'כל הכבוד!' : 'לא בדיוק...'}
                                    </h4>
                                    <p className={`text-sm ${feedback.type === 'success' ? 'text-green-700' : 'text-amber-800'}`}>
                                        {renderFormattedText(feedback.text)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const renderTest = () => {
        if (!content.test || content.test.length === 0) {
            return <div className="p-8 text-center">לא נמצאו שאלות למבחן זה.</div>
        }

        const question = content.test[testCurrentQuestion];
        const isAnswered = testAnswers[testCurrentQuestion] !== undefined;

        return (
            <div className="animate-fade-in max-w-2xl mx-auto">
                <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-slate-200">
                    <div className="p-4 bg-slate-800 text-white flex justify-between items-center">
                        <div className="flex items-center gap-2 font-bold">
                            {Award && <Award className="w-5 h-5 text-yellow-400" />}
                            <span>מבחן מסכם</span>
                        </div>
                        <span className="text-xs bg-white/20 px-2 py-1 rounded">
                            שאלה {testCurrentQuestion + 1} מתוך {content.test.length}
                        </span>
                    </div>

                    <div className="p-8">
                        <p className="text-lg font-medium text-slate-800 mb-8">
                            {renderFormattedText(question.question)}
                        </p>

                        <div className="space-y-3">
                            {question.options.map(option => {
                                const isSelected = testAnswers[testCurrentQuestion] === option.id;
                                let optionClass = 'bg-white border-slate-200 hover:bg-slate-50';

                                if (isAnswered) {
                                    if (option.correct) optionClass = 'bg-green-100 border-green-500 text-green-900';
                                    else if (isSelected) optionClass = 'bg-red-100 border-red-500 text-red-900';
                                    else optionClass = 'bg-slate-50 border-slate-200 opacity-50';
                                }

                                return (
                                    <button
                                        key={option.id}
                                        disabled={isAnswered}
                                        onClick={() => handleTestAnswer(option.id, option.correct)}
                                        className={`w-full text-right p-4 rounded-lg border transition-all duration-200 flex items-start gap-3 ${optionClass}`}
                                    >
                                        <div className={`mt-1 w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0
                                        ${isAnswered && option.correct ? 'border-green-600 bg-green-600 text-white' :
                                                isAnswered && isSelected ? 'border-red-600 bg-red-600 text-white' : 'border-slate-300'}
                                    `}>
                                            {isAnswered && option.correct && Check && <Check className="w-3 h-3" />}
                                            {isAnswered && isSelected && !option.correct && X && <X className="w-3 h-3" />}
                                        </div>
                                        <span className="">{renderFormattedText(option.text)}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderDone = () => (
        <div className="text-center py-12 animate-fade-in">
            <div className="inline-block p-6 bg-green-100 rounded-full mb-6">
                {Star && <Star className="w-16 h-16 text-green-600" />}
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">יחידה הושלמה!</h2>

            {content.test && content.test.length > 0 && (
                <div className="mb-6">
                    <span className="text-lg text-slate-600">ציון במבחן:</span>
                    <div className="text-4xl font-bold text-blue-600 mt-2">
                        {testScore} / {content.test.length}
                    </div>
                </div>
            )}

            <p className="text-xl text-slate-600 max-w-lg mx-auto mb-8">
                השלמת בהצלחה את הנושא <strong>{content.title}</strong>.
            </p>
            <button
                onClick={() => {
                    setCurrentPhase('A');
                }}
                className="px-8 py-3 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 transition"
            >
                חזור על היחידה
            </button>
        </div>
    )

    return (
        <div className="p-4 md:p-8 h-full overflow-y-auto bg-slate-50 relative">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">{content.title}</h1>
            <p className="text-slate-500 mb-8">אסטרטגיה שיווקית</p>

            {renderProgressBar()}

            <div className="pb-20">
                {currentPhase === 'A' && renderPhaseA()}
                {currentPhase === 'B' && renderPhaseB()}
                {currentPhase === 'C1' && renderPhaseC(0, 'C2')}
                {currentPhase === 'C2' && renderPhaseC(1, 'C3')}
                {currentPhase === 'C3' && renderPhaseC(2, 'TEST')}
                {currentPhase === 'TEST' && renderTest()}
                {currentPhase === 'DONE' && renderDone()}
            </div>
        </div>
    );
};

// 3. Welcome Screen
const WelcomeScreen = ({ onStart }) => {
    return (
        <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-slate-50">
            <div className="bg-white p-12 rounded-2xl shadow-xl max-w-2xl border border-slate-200">
                {Target && <Target className="w-20 h-20 text-blue-600 mx-auto mb-6" />}
                <h1 className="text-4xl font-extrabold text-slate-900 mb-4">
                    אסטרטגיה שיווקית
                </h1>
                <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                    מערכת למידה אינטראקטיבית למושגי יסוד בשיווק.
                    <br />
                    נלמד לנתח ערך, פילוח, מיצוב וניהול מותג.
                </p>
                <div className="space-y-4">
                    <div className="flex justify-center gap-4 text-sm text-slate-600 mb-8">
                        <span className="flex items-center gap-1">{Zap && <Zap className="w-4 h-4" />} דילמה</span>
                        {ChevronLeft && <ChevronLeft className="w-4 h-4 mt-1" />}
                        <span className="flex items-center gap-1">{Book && <Book className="w-4 h-4" />} תיאוריה</span>
                        {ChevronLeft && <ChevronLeft className="w-4 h-4 mt-1" />}
                        <span className="flex items-center gap-1">{Award && <Award className="w-4 h-4" />} מבחן</span>
                    </div>
                </div>
                <button
                    onClick={onStart}
                    className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold rounded-xl shadow-lg shadow-blue-200 transition-all hover:scale-105"
                >
                    התחל ללמוד
                </button>
            </div>
        </div>
    )
}

/**
 * MAIN APP COMPONENT
 */
const App = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeTopic, setActiveTopic] = useState(null);
    const [completedTopics, setCompletedTopics] = useState([]);
    const [isInitialized, setIsInitialized] = useState(false);

    // Toggle sidebar on mobile
    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    const handleTopicCompletion = (topicId) => {
        if (!completedTopics.includes(topicId)) {
            setCompletedTopics([...completedTopics, topicId]);
        }
    };

    const handleSelectTopic = (topicId) => {
        setActiveTopic(topicId);
        setIsInitialized(true);
    };

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden font-sans" dir="rtl">

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 text-white z-40 flex items-center px-4 justify-between shadow-md">
                <button onClick={toggleSidebar} className="p-2">
                    {sidebarOpen ? (X ? <X className="w-6 h-6" /> : null) : (Menu ? <Menu className="w-6 h-6" /> : null)}
                </button>
                <span className="font-bold">אסטרטגיה שיווקית</span>
            </div>

            {/* Main Layout */}
            <div className="flex w-full h-full pt-16 md:pt-0 relative">

                {/* Sidebar */}
                <Sidebar
                    isOpen={sidebarOpen}
                    toggleSidebar={toggleSidebar}
                    activeTopic={activeTopic}
                    onSelectTopic={handleSelectTopic}
                    completedTopics={completedTopics}
                />

                {/* Main Content Area */}
                <main className="flex-1 h-full relative overflow-hidden">
                    {!isInitialized ? (
                        <WelcomeScreen onStart={() => {
                            setIsInitialized(true);
                            setSidebarOpen(false);
                            // Open first topic automatically if desired, or let user choose
                        }} />
                    ) : !activeTopic ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8 text-center animate-fade-in">
                            {Target && <Target className="w-24 h-24 mb-4 text-slate-200" />}
                            <h2 className="text-2xl font-bold text-slate-600 mb-2">בחר נושא</h2>
                            <p>בחר נושא מתפריט הצד כדי להתחיל ללמוד.</p>
                            <button onClick={() => setSidebarOpen(true)} className="mt-6 md:hidden text-blue-600 font-bold flex items-center gap-2 mx-auto">
                                {Menu && <Menu className="w-5 h-5" />}
                                פתח תפריט
                            </button>
                        </div>
                    ) : (
                        <PhaseManager
                            topicId={activeTopic}
                            onCompleteTopic={handleTopicCompletion}
                        />
                    )}
                </main>
            </div>

            {/* Global CSS for Tailwind extensions */}
            <style>{`
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
            from { opacity: 0; height: 0; }
            to { opacity: 1; height: auto; }
        }
        .animate-fade-in {
            animation: fadeIn 0.5s ease-out forwards;
        }
        .animate-slide-up {
            animation: slideUp 0.3s ease-out forwards;
        }
        
        /* Custom Scrollbar */
        .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent; 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: #334155; /* slate-700 */
            border-radius: 20px;
            border: 2px solid transparent;
            background-clip: content-box;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background-color: #475569; /* slate-600 */
        }
        /* Firefox fallback */
        .custom-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: #334155 transparent;
        }
      `}</style>
        </div>
    );
};

export default App;