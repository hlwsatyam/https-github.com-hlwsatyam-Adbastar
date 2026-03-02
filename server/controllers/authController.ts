import jwt from "jsonwebtoken";
import User from "../models/User.ts";

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "secret", {
    expiresIn: "30d",
  });
};

export const registerUser = async (req: any, res: any) => {
  const { firstName, lastName, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const user: any = await User.create({
    firstName,
    lastName,
    email,
    password,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ message: "Invalid user data" });
  }
};

export const loginUser = async (req: any, res: any) => {
  const { email, password } = req.body;

  const user: any = await User.findOne({ email });

  if (user && (await user.comparePassword(password))) {
    if (user.isBlocked) {
      return res.status(403).json({ message: "User is blocked" });
    }
    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
};

export const getMe = async (req: any, res: any) => {
  const user = await User.findById(req.user._id).select("-password");
  res.json(user);
};
