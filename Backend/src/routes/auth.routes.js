import { Router } from "express";

import {
  getMe,
  login,
  logout,
  register,
  verifyEmail,
} from "../controllers/auth.controller.js";

import {
  loginValidator,
  registerValidator,
} from "../validators/auth.validation.js";

import { authUser } from "../middlewares/auth.middleware.js";

const AuthRouter = Router();

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 * @body {username, email, password}
 */

AuthRouter.post("/register", registerValidator(), register);

/**
 * @route POST /api/auth/login
 * @desc Authenticate user and return JWT token
 * @access Public
 * @body {email, password}
 */

AuthRouter.post("/login", loginValidator(), login);

AuthRouter.post("/logout", logout);

/**
 * @route GET /api/auth/verify-email
 * @desc Verify user's email address
 * @access Public
 * @query {token}
 */

AuthRouter.get("/verify-email", verifyEmail);

/**
 * @route GET /api/auth/get-me
 * @desc Get current authenticated user's info
 * @access Private
 */

AuthRouter.get("/get-me", authUser, getMe);

export default AuthRouter;
