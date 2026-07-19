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

    if (!token) {
      navigate('/login?error=google_failed', { replace: true });
      return;
    }

    // Use the exact same localStorage key that AuthContext and tokenStorage use:
    const tokenKey = 'campusos_token';
    localStorage.setItem(tokenKey, token);

    // Verify the token works by fetching the current user from `/auth/me`
    const apiBase = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:3000' : '');
    fetch(`${apiBase}/api/v1/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch user');
        return res.json();
      })
      .then(() => {
        // Token valid, user exists — do a full reload so AuthContext reinitializes from localStorage
        window.location.href = '/';
      })
      .catch(() => {
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
        animation: 'brute-in 0.4s ease-out infinite alternate',
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
