import { createClient } from "@supabase/supabase-js";

export type Settings = {
  mark: string;
  brandImage: string;
  heroKicker: string;
  heroVerse: string;
  heroVerseSource: string;
  inkColor: string;
  goldColor: string;
  goldSoftColor: string;
  accentColor: string;
  accentSoftColor: string;
  paperColor: string;
  creamColor: string;
  sageColor: string;
  colorMode: "light" | "dark";
  siteDensity: "airy" | "balanced" | "compact";
  layoutStyle: "bento" | "editorial" | "minimal";
  cornerStyle: "soft" | "rounded" | "sharp";
  showBackToTop: boolean;
  showReadingProgress: boolean;
  showRelatedContent: boolean;
  buttonStyle: "pill" | "classic" | "outline";
  showMobileBar: boolean;
  showAnnouncement: boolean;
  showIntro: boolean;
  showCourses: boolean;
  showLessons: boolean;
  showMajlis: boolean;
  showArticles: boolean;
  showLibrary: boolean;
  showNewsletter: boolean;
  showCommunity: boolean;
  showHomeSignals: boolean;
  showHomeDirectory: boolean;
  showHero: boolean;
  showSearch: boolean;
  showWorldGlobe: boolean;
  showLearningShelf: boolean;
  showSpotlight: boolean;
  showStudyMomentum: boolean;
  showFooter: boolean;
  showBrandImage: boolean;
  showNexusHeader: boolean;
  showNexusSearch: boolean;
  showNexusLanguage: boolean;
  showNexusTheme: boolean;
  showNexusHero: boolean;
  showNexusHeroTag: boolean;
  showNexusHeroProof: boolean;
  showNexusHeroPanel: boolean;
  showNexusPanelStats: boolean;
  showNexusAnnouncementAction: boolean;
  showNexusRail: boolean;
  showNexusIntent: boolean;
  showNexusAccount: boolean;
  showNexusHeroSecondary: boolean;
  showNexusStart: boolean;
  showNexusFeatured: boolean;
  showNexusFeatureMeta: boolean;
  showNexusFlow: boolean;
  showNexusFlowSteps: boolean;
  showNexusDesk: boolean;
  showNexusDeskList: boolean;
  showNexusEvent: boolean;
  showNexusEventQuote: boolean;
  showNexusNewsletter: boolean;
  showNexusNewsletterForm: boolean;
  showNexusFooter: boolean;
  nexusSkipLink: string;
  nexusAcademyLabel: string;
  nexusTodayLabel: string;
  nexusAvailableLabel: string;
  nexusNextStepLabel: string;
  nexusStartLessonLabel: string;
  nexusSearchLabel: string;
  nexusMenuLabel: string;
  nexusSearchAriaLabel: string;
  nexusWebsiteFieldLabel: string;
  nexusReadFallbackLabel: string;
  nexusCoursesCountLabel: string;
  nexusMaterialsCountLabel: string;
  nexusAlwaysLabel: string;
  nexusIntentQuestion: string;
  nexusIntentStartLabel: string;
  nexusIntentQuickLabel: string;
  nexusIntentReadLabel: string;
  nexusRailIntro: string;
  nexusRailCourses: string;
  nexusRailMaterials: string;
  nexusRailAudience: string;
  nexusStartEyebrow: string;
  nexusStartTitle: string;
  nexusStartText: string;
  nexusMaterialCountLabel: string;
  nexusFeaturedEyebrow: string;
  nexusFeaturedTitle: string;
  nexusExploreAllLabel: string;
  nexusPathLabel: string;
  nexusOpenLabel: string;
  nexusReadTodayLabel: string;
  nexusLibraryLabel: string;
  nexusFlowEyebrow: string;
  nexusFlowTitle: string;
  nexusFlowText: string;
  nexusFlowChooseTitle: string;
  nexusFlowChooseText: string;
  nexusFlowDeepenTitle: string;
  nexusFlowDeepenText: string;
  nexusFlowContinueTitle: string;
  nexusFlowContinueText: string;
  nexusDeskEyebrow: string;
  nexusDeskTitle: string;
  nexusDeskText: string;
  nexusSendingLabel: string;
  dashboardKicker: string;
  dashboardTitle: string;
  dashboardProgressLabel: string;
  dashboardProgressHelp: string;
  dashboardQueueKicker: string;
  dashboardQueueTitle: string;
  dashboardQueueText: string;
  dashboardStartLabel: string;
  dashboardRecentLabel: string;
  dashboardSavedLabel: string;
  dashboardSuggestedLabel: string;
  dashboardRemainingLabel: string;
  dashboardFinishedKicker: string;
  dashboardFinishedTitle: string;
  dashboardFinishedText: string;
  dashboardExploreLabel: string;
  dashboardSavedTitle: string;
  dashboardCompletedTitle: string;
  dashboardSavedEmpty: string;
  dashboardCompletedEmpty: string;
  detailRelatedEyebrow: string;
  detailRelatedTitle: string;
  detailRelatedText: string;
  homeLeadKicker: string;
  homeLeadTitle: string;
  homeLeadText: string;
  homeLeadPrimaryCta: string;
  homeLeadSecondaryCta: string;
  heroTrustOne: string;
  heroTrustTwo: string;
  heroTrustThree: string;
  heroLiveLabel: string;
  heroPathsLabel: string;
  heroPathsMeta: string;
  heroMaterialsLabel: string;
  heroMaterialsMeta: string;
  heroWorldLabel: string;
  heroWorldMeta: string;
  spotlightEyebrow: string;
  spotlightTitle: string;
  spotlightText: string;
  spotlightCourseLabel: string;
  spotlightLessonLabel: string;
  spotlightArticleLabel: string;
  spotlightLinkLabel: string;
  homeMapEyebrow: string;
  homeMapTitle: string;
  homeMapText: string;
  homeExploreEyebrow: string;
  homeExploreTitle: string;
  homeExploreText: string;
  homeExploreCoursesText: string;
  homeExploreLessonsText: string;
  homeExploreArticlesText: string;
  homeExploreLibraryText: string;
  homeSectionOrder: string[];
  navHome: string;
  navCourses: string;
  navLessons: string;
  navMajlis: string;
  navArticles: string;
  navLibrary: string;
  announcementButton: string;
  heroPrimaryCta: string;
  heroSecondaryCta: string;
  heroMetricLessonsLabel: string;
  heroMetricCoursesLabel: string;
  heroMetricFreeValue: string;
  heroMetricFreeLabel: string;
  homeSignalsCoursesLabel: string;
  homeSignalsCoursesText: string;
  homeSignalsContentLabel: string;
  homeSignalsContentText: string;
  homeSignalsCommunityLabel: string;
  homeSignalsCommunityText: string;
  homeDirectoryEyebrow: string;
  homeDirectoryTitle: string;
  homeDirectoryText: string;
  homeDirectoryCoursesText: string;
  homeDirectoryLessonsText: string;
  homeDirectoryArticlesText: string;
  homeDirectoryLibraryText: string;
  floatingCardTitle: string;
  floatingCardText: string;
  floatingCardStatus: string;
  searchPlaceholder: string;
  coursesEyebrow: string;
  coursesTitle: string;
  coursesLink: string;
  lessonsEyebrow: string;
  lessonsTitle: string;
  lessonsLink: string;
  majlisEyebrow: string;
  majlisButton: string;
  articlesEyebrow: string;
  articlesTitle: string;
  articlesLink: string;
  libraryEyebrow: string;
  libraryTitle: string;
  libraryText: string;
  libraryButton: string;
  newsletterEyebrow: string;
  newsletterInputPlaceholder: string;
  newsletterButton: string;
  communityEyebrow: string;
  communityTitle: string;
  communityText: string;
  footerCopyright: string;
  ownerPanelLabel: string;
  emailLabel: string;
  telegramLabel: string;
  whatsappLabel: string;
  instagramLabel: string;
  youtubeLabel: string;
  searchNoResults: string;
  listenLabel: string;
  readArticleLabel: string;
  downloadSoonLabel: string;
  name: string;
  tagline: string;
  heroTitle: string;
  heroText: string;
  announcement: string;
  email: string;
  telegram: string;
  whatsapp: string;
  instagram: string;
  youtube: string;
  showContactLinks: boolean;
  introEyebrow: string;
  introTitle: string;
  introText: string;
  newsletterTitle: string;
  newsletterText: string;
  majlisTitle: string;
  majlisText: string;
  majlisDate: string;
  majlisTopic: string;
  majlisMeta: string;
  majlisQuote: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  canonicalUrl: string;
};

