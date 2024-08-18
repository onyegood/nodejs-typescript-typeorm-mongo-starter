import { hash } from "bcryptjs";
import jwt from "jsonwebtoken";

export class Generate {
  static randomNumber(length: number) {
    const code =
      Math.floor(Math.random() * (9 * Math.pow(10, length))) +
      Math.pow(10, length);

    const randomCode = code.toString().substring(1);
    return randomCode;
  }

  static generateToken(
    userId: string,
    userType: string,
    email?: string,
    expired?: string,
  ) {
    const jwtPayload = email
      ? {
          id: userId,
          userType,
          email,
        }
      : { id: userId, userType };
    return jwt.sign(jwtPayload, process.env.ACCESS_KEY_SECRET!, {
      expiresIn: expired ? expired : process.env.TOKEN_EXPIRES_IN!,
    });
  }

  static async verifyToken(token: string) {
    return jwt.verify(token, process.env.ACCESS_KEY_SECRET!);
  }

  static async hashPassword(password: string) {
    return hash(password, 12);
  }

  static futureDate(duration: number): Date {
    // Get the current date
    const currentDate = new Date();

    // Add 30 days to the current date
    currentDate.setDate(currentDate.getDate() + duration);

    return currentDate;
  }
}
