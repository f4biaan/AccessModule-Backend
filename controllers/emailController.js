const nodemailer = require('nodemailer');
const { generate2FA, generate2FA_only } = require('../controllers/authController');
const { findUserByEmail } = require('../models/userModel');
const { use } = require('bcrypt/promises');
require('dotenv').config();

// Función para enviar el código de verificación por correo
exports.sendVerificationCode = async (req, res) => {
  const { token, secret } = await generate2FA_only()

  const { email } = req.body;

  // find user by email
  const user = await findUserByEmail(email);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.nam,
    to: email,
    subject: '🔐 Código de Verificación 2FA - Acceso Seguro',
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <h2 style="color: #4CAF50; text-align: center;">🔐 Verificación de Doble Factor (2FA)</h2>
      <p style="font-size: 16px; color: #333;">Hola, ${user.name}</p>
      <p style="font-size: 16px; color: #333;">
        Para proteger la seguridad de tu cuenta, hemos activado la verificación de doble factor. Usa el siguiente código para completar el proceso de autenticación.
      </p>
      <div style="text-align: center; margin: 20px 0;">
        <span style="font-size: 24px; color: #4CAF50; font-weight: bold; background: #f4f4f4; padding: 10px 20px; border-radius: 4px;">${token}</span>
      </div>
      <p style="font-size: 14px; color: #666; text-align: center;">
        Este código es válido solo por 3 minutos. No compartas este código con nadie.
      </p>
      <p style="font-size: 16px; color: #333;">
        Si no solicitaste este código, por favor, ignora este mensaje o contáctanos si tienes alguna inquietud.
      </p>
      <footer style="text-align: center; margin-top: 20px; font-size: 12px; color: #999;">
        <p>Gracias por confiar en nuestra seguridad.</p>
      </footer>
    </div>
  `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error al enviar el correo:', error);
      return res.status(500).json({ message: 'Error al enviar el correo', error: error.message });
    }
    res.status(200).json({ message: 'Código enviado correctamente', secret });
  });
};
