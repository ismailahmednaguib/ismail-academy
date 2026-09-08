export default function About() {
  return (
    <section
      id="about"
      className="section"
    >
      <div className="container">

        <div className="section-head">

          <div className="eyebrow">
            01 — عني
          </div>

          <h2 className="section-title">
            شخصي، هادئ، وهادف.
          </h2>

          <p className="section-description">
            لا أريد أن يكون هذا الموقع مجرد سيرة ذاتية
            تقليدية؛ أريده أن يعكس شخصيتي وما أتعلمه
            والأشياء التي أحاول بناءها والأثر الذي أتمنى
            أن أتركه.
          </p>

        </div>

        <div className="about-grid">

          <div className="card about-quote">
            أطمح أن أتعلم شيئًا نافعًا،
            ثم أقرّبه للناس بصورة واضحة
            وجميلة.
          </div>

          <div className="card about-card">

            <h3>
              من أنا؟
            </h3>

            <p>
              إسماعيل أحمد نجيب، طالب علم ومهتم بالتعليم
              والكتابة وصناعة المحتوى وبناء المشاريع
              الرقمية. أحب أن أحول ما أتعلمه إلى معرفة
              سهلة ومحتوى يمكن للناس الاستفادة منه.
            </p>

            <div className="stats">

              <div className="stat">
                <strong>علم</strong>
                <span>
                  طلب وفهم وتلخيص
                </span>
              </div>

              <div className="stat">
                <strong>محتوى</strong>
                <span>
                  كتابة وتعليم ونشر
                </span>
              </div>

              <div className="stat">
                <strong>مشاريع</strong>
                <span>
                  أفكار تتحول إلى واقع
                </span>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}