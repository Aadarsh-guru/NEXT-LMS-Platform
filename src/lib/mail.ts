import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

// Initialize the SES client
const sesClient = new SESClient({
    region: process.env.REGION as string,
    credentials: {
        accessKeyId: process.env.ACCESS_KEY as string,
        secretAccessKey: process.env.SECRET_ACCESS_KEY as string,
    },
});

const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL as string;

interface ISendMail {
    to: string;
    subject: string;
    html: string;
};

const sendMail = async ({ to, subject, html }: ISendMail) => {
    try {
        const params = {
            Destination: {
                ToAddresses: [to],
            },
            Message: {
                Body: {
                    Html: {
                        Data: html,
                    },
                },
                Subject: { Data: subject },
            },
            Source: adminEmail,
        };
        const command = new SendEmailCommand(params);
        return await sesClient.send(command);
    } catch (error) {
        throw error;
    };
};

export default sendMail;