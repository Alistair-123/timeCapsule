const nodemailer = require('nodemailer');
const admin = require('firebase-admin');
const { getFirestore, collection, query, where, getDocs } = require('firebase-admin/firestore');

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
  });
}

const db = getFirestore();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

exports.handler = async (event, context) => {
  try {
    const today = new Date().toISOString().split('T')[0]; // Get today's date (yyyy-mm-dd)

    const q = query(
      collection(db, 'messages'),
      where('date', '==', today),
      where('sent', '==', false) // Only unsent messages
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.log("No messages to send.");
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'No messages to send.' }),
      };
    }

    const emailPromises = snapshot.docs.map(async (doc) => {
      const { name, message, email } = doc.data();

      const mailOptions = {
        from: process.env.GMAIL_USER,
        to: email,
        subject: `Time Capsule Message from the past to ${name}`,
        html: `<p>Hello ${name},<br/></p><p>Here is your message:</p>
        <p>${message}</p><br/>
        <p>Best regards,<br/>Time Capsule App</p>`,
      };

      try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);

        // Only update Firestore if email is sent successfully
        await doc.ref.update({ sent: true });
      } catch (error) {
        console.error('Error sending email:', error);
        throw error; // Re-throw the error to be handled by the catch block
      }
    });

    // Wait for all emails to be sent
    await Promise.all(emailPromises);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Emails sent successfully!' }),
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error sending emails' }),
    };
  }
};
