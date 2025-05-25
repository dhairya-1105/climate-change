// pages/api/signup.js
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as cookie from 'cookie';

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await dbConnect();

    const { email, password, Username, rememberMe } = req.body;
    
    if (!email || !password || !Username) {
      return res.status(400).json({ valid: 1, error: 'All fields are required' });
    }

    // Check if email already exists
    const existingEmailUser = await User.findOne({ email });
    if (existingEmailUser) {
      return res.status(400).json({ valid: 3, error: 'Email already registered. Please login instead.' });
    }

    // Check if username already exists
    const existingUsernameUser = await User.findOne({ Username });
    if (existingUsernameUser) {
      return res.status(400).json({ valid: 1, error: "Username already exists. Please choose a different one." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const newUser = new User({
      email,
      password: hashedPassword,
      Username,
    });

    await newUser.save();

    // Generate JWT token
    const accessToken = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: rememberMe ? "7d" : "24h" }
    );

    // Set cookie
    res.setHeader("Set-Cookie", cookie.serialize("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: rememberMe ? 7 * 24 * 60 * 60 : 24 * 60 * 60,
      path: "/"
    }));

    return res.status(200).json({ 
      valid: 0, 
      username: newUser.Username,
      message: "User registered successfully" 
    });

  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ valid: 1, error: "Registration failed. Please try again." });
  }
}