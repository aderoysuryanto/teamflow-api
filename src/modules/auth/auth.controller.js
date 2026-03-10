import * as authService from "./auth.service.js";

export async function register(req, res) {
  try {
    const user = await authService.registerUser(req.body);

    res.status(201).json({
      message: "User created",
      data: user
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function login(req, res) {
  try {
    const tokens = await authService.loginUser(
      req.body.email,
      req.body.password
    );

    res.json(tokens);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
}
