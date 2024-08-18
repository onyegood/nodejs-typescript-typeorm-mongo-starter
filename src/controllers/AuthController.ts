// import { validate } from "class-validator";
import { compare } from "bcryptjs";
import { Request, Response } from "express";

import { UserType } from "@/constants/Roles";
import { AuthService } from "@/services/AuthService";
import { Generate } from "@/utils/Generate";
// import jwt from "jsonwebtoken";

// import { Generate } from "@/utils/Generate";
// import { UserType } from "@/constants/Roles";

const authService = new AuthService();

export class AuthController {
  // async register(req: Request, res: Response): Promise<Response> {
  //   const userData = req.body;

  //   // Validate data
  //   const dto = new RegisterAuthDTO();
  //   Object.assign(dto, userData);

  //   const errors = await validate(dto);
  //   if (errors.length > 0) {
  //     return ResponseUtl.sendError(
  //       res,
  //       FEEDBACK.INVALID_DATA,
  //       STATUS_CODE.UNPROCESSABLE_ENTITY,
  //       errors,
  //     );
  //   }
  //   // Validate data

  //   const repo = AppDataSource.getRepository(User);
  //   const user = repo.create(userData);

  //   // Save user into the db
  //   await repo.save(user);

  //   // Delete the password field before returning the user object.
  //   delete user["password"];

  //   // Send otp code to the customer email
  //   const code = Generate.randomNumber(5);

  //   const userId = user["id"];

  //   // Generate token
  //   const token = Generate.generateToken(
  //     userId,
  //     UserType.PARENT,
  //     userData.email,
  //     process.env.OTP_TOKEN_EXPIRES_IN,
  //   );

  //   // // Save otp code in the db
  //   const otpRepo = AppDataSource.getRepository(Otp);
  //   const otpData = {
  //     email: userData.email,
  //     code,
  //     token,
  //   };
  //   const otp = otpRepo.create(otpData);

  //   // Save otp into the db
  //   await otpRepo.save(otp);

  //   // Send otp to user email
  //   const payload = {
  //     subject: "Welcome to Efiko Kids",
  //     to: [userData.email],
  //     html: `Kindly use this code <p><b>${code}</b></p> to verify your account.`,
  //   };

  //   Mailer.gmailSender(payload);
  //   // Send otp to user email

  //   return ResponseUtl.sendResponse(
  //     res,
  //     user,
  //     FEEDBACK.CREATED,
  //     null,
  //     STATUS_CODE.CONTENT_CREATED,
  //   );
  // }

  async login(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;

    const user = await authService.login(email);

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    const passwordMatches = await compare(password, user.password);

    if (!passwordMatches) {
      return res.status(400).json({
        success: false,
        message: "User name or password is incorrect",
      });
    }

    // Generate access token
    const token = Generate.generateToken(
      String(user.id),
      String(UserType.PARENT),
    );

    // Generate refresh token
    const refreshToken = Generate.generateToken(
      String(user.id),
      String(UserType.PARENT),
      process.env.REFRESH_TOKEN_EXPIRES_IN!,
    );

    const payload = {
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone,
        role: user.role,
        verified: user.verified,
        active: user.active,
        organisationId: user.organisationId,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      token,
      refreshToken,
    };

    return res.status(200).json(payload);
  }

