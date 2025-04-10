const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  },
});

const sendEmailAlert = async (elementId, condition, message, recipient) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: recipient,
    subject: `WARNING: Element ${elementId} has failed condition check`,
    text: `Element ID: ${elementId}\nCondition Violated: ${condition}\n\nMessage: ${message}\n\nPlease check the system immediately.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email alert sent to ${recipient} for Element ${elementId}`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = { sendEmailAlert };
