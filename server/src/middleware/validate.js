import { validationResult } from "express-validator";

export function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Please correct the highlighted fields",
      errors: errors.array().map((error) => ({ field: error.path, message: error.msg }))
    });
  }
  next();
}
