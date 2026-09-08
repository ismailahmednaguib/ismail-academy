export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">

        <div className="footer-name">
          إسماعيل أحمد نجيب
        </div>

        <div>
          © {new Date().getFullYear()} — جميع الحقوق محفوظة
        </div>

        <div>
          اللهم علمنا ما ينفعنا وانفعنا بما علمتنا
        </div>

      </div>
    </footer>
  );
}