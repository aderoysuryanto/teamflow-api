import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import * as userRepo from "../users/user.repository.js";
import * as tokenRepo from "./refreshToken.repository.js";
import AppError from "../../utils/appError.js";

const SALT_ROUNDS = 10;

export async function registerUser(data) {
  const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

  const user = await userRepo.createUser({
    email: data.email,
    password: hashedPassword,
    name: data.name
  });

  return user;
}

export async function loginUser(email, password) {
  const user = await userRepo.findUserByEmail(email);

  if (!user) throw new AppError("Invalid credentials", 400);

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) throw new AppError("Invalid credentials", 400);

  const accessToken = jwt.sign(
    { userId: user.id },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRES }
  );

  const refreshToken = jwt.sign(
    { userId: user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES }
  );

  await tokenRepo.createRefreshToken({
    token: refreshToken,
    userId: user.id,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  });

  return { accessToken, refreshToken };
}

export async function refreshToken(token) {
  const stored = await tokenRepo.findResreshToken(token);

  if (!stored) throw new Error("Invalid refresh token");

  const payload = jwt.verify(
    token,
    process.env.JWT_REFRESH_SECRET
  );

  const accessToken = jwt.sign(
    { userId: payload.userId },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRES }
  );

  return { accessToken };
}

export async function logout(token) {
  await tokenRepo.deleteRefreshToken(token);
}
