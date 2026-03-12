import asyncHandler from "../../utils/asyncHandler.js";
import * as authService from "./auth.service.js";

export const register = asyncHandler(async (req, res) => {
  const user = await authService.registerUser(req.body);

  res.status(201).json({
    message: "User created",
    data: user
  });
});

export const login = asyncHandler(async (req, res) => {
  const tokens = await authService.loginUser(
    req.body.email,
    req.body.password
  );

  res.json(tokens);
});

export const refresh = asyncHandler( async (req, res) => {
  const { refreshToken } = req.body;

  const token = await authService.refreshToken(refreshToken);

  res.json(token);
});

export const logout = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  await authService.logout(refreshToken);

  res.json({
    message: "Logged out"
  });
})
