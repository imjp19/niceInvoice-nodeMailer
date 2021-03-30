const fs = require("fs");
const PDFDocument = require("pdfkit");
const stream = require("./stream");
const WritableBufferStream = require("./stream.js");

let niceInvoice = (invoice, func) => {
  let doc = new PDFDocument({ size: "A4", margin: 40, })
  let writeStream = new WritableBufferStream();
  doc.pipe(writeStream);
  doc.image(invoice.niceInvoice.prakarsh_logo, 50, 200, { widht: 500, height: 500 })

  header(doc, invoice);
  customerInformation(doc, invoice);
  invoiceTable(doc, invoice);
  footer(doc, invoice);
  let buffers = [];
  let pdfData;
  doc.on('data', buffers.push.bind(buffers));
  
  // doc.on('end', () => {

  //   pdfData = Buffer.concat(buffers);
  //   func(pdfData).catch(console.error);
    
  //   // ... now send pdfData as attachment ...

  // });

 
  
  //doc.pipe(fs.createWriteStream(path));

  writeStream.on('finish', () => {
    // console log pdf as bas64 string
    // console.log(writeStream.toBuffer().toString('base64'));
    func(writeStream.toBuffer().toString('base64')).catch(console.error);
  });
  doc.end();

}

let header = (doc, invoice) => {

  if (fs.existsSync(invoice.header.company_logo)) {
    doc.image(invoice.header.company_logo, 35, 25, { width: 75, height:75})
      .fontSize(25)
      .font("Helvetica-Bold")
      .text(invoice.header.company_name, 110, 63)
      .font("Helvetica-Bold")
      .moveDown();
  } else {
    doc.fontSize(20)
      .text(invoice.header.company_name, 50, 45)
      .moveDown()
  }

  if (invoice.header.company_address.length !== 0) {
    companyAddress(doc, invoice.header.company_address);
  }

}

let customerInformation = (doc, invoice) => {
  doc
    .fillColor("#444444")
    .fontSize(20)
    .text("Receipt", 50, 160);

  generateHr(doc, 185);

  const customerInformationTop = 200;

  doc.fontSize(10)
    // .text("Invoice Number:", 50, customerInformationTop)
    // .font("Helvetica-Bold")
    .text(invoice.order_number, 150, customerInformationTop)
    .font("Helvetica")
    // .text("Payment Id:", 50, customerInformationTop + 15)
    // .font("Helvetica-Bold")
    .text(invoice.payment_id, 150, customerInformationTop + 15)
    .font("Helvetica")
    .text("Billing Date:", 50, customerInformationTop + 30)
    .text(invoice.date.billing_date, 150, customerInformationTop + 30)
    .text("Order Id:", 50, customerInformationTop + 45)
    .text(invoice.order_id, 150, customerInformationTop + 45)
    .font("Helvetica-Bold")
    .text(invoice.shipping.name, 350, customerInformationTop)
    .font("Helvetica")
    .text(invoice.shipping.college, 350, customerInformationTop + 15)
    .text(invoice.shipping.mobile, 350, customerInformationTop + 45)
    .text(invoice.shipping.email, 350, customerInformationTop + 60)
    .moveDown();

  generateHr(doc, 280);
}

let invoiceTable = (doc, invoice) => {
  let i;
  const invoiceTableTop = 300;
  const currencySymbol = invoice.currency_symbol;

  doc.font("Helvetica-Bold");
  tableRow(
    doc,
    invoiceTableTop,
    "Events",
    "Price",
    "Price",
    "Price",
    "Total",
    ""
  );
  generateHr(doc, invoiceTableTop + 20);
  doc.font("Helvetica");

  for (i = 0; i < invoice.items.length; i++) {
    const item = invoice.items[i];
    const position = invoiceTableTop + (i + 1) * 30;
    tableRow(
      doc,
      position,
      item.item,
      
      formatCurrency(item.price, currencySymbol),
      
      formatCurrency(applyTaxIfAvailable(item.price, item.quantity), currencySymbol),

    );

    generateHr(doc, position + 20);
  }

  const subtotalPosition = invoiceTableTop + (i + 1) * 30;
  doc.font("Helvetica-Bold");
  totalTable(
    doc,
    subtotalPosition,
    "",
    // formatCurrency(invoice.total, currencySymbol)
  );

  const paidToDatePosition = subtotalPosition + 20;
  doc.font("Helvetica-Bold");
  totalTable(
    doc,
    paidToDatePosition,
    "Total",
    formatCurrency(invoice.total, currencySymbol)
  );
}

let footer = (doc, invoice) => {
  if (invoice.footer.text.length !== 0) {
    doc.fontSize(10).text(invoice.footer.text, 50, 700, { align: "center", width: 500 });
  }
}

let totalTable = (
  doc,
  y,
  name,
  description
) => {
  doc
    .fontSize(10)
    .text(name, 400, y, { width: 90, align: "right" })
    .text(description, 0, y, { align: "right" })
}

let tableRow = (
  doc,
  y,
  item,
  lineTotal,
  
) => {
  doc
    .fontSize(10)
    .text(item, 50, y)
  
    .text(lineTotal, 400, y, { width: 90, align: "right" })
  
}

let generateHr = (doc, y) => {
  doc
    .strokeColor("#aaaaaa")
    .lineWidth(1)
    .moveTo(50, y)
    .lineTo(550, y)
    .stroke();
}

let formatCurrency = (cents, symbol) => {
  return symbol + cents.toFixed(2);
}




let applyTaxIfAvailable = (price, quantity) => {



  var itemPrice = price;


  return itemPrice;
}

let companyAddress = (doc, address) => {
  let str = address;
  let chunks = str.match(/.{0,25}(\s|$)/g);
  let first = 50;
  chunks.forEach(function (i, x) {
    doc.fontSize(10).text(chunks[x], 200, first, { align: "right" });
    first = +first + 15;
  });
}

module.exports = niceInvoice;

