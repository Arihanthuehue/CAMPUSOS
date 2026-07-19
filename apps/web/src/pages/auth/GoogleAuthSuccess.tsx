import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export function GoogleAuthSuccess() {
  const navigate = useNavigate();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    const apiBase = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:3000' : '');

    console.log('[GoogleAuth] token from URL:', token ? token.substring(0, 50) + '...' : 'NULL');
    console.log('[GoogleAuth] full URL:', window.location.href);
    console.log('[GoogleAuth] VITE_API_URL:', import.meta.env.VITE_API_URL);

    if (!token) {
      console.log('[GoogleAuth] No token found, redirecting to login');
      navigate('/login?error=google_failed', { replace: true });
      return;
    }

    // Log what's currently in localStorage
    console.log('[GoogleAuth] localStorage before set:', { ...localStorage });

    const tokenKey = 'campusos_token';
    localStorage.setItem(tokenKey, token);

    console.log('[GoogleAuth] token stored, now calling /auth/me');
    console.log('[GoogleAuth] fetch URL:', `${apiBase}/api/v1/auth/me`);

    fetch(`${apiBase}/api/v1/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        console.log('[GoogleAuth] /auth/me status:', res.status);
        console.log('[GoogleAuth] /auth/me ok:', res.ok);
        return res.text().then(text => {
          console.log('[GoogleAuth] /auth/me response body:', text);
          if (!res.ok) throw new Error(`HTTP ${res.status}: ${text}`);
          return text;
        });
      })
      .then(() => {
        console.log('[GoogleAuth] SUCCESS — redirecting to /');
        window.location.href = '/';
      })
      .catch(err => {
        console.log('[GoogleAuth] FAILED — error:', err.message);
        localStorage.removeItem(tokenKey);
        navigate('/login?error=google_failed', { replace: true });
      });
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F5F0E8',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: 16,
    }}>
      <div style={{
        width: 24,
        height: 24,
        backgroundColor: '#C8F135',
        border: '2px solid #0A0A0A',
      }} />
      <p style={{
        fontFamily: 'Space Grotesk, sans-serif',
        fontWeight: 700,
        fontSize: 14,
        color: '#0A0A0A',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        margin: 0,
      }}>
        Signing you in...
      </p>
    </div>
  );
}
