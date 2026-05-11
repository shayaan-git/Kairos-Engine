// Checks which user is making the request and adds the user object to the request for use in controllers

import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";

export function authUser(req, res, next) {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No token provided",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token and decode it to get user info (like user ID)
    req.user = decoded;
    // Add decoded token (user info) to request object, will be using in controllers to identify the user making the request. To be used in protected routes that require authentication like getMe, updateProfile, etc.
    next(); // Call next middleware or controller
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
}
