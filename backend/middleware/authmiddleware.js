const jwt = require('jsonwebtoken');
const JWT_SECRET = 'Harshisagood$boy'; // Replace with your actual secret key

const authMiddleware = (req, res, next) => {
  // Get the token from the request headers or other sources (e.g., cookies)
  const token = req.header('auth-token'); // Assuming you pass the token in the 'auth-token' header

  // Check if the token exists
  if (!token) {
    return res.status(401).json({ message: 'Access denied. Token missing.' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Attach the user information to the request object
    req.user = decoded.user;

    // Continue to the next middleware or route
    next();
  } catch (error) {
    console.error(error.message);
    return res.status(401).json({ message: 'Invalid token. Authentication failed.' });
  }
};

module.exports = authMiddleware;
