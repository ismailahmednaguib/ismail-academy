import Link from "next/link";

export default function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav className="breadcrumbs" aria-label="مسار التنقل">
      <Link href="/">الرئيسية</Link>
      {items.map((item, i) => (
        <span key={`${item.label}-${i}`} className="crumb">
          <span aria-hidden="true">‹</span>
          {item.href ? <Link href={item.href}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}
        </span>
      ))}
    </nav>
  );
}