import { checkSchema } from "express-validator";

export default checkSchema({
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
  },
});
