require('dotenv').config();
const nodemailer = require('nodemailer');

async function testEmail() {
  console.log('Starting email test...');
  console.log('HOST:', process.env.SMTP_HOST);
  console.log('PORT:', process.env.SMTP_PORT);
  console.log('USER:', process.env.SMTP_USER);
  
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: parseInt(process.env.SMTP_PORT) === 465,
    auth: {
      user: 'contactarnavinfoweb@gmail.com',
      pass: 'andzgnduvxzjonmi'
    },
    logger: true,
    debug: true // include SMTP traffic in the logs
  });

  try {
    const info = await transporter.sendMail({
      from: '"Test Script" <contactarnavinfoweb@gmail.com>',
      to: 'contactarnavinfoweb@gmail.com',
      subject: "Direct Nodemailer Test",
      text: "This is a direct test from the Node.js script."
    });
    console.log('Message sent successfully! Message ID:', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

testEmail();
