const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    numeroPedido: {
      type: String,
      required: true,
      unique: true,
    },
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productos: [
      {
        producto: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        cantidad: {
          type: Number,
          required: true,
          default: 1,
        },
        talla: {
          type: String,
          required: false,
        },
        color: {
          type: String,
          required: false,
        },
        precioUnitario: {
          type: mongoose.Types.Decimal128,
          required: true,
          get: (value) => (value ? parseFloat(value.toString()) : 0),
        },
      },
    ],
    subtotal: {
      type: mongoose.Types.Decimal128,
      required: true,
      get: (value) => (value ? parseFloat(value.toString()) : 0),
    },
    impuestos: {
      type: mongoose.Types.Decimal128,
      required: true,
      default: 0,
      get: (value) => (value ? parseFloat(value.toString()) : 0),
    },
    costoEnvio: {
      type: mongoose.Types.Decimal128,
      required: true,
      default: 0,
      get: (value) => (value ? parseFloat(value.toString()) : 0),
    },
    total: {
      type: mongoose.Types.Decimal128,
      required: true,
      get: (value) => (value ? parseFloat(value.toString()) : 0),
    },
    direccionEnvio: {
      type: String,
      required: true,
    },
    telefono: {
      type: String,
      required: true,
    },
    estado: {
      type: String,
      enum: ["CONFIRMADO", "PREPARANDO", "ENVIADO", "ENTREGADO"],
      default: "CONFIRMADO",
    },
    metodoPago: {
      type: String,
      required: true,
    },
    fechaConfirmacion: Date,
    fechaEnvio: Date,
    fechaEntrega: Date,
  },
  {
    timestamps: true,
    toJSON: { getters: true },
  }
);

// Indexes for performance
// Note: numeroPedido index created automatically by unique: true
orderSchema.index({ usuario: 1, estado: 1 });
orderSchema.index({ createdAt: -1 }); // Optimize "Recent Orders" queries

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
