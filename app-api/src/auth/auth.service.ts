import jwt from "jsonwebtoken";
import User from "../models/user.model";
import { createUser } from "../services/user.service";

export const register = async (data: any) => {
  return await createUser(data);
};

export const login = async (email: string, password: string) => {
  const user = await User.findOne({ email });

  if (!user) {
    return null;
  }

  if (user.password !== password) {
    return null;
  }

  // Marcar usuario como online
  user.online = true;
  await user.save();

  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET as string,
    { expiresIn: "1h" },
  );

  // Devolver usuario sin password
  const userObj = user.toObject();
  const { password: _, ...userSinPassword } = userObj;

  return { user: userSinPassword, token };
};
