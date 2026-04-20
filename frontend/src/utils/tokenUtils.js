/**
 * Decode JWT token and extract userId
 * @param {string} token - JWT token
 * @returns {string|null} - userId from token or null
 */
export const extractUserIdFromToken = (token) => {
  try {
    if (!token) return null;
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    // Decode the payload (second part)
    const decoded = JSON.parse(atob(parts[1]));
    return decoded.userId || null;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

/**
 * Get userId from localStorage with multiple fallbacks
 * @returns {string|null} - userId or null
 */
export const getUserIdFromStorage = () => {
  // Primary: Direct userId from localStorage
  let userId = localStorage.getItem('userId');
  if (userId) return userId;

  // Secondary: Extract from stored user object
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      userId = user.id || user._id;
      if (userId) return userId;
    } catch (error) {
      console.error('Error parsing user object:', error);
    }
  }

  // Tertiary: Extract from JWT token
  const token = localStorage.getItem('token');
  if (token) {
    userId = extractUserIdFromToken(token);
    if (userId) return userId;
  }

  return null;
};
