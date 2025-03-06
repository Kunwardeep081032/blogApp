// Email utility

import nodemailer from "nodemailer";
import { CLIENT_URL, EMAIL_PASSWORD, EMAIL_USER } from "../config/config";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD,
  },
});

export const sendVerificationEmail = async (email: string, token: string, callbackUrl?: string) => {
  //TODO: Remove this after development
  let verificationUrl = "";
  if (process.env.NODE_ENV === "development") {
    verificationUrl = `http://localhost:5173/verify-email/${token}${callbackUrl ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ""}`;
  } else {
    verificationUrl = `${CLIENT_URL}/verify-email/${token}${callbackUrl ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ""}`;
  }

  const mailOptions = {
    from: EMAIL_USER,
    to: email,
    subject: "Verify your email address",
    html: `
      <h1>Email Verification</h1>
      <p>Please click the link below to verify your email address:</p>
      <a href="${verificationUrl}">${verificationUrl}</a>
      <p>This link will expire in 24 hours.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};
