import React from 'react';

const tags = [
  'FLUTTER',
  'DART',
  'SUPABASE',
  'FASTAPI',
  'REST APIS',
  'OPENAI GPT API',
  'MULTILINGUAL NLP',
  'POSTGRESQL',
  'FIREBASE',
  'GIT & GITHUB ACTIONS',
  'RESPONSIVE WEB',
  'PWA DEVELOPER',
  'UI/UX FIGMA',
];

export default function TechMarquee() {
  // Duplicate tags twice to make sure it fills the screen during the transition
  const items = [...tags, ...tags, ...tags];

  return (
    <div className="marquee-container">
      <div className="marquee-track">
        {items.map((tag, idx) => (
          <div key={idx} className="marquee-item">
            <span className="marquee-text">{tag}</span>
            <span className="marquee-dot">✦</span>
          </div>
        ))}
      </div>

      <style jsx global>{`
        .marquee-container {
          height: 44px;
          background-color: #F0EAE1;
          border-top: 1.5px solid #E8DFD0;
          border-bottom: 1.5px solid #E8DFD0;
          overflow: hidden;
          width: 100%;
          display: flex;
          align-items: center;
          position: relative;
        }

        .marquee-track {
          display: flex;
          width: max-content;
          animation: marquee-scroll 25s linear infinite;
        }

        .marquee-item {
          display: flex;
          align-items: center;
          padding: 0 24px;
          flex-shrink: 0;
        }

        .marquee-text {
          font-family: var(--font-mono);
          font-size: 12px;
          color: #3E2723; /* textDark */
          font-weight: bold;
          letter-spacing: 1.5px;
        }

        .marquee-dot {
          color: #8C7355; /* accentGold */
          font-size: 14px;
          margin-left: 16px;
        }

        @keyframes marquee-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
      `}</style>
    </div>
  );
}
