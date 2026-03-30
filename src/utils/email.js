import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { Resend } from "resend";

dotenv.config({ quiet: true });

const filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(filename);

class Email {
  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async SendMail(to, subject, name, email, loginLink, avatarUrl) {
    const emailTemplate = fs.readFileSync(
      path.join(__dirname, "welcomeEmail.html"),
      "utf-8",
    );
    const customizedEmail = emailTemplate
      .replace("{{name}}", name)
      .replace(/{{name}}/g, name)
      .replace("{{email}}", email)
      .replace("{{loginLink}}", loginLink)
      .replace("{{avatarUrl}}", avatarUrl);

    const mailOptions = {
      from: "Zync <onboarding@resend.dev>",
      to: [to],
      subject: subject,
      html: customizedEmail,
    };

    try {
      await this.resend.emails.send(mailOptions);
      console.log("Email sent successfully");
    } catch (error) {
      console.error("Error sending email:", error);
    }
  }
}

export default Email;
