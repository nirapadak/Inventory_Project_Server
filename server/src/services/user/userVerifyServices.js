const userVerifyService = async (code, email ,User) => {
  return await User.find({ email: email, otp: code }).count('total');
}

module.exports = userVerifyService;