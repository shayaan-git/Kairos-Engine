import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import userModel from "../models/user.model.js";
import { sendEmail } from "../services/mail.service.js";

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 * @body {username, email, password}
 */
export async function register(req, res) {
  console.log("Register route hit");
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await userModel.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email or username already registered",
      });
    }

    // Create new user
    const newUser = new userModel({
      username,
      email,
      password, // Will be hashed by pre-save hook in user model
    });

    await newUser.save();

    // Generate JWT token
    const emailVerificationToken = jwt.sign(
      { email: newUser.email },
      process.env.JWT_SECRET,
    );

    await sendEmail({
      to: email,
      subject: "Welcome to Kairos!",
      html: `Hi, ${username}!<p>Thank you for registering at <strong>Kairos</strong>. We're excited to have you on board.</p>
      <p>Please verify your email address by clicking the link below:</p>
      <a href="${process.env.CLIENT_URL}/api/auth/verify-email?token=${emailVerificationToken}">Verify Email</a>
      <p>If you did not create an account, please ignore this email.</p>
      <p>Best regards,<br/>The Kairos Team</p>`,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during registration",
    });
  }
}

/**
 * @route POST /api/auth/login
 * @desc Authenticate user and return JWT token
 * @access Public
 * @body {email, password}
 */
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
        err: "User not found",
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (!user.verified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email before logging in",
      });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      token: token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during login",
    });
  }
}

/**
 * @route GET /api/auth/get-me
 * @desc Get current authenticated user's info
 * @access Private
 */
export async function getMe(req, res) {
  const userId = req.user.id;

  const user = await userModel.findById(userId).select("-password");

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  res.status(200).json({
    message: "User details fetched successfully",
    success: true,
    user,
  });
}

/**
 * @route GET /api/auth/verify-email
 * @desc Verify user's email address
 * @access Public
 * @query {token}
 */
export async function verifyEmail(req, res) {
  try {
    const { token } = req.query;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findOne({ email: decoded.email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.verified = true;
    await user.save(); // you have never saved the user after setting verified to true, so the change is not persisted in the database. You need to call user.save() to save the updated user document back to the database.

    // res.send() automatically sets Content-Type: text/html when you pass it an HTML string.
    res.send(
      "<h1>Email verified successfully!</h1><p>You can now log in to your account.</p><a href='${process.env.CLIENT_URL}/login'>Go to Login</a>",
    );
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid or expired token" });
  }
}