  /*
  async studentLogin(req: Request, res: Response): Promise<Response> {
    const studentData = req.body;

    // Validate data
    const dto = new StudentLoginDTO();
    Object.assign(dto, studentData);

    const errors = await validate(dto);
    if (errors.length > 0) {
      return ResponseUtl.sendError(
        res,
        FEEDBACK.INVALID_DATA,
        STATUS_CODE.UNPROCESSABLE_ENTITY,
        errors,
      );
    }
    // Validate data

    const repo = AppDataSource.getRepository(Student);
    const user = await repo.findOneBy({ user_name: studentData.user_name });

    if (!user) {
      return ResponseUtl.sendError(
        res,
        FEEDBACK.INVALID_DATA,
        STATUS_CODE.UNAUTHORIZED,
        [{ field: "user_name", message: FEEDBACK.SOMETHING_WENT_WRONG }],
      );
    }

    const passwordMatches = await compare(studentData.password, user.password);

    if (!passwordMatches) {
      return ResponseUtl.sendError(
        res,
        FEEDBACK.INVALID_DATA,
        STATUS_CODE.UNAUTHORIZED,
        [{ field: "password", message: FEEDBACK.SOMETHING_WENT_WRONG }],
      );
    }

    // Generate access token
    const token = Generate.generateToken(user.id, UserType.STUDENT);

    // Generate refresh token
    const refreshToken = Generate.generateToken(
      user.id,
      UserType.STUDENT,
      process.env.REFRESH_TOKEN_EXPIRES_IN!,
    );

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // req.session.jwt = token;

    const returnStudent = user.toResponse();

    const payload = { user: returnStudent, token, refreshToken };

    return ResponseUtl.sendResponse(
      res,
      payload,
      FEEDBACK.FETCHED,
      null,
      STATUS_CODE.SUCCESS,
    );
  }

  async loginOrg(req: Request, res: Response): Promise<Response> {
    const userData = req.body;

    // Validate data
    const dto = new LoginAuthDTO();
    Object.assign(dto, userData);

    const errors = await validate(dto);
    if (errors.length > 0) {
      return ResponseUtl.sendError(
        res,
        FEEDBACK.INVALID_DATA,
        STATUS_CODE.UNPROCESSABLE_ENTITY,
        errors,
      );
    }
    // Validate data

    const repo = AppDataSource.getRepository(Organisation);
    const user = await repo.findOneBy({ email: userData.email });

    if (!user) {
      return ResponseUtl.sendError(
        res,
        FEEDBACK.INVALID_DATA,
        STATUS_CODE.UNAUTHORIZED,
        [{ field: "email", message: FEEDBACK.SOMETHING_WENT_WRONG }],
      );
    }

    const passwordMatches = await compare(userData.password, user.password);

    if (!passwordMatches) {
      return ResponseUtl.sendError(
        res,
        FEEDBACK.INVALID_DATA,
        STATUS_CODE.UNAUTHORIZED,
        [{ field: "password", message: FEEDBACK.SOMETHING_WENT_WRONG }],
      );
    }

    // Generate access token
    const token = Generate.generateToken(user.id, UserType.ORGANISATION);

    // Generate refresh token
    const refreshToken = Generate.generateToken(
      user.id,
      UserType.ORGANISATION,
      process.env.REFRESH_TOKEN_EXPIRES_IN!,
    );

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // req.session.jwt = token;

    const returnUser = user.toResponse();

    const payload = { user: returnUser, token, refreshToken };

    // Send otp code to the customer email
    const code = Generate.randomNumber(5);

    const userId = user.id;

    // Generate token
    const otpToken = Generate.generateToken(
      userId,
      UserType.ORGANISATION,
      process.env.OTP_TOKEN_EXPIRES_IN,
    );

    // // Save otp code in the db
    const otpRepo = AppDataSource.getRepository(Otp);
    const otpData = {
      email: userData.email,
      code,
      token: otpToken,
    };
    const otp = otpRepo.create(otpData);

    // Save otp into the db
    await otpRepo.save(otp);

    // Send otp to user email
    const emailPayload = {
      subject: "Welcome to Efiko Kids",
      to: [userData.email],
      html: `Kindly use this code <p><b>${code}</b></p> to verify your account.`,
    };

    Mailer.gmailSender(emailPayload);
    // Send otp to user email

    return ResponseUtl.sendResponse(
      res,
      payload,
      FEEDBACK.FETCHED,
      null,
      STATUS_CODE.SUCCESS,
    );
  }

  async sendOTP(req: Request, res: Response): Promise<Response> {
    const userData = req.body;

    // Validate data
    const dto = new VerifyAccountEmailDTO();
    Object.assign(dto, userData);

    const errors = await validate(dto);
    if (errors.length > 0) {
      return ResponseUtl.sendError(
        res,
        FEEDBACK.INVALID_DATA,
        STATUS_CODE.UNPROCESSABLE_ENTITY,
        errors,
      );
    }
    // Validate data

    const repo = AppDataSource.getRepository(User);
    const user = await repo.findOneBy({ email: userData.email });

    if (!user) {
      return ResponseUtl.sendError(
        res,
        FEEDBACK.INVALID_DATA,
        STATUS_CODE.UNAUTHORIZED,
        errors,
      );
    }

    // Generate token
    const token = Generate.generateToken(
      user.id,
      UserType.PARENT,
      userData.email,
      process.env.OTP_TOKEN_EXPIRES_IN,
    );

    const code = Generate.randomNumber(5);

    const otpRepo = AppDataSource.getRepository(Otp);

    // Save otp code in the db
    const isExist = await otpRepo.findOneBy({ email: userData.email });
    const otpData = {
      email: userData.email,
      code,
      token,
    };

    if (isExist) {
      await otpRepo
        .createQueryBuilder()
        .update(Otp)
        .set({ code, token })
        .where({ email: userData.email })
        .execute();
    } else {
      const otp = otpRepo.create(otpData);
      // Save otp into the db
      await otpRepo.save(otp);
    }

    // Send otp to user email
    const payload = {
      subject: "Welcome to Efiko Kids",
      to: [userData.email],
      html: `Kindly use this code <p><b>${code}</b></p> to verify your account.`,
    };

    Mailer.gmailSender(payload);
    // Send otp to user email

    return ResponseUtl.sendResponse(
      res,
      null,
      FEEDBACK.FETCHED,
      null,
      STATUS_CODE.SUCCESS,
    );
  }

  async verifyAccount(req: Request, res: Response): Promise<Response> {
    try {
      const userData = req.body;
      const isResetPassword = req.query.reset;

      // Validate data
      const dto = new CreateOtpDTO();
      Object.assign(dto, userData);

      const errors = await validate(dto);
      if (errors.length > 0) {
        return ResponseUtl.sendError(
          res,
          FEEDBACK.INVALID_DATA,
          STATUS_CODE.UNPROCESSABLE_ENTITY,
          errors,
        );
      }
      // Validate data

      const otpRepo = AppDataSource.getRepository(Otp);
      const otp = await otpRepo.findOneBy({ code: userData.code });

      if (!otp) {
        return ResponseUtl.sendError(
          res,
          FEEDBACK.INVALID_DATA,
          STATUS_CODE.UNAUTHORIZED,
          errors,
        );
      }

      const decoded = await Generate.verifyToken(otp.token);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const { id, email } = decoded;

      if (email !== userData.email) {
        return ResponseUtl.sendError(
          res,
          FEEDBACK.INVALID_DATA,
          STATUS_CODE.UNAUTHORIZED,
          errors,
        );
      }

      const repo = AppDataSource.getRepository(User);
      await repo
        .createQueryBuilder()
        .update(User)
        .set({ verified: true })
        .where({ id })
        .execute();

      if (!isResetPassword) {
        // Delete otp from the db
        await otpRepo.remove(otp);
      }

      return ResponseUtl.sendResponse(
        res,
        null,
        FEEDBACK.FETCHED,
        null,
        STATUS_CODE.SUCCESS,
      );
    } catch (errors) {
      return ResponseUtl.sendError(
        res,
        FEEDBACK.INVALID_DATA,
        STATUS_CODE.UNAUTHORIZED,
        errors,
      );
    }
  }

  async resetPassword(req: Request, res: Response): Promise<Response> {
    try {
      const userData = req.body;

      // Validate data
      const dto = new ResetPasswordDTO();
      Object.assign(dto, userData);

      const errors = await validate(dto);
      if (errors.length > 0) {
        return ResponseUtl.sendError(
          res,
          FEEDBACK.INVALID_DATA,
          STATUS_CODE.UNPROCESSABLE_ENTITY,
          errors,
        );
      }
      // Validate data

      const otpRepo = AppDataSource.getRepository(Otp);
      const otp = await otpRepo.findOneBy({ code: userData.code });

      if (!otp) {
        return ResponseUtl.sendError(
          res,
          FEEDBACK.INVALID_DATA,
          STATUS_CODE.UNAUTHORIZED,
          errors,
        );
      }

      const decoded = await Generate.verifyToken(otp.token);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const { id, email } = decoded;

      if (email !== userData.email) {
        return ResponseUtl.sendError(
          res,
          FEEDBACK.INVALID_DATA,
          STATUS_CODE.UNAUTHORIZED,
          errors,
        );
      }

      const repo = AppDataSource.getRepository(User);

      // Hashed password
      const password = await Generate.hashPassword(userData.password);

      await repo
        .createQueryBuilder()
        .update(User)
        .set({ password })
        .where({ id })
        .execute();

      // Delete otp from the db
      await otpRepo.remove(otp);

      return ResponseUtl.sendResponse(
        res,
        null,
        FEEDBACK.FETCHED,
        null,
        STATUS_CODE.SUCCESS,
      );
    } catch (errors) {
      return ResponseUtl.sendError(
        res,
        FEEDBACK.INVALID_DATA,
        STATUS_CODE.UNAUTHORIZED,
        errors,
      );
    }
  }

  async signout(req: Request, res: Response): Promise<void> {
    req.session = null; // Clear the session data
    res.json({ message: "Sign-out successful" });
  }

  async checkSession(req: Request, res: Response): Promise<void> {
    if (req.session) {
      res.json({ session: req.session });
    }
  }

  async isValidToken(req: Request, res: Response): Promise<Response> {
    const token = req.header("x-auth-token");
    if (!token) return res.status(400).json(false);

    const verified = jwt.verify(token, process.env.ACCESS_KEY_SECRET!);
    if (!verified) return res.status(400).json(false);

    const id = verified["id"];
    const userId = req["user"]["id"];

    if (userId !== id) {
      return ResponseUtl.sendError(
        res,
        FEEDBACK.INVALID_DATA,
        STATUS_CODE.INTERNAL_SERVER_ERROR,
        null,
      );
    }

    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOneBy({ id });

    if (!user) {
      return ResponseUtl.sendError(
        res,
        FEEDBACK.INVALID_DATA,
        STATUS_CODE.INTERNAL_SERVER_ERROR,
        null,
      );
    }

    return res.status(200).json(true);
  }
    */
}
