const User = require('../models/User_model.js');
const {hashPassword, comparePassword} = require('../middlewares/hash_Password.js');
const jwt = require('jsonwebtoken');
const SendEmailUtility = require('../utility/SendEmailUtility');
const userVerifyService = require('../services/user/userVerifyServices.js');


// user registrations ---------------------------------------------------------- 
exports.register = async (req, res) => {
 try {
   const { name, email, role, password } = req.body;
   
   
   if (!name.trim()) {
     return res.json({ massage: "user name is required" });
    }
    
    if (!email) {
      return res.json({ massage: "user email is required" });
    }
    
    if (!password || password.length<5) {
      return res.json({ massage: "user password is required and password must be 6 character " });
    }
    
   
  // email Check ------------
   const existingEmail = await User.findOne({ email });

   if (existingEmail) {
     return res.json({ data: "user already found"})
   }

   // Otp sends a Request ---------
    let code = Math.floor(100000 + Math.random() * 900000);
   let EmailText = `Hi ${name} Welcome to myApplication \nEmail Verification Code is ${code} \n Thanks for signing`;
   
   await SendEmailUtility(email, EmailText, "Email Verification Code");


  // password hashing algorithm ----------------------
   const hash_password = await hashPassword(password);

   const user = await new User({
     name,
     email,
     otp: code,
     role,
     password: hash_password,
   }).save();


   const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY, {
     expiresIn: "7d",
   })

   res.json({
     user: {
       name: user.name,
       email: user.email,
       role: user.role,
     },
     token,
   })

 } catch (error) {
   console.log(error);
 }
}

// user verification Otp----------------------------------------------------------------


exports.VerifyUser = async (req, res) => {

  let email = req.params.email;
  let otp = req.params.otp;

  const verify = await userVerifyService(otp, email, User);
  const user = await User.findOne({ email });

  if (verify == 1) {
    let token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY, { expiresIn: '7d' })
    
    return res.status(200).json({
      message: "user Verification successful",
      successful: true,
      token: token,
    })


  } else {
    return res.status(200).json({
      message: "Invalid OTP",
      successful: false,
    })
  }

}


// login required for user verification ----------------------------------------------------
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.json({
        error: "email is required"
      })
    }

    if (!password || password.length < 6) {
      return res.json({
        error: "password must be at least 6 characters and password is Required",
      })
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        error: "user not found"
      })
    }
// compare password with database password
    const match = await comparePassword(password, user.password);

    if (!match) {
      return res.json({
        error: "invalid password and email",
      })
    }

    const token = jwt.sign({ _id: user._id, }, process.env.SECRET_KEY, {
      expiresIn: '7d',
    })


    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    })
    

  } catch (error) {
    res.json({
      error: `login fail and ${error.massage}`,
    })
  }
}



// update profile--------------------------------------------------------------------------

exports.updateProfile = async (req, res) => {
  try {
    const { name, email,role, password } = req.body;

    const user = await User.findById(req.user._id);

    if (!password || password.length < 6) {
      return res.json({ error: 'invalid_password' });
    }

    const hash_password = password ? await hashPassword(password) : undefined;


    const update = await User.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        email: email || user.email,
        role: role || user.role,
        password: hash_password || user.password,
      },
      {
        new: true,
      });
    // don't show res json 
      update.password = undefined,
      update.role = undefined,
      
        
      res.json(update)
    
  } catch (error) {
    console.log(error);
  }
}


