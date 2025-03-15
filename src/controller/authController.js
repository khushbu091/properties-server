const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const sendOtpEmail = require("../services/emailServices");
const { User: userModel } = require("../../config/db");

function generateOTP() {
  return crypto.randomInt(100000, 999999).toString();
}

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await userModel.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({
        status: false,
        statusCode: 404,
        message: "User not found",
      });
    }

    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        status: false,
        statusCode: 400,
        message: "Invalid password",
      });
    }

    // Check if user is verified
    if (!user.is_verified) {
      return res.status(403).json({
        status: false,
        statusCode: 403,
        message: "User is not verified. Please verify OTP first.",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" } // Token expires in 7 days
    );

    return res.status(200).json({
      status: true,
      statusCode: 200,
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error("Error in user login:", error);
    return res.status(500).json({
      status: false,
      statusCode: 500,
      message: "Internal server error",
    });
  }
};
const userRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if the user already exists
    const existingUser = await userModel.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        status: false,
        statusCode: 400,
        message: "Email is already taken",
      });
    }

    // Hash password and generate OTP
    const hashPassword = await bcrypt.hash(password, 10);
    const verificationOTP = generateOTP();
    const expirationTime = new Date();
    expirationTime.setMinutes(expirationTime.getMinutes() + 15); // OTP valid for 15 minutes

    // Create new user object
    const newUser = {
      name,
      email,
      password: hashPassword,
      OTP: verificationOTP,
      expiration_time: expirationTime,
    };

    // Store the new user in the database
    const createUser = await userModel.create(newUser);

    if (!createUser) {
      return res.status(400).json({
        status: false,
        message: "Registration failed",
      });
    }

    // Send OTP email before responding
    await sendOtpEmail(name, email, verificationOTP);

    return res.status(201).json({
      status: true,
      statusCode: 201,
      message: "Registration successful",
    });
  } catch (error) {
    console.error("Error in user registration:", error);
    return res.status(500).json({
      status: false,
      statusCode: 500,
      message: "Internal server error",
    });
  }
};
const verifyOTP = async (req, res) => {
  try {
    const { email, OTP } = req.body;

    // Check if the user exists
    const user = await userModel.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({
        status: false,
        statusCode: 404,
        message: "User not found",
      });
    }

    // Check if OTP matches
    if (user.OTP !== OTP) {
      return res.status(400).json({
        status: false,
        statusCode: 400,
        message: "Invalid OTP",
      });
    }

    // Check if OTP is expired
    const currentTime = new Date();
    if (currentTime > user.expiration_time) {
      return res.status(400).json({
        status: false,
        statusCode: 400,
        message: "OTP has expired",
      });
    }

    // Update user status to verified and remove OTP fields
    await userModel.update(
      { OTP: null, expiration_time: null, is_verified: true },
      { where: { email } }
    );

    return res.status(200).json({
      status: true,
      statusCode: 200,
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.error("Error in OTP verification:", error);
    return res.status(500).json({
      status: false,
      statusCode: 500,
      message: "Internal server error",
    });
  }
};
const resendOtpEmail = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if the user exists
    const user = await userModel.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({
        status: false,
        statusCode: 404,
        message: "User not found",
      });
    }

    // Generate new OTP and expiration time
    const newOTP = generateOTP();
    const expirationTime = new Date();
    expirationTime.setMinutes(expirationTime.getMinutes() + 15); // OTP valid for 15 minutes

    // Update the OTP in the database
    await userModel.update(
      { OTP: newOTP, expiration_time: expirationTime },
      { where: { email } }
    );

    // Send OTP email
    await sendOtpEmail(user.name, user.email, newOTP);

    return res.status(200).json({
      status: true,
      statusCode: 200,
      message: "OTP has been resent successfully",
    });
  } catch (error) {
    console.error("Error in resending OTP:", error);
    return res.status(500).json({
      status: false,
      statusCode: 500,
      message: "Internal server error",
    });
  }
};
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    // Generate OTP and expiration time
    const otp = generateOTP(); // 6-digit OTP
    const expirationTime = new Date(Date.now() + 15 * 60 * 1000); // 15 min expiry

    // Update user with OTP and expiration time
    await user.update({ otp, otpExpirationTime: expirationTime });

    // Send OTP email
    sendOtpEmail(user.name, user.email, otp);

    res.status(200).json({
      status: true,
      message: "OTP sent successfully. Check your email.",
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ status: false, message: "Something went wrong" });
  }
};
const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    // Check if OTP is valid and not expired
    if (!user.otp || user.otp !== otp || new Date() > user.otpExpirationTime) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid or expired OTP" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user's password & clear OTP
    await user.update({
      password: hashedPassword,
      otp: null,
      otpExpirationTime: null,
    });

    res
      .status(200)
      .json({ status: true, message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ status: false, message: "Something went wrong" });
  }
};

module.exports = {
  loginUser,
  userRegister,
  verifyOTP,
  resendOtpEmail,
  forgotPassword,
  resetPassword,
};
