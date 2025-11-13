import User from "../models/UserSchema.js";
import Jwt from "jsonwebtoken";
import crypto from "crypto";
import validator from "validator"
import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "../utils/catchAsyncErrors.js";

export const sendToken = catchAsyncErrors(async(user, statusCode, res) => {
  const token = user.getJwtToken();

  const options = {
      expires: new Date (
          Date.now() + process.env.COOKIE_EXPIRE_TIME * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
  };
  res.status(statusCode).cookie("token", token, options).json({
      token,
  })
})

// Registration
export const register = catchAsyncErrors(async (req, res, next) => {
  try {
    const {email, password } = req.body;

    if (!email || !password) {
      return next(new ErrorHandler("Email and Password is Required", 400));
    }

    if (!validator.isEmail(email)) {
      return next(new ErrorHandler("Invalid email format", 400));
    }

    if (await User.findOne({ email })) {
      return next(new ErrorHandler("Email already exists", 400));
    }

    const user = await User.create({email, password });

    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    return next(new ErrorHandler("Server error", 500));
  }
});

// Login
export const login = catchAsyncErrors(async (req, res, next) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return next(new ErrorHandler("Credentials Missing", 400));
    }

    const user = await User.findOne({
      $or: [{ email: identifier }],
    }).select("+password");

    if (!user) return next(new ErrorHandler("Invalid credentials", 401));

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return next(new ErrorHandler("Invalid credentials", 401));

    sendToken(user, 200, res);
  } catch (err) {
    console.log(err);
    return next(new ErrorHandler("Server error", 500));
  }
});

// Me
export const me = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
      return next(new ErrorHandler(`User does not found with id: ${req.params.id}`))
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// Logout
export const logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true
})
res.status(200).json({
    message: "logged-out"
})
});