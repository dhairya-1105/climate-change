import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as cookie from 'cookie';

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  await dbConnect();

  const { email, password, Username, rememberMe } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const isMatch = await bcrypt.compare(password, existingUser.password);
      if (!isMatch) return res.status(401).json({ valid: 3, error: 'Invalid email or password' });
      existingUser.Username = Username;
      await existingUser.save();
      const accessToken = jwt.sign(
        { userId: existingUser._id, email: existingUser.email },
        process.env.JWT_SECRET,
        { expiresIn: rememberMe ? "7d" : "1m" }
      );
      res.setHeader("Set-Cookie", cookie.serialize("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: rememberMe ? 7 * 24 * 60 * 60 : 60,
        path: "/"
      }));
      return res.status(200).json({ valid: 0, message: "Email already registered" });
    }
    const user = await User.findOne({ Username });
    if (user) {
      return res.status(400).json({ valid: 1, error: "Username exists, already" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
      Username,
    });

    await newUser.save();

    const accessToken = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: rememberMe ? "7d" : "1m" }
    );

    res.setHeader("Set-Cookie", cookie.serialize("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: rememberMe ? 7 * 24 * 60 * 60 : 60,
      path: "/"
    }));

    res.status(200).json({ valid: 2, message: "User registered successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}