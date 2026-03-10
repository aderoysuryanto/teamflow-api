import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import * as userRepo from "../users/user.repository.js";
import * as tokenRepo from "./refreshToken.repository.js";

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

  if (!user) throw new Error("Invalid credentials");

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) throw new Error("Invalid credentials");

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
