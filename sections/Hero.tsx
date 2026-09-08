export default function Hero() {
  return (
    <section
      id="home"
      className="hero"
    >
      <div className="container hero-grid">

        <div className="hero-content">

          <div className="hero-badge">
            <span />
            بسم الله نبدأ
          </div>

          <h1>
            أتعلم،
            <br />
            <span>أشارك،</span>
            <br />
            وأبني ما ينفع.
          </h1>

          <p className="hero-description">
            أنا إسماعيل أحمد نجيب، طالب علم ومهتم بالتعليم
            والكتابة وصناعة المحتوى وبناء المشاريع الرقمية.
            هذا الموقع مساحتي الشخصية لأشارك ما أتعلمه وما
            أعمل عليه، وأسعى أن يكون فيه نفع حقيقي للناس.
          </p>

          <div className="hero-actions">

            <a
              href="#about"
              className="button button-primary"
            >
              تعرّف عليّ
            </a>

            <a
              href="#projects"
              className="button button-secondary"
            >
              استكشف مشاريعي
            </a>

          </div>

        </div>

        <div className="hero-visual">

          <div className="hero-orb">
            وَقُلْ رَبِّ زِدْنِي عِلْمًا
          </div>

          <div className="hero-note">
            رحلة مستمرة في طلب العلم،
            وبناء المعرفة، وخدمة الآخرين.
          </div>

        </div>

      </div>
    </section>
  );
}