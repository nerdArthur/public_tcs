import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import { transporterOptions } from "../configs/mailConfig";
import { GMAIL_ACCOUNT } from "../utils/constant";

export const transporter = nodemailer.createTransport(transporterOptions);

export const sendMail = async (options?: Mail.Options) => {
  const info = await transporter.sendMail({
    from: GMAIL_ACCOUNT,
    to: "arthur.7martins@gmail.com",
    subject: "Redefinir senha ✔",
    text: "Acesse esse link para resetar sua senha",
    ...options,
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
};
