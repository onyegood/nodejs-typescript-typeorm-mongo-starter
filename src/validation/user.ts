import { body } from "express-validator";

export const validateUser = [
  body("email").isEmail().withMessage("Email must be a valid email."),
  body("first_name")
    .isString()
    .withMessage("First name is required.")
    .isLength({ min: 2, max: 255 })
    .withMessage("First name must be between 2 and 255 characters."),
  body("last_name")
    .isString()
    .withMessage("Last name is required.")
    .isLength({ min: 2, max: 255 })
    .withMessage("Last name must be between 2 and 255 characters."),
  body("gender")
    .isString()
    .withMessage("Gender is required.")
    .isLength({ min: 1, max: 6 })
    .withMessage("Gender must be between 2 and 255 characters."),
  body("password")
    .isString()
    .withMessage("Password is required.")
    .isLength({ min: 5, max: 50 })
    .withMessage("Password must be between 5 and 255 characters."),
  body("phone")
    .isString()
    .withMessage("Phone is required.")
    .isLength({ min: 11, max: 13 })
    .withMessage("Phone must be between 5 and 255 characters."),
  body("organisationId").isString().optional(),
  body("role").isString().optional(),
];

export const validateEmail = [
  body("email").isEmail().withMessage("Email must be a valid email."),
];