export const defaultSettings: Settings = {
  mark: "ا",
  brandImage: "",
  heroKicker: "بِسْمِ اللهِ نَبْدَأُ",
  heroVerse: "وَقُلْ رَبِّ زِدْنِي عِلْمًا",
  heroVerseSource: "طه · 114",
  inkColor: "#173a35",
  goldColor: "#b8893e",
  goldSoftColor: "#e4c888",
  accentColor: "#ef9a78",
  accentSoftColor: "#f6c7aa",
  paperColor: "#fbfaf5",
  creamColor: "#f3f0e6",
  sageColor: "#dce9df",
  colorMode: "light",
  siteDensity: "balanced",
  layoutStyle: "bento",
  cornerStyle: "rounded",
  showBackToTop: true,
  showReadingProgress: true,
  showRelatedContent: true,
  buttonStyle: "classic",
  showMobileBar: true,
  showAnnouncement: true,
  showIntro: true,
  showCourses: true,
  showLessons: true,
  showMajlis: true,
  showArticles: true,
  showLibrary: true,
  showNewsletter: true,
  showCommunity: true,
  showHomeSignals: false,
  showHomeDirectory: true,
  showHero: true,
  showSearch: true,
  showWorldGlobe: true,
  showLearningShelf: true,
  showSpotlight: true,
  showStudyMomentum: true,
  showFooter: true,
  showBrandImage: true,
  showNexusHeader: true,
  showNexusSearch: true,
  showNexusLanguage: true,
  showNexusTheme: true,
  showNexusHero: true,
  showNexusHeroTag: true,
  showNexusHeroProof: true,
  showNexusHeroPanel: true,
  showNexusPanelStats: true,
  showNexusAnnouncementAction: true,
  showNexusRail: true,
  showNexusIntent: true,
  showNexusAccount: true,
  showNexusHeroSecondary: true,
  showNexusStart: true,
  showNexusFeatured: true,
  showNexusFeatureMeta: true,
  showNexusFlow: true,
  showNexusFlowSteps: true,
  showNexusDesk: true,
  showNexusDeskList: true,
  showNexusEvent: true,
  showNexusEventQuote: true,
  showNexusNewsletter: true,
  showNexusNewsletterForm: true,
  showNexusFooter: true,
  nexusSkipLink: "تخطى إلى المحتوى",
  nexusAcademyLabel: "ACADEMY 01",
  nexusTodayLabel: "جلسة اليوم",
  nexusAvailableLabel: "متاح",
  nexusNextStepLabel: "الخطوة التالية",
  nexusStartLessonLabel: "ابدأ الدرس",
  nexusSearchLabel: "بحث",
  nexusMenuLabel: "القائمة",
  nexusSearchAriaLabel: "البحث",
  nexusWebsiteFieldLabel: "الموقع الإلكتروني",
  nexusReadFallbackLabel: "قراءة قصيرة",
  nexusCoursesCountLabel: "مسارات",
  nexusMaterialsCountLabel: "مواد",
  nexusAlwaysLabel: "متاح دائمًا",
  nexusIntentQuestion: "ماذا تحتاج الآن؟",
  nexusIntentStartLabel: "أبدأ من الصفر",
  nexusIntentQuickLabel: "درس سريع",
  nexusIntentReadLabel: "قراءة",
  nexusRailIntro: "تعلم منظم",
  nexusRailCourses: "مسارات تعليمية",
  nexusRailMaterials: "درسًا وقراءة",
  nexusRailAudience: "مصمم للعالم العربي",
  nexusStartEyebrow: "اختَر مدخلك",
  nexusStartTitle: "ابدأ من المكان المناسب لك.",
  nexusStartText: "لا تحتاج إلى مسار طويل في البداية. اختر مادة واحدة، ثم دع الاستمرار يبني الطريق.",
  nexusMaterialCountLabel: "{count} مواد جاهزة",
  nexusFeaturedEyebrow: "مختارات اليوم",
  nexusFeaturedTitle: "محتوى يستحق وقتك.",
  nexusExploreAllLabel: "استكشف الكل ↗",
  nexusPathLabel: "مسار مقترح",
  nexusOpenLabel: "مفتوح للجميع",
  nexusReadTodayLabel: "قراءة اليوم",
  nexusLibraryLabel: "من المكتبة",
  nexusFlowEyebrow: "طريقة بسيطة",
  nexusFlowTitle: "تعلّم بطريقة يمكن أن تستمر.",
  nexusFlowText: "التجربة مصممة لتقلل التشتت: اختر، استمع أو اقرأ، ثم احفظ أثر الخطوة.",
  nexusFlowChooseTitle: "اختر",
  nexusFlowChooseText: "مسار واضح أو درس قصير يناسب وقتك الآن.",
  nexusFlowDeepenTitle: "تعمّق",
  nexusFlowDeepenText: "استمع، اقرأ، واستخدم المراجعة لتثبيت الفكرة.",
  nexusFlowContinueTitle: "استمر",
  nexusFlowContinueText: "احفظ ما ينفعك وارجع إليه من مكتبك الشخصي.",
  nexusDeskEyebrow: "مكتبك الشخصي",
  nexusDeskTitle: "أكمل من حيث توقفت.",
  nexusDeskText: "احفظ المواد المهمة، وستجدها هنا عندما تعود من أي جهاز.",
  nexusSendingLabel: "جارٍ...",
  dashboardKicker: "مساحتك التعليمية",
  dashboardTitle: "أهلًا بك في رحلتك.",
  dashboardProgressLabel: "نسبة الإنجاز في مكتبة الأكاديمية",
  dashboardProgressHelp: "كلما علّمت مادة كمكتملة، تتحدث النسبة تلقائيًا.",
  dashboardQueueKicker: "طابور التعلم",
  dashboardQueueTitle: "الخطوة التالية واضحة.",
  dashboardQueueText: "رتبنا لك بداية عملية: نكمل أولًا المادة المحفوظة، ثم ننتقل للمحتوى الذي لم تبدأه بعد.",
  dashboardStartLabel: "ابدأ الآن",
  dashboardRecentLabel: "آخر ما بدأت",
  dashboardSavedLabel: "محفوظة للمراجعة",
  dashboardSuggestedLabel: "اقتراح البداية",
  dashboardRemainingLabel: "مادة متبقية",
  dashboardFinishedKicker: "رحلة مكتملة",
  dashboardFinishedTitle: "أنجزت كل المواد المتاحة.",
  dashboardFinishedText: "ارجع إلى المحفوظ للمراجعة أو استكشف مادة جديدة من الكتالوج.",
  dashboardExploreLabel: "استكشف المزيد ←",
  dashboardSavedTitle: "محفوظ للمراجعة",
  dashboardCompletedTitle: "أنجزته",
  dashboardSavedEmpty: "لم تحفظ أي مادة بعد. افتح درسًا واضغط «حفظ للمراجعة».",
  dashboardCompletedEmpty: "ابدأ بأول درس، ثم علّمه كمكتمل عند الانتهاء.",
  detailRelatedEyebrow: "خطوتك التالية",
  detailRelatedTitle: "محتوى يكمل الصورة.",
  detailRelatedText: "اقتراحات قريبة من هذه الصفحة لتتابع التعلم من دون تشتت.",
  homeLeadKicker: "تعلمٌ مرتب، أثرٌ متدرّج",
  homeLeadTitle: "خذ من العلم ما يغيّر يومك.",
  homeLeadText: "ابدأ من مادة صغيرة، تابع بهدوء، واصنع لنفسك مسارًا يمكن أن يستمر.",
  homeLeadPrimaryCta: "سجل الآن",
  homeLeadSecondaryCta: "",
  heroTrustOne: "دروس مركزة",
  heroTrustTwo: "مجتمع عالمي",
  heroTrustThree: "تعلم مستمر",
  heroLiveLabel: "متاح الآن",
  heroPathsLabel: "مسارات",
  heroPathsMeta: "تعلم مرتب",
  heroMaterialsLabel: "مواد",
  heroMaterialsMeta: "قراءة واستماع",
  heroWorldLabel: "العالم",
  heroWorldMeta: "أثر يتصل",
  spotlightEyebrow: "اختيار الأكاديمية",
  spotlightTitle: "ابدأ من نقطة واضحة.",
  spotlightText: "ثلاثة أبواب صغيرة تكفي لتبدأ اليوم: مسار مرتب، درس قصير، وقراءة تفتح لك زاوية جديدة.",
  spotlightCourseLabel: "المسار المقترح",
  spotlightLessonLabel: "درس قصير",
  spotlightArticleLabel: "قراءة اليوم",
  spotlightLinkLabel: "افتح المسار",
  homeMapEyebrow: "خريطة المشاركين",
  homeMapTitle: "نتعلم من أماكن مختلفة",
  homeMapText: "النقاط التي تظهر على الكرة هي أعضاء اختاروا بلدهم عند التسجيل.",
  homeExploreEyebrow: "اختَر بوابتك",
  homeExploreTitle: "من أين تحب أن تبدأ؟",
  homeExploreText: "كل قسم له صفحته ومساره الخاص؛ اختر ما يناسب وقتك الآن وابدأ مباشرة.",
  homeExploreCoursesText: "خطوات من البداية",
  homeExploreLessonsText: "فكرة واحدة كل مرة",
  homeExploreArticlesText: "قراءات قصيرة",
  homeExploreLibraryText: "ملفات تحتفظ بها",
  homeSectionOrder: ["start", "featured", "flow", "desk", "event", "newsletter"],
  navHome: "الرئيسية",
  navCourses: "الدورات",
  navLessons: "الدروس",
  navMajlis: "المجالس",
  navArticles: "المقالات",
  navLibrary: "المكتبة",
  announcementButton: "التفاصيل",
  heroPrimaryCta: "ابدأ رحلتك",
  heroSecondaryCta: "استكشف المجالس",
  heroMetricLessonsLabel: "درسًا مختارًا",
  heroMetricCoursesLabel: "مسارات تعليمية",
  heroMetricFreeValue: "مجاني",
  heroMetricFreeLabel: "ومتاح للجميع",
  homeSignalsCoursesLabel: "مسارات",
  homeSignalsCoursesText: "طريق للتعلّم",
  homeSignalsContentLabel: "استماع وقراءة",
  homeSignalsContentText: "محتوى قصير ومفيد",
  homeSignalsCommunityLabel: "مجتمع",
  homeSignalsCommunityText: "رحلة تتصل بالعالم",
  homeDirectoryEyebrow: "اختَر بوابتك",
  homeDirectoryTitle: "من أين تحب أن تبدأ؟",
  homeDirectoryText: "كل قسم له صفحته ومساره الخاص؛ اختر ما يناسب وقتك الآن وابدأ مباشرة.",
  homeDirectoryCoursesText: "خطوات من البداية",
  homeDirectoryLessonsText: "فكرة واحدة كل مرة",
  homeDirectoryArticlesText: "قراءات قصيرة",
  homeDirectoryLibraryText: "ملفات تحتفظ بها",
  floatingCardTitle: "ورد اليوم",
  floatingCardText: "اقرأ · تعلّم · طبّق",
  floatingCardStatus: "✓ مكتمل جزئيًا",
  searchPlaceholder: "ابحث في الدروس والمقالات والمكتبة...",
  coursesEyebrow: "المسارات التعليمية",
  coursesTitle: "الدورات",
  coursesLink: "عرض كل الدورات ←",
  lessonsEyebrow: "تعلّم بخطوات قصيرة",
  lessonsTitle: "أحدث الدروس",
  lessonsLink: "كل الدروس ←",
  majlisEyebrow: "المجالس واللقاءات",
  majlisButton: "سجّل اهتمامك ←",
  articlesEyebrow: "اقرأ بتأنٍّ",
  articlesTitle: "من المقالات",
  articlesLink: "كل المقالات ←",
  libraryEyebrow: "مكتبة نافعة",
  libraryTitle: "ملفات تعود إليها.",
  libraryText: "مختارات مصممة للقراءة الهادئة والطباعة والمراجعة.",
  libraryButton: "دخول المكتبة ←",
  newsletterEyebrow: "رسالة نافعة، بلا إزعاج",
  newsletterInputPlaceholder: "بريدك الإلكتروني",
  newsletterButton: "اشترك الآن",
  communityEyebrow: "مجتمع الأكاديمية",
  communityTitle: "علمٌ يتصل من بلد إلى بلد.",
  communityText: "كل عضو جديد يضيف نقطة إلى خريطة التعلّم؛ مجتمع صغير، متصل، وينمو بهدوء.",
  footerCopyright: "جميع الحقوق محفوظة.",
  ownerPanelLabel: "لوحة المالك",
  emailLabel: "البريد",
  telegramLabel: "تيليجرام",
  whatsappLabel: "واتساب",
  instagramLabel: "إنستجرام",
  youtubeLabel: "يوتيوب",
  searchNoResults: "لا توجد نتائج مطابقة",
  listenLabel: "استمع ←",
  readArticleLabel: "اقرأ المقال ←",
  downloadSoonLabel: "سيتم إضافة الملف قريبًا",
  name: "أكاديمية إسماعيل أحمد نجيب",
  tagline: "علمٌ يُفهم، وأثرٌ يبقى",
  heroTitle: "رحلة هادئة نحو علمٍ أنفع وحياةٍ أصفى.",
  heroText:
    "مساحة عربية تجمع الدروس المنتقاة، المجالس، المقالات والمكتبة؛ لتتعلم بخطوات واضحة وتعود إلى ما ينفعك كل يوم.",
  announcement: "المجلس القادم: كيف نبدأ طلب العلم بثبات؟ الخميس بعد المغرب",
  email: "",
  telegram: "",
  whatsapp: "",
  instagram: "",
  youtube: "",
  showContactLinks: true,
  introEyebrow: "منصة متكاملة",
  introTitle: "كل ما تحتاجه في مكان واحد.",
  introText: "محتوى مرتب لا يزاحمك، وتجربة تعلّم تراعي وقتك وتعينك على الاستمرار.",
  newsletterTitle: "وصلك الجديد من الأكاديمية.",
  newsletterText: "تنبيه بالدروس والملفات والمجالس الجديدة حين تكون جاهزة.",
  majlisTitle: "مجلس يقرّب العلم إلى الحياة.",
  majlisText: "نلتقي في مجالس خفيفة، نقرأ فيها ونتدارس ونخرج بخطوة عملية.",
  majlisDate: "الخميس | 18 | صفر",
  majlisTopic: "كيف نبدأ طلب العلم بثبات؟",
  majlisMeta: "بعد صلاة المغرب · لقاء مباشر",
  majlisQuote: "أحب الأعمال إلى الله أدومها وإن قل.",
  seoTitle: "أكاديمية إسماعيل أحمد نجيب | علمٌ يُفهم، وأثرٌ يبقى",
  seoDescription: "أكاديمية عربية للدروس والمقالات والمجالس والمكتبة، بتجربة تعلم هادئة ومنظمة.",
  seoKeywords: "أكاديمية عربية, طلب العلم, دروس, مقالات, مكتبة, مجالس, تعلم ذاتي",
  canonicalUrl: "",
};

