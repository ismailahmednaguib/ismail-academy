import Link from "next/link";

type Props = {
  homeLabel: string;
  kicker: string;
  title: string;
  description: string;
  count: number;
  countLabel: string;
  index: string;
  topline?: string;
  newLabel?: string;
};

export default function CatalogHero({ homeLabel, kicker, title, description, count, countLabel, index, topline, newLabel }: Props) {
  return <div className="catalog-hero">
    <div className="catalog-hero-copy">
      <div className="catalog-hero-topline"><span>{index}</span><i /> <small>{topline || "مساحة منتقاة للمعرفة"}</small></div>
      <p className="kicker">{kicker}</p>
      <h1 className="page-title">{title}</h1>
      <p className="catalog-hero-description">{description}</p>
      <Link href="/" className="catalog-back-link">← {homeLabel}</Link>
    </div>
    <div className="catalog-hero-stat"><span className="catalog-orbit" /><b>{count}</b><small>{countLabel}</small><em>{newLabel || "يُضاف الجديد باستمرار"}</em></div>
  </div>;
}
