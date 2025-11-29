// /components/Footer.tsx
export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-tech-stack">
          <p className="tech-stack-title">Powered By</p>
          <div className="tech-stack-grid">
            <div className="tech-item">
              <span className="tech-name">Next.js 16</span>
              <span className="tech-desc">React Framework</span>
            </div>
            <div className="tech-item">
              <span className="tech-name">Groq</span>
              <span className="tech-desc">AI Inference</span>
            </div>
            <div className="tech-item">
              <span className="tech-name">Upstash Vector</span>
              <span className="tech-desc">RAG Database</span>
            </div>
            <div className="tech-item">
              <span className="tech-name">NextAuth.js</span>
              <span className="tech-desc">Authentication</span>
            </div>
            <div className="tech-item">
              <span className="tech-name">Vercel</span>
              <span className="tech-desc">Deployment</span>
            </div>
            <div className="tech-item">
              <span className="tech-name">TypeScript</span>
              <span className="tech-desc">Type Safety</span>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="footer-copyright">
            © {currentYear} John Bryx Torralba Jovellanos • Crafted with <span className="footer-heart">♥</span> and AI
          </p>
          <p className="footer-tagline">Building intelligent digital experiences, one prompt at a time.</p>
        </div>
      </div>
    </footer>
  )
}