'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PersonalProjectsRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/project/personal-project');
  }, [router]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0a0a0c',
      color: '#EFEBE9',
      fontFamily: 'monospace',
      gap: '16px'
    }}>
      <p style={{ margin: 0, opacity: 0.8 }}>Redirecting to Personal Projects Directory...</p>
      <a
        href="/project/personal-project"
        style={{
          color: '#8C7355',
          textDecoration: 'underline',
          fontSize: '14px'
        }}
      >
        Click here if not redirected automatically →
      </a>
    </div>
  );
}
