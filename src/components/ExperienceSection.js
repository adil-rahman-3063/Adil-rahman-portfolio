import React from 'react';

export default function ExperienceSection() {
  return (
    <section id="experience" style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: '32px' }}>
        <span style={{
          fontFamily: 'var(--font-handwritten)',
          fontSize: '26px',
          color: '#8C7355',
          marginRight: '8px'
        }}>
          02 // 
        </span>
        <h2 style={{
          fontFamily: 'var(--font-header)',
          fontSize: '22px',
          color: '#EFEBE9',
          fontWeight: 'bold',
          letterSpacing: '1.0px',
          margin: 0
        }}>
          EXPERIENCE & EDUCATION
        </h2>
      </div>

      <div className="experience-grid">
        {/* Professional Experience */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <h3 style={{
            fontFamily: 'var(--font-header)',
            fontSize: '15px',
            color: '#8D6E63',
            margin: '0 0 8px 0',
            letterSpacing: '1.0px'
          }}>
            // PROFESSIONAL_EXP
          </h3>
          <div style={{ width: '100%', height: '1.5px', backgroundColor: '#E8DFD0', marginBottom: '16px' }} />

          <h4 style={{
            fontFamily: 'var(--font-header)',
            fontSize: '16px',
            color: '#EFEBE9',
            margin: '0 0 4px 0'
          }}>
            Freelance Software Developer
          </h4>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '13px',
            color: '#8C7355',
            marginBottom: '12px'
          }}>
            Red Parrot Institution // 2025
          </span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', fontFamily: 'var(--font-mono)', fontSize: '13px', color: '#EFEBE9', lineHeight: '1.4' }}>
              <span style={{ color: '#8C7355', fontWeight: 'bold', marginRight: '6px' }}>-</span>
              <span>Developed a scheduling and timetable management application for an educational institution.</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', fontFamily: 'var(--font-mono)', fontSize: '13px', color: '#EFEBE9', lineHeight: '1.4' }}>
              <span style={{ color: '#8C7355', fontWeight: 'bold', marginRight: '6px' }}>-</span>
              <span>Built structured session management workflows to improve scheduling efficiency.</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', fontFamily: 'var(--font-mono)', fontSize: '13px', color: '#EFEBE9', lineHeight: '1.4' }}>
              <span style={{ color: '#8C7355', fontWeight: 'bold', marginRight: '6px' }}>-</span>
              <span>Integrated backend services and optimized data handling for smoother operations.</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', fontFamily: 'var(--font-mono)', fontSize: '13px', color: '#EFEBE9', lineHeight: '1.4' }}>
              <span style={{ color: '#8C7355', fontWeight: 'bold', marginRight: '6px' }}>-</span>
              <span>Collaborated on requirement understanding and feature implementation.</span>
            </div>
          </div>

          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            color: '#BCAAA4',
            marginTop: '16px'
          }}>
            Technologies:{' '}
            <span style={{ color: '#8D6E63', fontWeight: 'bold' }}>
              Flutter, Backend Integration
            </span>
          </div>
        </div>

        {/* Academic History */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <h3 style={{
            fontFamily: 'var(--font-header)',
            fontSize: '15px',
            color: '#8D6E63',
            margin: '0 0 8px 0',
            letterSpacing: '1.0px'
          }}>
            // ACADEMIC_HISTORY
          </h3>
          <div style={{ width: '100%', height: '1.5px', backgroundColor: '#E8DFD0', marginBottom: '16px' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
            <div>
              <h4 style={{
                fontFamily: 'var(--font-header)',
                fontSize: '15px',
                color: '#EFEBE9',
                margin: '0 0 4px 0',
                lineHeight: '1.3'
              }}>
                APJ Abdul Kalam Technological University
              </h4>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '13px',
                color: '#8C7355'
              }}>
                B.Tech in CSE // 7.01 CGPA (First Class)
              </span>
            </div>

            <div>
              <h4 style={{
                fontFamily: 'var(--font-header)',
                fontSize: '15px',
                color: '#EFEBE9',
                margin: '0 0 4px 0',
                lineHeight: '1.3'
              }}>
                The Model School, Abu Dhabi
              </h4>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '13px',
                color: '#8C7355'
              }}>
                High School // 2019 - 2021
              </span>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .experience-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 32px;
          width: 100%;
        }
        @media (min-width: 900px) {
          .experience-grid {
            grid-template-columns: 1fr 1fr;
            gap: 50px;
          }
        }
      `}</style>
    </section>
  );
}
