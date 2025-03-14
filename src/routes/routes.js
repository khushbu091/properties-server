const { Router } = require("express");
const {
  userRegister,
  loginUser,
  verifyOTP,
  resendOtpEmail,
} = require("../controller/authController");
const router = Router();

router.post("/register", userRegister);
router.post("/login", loginUser);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOtpEmail);
module.exports = router;
