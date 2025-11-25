const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    nombre: {
      type: String,
      required: true,
    },
    categoria: {
      type: String,
      required: true,
      enum: ["SERIGRAFIA", "DTF", "CORPORATIVA", "ACCESORIOS"],
    },
    imagenResId: {
      type: Number,
      required: false,
    },
    imagenUrl: {
      type: String,
      required: false,
    },
    descripcion: {
      type: String,
      required: true,
    },
    precio: {
      type: mongoose.Types.Decimal128,
      required: true,
      get: (value) => (value ? parseFloat(value.toString()) : 0),
    },
    tipoTalla: {
      type: String,
      enum: ["ADULTO", "INFANTIL"],
      required: false,
    },
    permiteTipoInfantil: {
      type: Boolean,
      default: false,
    },
    coloresDisponibles: [
      {
        type: String,
      },
    ],
    stock: {
      type: Number,
      default: 100,
    },
    rating: {
      type: Number,
      default: 0,
    },
    cantidadReviews: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { getters: true },
  }
);

// Indexes for performance
productSchema.index({ categoria: 1 });
productSchema.index({ nombre: "text", descripcion: "text" });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
