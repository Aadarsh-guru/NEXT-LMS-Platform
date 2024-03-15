import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_MAIL_USER_ID as string,
        pass: process.env.GMAIL_MAIL_USER_PASSWORD as string
    },
});

interface ISendMail {
    from: string;
    to: string;
    subject: string;
    html: string;
};

const sendMail = async ({ from, to, subject, html }: ISendMail) => {
    try {
        return await transporter.sendMail({ from, to, subject, html });
    } catch (error) {
        throw error;
    };
};

export default sendMail;