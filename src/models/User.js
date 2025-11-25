const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    telefono: {
      type: String,
      required: false,
    },
    direccion: {
      type: String,
      required: false,
    },
    rol: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
    resetPasswordToken: {
      type: String,
      required: false,
    },
    resetPasswordExpires: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// Note: email index is created automatically by unique: true
// No need for explicit index declaration

// Encriptar password antes de guardar
userSchema.pre('save', async function (next) {
    if (!this.isModified("password")) {
      return next();
    }
    // Use work factor 1 in test environment for speed, otherwise use config value
    const rounds =
      process.env.NODE_ENV === "test"
        ? 1
        : parseInt(process.env.BCRYPT_ROUNDS || "10");
    const salt = await bcrypt.genSalt(rounds);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Método para comparar passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Método para generar y hashear token de reseteo de contraseña
userSchema.methods.getResetPasswordToken = function () {
    const crypto = require('crypto');
    
    // Generar token aleatorio
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // Hashear el token antes de guardarlo en la DB (SEGURIDAD)
    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
    
    // Expiración: 10 minutos
    this.resetPasswordExpires = Date.now() + 10 * 60 * 1000;
    
    // Retornar el token SIN hashear (este se envía por email)
    return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
