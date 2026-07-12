const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const generateToken = (user) =>
  jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  });

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 24 * 60 * 60 * 1000,
};

const registerUser = async (req, res) => {
  try {
    const { fullName, email, password, confirmPassword } = req.body;

    if (!fullName || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const existingUser = await userModel.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = await userModel.createUser({
      fullName,
      email,
      password: hashedPassword,
    });

    const user = await userModel.getUserById(userId);
    const token = generateToken(user);

    res.cookie("token", token, cookieOptions).status(201).json({
      message: "Registration Successful",
      token,
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const user = await userModel.getUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Password" });
    }

    const token = generateToken(user);

    res
      .cookie("token", token, cookieOptions)
      .status(200)
      .json({
        message: "Login Successful",
        token,
        user: {
          id: user.id,
          fullName: user.full_name,
          email: user.email,
          bio: user.bio,
          avatar: user.avatar,
        },
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
};

const logoutUser = (req, res) => {
  res.clearCookie("token", { ...cookieOptions, maxAge: 0 });
  res.status(200).json({ message: "Logged out" });
};

const getMe = async (req, res) => {
  // req.user is populated by the `protect` middleware
  res.status(200).json({ user: req.user });
};

const updateProfile = async (req, res) => {
  try {
    const { fullName, bio } = req.body;
    let avatar = null;

    if (req.file) {
      avatar = `/uploads/${req.file.filename}`;
      // remove old avatar file if it exists locally
      if (req.user.avatar && req.user.avatar.startsWith("/uploads/")) {
        const fs = require("fs");
        const path = require("path");
        const oldPath = path.join(__dirname, "..", req.user.avatar);
        fs.unlink(oldPath, () => {});
      }
    }

    const updated = await userModel.updateUser(req.user.id, {
      fullName: fullName || req.user.full_name,
      bio: bio ?? req.user.bio,
      avatar: avatar || req.user.avatar,
    });

    res.status(200).json({
      message: "Profile updated",
      user: {
        id: updated.id,
        fullName: updated.full_name,
        email: updated.email,
        bio: updated.bio,
        avatar: updated.avatar,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Please provide your email" });
    }

    const user = await userModel.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "No user found with this email" });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    await userModel.setResetToken(email, code, expiresAt);

    console.log(`\n==========================================`);
    console.log(`[MOCK MAIL] Password reset requested for: ${email}`);
    console.log(`[MOCK MAIL] Reset Code: ${code}`);
    console.log(`==========================================\n`);

    res.status(200).json({
      message: "Password reset code sent. Please check your email (or server logs).",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to send reset code. Please try again." });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, code, password, confirmPassword } = req.body;

    if (!email || !code || !password || !confirmPassword) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const user = await userModel.verifyResetToken(email, code);
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset code" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await userModel.updatePasswordAndClearToken(email, hashedPassword);

    res.status(200).json({ message: "Password reset successful. You can now login." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to reset password. Please try again." });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
  updateProfile,
  forgotPassword,
  resetPassword,
};
