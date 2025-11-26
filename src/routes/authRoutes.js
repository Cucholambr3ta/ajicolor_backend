const express = require('express');
const router = express.Router();
const { check } = require("express-validator");
const {
  login,
  register,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");
const auditLogger = require("../middleware/auditLogger");

// Validation Chains
const loginValidation = [
  check("email", "Please include a valid email").isEmail().normalizeEmail(),
  check("password", "Password is required").exists().isString(),
];

const registerValidation = [
  check("nombre", "Name is required").not().isEmpty().trim().escape(),
  check("email", "Please include a valid email").isEmail().normalizeEmail(),
  check("password", "Password must be at least 6 characters").isLength({
    min: 6,
  }),
];

const recoverValidation = [
  check("email", "Please include a valid email").isEmail().normalizeEmail(),
];

const resetValidation = [
  check("email", "Please include a valid email").isEmail().normalizeEmail(),
  check("recoveryCode", "Recovery code is required")
    .not()
    .isEmpty()
    .trim()
    .escape(),
  check("newPassword", "Password must be at least 6 characters").isLength({
    min: 6,
  }),
];

// @desc    Autenticar usuario y obtener token
// @route   POST /api/v1/usuarios/login
// @access  Public
router.post("/login", auditLogger("LOGIN_ATTEMPT"), loginValidation, login);

// @desc    Registrar un nuevo usuario
// @route   POST /api/v1/usuarios/register
// @access  Public
router.post(
  "/register",
  auditLogger("REGISTER_ATTEMPT"),
  registerValidation,
  register
);

// @desc    Solicitar código de recuperación de contraseña
// @route   POST /api/v1/usuarios/recover
// @access  Public
router.post(
  "/recover",
  auditLogger("RECOVERY_REQUEST"),
  recoverValidation,
  forgotPassword
);

// @desc    Resetear contraseña con código de recuperación
// @route   POST /api/v1/usuarios/reset-password
// @access  Public
router.post(
  "/reset-password",
  auditLogger("PASSWORD_RESET"),
  resetValidation,
  resetPassword
);

module.exports = router;
