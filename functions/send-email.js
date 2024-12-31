const nodemailer = require('nodemailer');
const admin = require('firebase-admin');
const { getFirestore, collection, query, where, getDocs } = require('firebase-admin/firestore');


admin.initializeApp();
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
    
    const today = new Date().toISOString().split('T')[0]; 

    
    const q = query(
        collection(db, 'messages'),
        where('date', '==', today),
        where('sent', '==', false) 
      );
      
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.log("No messages to send.");
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'No messages to send.' }),
      };
    }

    
    snapshot.forEach((doc) => {
      const { name, message, email } = doc.data();

      const mailOptions = {
        from: process.env.GMAIL_USER,
        to: email,
        subject: `Time Capsule Message from the past to ${name}`,
        html: `<p>Hello ${name},</p><p>Here is your message:</p><p>${message}</p><p>Best regards,<br/>Time Capsule App</p>`,
      };

      
      transporter.sendMail(mailOptions, async (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
        } else {
          console.log('Email sent:', info.response);

          await doc.ref.update({ sent: true });
        }
      });
    });

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
