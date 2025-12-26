import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false, // true only for port 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendMail = async ({ email, subject, text, html }) => {
  await transporter.sendMail({
    from: process.env.SENDER_EMAIL,
    to: email,
    subject,
    text,
    html,
  });
};
