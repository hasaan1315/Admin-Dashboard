const functions = require('firebase-functions');
const admin = require('firebase-admin');
const sgMail = require('@sendgrid/mail');

admin.initializeApp();
const db = admin.firestore();

const SENDGRID_API_KEY = functions.config().sendgrid.key;
sgMail.setApiKey(SENDGRID_API_KEY);

exports.sendNotificationEmail = functions.firestore
  .document('notifications/{notificationId}')
  .onCreate(async (snap, context) => {
    const notification = snap.data();

    if (!notification || !notification.email || !notification.message) {
      console.log('Invalid notification data, skipping email.');
      return null;
    }

    const msg = {
      to: notification.email,
      from: 'your-email@example.com', // Change to your verified sender
      subject: 'Issue Resolved Notification',
      text: notification.message,
      html: `<p>${notification.message}</p>`,
    };

    try {
      await sgMail.send(msg);
      console.log('Email sent to:', notification.email);
    } catch (error) {
      console.error('Error sending email:', error);
    }

    return null;
  });
