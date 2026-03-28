import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config({ quiet: true });

const filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(filename);

class Email {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      port: 587,
      secure: false,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
  }

  async SendMail(to, subject, name, email, loginLink,avatarUrl) {
    const emailTemplate = fs.readFileSync(
      path.join(__dirname, "welcomeEmail.html"),
      "utf-8"
    );
    const customizedEmail = emailTemplate
      .replace("{{name}}", name)
      .replace(/{{name}}/g, name)
      .replace("{{email}}", email)
      .replace("{{loginLink}}", loginLink)
      .replace("{{avatarUrl}}", avatarUrl);

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: to,
      subject: subject,
      html: customizedEmail,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log("Email sent successfully");
    } catch (error) {
      console.error("Error sending email:", error);
    }
  }
}

export default Email;
