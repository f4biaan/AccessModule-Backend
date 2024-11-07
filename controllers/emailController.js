const nodemailer = require('nodemailer');

// Función para enviar el código de verificación
exports.sendVerificationCode = (req, res) => {
    const { email } = req.body;  // Solo recibe el email de destino en el cuerpo

    // Configurar el transporte de correo (Nodemailer) con las credenciales del .env
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,  // Usuario de correo desde .env
            pass: process.env.EMAIL_PASS   // Contraseña de correo desde .env
        }
    });

    // Generar un código de verificación de 4 dígitos
    const code = Math.floor(1000 + Math.random() * 9000);

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Código de Verificación',
        text: `Tu código de verificación es: ${code}`
    };

    // Enviar el correo
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error al enviar el correo:', error);
            return res.status(500).json({ message: 'Error al enviar el correo', error: error.message });
        }
        console.log('Correo enviado:', info.response);
        res.status(200).json({ message: 'Código enviado correctamente', code: code });
    });
};
