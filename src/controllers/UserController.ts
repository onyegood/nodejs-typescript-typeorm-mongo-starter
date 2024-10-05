import { Request, Response } from "express";
import { validationResult } from "express-validator";

import { UserType } from "@/constants/Roles";
import { STATUS_CODE } from "@/constants/StatusCode";
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

      return res.status(STATUS_CODE.SUCCESS).json({
        users: userData,
        total,
        page,
        last_page: Math.ceil(total / take),
      });
    } catch (error: any) {
      return res
        .status(STATUS_CODE.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  public async getUserById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const user = await userService.getUserById(id);

      return user
        ? res.status(STATUS_CODE.SUCCESS).json(user)
        : res.status(STATUS_CODE.NOT_FOUND).json({ message: "User not found" });
    } catch (error: any) {
      return res
        .status(STATUS_CODE.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  public async getCurrentUser(req: Request, res: Response): Promise<Response> {
    try {
      const id = req["user"]["id"];

      const user = await userService.getUserById(id);
      return user
        ? res.status(STATUS_CODE.SUCCESS).json(user)
        : res.status(STATUS_CODE.NOT_FOUND).json({ message: "User not found" });
    } catch (error: any) {
      return res
        .status(STATUS_CODE.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  public async createUser(req: Request, res: Response): Promise<Response> {
    try {
      // Validate the request
      await Promise.all(validateUser.map(validation => validation.run(req)));
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(STATUS_CODE.INTERNAL_SERVER_ERROR)
          .json({ errors: errors.array() });
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

      return res.status(STATUS_CODE.CONTENT_CREATED).json(user);
    } catch (error: any) {
      return res
        .status(STATUS_CODE.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  public async updateUser(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      const user = await userService.update(id, req.body);
      return user
        ? res.status(STATUS_CODE.SUCCESS).json(user)
        : res.status(STATUS_CODE.NOT_FOUND).json({ message: "User not found" });
    } catch (error: any) {
      return res
        .status(STATUS_CODE.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  public async deleteUser(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      const deleted = await userService.delete(id);
      return deleted
        ? res.status(STATUS_CODE.SUCCESS).json({ message: "Deleted" })
        : res.status(STATUS_CODE.NOT_FOUND).json({ message: "User not found" });
    } catch (error: any) {
      return res
        .status(STATUS_CODE.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
}
