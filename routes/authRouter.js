const express = require('express');
const authController = require("./../controllers/authController");
const validation = require("./../middlewares/validationMiddleware");

const router = express.Router();

// sign-up new user
router.post(
    "/signup",
    validation.signupRules,
    authController.signup
)
// login user
router.post(
    "/login",
    validation.loginRules,
    authController.login
)
// logout user
router.get(
    "/logout",
    authController.logout
)
// forget password functionality
router.post(
    "/forget-password",
    validation.forgetPasswordRules,
    authController.forgetPassword
)
// reset user password
router.patch(
    "/reset-password/:PWD_token",
    validation.resetPasswordRules,
    authController.resetPassword
)

// update user password
router.patch(
    "/update-password",
    protectRoute,
    validation.updatePasswordRules,
    authController.updatePassword
)


module.exports = router;
