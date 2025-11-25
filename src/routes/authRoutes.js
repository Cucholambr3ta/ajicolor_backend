const express = require('express');
const router = express.Router();
const { check } = require("express-validator");
const { login, register } = require("../controllers/authController");
const auditLogger = require("../middleware/auditLogger");

const sendEmail = require("../utils/sendEmail");

// Validation Chains
const loginValidation = [
  check("email", "Please include a valid email").isEmail().normalizeEmail(),
  check("password", "Password is required").exists().isString(),
];

// @desc    Autenticar usuario y obtener token
// @route   POST /api/v1/usuarios/login
// @access  Public
router.post("/login", auditLogger("LOGIN_ATTEMPT"), loginValidation, login);

// @desc    Registrar un nuevo usuario
// @route   POST /api/v1/usuarios/register
// @access  Public
router.post("/register", async (req, res) => {
  const { nombre, email, password, telefono, direccion } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    const user = await User.create({
      nombre,
      email,
      password,
      telefono,
      direccion,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Datos de usuario inválidos" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Solicitar código de recuperación de contraseña
// @route   POST /api/v1/usuarios/recover
// @access  Public
router.post("/recover", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Generar código de recuperación de 6 dígitos
    const recoveryCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Guardar código con expiración de 15 minutos
    user.resetPasswordToken = recoveryCode;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutos
    await user.save();

    // Enviar email
    const message = `Tu código de recuperación es: ${recoveryCode}\n\nEste código expirará en 15 minutos.`;

    try {
      await sendEmail({
        email: user.email,
        subject: "Recuperación de contraseña - App Poleras",
        message,
      });
      console.log(`Email enviado a: ${email}`);
    } catch (emailError) {
      console.error("Error enviando email:", emailError);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      return res
        .status(500)
        .json({ message: "Error enviando el email de recuperación" });
    }

    // En producción, NO retornar el código
    res.json({
      message: "Código de recuperación enviado",
      recoveryCode: process.env.NODE_ENV === "test" ? recoveryCode : undefined,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Resetear contraseña con código de recuperación
// @route   POST /api/v1/usuarios/reset-password
// @access  Public
router.post('/reset-password', async (req, res) => {
    const { email, recoveryCode, newPassword } = req.body;

    try {
        const user = await User.findOne({ 
            email,
            resetPasswordToken: recoveryCode,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Código inválido o expirado' });
        }

        // Actualizar contraseña
        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.json({ 
            message: 'Contraseña actualizada exitosamente',
            token: generateToken(user._id)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
