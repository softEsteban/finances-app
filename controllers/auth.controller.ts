import { NextApiRequest, NextApiResponse } from "next";
import process from "process";
import Users from "../models/user";
import Profiles from "../models/profile";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const saltRounds = 10;

// POST - http://localhost:3000/api/login
export async function login(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { email, password } = req.body;

    // Find the user in the database
    const user = await Users.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "User does not exist" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Find the corresponding profile based on the user's user_type
    const profile = await Profiles.findOne({ profile_key: user.user_type });

    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET environment variable is not defined');
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" }); // Changed newUser to user

    res.status(200).json({ user: user, token, menu: profile.config, });
  } catch (error) {
    console.error('Error while authenticating user:', error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// POST - http://localhost:3000/api/register
export async function register(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { email, password, name, lastname, user_type, avatar, google_auth, is_google_login } = req.body;

    // Check if the user already exists
    const existingUser = await Users.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user in the database with the hashed password
    const newUser = await Users.create({ email, password: hashedPassword, name, lastname, user_type: "USER", avatar, google_auth, is_google_login });

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET environment variable is not defined');
    }

    // Generate a JWT token for the newly registered user
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.status(201).json({ token });
  } catch (error) {
    console.error('Error while registering user:', error);
    res.status(500).json({ error: "Internal server error" });
  }
}
