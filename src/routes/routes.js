const { Router } = require("express");
const {
  userRegister,
  loginUser,
  verifyOTP,
  resendOtpEmail,
  resetPassword,
} = require("../controller/authController");
const {
  createPropertyType,
  createProperty,
  getPropertyType,
  getProperty,
  updateProperty,
  deleteProperty,
  getPropertiesByType,
} = require("../controller/propertyController");
const upload = require("../middlewares/upload");
const router = Router();

// user routes
router.post("/register", userRegister);
router.post("/login", loginUser);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOtpEmail);
router.post("/reset-password", resetPassword);

// property routes
router.post("/create_property_type", createPropertyType);
router.post(
  "/create_property",
  upload.array("property_img", 8),
  createProperty
);

router.get("/property-types/:propertyTypeId/listings", getPropertiesByType);
router.get("/get_property_type", getPropertyType);
router.get("/get_property", getProperty);

router.patch("/update_property", updateProperty);

router.delete("/delete_property", deleteProperty);

module.exports = router;
