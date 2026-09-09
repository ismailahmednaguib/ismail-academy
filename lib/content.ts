import { createClient } from "@supabase/supabase-js";

export type Settings = {
  name: string;
  tagline: string;
  heroTitle: string;
  heroText: string;
  announcement: string;
  email: string;
  telegram: string;
  majlisTitle: string;
  majlisText: string;
  majlisDate: string;
  majlisTopic: string;
  majlisMeta: string;
  majlisQuote: string;
};

export const defaultSettings: Settings = {
  name: "أكاديمية إسماعيل أحمد نجيب",
  tagline: "علمٌ يُفهم، وأثرٌ يبقى",
  heroTitle: "رحلة هادئة نحو علمٍ أنفع وحياةٍ أصفى.",
  heroText:
    "مساحة عربية تجمع الدروس المنتقاة، المجالس، المقالات والمكتبة؛ لتتعلم بخطوات واضحة وتعود إلى ما ينفعك كل يوم.",
  announcement: "المجلس القادم: كيف نبدأ طلب العلم بثبات؟ الخميس بعد المغرب",
  email: "hello@example.com",
  telegram: "@your_username",
  majlisTitle: "مجلس يقرّب العلم إلى الحياة.",
  majlisText: "نلتقي في مجالس خفيفة، نقرأ فيها ونتدارس ونخرج بخطوة عملية.",
  majlisDate: "الخميس | 18 | صفر",
  majlisTopic: "كيف نبدأ طلب العلم بثبات؟",
  majlisMeta: "بعد صلاة المغرب · لقاء مباشر",
  majlisQuote: "أحب الأعمال إلى الله أدومها وإن قل.",
};

// Row shape per section (kept as string[] to stay compatible with the
// existing pipe-separated admin textareas):
// courses:  [title, desc, count, level, num]
// lessons:  [title, meta, audioUrl?]
// articles: [title, category, time, body?]   body paragraphs separated by literal "\n"
// books:    [title, meta, fileUrl?]

export const initialCourses: string[][] = [
  ["مدخل إلى طلب العلم", "خارطة عملية لبداية متوازنة، من النية حتى تنظيم الوقت.", "6 دروس", "مبتدئ", "01"],
  ["تدبر القرآن", "مفاتيح بسيطة للتعامل اليومي مع كتاب الله بفهم وحضور.", "8 دروس", "متوسط", "02"],
  ["فقه القلب", "دروس قصيرة في الإخلاص والصبر والرجاء وما يصلح القلب.", "5 دروس", "مبتدئ", "03"],
];

export const initialArticles: string[][] = [
  [
    "كيف تبني وردًا علميًا لا ينقطع؟",
    "منهجية",
    "7 دقائق",
    "أكبر سبب لانقطاع الورد العلمي ليس ضعف الهمة، بل ضخامة الخطة من أول يوم.\\nابدأ بجرعة صغيرة يمكنك المحافظة عليها ستة أشهر متواصلة، لا بجرعة كبيرة تنطفئ بعد أسبوع.\\nاجعل ورقة المتابعة أمامك، وقِس نفسك بالاستمرار لا بالكمّ.",
  ],
  [
    "ليس كل ما تعرفه يجب أن تقوله",
    "تزكية",
    "4 دقائق",
    "من فقه العلم معرفة موضع الكلام وموضع الصمت.\\nبعض العلم يُقال، وبعضه يُدَّخر لوقته، وبعضه يكفي أن يُعمل به دون أن يُتحدّث عنه.\\nمجرد العلم بالمسألة ليس مبررًا كافيًا لنشرها في كل مجلس.",
  ],
  [
    "ثلاثة أسئلة قبل اختيار كتاب جديد",
    "قراءة",
    "5 دقائق",
    "قبل أن تبدأ كتابًا جديدًا اسأل نفسك: هل أنهيت ما بين يديّ؟ هل هذا الكتاب يناسب مرحلتي الآن؟ وهل قرأت عن مؤلفه ومنهجه أولًا؟\\nهذه الأسئلة الثلاثة تحميك من مكتبة مليئة بالبدايات بلا نهايات.",
  ],
];

export const initialBooks: string[][] = [
  ["مختارات في آداب طالب العلم", "PDF · 2.4 MB"],
  ["دفتر متابعة الورد اليومي", "PDF · قابل للطباعة"],
  ["دليل المبتدئ إلى القراءة النافعة", "PDF · 1.8 MB"],
];

export const initialLessons: string[][] = [
  ["كيف تضبط نيتك قبل البدء؟", "من مسار مدخل إلى طلب العلم · 12 دقيقة"],
  ["طريقة عملية لتلخيص درسٍ واحد", "من مسار مدخل إلى طلب العلم · 12 دقيقة"],
  ["متى تراجع ما تعلّمته؟", "من مسار مدخل إلى طلب العلم · 12 دقيقة"],
];

export type AcademyContent = {
  settings: Settings;
  courses: string[][];
  articles: string[][];
  books: string[][];
  lessons: string[][];
};

/** Arabic-friendly slug: strips diacritics/punctuation, keeps the script, spaces -> hyphens. */
export function slugify(text: string): string {
  return text
    .normalize("NFKC")
    .trim()
    .replace(/[\u064B-\u0652]/g, "") // tanween / diacritics
    .replace(/[«»"'’‘“”!.,:؛؟?()]/g, "")
    .replace(/\s+/g, "-");
}

export function findBySlug(items: string[][], slug: string): string[] | undefined {
  return items.find((item) => slugify(item[0]) === slug);
}

// A server-safe client (works in Server Components / route handlers).
// Kept separate from lib/supabase.ts, which is marked "use client" for the
// interactive homepage, to avoid crossing that boundary unnecessarily.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const supabaseServer = url && key ? createClient(url, key) : null;

export async function getSiteContent(): Promise<AcademyContent> {
  const base: AcademyContent = {
    settings: defaultSettings,
    courses: initialCourses,
    articles: initialArticles,
    books: initialBooks,
    lessons: initialLessons,
  };
  if (!supabaseServer) return base;
  try {
    const { data } = await supabaseServer
      .from("site_content")
      .select("payload")
      .eq("id", "main")
      .single();
    const payload = data?.payload as Partial<AcademyContent> | undefined;
    if (!payload) return base;
    return {
      settings: { ...defaultSettings, ...(payload.settings ?? {}) },
      courses: payload.courses?.length ? payload.courses : initialCourses,
      articles: payload.articles?.length ? payload.articles : initialArticles,
      books: payload.books?.length ? payload.books : initialBooks,
      lessons: payload.lessons?.length ? payload.lessons : initialLessons,
    };
  } catch {
    return base;
  }
}
