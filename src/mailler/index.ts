import nodemailer from "nodemailer";
import { AttachmentLike } from "nodemailer/lib/mailer";
import { Readable } from "nodemailer/lib/xoauth2";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_APP_USERNAME,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// async..await is not allowed in global scope, must use a wrapper
interface IOptions {
  subject: string;
  to: string[];
  text?: string;
  html: string | Buffer | Readable | AttachmentLike | undefined;
}
export class Mailer {
  static gmailSender({ subject, to, text, html }: IOptions) {
    const mailOption: IOptions = {
      to,
      subject,
      text,
      html,
    };
    transporter.sendMail(
      { from: "noreply@efikokids.com", ...mailOption },
      function (error: any, info: any) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent", info.response);
        }
      },
    );
  }
}
