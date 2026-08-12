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
          I'm a freelance Developer and Digital Builder who turns ideas into working products—fast. Over the past few projects, I've shipped everything from Flutter web apps with token-gated video streaming to automated WhatsApp workflows powered by Google Apps Script, along with React frontends and Shopify storefronts for clients who need results, not just code.
        </p>
        <p style={{ marginBottom: '16px' }}>
          I work across the full stack—UI/UX, backend automation, deployment, and infrastructure—so clients get a single point of contact instead of juggling multiple freelancers. Whether it's building a learning platform from scratch or automating a manual process into a seamless script, I focus on solutions that are practical, scalable, and built to actually get used.
        </p>
        <p style={{ marginBottom: 0 }}>
          I stay hands-on with new tools and frameworks—AI-assisted development, modern React ecosystems, and cloud infrastructure—because the best solution today might not be the best one six months from now, and I'd rather stay ahead of that curve than catch up to it.
        </p>
      </div>
    </section>
  );
}
