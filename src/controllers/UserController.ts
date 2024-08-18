import { Request, Response } from "express";
import { validationResult } from "express-validator";

import { UserType } from "@/constants/Roles";
import { User } from "@/database/entity/User";
import { Mailer } from "@/mailler";
import { UserRepository } from "@/repositories/UsersRepository";
import { OtpService } from "@/services/OtpService";
import { UserService } from "@/services/UserService";
import { Generate } from "@/utils/Generate";
import { validateUser } from "@/validation/user";

const userService = new UserService();
const otpService = new OtpService();

export class UserController {
  public async getAllUsers(req: Request, res: Response): Promise<Response> {
    try {
      let options = {};

      if (req.query.s) {
        options = {
          ...options,
          where: {
            $or: [
              { firstName: new RegExp(req.query.s.toString(), "i") },
              { lastName: new RegExp(req.query.s.toString(), "i") },
            ],
          },
        };
      }

      if (req.query.sort) {
        options = {
          ...options,
          order: {
            firstName: req.query.sort.toString().toUpperCase(),
            lastName: req.query.sort.toString().toUpperCase(),
            gender: req.query.sort.toString().toUpperCase(),
          },
        };
      }

      // Pagination
      const page: number = parseInt(req.query.page as any) || 1;
      const take: number = parseInt(req.query.take as any) || 5;
      const total = await UserRepository.count();

      const users = await userService.getAllUsers({
        ...options,
        take,
        skip: (page - 1) * take,
      });

      // Transform data to return array of users without the password field.
      const userData = users.map((user: User) => {
        return user.toResponse();
      });

      return res.status(200).json({
        users: userData,
        total,
        page,
        last_page: Math.ceil(total / take),
      });
    } catch (error) {
      // console.log(error);
      return res.status(500).json({ error: "Error fetching users" });
    }
  }

  public async getUserById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const user = await userService.getUserById(id);

      return user
        ? res.status(200).json(user)
        : res.status(404).json({ message: "User not found" });
    } catch (error) {
      // console.log(error);
      return res.status(500).json({ error: "Error fetching user" });
    }
  }

  public async getCurrentUser(req: Request, res: Response): Promise<Response> {
    try {
      const id = req["user"]["id"];

      const user = await userService.getUserById(id);
      return user
        ? res.status(200).json(user)
        : res.status(404).json({ message: "User not found" });
    } catch (error) {
      // console.log(error);
      return res.status(500).json({ error: "Error fetching current user" });
    }
  }

  public async createUser(req: Request, res: Response): Promise<Response> {
    try {
      // Validate the request
      await Promise.all(validateUser.map(validation => validation.run(req)));
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const user = await userService.create(req.body);

      // Send otp code to the customer email
      const code = Generate.randomNumber(5);

      const userId = String(user["id"]);

      // Generate token
      const token = Generate.generateToken(
        userId,
        String(UserType.PARENT),
        user.email,
        process.env.OTP_TOKEN_EXPIRES_IN,
      );

      // // Save otp code in the db
      const otpData = {
        email: user.email,
        code,
        token,
      };

      await otpService.create(otpData);

      // Send otp to user email
      const payload = {
        subject: "Welcome to Efiko Kids",
        to: [user.email],
        html: `Kindly use this code <p><b>${code}</b></p> to verify your account.`,
      };

      Mailer.gmailSender(payload);
      // Send otp to user email

      return res.status(201).json(user);
    } catch (error) {
      // console.log(error);
      return res.status(500).json({ error: "Error creating user" });
    }
  }

  public async updateUser(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      const user = await userService.update(id, req.body);
      return user
        ? res.status(200).json(user)
        : res.status(404).json({ message: "User not found" });
    } catch (error) {
      // console.log(error);
      return res.status(500).json({ error: "Error updating user" });
    }
  }

  public async deleteUser(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      const deleted = await userService.delete(id);
      return deleted
        ? res.status(200).json({ message: "Deleted" })
        : res.status(404).json({ message: "User not found" });
    } catch (error) {
      // console.log(error);
      return res.status(500).json({ error: "Error deleting user" });
    }
  }
}