// Row shape per section (kept as string[] to stay compatible with the
// existing pipe-separated admin textareas):
// courses:  [title, desc, count, level, num, featured?]
// lessons:  [title, meta, audioUrl?, courseTitle?, featured?, videoUrl?]
// articles: [title, category, time, body?, coverUrl?, featured?]   body paragraphs separated by literal "\n"
// books:    [title, meta, fileUrl?, featured?]

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

/** Optional row flag used by the owner to curate what appears on the homepage. */
export function isFeatured(row: string[], column: number): boolean {
  return row[column] !== "false";
}

const fallbackSiteUrl = "https://ismailahmednaguib.vercel.app";

/** Returns a safe origin for metadata, sitemap and robots even if an owner enters a bad URL. */
export function getSiteUrl(value?: string): string {
  try {
    const parsed = new URL(value?.trim() || fallbackSiteUrl);
    return parsed.protocol === "http:" || parsed.protocol === "https:" ? parsed.origin : fallbackSiteUrl;
  } catch {
    return fallbackSiteUrl;
  }
}

/** Allows only local paths or http(s) images in owner-controlled visual fields. */
export function safeImageUrl(value?: string): string {
  const candidate = value?.trim() ?? "";
  if (!candidate) return "";
  if (candidate.startsWith("/") && !candidate.startsWith("//")) return candidate;
  try {
    const parsed = new URL(candidate);
    return parsed.protocol === "http:" || parsed.protocol === "https:" ? parsed.href : "";
  } catch {
    return "";
  }
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
    const settings = { ...defaultSettings, ...(payload.settings ?? {}) };
    if (settings.email === "hello@example.com") settings.email = "";
    if (settings.telegram.includes("your_username")) settings.telegram = "";
    return {
      settings,
      courses: Array.isArray(payload.courses) ? payload.courses : initialCourses,
      articles: Array.isArray(payload.articles) ? payload.articles : initialArticles,
      books: Array.isArray(payload.books) ? payload.books : initialBooks,
      lessons: Array.isArray(payload.lessons) ? payload.lessons : initialLessons,
    };
  } catch {
    return base;
  }
}
