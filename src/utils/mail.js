/* eslint-disable class-methods-use-this */
import Mailgen from 'mailgen';
import { createTransport, getTestMessageUrl } from 'nodemailer';
import authHelpers from './auth';

const { EMAIL, EMAIL_PASS, BASE_URL, JWT_SECRET } = process.env;

class MailHelpers {
  constructor() {
    this.mailGenerator = new Mailgen({
      theme: 'default',
      product: {
        name: 'Hahiye🔥 backend',
        link: `${BASE_URL}`
      }
    });

    this.transporter = createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: EMAIL,
        pass: EMAIL_PASS
      }
    });

    this.sendMail = (mailOptions) => {
      const info = this.transporter.sendMail(mailOptions);
      // return console.log(`Preview: ${getTestMessageUrl(info)}`);
      return console.log(info);
    };
  }

  requestEmailConfirm({ user_email, user_name }) {
    const token = authHelpers.signToken(
      { user_email, user_name },
      JWT_SECRET,
      '1day'
    );
    const template = {
      body: {
        name: user_name,
        intro: `Welcome to Hahiye🔥! We're very excited to have you on board.`,
        action: {
          instructions:
            'To get started with Hahiye Verify your email by clicking the button below 👇👇👇',
          button: {
            color: '#008c52',
            text: 'Verify your Email',
            link: `${BASE_URL}/api/users/verify/${token}`
          }
        },
        outro:
          "The link will be expired by tomorrow! So don't miss the chance today."
      }
    };
    const mailOptions = {
      to: user_email,
      subject: 'Email Verification - Hahiye 🔥',
      from: '"noreply@hahiye.com"<noreply@hahiye.com>',
      html: this.mailGenerator.generate(template)
    };
    this.sendMail(mailOptions);
  }
  resetPasswordEmail({ user_email, user_name, token }) {
    const template = {
      body: {
        name: user_name,
        intro: `Welcome Again to Hahiye🔥! Don't worry if your've forgotten your password.`,
        action: {
          instructions:
            'To reset your password click on the button  below 👇👇👇',
          button: {
            color: '#008c52',
            text: 'Reset your password',
            link: `${BASE_URL}/api/users/resetPassword/${token}`
          }
        },
        outro:
          "The link will be expired in 20 minutes! So don't miss the chance today."
      }
    };
    const mailOptions = {
      to: user_email,
      subject: 'Reset link- Hahiye 🔥',
      from: '"noreply@hahiye.com"<noreply@hahiye.com>',
      html: this.mailGenerator.generate(template)
    };
    this.sendMail(mailOptions);
  }
}

const mailHelpers = new MailHelpers();

export default mailHelpers;
