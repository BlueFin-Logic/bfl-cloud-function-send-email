const nodemailer = require("nodemailer");

exports.sendemail = async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');

  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Methods', '*');
    res.set('Access-Control-Allow-Headers', '*');
    res.set('Access-Control-Max-Age', '3600');
    res.status(204).send('');
  }
  let {cusEmail, cusMessage} = req.query

  if (!cusEmail || !cusMessage) 
    res.status(200).send({
      sendStatus: false,
      message: "Missing cusEmail or cusMessage"
    })
    
  let transporter = nodemailer.createTransport({
    host: process.env.HOST,
    port: 587,
    secure: false,
    auth: {
      user: process.env.USER,
      pass: process.env.PASSWORD,
    },
  });

  try {
    let info = await transporter.sendMail({
      from: `"${process.env.SENDER}" <${process.env.USER}>`,
      to: cusEmail,
      subject: process.env.MAIL_SUBJECT,
      text: cusMessage,
    });

    res.status(200).send({
      message: "Done!",
      messageId: info.messageId,
    })
  } catch (error) {
    res.status(200).send(error)
  }
}