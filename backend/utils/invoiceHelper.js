const PDFDocument = require('pdfkit');
const nodemailer = require('nodemailer');
const twilio = require('twilio');

// 1. GENERATE PDF INVOICE
const generateInvoicePDF = (order, user) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      let buffers = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));

      // -- HEADER --
      doc.fontSize(20).text('INVOICE', { align: 'center' });
      doc.moveDown();
      doc.fontSize(10).text(`Order ID: ${order._id}`, { align: 'right' });
      doc.text(`Date: ${new Date().toLocaleDateString()}`, { align: 'right' });

      // -- COMPANY INFO --
      doc.moveDown();
      doc.fontSize(12).text('ProShop Inc.', 50, 80);
      doc.fontSize(10).text('123 Fashion Street', 50, 95);
      doc.text('Mumbai, India', 50, 110);

      // -- CUSTOMER INFO --
      doc.moveDown();
      doc.fontSize(12).text('Bill To:', 50, 150);
      doc.fontSize(10).text(user.name, 50, 165);
      doc.text(user.email, 50, 180);
      // ✅ FIX: Use 'phoneNumber' to match your Schema
      doc.text(`Phone: ${order.shippingAddress?.phoneNumber || 'N/A'}`, 50, 195);

      // -- TABLE HEADER --
      let y = 230;
      doc.font('Helvetica-Bold');
      doc.text('Item', 50, y);
      doc.text('Qty', 280, y, { width: 90, align: 'right' });
      doc.text('Price', 370, y, { width: 90, align: 'right' });
      doc.text('Total', 0, y, { align: 'right' });
      
      // -- LINE ITEMS --
      doc.font('Helvetica');
      y += 20;
      order.orderItems.forEach(item => {
        doc.text(item.name.substring(0, 35), 50, y);
        doc.text(item.qty, 280, y, { width: 90, align: 'right' });
        doc.text(item.price, 370, y, { width: 90, align: 'right' });
        doc.text((item.qty * item.price).toFixed(2), 0, y, { align: 'right' });
        y += 20;
      });

      // -- TOTALS --
      doc.moveDown();
      y += 20;
      doc.font('Helvetica-Bold');
      doc.text(`Total: Rs. ${order.totalPrice}`, 0, y, { align: 'right' });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

// 2. SEND EMAIL (Handles both "Order Placed" & "Payment Invoice")
const sendInvoiceEmail = async (order, user, pdfBuffer) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail', 
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
      },
    });

    // ✅ LOGIC: If pdfBuffer is null, it's just an "Order Received" notification.
    // If pdfBuffer exists, it's the "Payment Confirmed" invoice.
    
    const isInvoice = !!pdfBuffer;
    const subject = isInvoice 
      ? `Payment Received - Invoice for Order ${order._id}`
      : `Order Confirmation - ${order._id}`;

    const text = isInvoice
      ? `Hello ${user.name},\n\nWe have received your payment! Please find your official invoice attached.\n\nTotal Paid: Rs. ${order.totalPrice}`
      : `Hello ${user.name},\n\nThank you for your order! We have received your request.\nOrder ID: ${order._id}\nTotal: Rs. ${order.totalPrice}\n\nYou will receive another email with the invoice once payment is confirmed.`;

    const mailOptions = {
      from: `"ProShop Support" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: subject,
      text: text,
      attachments: isInvoice 
        ? [{ filename: `Invoice-${order._id}.pdf`, content: pdfBuffer, contentType: 'application/pdf' }] 
        : [], // No attachments for initial confirmation
    };

    await transporter.sendMail(mailOptions);
    console.log(`📧 Email Sent: ${subject}`);
  } catch (error) {
    console.error('Email Send Error:', error.message);
  }
};

// 3. SEND SMS (Via Twilio)
const sendOrderSMS = async (order, user) => {
  try {
    // ✅ FIX: Use 'phoneNumber' to match your Schema
    const phone = order.shippingAddress?.phoneNumber; 
    
    if (!phone) {
        console.log('⚠️ SMS Skipped: No phone number provided.');
        return;
    }

    // Ensure phone number has country code if missing (Basic check)
    // Twilio requires E.164 format (e.g., +919876543210)
    let formattedPhone = phone;
    if (!phone.startsWith('+')) {
        formattedPhone = `+91${phone}`; // Assuming India default, adjust as needed
    }

    const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

    await client.messages.create({
      body: `Hi ${user.name}, your ProShop order #${order._id} is confirmed! Amount: Rs. ${order.totalPrice}. Check your email for details.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formattedPhone, 
    });
    console.log(`📱 SMS Sent to ${formattedPhone}!`);
  } catch (error) {
    console.error('SMS Send Error:', error.message);
  }
};

module.exports = { generateInvoicePDF, sendInvoiceEmail, sendOrderSMS };