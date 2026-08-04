import React from 'react';

export default function AboutSection() {
  return (
    <section id="about" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: '24px' }}>
        <span style={{
          fontFamily: 'var(--font-handwritten)',
          fontSize: '26px',
          color: '#8C7355',
          marginRight: '8px'
        }}>
          01 // 
        </span>
        <h2 style={{
          fontFamily: 'var(--font-header)',
          fontSize: '22px',
          color: '#EFEBE9',
          fontWeight: 'bold',
          letterSpacing: '1.0px',
          margin: 0
        }}>
          ABOUT ME
        </h2>
      </div>

      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '14px',
        color: '#8D6E63',
        fontWeight: 'bold',
        marginBottom: '16px'
      }}>
        $ cat profile_summary.log
      </div>

      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '14px',
        color: '#EFEBE9',
        lineHeight: '1.7',
        maxWidth: '100%'
      }}>
        <p style={{ marginBottom: '16px', marginTop: 0 }}>
          I am a B.Tech Graduate, App Developer, and Innovator with a strong focus on real-world problem solving. 
          I have successfully built and deployed multiple applications across diverse use-cases, including budget tracking, 
          student productivity, media discovery, and AI-powered CRM systems.
        </p>
        <p style={{ marginBottom: '16px' }}>
          I enjoy developing solutions end-to-end—from crafting responsive UI/UX architectures to configuring database backends 
          and feature sets. My projects are designed to make daily tasks simpler, more organized, and highly efficient.
        </p>
        <p style={{ marginBottom: 0 }}>
          Driven by curiosity, I actively experiment with AI/ML integrations, scalable systems, and unique, fluid user experiences.
        </p>
      </div>
    </section>
  );
}
