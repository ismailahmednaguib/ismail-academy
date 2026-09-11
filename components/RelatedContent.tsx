import Link from "next/link";

type RelatedItem = {
  href: string;
  title: string;
  meta: string;
  kind: string;
};

type Props = {
  enabled?: boolean;
  eyebrow: string;
  title: string;
  text: string;
  items: RelatedItem[];
};

export default function RelatedContent({ enabled = true, eyebrow, title, text, items }: Props) {
  if (!enabled || !items.length) return null;
  return (
    <section className="related-content" aria-labelledby="related-content-title">
      <div className="related-content-heading">
        <div>
          <p className="kicker">{eyebrow}</p>
          <h2 id="related-content-title">{title}</h2>
        </div>
        <p>{text}</p>
      </div>
      <div className="related-content-grid">
        {items.map((item, index) => (
          <Link href={item.href} className="related-content-card" key={`${item.href}-${item.title}`}>
            <div className="related-content-top"><span>0{index + 1}</span><small>{item.kind}</small></div>
            <b>{item.title}</b>
            <span>{item.meta}</span>
            <i aria-hidden="true">↗</i>
          </Link>
        ))}
      </div>
    </section>
  );
}
