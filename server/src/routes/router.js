const express = require('express');
const route = express.Router();

const { register,login, updateProfile, VerifyUser} = require('../controller/User_controller');
const {loginRequire, isAdmin} = require('../middlewares/auth.js');


route.post('/register', register)
route.post('/login', login)
route.get('/update-profile', loginRequire, updateProfile);
route.get('/user-verify/:email/:otp', VerifyUser);

route.get('/test', loginRequire, isAdmin, (req, res) => {
  res.json({success: true})
})



module.exports = route;