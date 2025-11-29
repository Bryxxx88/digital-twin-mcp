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
            <p>Creating responsive, accessible interfaces with React, Next.js, HTML5, CSS3, and modern JavaScript frameworks.</p>
          </div>
          <div className="skill-box">
            <h3>Backend Development</h3>
            <p>Building scalable server architectures using Node.js, Express, and RESTful API design principles.</p>
          </div>
          <div className="skill-box">
            <h3>Database Management</h3>
            <p>Designing efficient data structures with MySQL, PostgreSQL, and MongoDB for optimal performance.</p>
          </div>
          <div className="skill-box">
            <h3>Development Tools</h3>
            <p>Version control with Git, modern IDEs, CI/CD pipelines, and cloud deployment platforms.</p>
          </div>
          <div className="skill-box">
            <h3>UI/UX Design</h3>
            <p>Crafting intuitive user experiences with attention to detail, accessibility, and visual hierarchy.</p>
          </div>
          <div className="skill-box">
            <h3>Collaboration</h3>
            <p>Effective communication, agile methodologies, and continuous learning mindset for team success.</p>
          </div>
        </div>
      </RevealSection>

      <RevealSection id="projects" className="container">
        <h2 className="section-title">Featured Projects</h2>
        <div className="project-box">
          <h3>University Clearance Management System</h3>
          <p>
            A comprehensive decision support system designed to streamline the clearance process at St. Paul University Philippines. 
            Features automated workflows, real-time tracking, and intelligent analytics for enhanced administrative efficiency.
          </p>
          <div className="tech-badges">
            <span className="tech-badge">PHP</span>
            <span className="tech-badge">Laravel</span>
            <span className="tech-badge">Python</span>
            <span className="tech-badge">MySQL</span>
            <span className="tech-badge">REST API</span>
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