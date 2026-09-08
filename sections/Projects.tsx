const projects = [
  {
    icon: "◈",
    title: "أكاديمية إسماعيل أحمد نجيب",
    description:
      "منصة تعليمية تجمع الدورات والدروس والمجالس والمقالات والمكتبة في مكان واحد.",
  },
  {
    icon: "✎",
    title: "الكتابة والمعرفة",
    description:
      "مقالات وملخصات وأفكار أشاركها بصورة بسيطة وقريبة من القارئ.",
  },
  {
    icon: "⌘",
    title: "المشاريع الرقمية",
    description:
      "أبني مواقع وأدوات رقمية تخدم التعليم والتنظيم ونشر المعرفة.",
  },
];

export default function Projects() {
  return (
    <section
      id="projects"
      className="section"
    >
      <div className="container">

        <div className="section-head">

          <div className="eyebrow">
            02 — ما أعمل عليه
          </div>

          <h2 className="section-title">
            مشاريع لها معنى.
          </h2>

          <p className="section-description">
            الفكرة ليست أن أصنع الكثير، بل أن أصنع
            شيئًا يستحق أن يبقى ويكون فيه نفع.
          </p>

        </div>

        <div className="projects-grid">

          {projects.map((project) => (
            <article
              key={project.title}
              className="project-card"
            >

              <div>

                <div className="project-icon">
                  {project.icon}
                </div>

                <h3>
                  {project.title}
                </h3>

                <p>
                  {project.description}
                </p>

              </div>

              <a
                href="#contact"
                className="project-link"
              >
                اكتشف المزيد ←
              </a>

            </article>
          ))}

        </div>

      </div>
    </section>
  );
}