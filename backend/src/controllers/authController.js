import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { ENV } from '../lib/env.js';

export const googleLogin = async (req, res) => {
  const { googleId, email, name, profilePicture } = req.body;

  if (!googleId || !email) {
    return res.status(400).json({ success: false, message: 'Missing required user information' });
  }

  try {
    // Find user by email (must exist in database)
    let user = await User.findOne({ email });

    if (!user) {
      // Email not in database - reject login
      return res.status(401).json({ success: false, message: 'You are not an authenticated user' });
    }

    // Link googleId if the user exists but doesn't have one yet
    if (!user.googleId) {
      user.googleId = googleId;
      if (profilePicture) user.profilePicture = profilePicture;
      if (!user.name) user.name = name;
      await user.save();
    }

    // Generate JWT for session management
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      ENV.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        profilePicture: user.profilePicture,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Google Auth Error:', error);
    res.status(500).json({ success: false, message: 'Authentication failed' });
  }
};
