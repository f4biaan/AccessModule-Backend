const nodemailer = require('nodemailer');
require('dotenv').config();

// Función para enviar el código de verificación por correo
exports.sendVerificationCode = (req, res) => {
  const { email, token } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Código de Verificación 2FA',
    text: `Tu código de verificación para 2FA es: ${token}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error al enviar el correo:', error);
      return res.status(500).json({ message: 'Error al enviar el correo', error: error.message });
    }
    res.status(200).json({ message: 'Código enviado correctamente' });
  });
};
