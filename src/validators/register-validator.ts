import { checkSchema } from "express-validator";

export default checkSchema({
  firstName: {
    trim: true,
    errorMessage: "First name is required",
    notEmpty: true,
  },
  lastName: {
    trim: true,
    errorMessage: "Last name is required",
    notEmpty: true,
  },
  email: {
    trim: true,
    errorMessage: "Email is required",
    notEmpty: true,
    isEmail: {
      errorMessage: "Invalid email format",
    },
  },
  password: {
    trim: true,
    errorMessage: "Password is required",
    notEmpty: true,
    isLength: {
      errorMessage: "Password must be at least 8 characters long",
      options: { min: 8 },
    },
    matches: {
      errorMessage:
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      options: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
    },
  },
});
