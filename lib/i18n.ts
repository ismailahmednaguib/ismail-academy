export type Locale = "ar" | "en";

export const localeCopy = {
  ar: {
    languageName: "العربية",
    switchLabel: "English",
    skipToContent: "تخطى إلى المحتوى",
    context: "مكتبة معرفة · مجتمع · مجلس",
    search: "البحث",
    account: "الحساب",
    owner: "لوحة المالك",
    menu: "فتح القائمة",
    home: "الرئيسية",
    courses: "الدورات",
    lessons: "الدروس",
    majalis: "المجالس",
    articles: "المقالات",
    library: "المكتبة",
    quickNavigation: "تنقل سريع",
    lightMode: "نهاري",
    darkMode: "ليلي",
    enableLight: "تفعيل الوضع النهاري",
    enableDark: "تفعيل الوضع الليلي",
  },
  en: {
    languageName: "English",
    switchLabel: "العربية",
    skipToContent: "Skip to content",
    context: "Knowledge · Community · Gatherings",
    search: "Search",
    account: "Account",
    owner: "Owner dashboard",
    menu: "Open menu",
    home: "Home",
    courses: "Courses",
    lessons: "Lessons",
    majalis: "Gatherings",
    articles: "Articles",
    library: "Library",
    quickNavigation: "Quick navigation",
    lightMode: "Light",
    darkMode: "Dark",
    enableLight: "Enable light mode",
    enableDark: "Enable dark mode",
  },
} as const;

/** Bilingual content convention for owner-managed text: Arabic text || English text. */
export function localize(value: string | undefined, locale: Locale, fallback = "") {
  const raw = (value ?? "").trim();
  if (!raw) return fallback;
  const [arabic, english] = raw.split(/\s*\|\|\s*/, 2).map((part) => part.trim());
  if (locale === "en") return english || arabic || fallback;
  return arabic || fallback;
}
