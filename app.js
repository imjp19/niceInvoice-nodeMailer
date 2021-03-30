"use strict";
const niceInvoice = require('./nice-invoice/app.js');
const nodemailer = require('nodemailer');
const invoiceDetail = {
  niceInvoice: {

    prakarsh_logo: "prakarsh1.png"
  },
  shipping: {
    name: "Jay Patel",
    college: "Sardar Vallabhbhai Patel Institute of Technology, Vasad",
    mobile: "+91-9879726851",
    email: "jaypatel19124@gmail.com",
  },
  items: [
    {
      item: "Engine Evolution",
      price: 50.00,
    },
    {
      item: "Computer Workshop",
      price: 30.00,
      tax: ""
    },
    {
      item: "Aero Workshop",
      price: 50.00,
      tax: ""
    }
  ],
  subtotal: 130,
  total: 130,
  order_number: "",
  payment_id: "",
  order_id: "order-54464",
  header: {
    company_name: "Prakarsh 2021",
    company_logo: "prakarsh.png",
    company_address: "SVIT, Vasad"
  },
  footer: {
    text: "Copyright © Prakarsh 2021\n www.prakarsh.org"
  },
  currency_symbol: "",
  date: {
    billing_date: "08 August 2020",
  }
};


async function main(pdfData) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing


  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    name: "gmail.com",
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'jaypatel19124@gmail.com', // generated ethereal user
      pass: 'vjzmiggrvmxwnvko', // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Jay Patel" <jay.19beceg046@gmail.com>', // sender address
    to: "ayaan.180410107098@gmail.com, ", // list of receivers
    subject: "[Prakarsh 2021] Here is your receipt🎉", // Subject line
    text: "", // plain text body


    attachments: [
      {
        filename: "Invoice.pdf",
        content: pdfData,
        encoding: "base64"
      }
    ]

  });


  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

niceInvoice(invoiceDetail, main);
// main().catch(console.error);