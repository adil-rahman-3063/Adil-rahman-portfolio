'use client';
import React, { useState } from 'react';

const labels = [
  'HOME',
  'ABOUT',
  'EXPERIENCE',
  'SKILLS',
  'WORK ARCHIVE',
  'WORKSPACE',
  'BLOG',
  'REVIEWS',
  'CONTACT',
];

export default function CozyNav({ currentIndex, onTap }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const handleContactClick = (e) => {
    e.preventDefault();
    onTap(labels.length - 1);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="desktop-nav">
        <div className="nav-container">
          <div className="logo-section">
            <img
              src="/assets/Gemini_Generated_Image_cfgv0jcfgv0jcfgv-removebg-preview.png"
              alt="Logo"
              className="logo-img"
            />
            <span className="signature">Adil Rahman</span>
          </div>

          <div className="nav-links">
            {labels.slice(0, -1).map((label, idx) => {
              const isActive = currentIndex === idx;
              const isHovered = hoveredIndex === idx;

              let color = '#BCAAA4'; // CozyTheme.textGray
              if (isActive) color = '#FAF6EE'; // CozyTheme.paperCream
              else if (isHovered) color = '#8C7355'; // CozyTheme.accentGold

              return (
                <button
                  key={label}
                  onClick={() => onTap(idx)}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="nav-link-btn"
                  style={{ color }}
                >
                  <span className="link-text">{label}</span>
                  <div
                    className="active-line"
                    style={{ width: isActive ? '16px' : '0' }}
                  />
                </button>
              );
            })}
          </div>

          <button onClick={handleContactClick} className="contact-btn">
            Contact me
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="mobile-nav">
        <div className="mobile-nav-container">
          {labels.map((label, idx) => {
            const isActive = currentIndex === idx;
            const isHovered = hoveredIndex === idx;

            let color = '#BCAAA4';
            if (isActive) color = '#FAF6EE';
            else if (isHovered) color = '#8C7355';

            return (
              <button
                key={label}
                onClick={() => onTap(idx)}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="mobile-nav-link-btn"
                style={{ color }}
              >
                <span>{label}</span>
                <div
                  className="active-line"
                  style={{ width: isActive ? '12px' : '0' }}
                />
              </button>
            );
          })}
        </div>
      </nav>

      <style jsx global>{`
        /* Desktop Nav Styles */
        .desktop-nav {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          background-color: rgba(35, 21, 19, 0.75); /* bgDark with opacity */
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(232, 223, 208, 0.1); /* paperBorder with opacity */
        }

        @media (min-width: 1100px) {
          .desktop-nav {
            display: block;
          }
        }

        .nav-container {
          display: flex;
          align-items: center;
          max-width: 100%;
          margin: 0 auto;
          padding: 16px 40px;
        }

        .logo-section {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
        }

        .logo-img {
          height: 38px;
          width: 38px;
          object-fit: contain;
          filter: brightness(0) invert(1); /* blends to white */
        }

        .signature {
          font-family: var(--font-handwritten);
          font-size: 24px;
          color: #FAF6EE; /* paperCream */
          white-space: nowrap;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-left: auto;
          margin-right: 24px;
        }

        .nav-link-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-family: var(--font-header);
          font-size: 13px;
          letter-spacing: 1.5px;
          padding: 6px 14px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          transition: color 0.2s;
        }

        .active-line {
          height: 2px;
          background-color: #8D6E63; /* accentBrown */
          border-radius: 1px;
          transition: width 0.25s ease-in-out;
        }

        .contact-btn {
          background: transparent;
          border: 1.5px solid #E8DFD0;
          border-radius: 30px;
          color: #FAF6EE;
          font-family: var(--font-mono);
          font-size: 12px;
          font-weight: bold;
          padding: 12px 20px;
          cursor: pointer;
          transition: background-color 0.2s, color 0.2s, border-color 0.2s;
        }
        .contact-btn:hover {
          background-color: #FAF6EE;
          color: #231513;
          border-color: #FAF6EE;
        }

        /* Mobile Nav Styles */
        .mobile-nav {
          display: block;
          position: fixed;
          bottom: 16px;
          left: 0;
          right: 0;
          z-index: 1000;
          pointer-events: none;
        }

        @media (min-width: 1100px) {
          .mobile-nav {
            display: none;
          }
        }

        .mobile-nav-container {
          pointer-events: auto;
          width: 94%;
          margin: 0 auto;
          padding: 10px 16px;
          background-color: rgba(35, 21, 19, 0.95);
          border: 1.5px solid #3E2723;
          border-radius: 30px;
          box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
          display: flex;
          align-items: center;
          gap: 8px;
          overflow-x: auto;
          white-space: nowrap;
          -webkit-overflow-scrolling: touch;
          justify-content: flex-start;
        }

        /* Hide scrollbar for Chrome, Safari and Opera */
        .mobile-nav-container::-webkit-scrollbar {
          display: none;
        }
        /* Hide scrollbar for IE, Edge and Firefox */
        .mobile-nav-container {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }

        .mobile-nav-link-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-family: var(--font-header);
          font-size: 10px;
          letter-spacing: 0.5px;
          padding: 6px 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          flex-shrink: 0;
        }
      `}</style>
    </>
  );
}
