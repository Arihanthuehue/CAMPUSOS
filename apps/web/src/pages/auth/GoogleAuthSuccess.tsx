import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function GoogleAuthSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const error = params.get('error');

    if (error || !token) {
      navigate('/login?error=google_failed', { replace: true });
      return;
    }

    // Store token exactly the same way the existing login flow stores it
    import('../../lib/tokenStorage').then(({ setToken }) => {
      setToken(token);
      // Force a full page reload so AuthContext re-initializes and picks up the new token
      window.location.replace('/');
    }).catch(() => {
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
