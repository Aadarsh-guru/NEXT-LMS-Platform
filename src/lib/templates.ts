import { Course } from "@prisma/client";

const coursePurchaseConfirmationMailTemplate = ({ paymentId, orderId, course, username }: { paymentId: string, orderId: string, course: Course | null, username: string | null }) => (`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Course Purchased - ${process.env.NEXT_PUBLIC_APP_NAME || "Aadarsh Guru"}</title>
  <style>
    /* You can add your custom CSS styles here */
    body {
      font-family: sans-serif;
      margin: 0;
      padding: 0;
    }
    .container {
      padding: 20px;
    }
    h1, h2 {
      margin: 10px 0;
    }
    .info-list {
      list-style: none;
      padding: 0;
    }
    .info-list li {
      margin-bottom: 10px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Welcome to the ${course?.title} Journey!</h1>
    <p>Hi ${username},</p>
    <p>We're thrilled to confirm your purchase of the <strong>${course?.title} course!</strong></p>
    <h2>Your order details:</h2>
    <ul class="info-list">
      <li>Order ID: ${orderId}</li>
      <li>Payment ID: ${paymentId}</li>
      <li>Course Purchased: ${course?.title}</li>
    </ul>
    <p>You can access your course materials and start learning immediately by visiting our platform.</p>
    <h2>What's next?</h2>
    <p>We're excited to have you on board and can't wait for you to embark on this learning journey with us!</p>
    <p>If you have any questions or need assistance, please feel free to reply to this email or contact our support team at ${process.env.GMAIL_MAIL_USER_ID as string}.</p>
    <p>Best regards,</p>
    <p>The ${process.env.NEXT_PUBLIC_APP_NAME || "Aadarsh Guru"} Team</p>
  </div>
</body>
</html>
`);


const coursePurchasedMailTemplate = ({ paymentId, orderId, course, username, useremail }: { paymentId: string, orderId: string, course: Course | null, username: string | null, useremail: string | null }) => (`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Course Purchase - ${username}</title>
  <style>
    /* You can add your custom CSS styles here */
    body {
      font-family: sans-serif;
      margin: 0;
      padding: 0;
    }
    .container {
      padding: 20px;
    }
    h2 {
      margin: 10px 0;
    }
    .info-list {
      list-style: none;
      padding: 0;
    }
    .info-list li {
      margin-bottom: 10px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h2>New Course Purchase</h2>
    <p>This email notifies you of a new course purchase:</p>
    <h3>User Information</h3>
    <ul class="info-list">
      <li>User: ${username}</li>
      <li>Email: ${useremail}</li>
    </ul>
    <h3>Order Information</h3>
    <ul class="info-list">
      <li>Order ID: ${orderId}</li>
      <li>Payment ID: ${paymentId}</li>
      <li>Course Purchased: ${course?.title}</li>
    </ul>
    <p>**Additional Information:**</p>
    <p>Please take any necessary actions regarding this purchase.</p>
    <p>Thanks,</p>
    <p>The System</p> </div>
</body>
</html>
`)


export {
    coursePurchaseConfirmationMailTemplate,
    coursePurchasedMailTemplate,
};