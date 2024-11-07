const nodemailer = require('nodemailer');
const speakeasy = require('speakeasy');

// Función para enviar el código de verificación
exports.sendVerificationCode = (req, res) => {
    const { email, secret } = req.body;

    // Configurar el transporte de correo (Nodemailer)
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    // Generar un código OTP basado en el secreto
    const code = speakeasy.totp({ secret, encoding: 'base32', step: 180 });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Código de Verificación',
        text: `Tu código de verificación es: ${code}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error al enviar el correo:', error);
            return res.status(500).json({ message: 'Error al enviar el correo', error: error.message });
        }
        console.log('Correo enviado:', info.response);
        res.status(200).json({ message: 'Código enviado correctamente' });
    });
};
