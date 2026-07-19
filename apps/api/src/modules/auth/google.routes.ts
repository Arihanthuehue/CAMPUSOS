import { Router } from 'express';
import passport from '../../lib/passport';
import { signToken } from '../../lib/jwt';

const router = Router();

// Step 1: Redirect user to Google
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
  })
);

// Step 2: Google redirects back here
router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=google_failed`,
  }),
  (req, res) => {
    try {
      const user = req.user as { id: string; email: string; platformRole: string };
      
      // Sign your existing JWT token
      const token = signToken({ userId: user.id });

      // Redirect to frontend with token in query param
      // Frontend will grab the token from URL and store it
      res.redirect(`${process.env.FRONTEND_URL}/auth/google/success?token=${token}`);
    } catch {
      res.redirect(`${process.env.FRONTEND_URL}/login?error=token_failed`);
    }
  }
);

export default router;
