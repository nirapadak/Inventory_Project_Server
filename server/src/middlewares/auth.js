const jwt = require('jsonwebtoken');
const User = require('../models/User_model')


exports.loginRequire =(req, res, next) => {
  try {
    const decoded = jwt.verify(
      req.headers.authorization,
      process.env.SECRET_KEY);
    // req .user  why aging and aging error here----------------
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(404).json({error: `${error}`});
  }
}

exports.isAdmin = async(req, res, next) => {
  try {
  
 
    const user = await User.findById(req.user._id)

    if (user.role !== "1") {
      res.status(404).json({error: "authorization error", message: "You are not Admin"})
    } else {
      next();
    }
  } catch (error) {
    res.json({ error: error.message });
  }
}