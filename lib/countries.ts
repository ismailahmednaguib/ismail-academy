export type CountryOption = { code: string; name: string };

export const countryOptions: CountryOption[] = [
  { code: "EG", name: "مصر" }, { code: "SA", name: "السعودية" }, { code: "AE", name: "الإمارات" },
  { code: "QA", name: "قطر" }, { code: "KW", name: "الكويت" }, { code: "BH", name: "البحرين" },
  { code: "OM", name: "عُمان" }, { code: "JO", name: "الأردن" }, { code: "PS", name: "فلسطين" },
  { code: "IQ", name: "العراق" }, { code: "SY", name: "سوريا" }, { code: "YE", name: "اليمن" },
  { code: "LY", name: "ليبيا" }, { code: "TN", name: "تونس" }, { code: "DZ", name: "الجزائر" },
  { code: "MA", name: "المغرب" }, { code: "SD", name: "السودان" }, { code: "TR", name: "تركيا" },
  { code: "GB", name: "المملكة المتحدة" }, { code: "FR", name: "فرنسا" }, { code: "DE", name: "ألمانيا" },
  { code: "IT", name: "إيطاليا" }, { code: "ES", name: "إسبانيا" }, { code: "US", name: "الولايات المتحدة" },
  { code: "CA", name: "كندا" }, { code: "MY", name: "ماليزيا" }, { code: "ID", name: "إندونيسيا" },
  { code: "PK", name: "باكستان" }, { code: "IN", name: "الهند" }, { code: "NG", name: "نيجيريا" },
];

export function countryName(code: string) {
  return countryOptions.find((country) => country.code === code)?.name ?? code;
}
