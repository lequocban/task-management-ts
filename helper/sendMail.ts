import nodemailer from "nodemailer";

const sendMail = (to: string, subject: string, html: string): void => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      return;
    }
    console.log("Email sent:", info.response);
  });
};

const sendMailHelper = { sendMail };
export default sendMailHelper;
