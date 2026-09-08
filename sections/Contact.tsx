export default function Contact() {
  return (
    <section
      id="contact"
      className="section"
    >
      <div className="container contact-grid">

        <div className="contact-box">

          <div className="eyebrow">
            03 — تواصل
          </div>

          <h2>
            لنتبادل فائدة.
          </h2>

          <p>
            للاستفسارات أو الاقتراحات أو التعاون أو مشاركة
            فكرة نافعة، يمكنك التواصل معي من خلال إحدى
            القنوات التالية.
          </p>

        </div>

        <div className="contact-box">

          <div className="contact-links">

            <a
              href="mailto:hello@example.com"
              className="contact-link"
            >
              <strong>
                البريد الإلكتروني
              </strong>

              <span>
                hello@example.com
              </span>
            </a>

            <a
              href="https://t.me/your_username"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-link"
            >
              <strong>
                تيليجرام
              </strong>

              <span>
                @your_username
              </span>
            </a>

            <a
              href="#"
              className="contact-link"
            >
              <strong>
                يوتيوب
              </strong>

              <span>
                القناة التعليمية
              </span>
            </a>

          </div>

        </div>

      </div>
    </section>
  );
}