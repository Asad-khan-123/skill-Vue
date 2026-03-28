import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { ENV } from '../lib/env.js';

export const googleLogin = async (req, res) => {
  const { googleId, email, name, profilePicture } = req.body;

  if (!googleId || !email) {
    return res.status(400).json({ success: false, message: 'Missing required user information' });
  }

  try {
    // Find user by googleId or email (handles existing users who might not have googleId yet)
    let user = await User.findOne({ $or: [{ googleId }, { email }] });

    if (!user) {
      // Create new user with default 'student' role
      user = new User({
        googleId,
        email,
        name,
        profilePicture,
        role: 'student',
      });
      await user.save();
    } else if (!user.googleId) {
      // Link googleId if the user exists but doesn't have one yet
      user.googleId = googleId;
      if (profilePicture) user.profilePicture = profilePicture;
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
