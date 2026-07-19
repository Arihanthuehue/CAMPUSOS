import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';

export function GoogleAuthSuccess() {
  const navigate = useNavigate();
  const { loginWithToken } = useAuthContext();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const error = params.get('error');

    if (error || !token) {
      navigate('/login?error=google_failed', { replace: true });
      return;
    }

    // Store token and fetch user profile
    loginWithToken(token).then(() => {
      navigate('/', { replace: true });
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
        width: 20,
        height: 20,
        backgroundColor: '#C8F135',
        border: '2px solid #0A0A0A',
        animation: 'brute-in 0.3s ease-out infinite alternate',
      }} />
      <p style={{
        fontFamily: 'Space Grotesk, sans-serif',
        fontWeight: 700,
        fontSize: 14,
        color: '#0A0A0A',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
      }}>
        Signing you in...
      </p>
    </div>
  );
}
