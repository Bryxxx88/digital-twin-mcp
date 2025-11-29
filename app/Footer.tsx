// /components/Footer.tsx
export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-bottom">
          <p className="footer-copyright">
            © {currentYear} John Bryx Torralba Jovellanos • Made with <span className="footer-heart">♥</span> using Next.js
          </p>
          <p className="footer-tagline">Crafting digital experiences, one line of code at a time.</p>
        </div>
      </div>
    </footer>
  )
}