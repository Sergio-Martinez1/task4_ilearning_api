import { pool } from "../db.js";

export const getUsers = async (req, res) => {
  try {
    const [result, fields] = await pool.query("SELECT * FROM users;");
    if (result.length == 0)
      res.status(400).json({ message: "Not users found" });
    const users = result.map((user) => {
      let status = user.status == 1 ? "Blocked" : "Active";
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        lastLogin: user.lastLogin,
        status: status,
      };
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const blockUser = async (req, res) => {
  try {
    const [result, fields] = await pool.query(
      "SELECT * FROM users WHERE id=?",
      [req.params.id],
    );

    if (result.length == 0) res.status(400).json({ message: "User not found" });

    await pool.query("UPDATE users SET status = 1 WHERE id = ?", [
      req.params.id,
    ]);

    res.status(200).json({ message: "User blocked successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const unblockUser = async (req, res) => {
  try {
    const [result, fields] = await pool.query(
      "SELECT * FROM users WHERE id=?",
      [req.params.id],
    );

    if (result.length == 0) res.status(400).json({ message: "User not found" });

    await pool.query("UPDATE users SET status = 0 WHERE id = ?", [
      req.params.id,
    ]);

    res.status(200).json({ message: "User unblocked successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const [result, fields] = await pool.query(
      "SELECT * FROM users WHERE id=?",
      [req.params.id],
    );

    if (result.length == 0) res.status(400).json({ message: "User not found" });
    await pool.query("DELETE FROM users WHERE id = ?", [req.params.id]);

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
