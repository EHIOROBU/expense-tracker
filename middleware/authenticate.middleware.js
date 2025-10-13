const jwt = require('jsonwebtoken');

const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Please authenticate' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "PLEASE AUTHENTICATE",
      error: {
        code: "Authentication Error",
        details: "PLEASE AUTHENTICATE",
      }

    })
  }
};

module.exports = authenticate;