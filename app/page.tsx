// /app/page.tsx
import RevealSection from './RevealSection'
import DigitalTwinChat from './DigitalTwinChat'
import Image from 'next/image'


export default function HomePage() {
  return (
    <>
      <DigitalTwinChat />
      <RevealSection id="home" className="hero">
        <div className="hero-inner">
          <div className="hero-left">
            <h1 className="hero-title">
              Hello, I'm
              <span className="name">John Bryx Torralba Jovellanos</span>
            </h1>
            
            <p className="hero-sub">
              Crafting elegant digital experiences through innovative web development. 
              Specializing in full-stack solutions that blend aesthetics with functionality.
            </p>

            <div className="hero-ctas">
              <a href="#projects" className="btn btn-primary">
                View Projects
              </a>
              <a href="#contact" className="btn btn-outline">
                Get in Touch
              </a>
            </div>
          </div>

          <div className="photo-placeholder">
            <Image
              src="/bryxxx.jpg"
              alt="John Bryx Torralba Jovellanos"
              width={420}
              height={420}
              priority
            />
          </div>
        </div>
      </RevealSection>

      <RevealSection id="stats" className="stats-section">
        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-value">4th Year</div>
            <div className="stat-label">BSIT Student | Graduating 2026</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">2+</div>
            <div className="stat-label">Major Projects Deployed</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">90%</div>
            <div className="stat-label">Process Improvement Achieved</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">500+</div>
            <div className="stat-label">Students Served</div>
          </div>
        </div>
      </RevealSection>

      <RevealSection id="aboutme" className="container">
        <h2 className="section-title">About Me</h2>
        <div className="about-main-box">
          <p>
            I'm a passionate IT student specializing in Website and Full-Stack Development at St. Paul University Philippines. 
            My journey in technology is driven by a commitment to creating meaningful digital solutions that make a difference. 
            I thrive on transforming complex challenges into elegant, user-centric applications that deliver real value.
          </p>
        </div>
        <div className="about-side">
          <div className="about-side-box">
            <h3>Education</h3>
            <p>Bachelor of Science in Information Technology<br/>St. Paul University Philippines</p>
          </div>
          <div className="about-side-box">
            <h3>Expertise</h3>
            <p>Website Development<br/>Full Stack Development<br/>UI/UX Design</p>
          </div>
          <div className="about-side-box">
            <h3>Philosophy</h3>
            <p>Building accessible, intuitive interfaces while continuously evolving through emerging technologies.</p>
          </div>
        </div>
      </RevealSection>

      <RevealSection id="skills" className="container">
        <h2 className="section-title">Skills & Expertise</h2>
        <div className="skills-grid">
          <div className="skill-box">
            <h3>Frontend Development</h3>
            <ul>
              <li>React & Next.js</li>
              <li>HTML5 & CSS3</li>
              <li>JavaScript frameworks</li>
              <li>Responsive design</li>
              <li>Accessibility standards</li>
            </ul>
          </div>
          <div className="skill-box">
            <h3>Backend Development</h3>
            <ul>
              <li>Node.js & Express</li>
              <li>RESTful API design</li>
              <li>Server architecture</li>
              <li>MVC principles</li>
              <li>PHP & Laravel</li>
            </ul>
          </div>
          <div className="skill-box">
            <h3>Database Management</h3>
            <ul>
              <li>MySQL</li>
              <li>PostgreSQL</li>
              <li>MongoDB</li>
              <li>Data structure design</li>
              <li>Query optimization</li>
            </ul>
          </div>
          <div className="skill-box">
            <h3>Development Tools</h3>
            <ul>
              <li>Git version control</li>
              <li>Modern IDEs</li>
              <li>CI/CD basics</li>
              <li>Vercel & Firebase</li>
              <li>Cloud deployment</li>
            </ul>
          </div>
          <div className="skill-box">
            <h3>UI/UX Design</h3>
            <ul>
              <li>User experience design</li>
              <li>Visual hierarchy</li>
              <li>Accessibility focus</li>
              <li>Design consistency</li>
              <li>Bootstrap & Tailwind</li>
            </ul>
          </div>
          <div className="skill-box">
            <h3>AI/ML Development</h3>
            <ul>
              <li>RAG systems</li>
              <li>Vector databases</li>
              <li>LLM integration</li>
              <li>Groq API</li>
              <li>Upstash Vector</li>
            </ul>
          </div>
          <div className="skill-box">
            <h3>Professional Skills</h3>
            <ul>
              <li>Problem-solving</li>
              <li>Team collaboration</li>
              <li>Self-learning</li>
              <li>Communication</li>
              <li>Project management</li>
            </ul>
          </div>
        </div>
      </RevealSection>

      <RevealSection id="projects" className="container">
        <h2 className="section-title">Featured Projects</h2>
        <div className="project-box">
          <h3>University Clearance Management System</h3>
          <p>
            Full-stack web application for automating university clearance workflows with decision support logic, featuring automated validation, real-time tracking, role-based access control, and responsive Bootstrap interface to reduce processing time and enhance administrative efficiency.
          </p>
          <div className="tech-badges">
            <span className="tech-badge">PHP</span>
            <span className="tech-badge">Laravel</span>
            <span className="tech-badge">Python</span>
            <span className="tech-badge">MySQL</span>
            <span className="tech-badge">REST API</span>
          </div>
        </div>
        <div className="project-box">
          <h3>Digital Twin MCP Server</h3>
          <p>
            AI-powered intelligent career assistant system leveraging RAG architecture and Groq LLM, featuring real-time conversational interface with voice input/output capabilities, persistent chat history, and responsive Next.js design for 24/7 professional information retrieval.
          </p>
          <div className="tech-badges">
            <span className="tech-badge">Next.js</span>
            <span className="tech-badge">RAG</span>
            <span className="tech-badge">GROQ</span>
            <span className="tech-badge">Typescript</span>
            <span className="tech-badge">Upstash Vector</span>
            <span className="tech-badge">Python</span>
          </div>
        </div>
      </RevealSection>

      <RevealSection id="contact" className="container">
        <h2 className="section-title">Let's Connect</h2>
        <div className="contact-box">
          <p>I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision. Let's create something amazing together!</p>
          <div className="contact-socials">
            <div className="contact-email">
              <span className="contact-email-icon">@</span>
              bryx.jovellanos@gmail.com
            </div>
            <a href="https://www.linkedin.com/in/john-bryx-jovellanos-731872397/" className="contact-social" target="_blank" rel="noopener noreferrer">
              <span className="contact-social-icon">in</span>
              LinkedIn
            </a>
            <a href="https://github.com/Bryxxx88" className="contact-social" target="_blank" rel="noopener noreferrer">
              <span className="contact-social-icon">gh</span>
              GitHub
            </a>
            <a href="https://www.facebook.com/johnbryx.jovellanos88" className="contact-social" target="_blank" rel="noopener noreferrer">
              <span className="contact-social-icon">fb</span>
              Facebook
            </a>
          </div>
        </div>
      </RevealSection>
    </>
  )
}