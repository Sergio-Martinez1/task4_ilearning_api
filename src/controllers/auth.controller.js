import { pool } from "../db.js";
import bcrypt from "bcryptjs";
import { createAccesToken } from "../libs/jwt.js";
import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";

export const signUp = async (req, res) => {
  const { email, password, name } = req.body;
  try {
    const [result, fields] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
    );
    if (result[0])
      return res.status(400).json({ message: "This email already exists" });

    const passwordHash = await bcrypt.hash(password, 10);
    await pool.query(
      "INSERT INTO users(name, email, password) VALUES (?, ?, ?)",
      [name, email, passwordHash],
    );

    res.status(200).json({ message: "User created" });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      res.status(400).json({ message: "This email already exists" });
    } else {
      res.status(500).json({ message: "There was an error in user sigup" });
    }
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const [result, fields] = await pool.query(
      "SELECT * FROM users WHERE email=?",
      [email],
    );

    if (result.length == 0)
      return res.status(400).json({ message: "Email not found" });

    const user = result[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(400).json({ message: "Incorrect password" });

    const token = await createAccesToken({ id: user.id });
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    });

    let currentDateTime = new Date();

    let lastLogin =
      currentDateTime.getUTCFullYear() +
      "-" +
      ("0" + (currentDateTime.getUTCMonth() + 1)).slice(-2) +
      "-" +
      ("0" + currentDateTime.getUTCDate()).slice(-2) +
      " " +
      ("0" + currentDateTime.getUTCHours()).slice(-2) +
      ":" +
      ("0" + currentDateTime.getUTCMinutes()).slice(-2) +
      ":" +
      ("0" + currentDateTime.getUTCSeconds()).slice(-2);

    await pool.query("UPDATE users SET lastLogin = ? WHERE id = ?", [
      lastLogin,
      user.id,
    ]);

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      status: user.status,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logout = async (req, res) => {
  res.cookie("token", "", {
    expires: new Date(0),
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
  });
  return res.sendStatus(200);
};

export const verifyToken = async (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  try {
    jwt.verify(token, TOKEN_SECRET, async (err, user) => {
      if (err) return res.status(401).json({ message: "Unauthorized" });
      const [result, fields] = await pool.query(
        "SELECT * FROM users WHERE id = ?",
        [user.id],
      );
      if (result.length === 0)
        return res.status(401).json({ message: "Unauthorized" });

      return res.json({
        id: result[0].id,
        name: result[0].name,
        email: result[0].email,
      });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyStatus = async (req, res) => {
  const { user } = req.body;
  try {
    const [result, fields] = await pool.query(
      "SELECT * FROM users WHERE id = ?",
      [req.params.id],
    );
    if (result.length === 0)
      return res.status(401).json({ message: "Email not found" });

    if (result[0].status == 1) {
      res.cookie("token", "", { expires: new Date(0) });
      return res.status(401).json({ message: "Blocked email" });
    } else return res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
