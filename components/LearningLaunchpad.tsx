import Link from "next/link";

type LaunchpadItem = {
  href: string;
  label: string;
  note: string;
  count: number;
  tone: string;
};

type Props = {
  eyebrow: string;
  title: string;
  text: string;
  exploreLabel: string;
  countLabel: string;
  items: LaunchpadItem[];
};

export default function LearningLaunchpad({ eyebrow, title, text, exploreLabel, countLabel, items }: Props) {
  return (
    <section className="nexus-section nexus-start nexus-launchpad" id="nexus-start">
      <div className="nexus-launchpad-head">
        <div className="nexus-launchpad-title">
          <span className="nexus-index">01</span>
          <div>
            <p className="nexus-eyebrow">{eyebrow}</p>
            <h2>{title}</h2>
          </div>
        </div>
        <div className="nexus-launchpad-note">
          <p>{text}</p>
          <Link href="/search" className="nexus-inline-link">{exploreLabel}</Link>
        </div>
      </div>

      <div className="nexus-launchpad-grid">
        {items.map((item, index) => (
          <Link href={item.href} className={`nexus-launchpad-card tone-${item.tone} ${index === 0 ? "featured" : ""}`} key={item.href}>
            <div className="nexus-launchpad-card-top">
              <span>{String(index + 1).padStart(2, "0")}</span>
              <b>↗</b>
            </div>
            <div className="nexus-launchpad-card-body">
              <small>{item.label}</small>
              <h3>{countLabel.replace("{count}", String(item.count))}</h3>
              <p>{item.note}</p>
            </div>
            <span className="nexus-launchpad-line" aria-hidden="true" />
          </Link>
        ))}
      </div>
    </section>
  );
}
