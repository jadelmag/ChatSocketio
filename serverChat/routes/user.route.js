const { Router } = require("express");
const { check } = require("express-validator");
const { validateJWT } = require("../middlewares/validateJWT");
const router = Router();

// Controllers
const {
  siginUser,
  loginUser,
  allUssers,
  renewToken,
} = require("../controllers/user.controller");

router.post(
  "/sigin",
  [
    check("username").not().isEmpty().withMessage("Username field is required"),
    check("email")
      .trim()
      .escape()
      .not()
      .isEmpty()
      .withMessage("Email field is required")
      .bail()
      .isEmail()
      .withMessage("Email is invalid"),
    check("password")
      .trim()
      .escape()
      .not()
      .isEmpty()
      .withMessage("Password field is required")
      .bail()
      .isLength({ min: 6 })
      .withMessage("Minimum 6 characters required!")
      .bail(),
    check("confirmPassword")
      .trim()
      .escape()
      .not()
      .isEmpty()
      .withMessage("Password field is required")
      .bail()
      .isLength({ min: 6 })
      .withMessage("Minimum 6 characters required!")
      .bail()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords don't match");
        }
        return true;
      }),
  ],
  siginUser
);

router.post(
  "/login",
  [
    check("email")
      .trim()
      .escape()
      .not()
      .isEmpty()
      .withMessage("Email field is required")
      .bail()
      .isEmail()
      .withMessage("Email is invalid"),
    check("password")
      .trim()
      .escape()
      .not()
      .isEmpty()
      .withMessage("Password field is required")
      .bail()
      .isLength({ min: 6 })
      .withMessage("Minimum 6 characters required!")
      .bail(),
  ],
  loginUser
);

router.post("/all", validateJWT, allUssers);

router.get("/renew", validateJWT, renewToken);

module.exports = router;
