import Link from 'next/link';

export default function SiteFooter({
  ctaLabel = '// LOOKING TO BUILD SOMETHING SIMILAR?',
  ctaTitle = "Let's Build Something Together",
  ctaDesc = 'Available for freelance full-stack software development, MVPs, cross-platform apps, and automated workflows.',
  primaryBtn = { label: 'Get In Touch', href: '/#contact' },
  secondaryBtn = { label: 'Projects Hub', href: '/project' },
  tertiaryBtn = null,
  showCta = true,
}) {
  return (
    <div className="site-footer-wrapper">
      {/* ── Blog-Style Centered CTA Card ── */}
      {showCta && (
        <section className="blog-footer-cta">
          <div className="blog-footer-cta-inner">
            {ctaLabel && <p className="blog-footer-label">{ctaLabel}</p>}
            {ctaTitle && <h3 className="blog-footer-title">{ctaTitle}</h3>}
            {ctaDesc && <p className="blog-footer-desc">{ctaDesc}</p>}
            <div className="blog-footer-links">
              {primaryBtn && (
                <Link href={primaryBtn.href} className="blog-cta-btn">
                  {primaryBtn.label}
                </Link>
              )}
              {secondaryBtn && (
                <Link href={secondaryBtn.href} className="blog-secondary-btn">
                  {secondaryBtn.label}
                </Link>
              )}
              {tertiaryBtn && (
                <Link href={tertiaryBtn.href} className="blog-secondary-btn">
                  {tertiaryBtn.label}
                </Link>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── Unified Bottom Navigation Bar ── */}
      <footer className="site-bottom-footer">
        <nav className="footer-links-row" aria-label="Footer navigation">
          <Link href="/" className="footer-link">Portfolio Home</Link>
          <span className="footer-sep">·</span>
          <Link href="/project" className="footer-link">Projects Hub</Link>
          <span className="footer-sep">·</span>
          <Link href="/project/saas" className="footer-link">SaaS</Link>
          <span className="footer-sep">·</span>
          <Link href="/project/freelance" className="footer-link">Freelance</Link>
          <span className="footer-sep">·</span>
          <Link href="/project/personal-project" className="footer-link">Personal</Link>
          <span className="footer-sep">·</span>
          <Link href="/tools" className="footer-link">Tools</Link>
          <span className="footer-sep">·</span>
          <Link href="/tools/resume-builder" className="footer-link">Resume Builder</Link>
          <span className="footer-sep">·</span>
          <Link href="/services" className="footer-link">Services</Link>
          <span className="footer-sep">·</span>
          <Link href="/blog" className="footer-link">Blog</Link>
          <span className="footer-sep">·</span>
          <Link href="/reviews" className="footer-link">Reviews</Link>
          <span className="footer-sep">·</span>
          <Link href="/privacy" className="footer-link">Privacy</Link>
        </nav>
        <p className="footer-copy">© 2026 Adil Rahman | Engineered with Next.js, Supabase & Cloudflare</p>
      </footer>
    </div>
  );
}

