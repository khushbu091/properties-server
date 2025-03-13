const nodemailer = require("nodemailer");
const config = require("../../config/config");
const ejs = require("ejs");
const path = require("path");
require("dotenv").config();

const sendOtpEmail = async (name, email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    ejs.renderFile(
      path.join(__dirname, "../views/email.ejs"),
      { name, otp },
      (err, data) => {
        if (err) {
          console.log("Error rendering email template:", err);
          return;
        }

        const message = {
          from: "",
          to: email,
          subject: "Your verification Opt",
          html: data,
        };

        transporter.sendMail(message, (error, info) => {
          if (error) {
            console.log("Error sending email:", error);
          } else {
            console.log("OTP Email sent:", info.response);
          }
        });
      }
    );
  } catch (error) {
    console.log("Error sending OTP email:", error);
  }
};

module.exports = sendOtpEmail;
