import jwt from "jsonwebtoken";
import User from "../models/user.model";
import { createUser } from "../services/user.service";
import { normalizeAvatarPath } from "../constants/avatars";

export const register = async (data: any) => {
    const nick = data.nick;
    const email = data.email;
    const password = data.password;
    const edad = data.edad;
    const foto = normalizeAvatarPath(data.foto);
    const userDoc = await createUser({ nick, email, password, edad, foto });
    const u = userDoc.toObject();
    const { password: _, ...userSinPassword } = u;
    return userSinPassword;
};

export const login = async (email: string, password: string) => {
  const user = await User.findOne({ email });

  if (!user) {
    return null;
  }

  if (user.password !== password) {
    return null;
  }

  await user.save();

  const token = jwt.sign(
    {
      id: String(user._id),
      role: user.role,
    },
    process.env.JWT_SECRET as string,
    { expiresIn: "5h" },
  );

  // Devolver usuario sin password
  const userObj = user.toObject();
  const { password: _, ...userSinPassword } = userObj;

  return { user: userSinPassword, token };
};
