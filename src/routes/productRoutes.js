const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const jwt = require("jsonwebtoken");

const { protect, admin } = require("../middleware/authMiddleware");

// @desc    Obtener todos los productos
// @route   GET /api/v1/productos
// @access  Public
router.get("/", async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Obtener un producto por ID
// @route   GET /api/v1/productos/:id
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    // Intentar buscar por _id de Mongo o por id personalizado
    let product;
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(req.params.id);
    } else {
      product = await Product.findOne({ id: req.params.id });
    }

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Producto no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Crear un nuevo producto
// @route   POST /api/v1/productos
// @access  Private (Admin)
router.post("/", protect, admin, async (req, res) => {
  const {
    id,
    nombre,
    descripcion,
    precio,
    categoria,
    stock,
    imagenUrl,
    tipoTalla,
    coloresDisponibles,
  } = req.body;

  try {
    const product = await Product.create({
      id,
      nombre,
      descripcion,
      precio,
      categoria,
      stock,
      imagenUrl,
      tipoTalla,
      coloresDisponibles,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Actualizar un producto
// @route   PUT /api/v1/productos/:id
// @access  Private (Admin)
router.put("/:id", protect, admin, async (req, res) => {
  try {
    let product;

    // Buscar por _id de Mongo o por id personalizado
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(req.params.id);
    } else {
      product = await Product.findOne({ id: req.params.id });
    }

    if (product) {
      product.nombre = req.body.nombre || product.nombre;
      product.descripcion = req.body.descripcion || product.descripcion;
      product.precio =
        req.body.precio !== undefined ? req.body.precio : product.precio;
      product.categoria = req.body.categoria || product.categoria;
      product.stock =
        req.body.stock !== undefined ? req.body.stock : product.stock;
      product.imagenUrl = req.body.imagenUrl || product.imagenUrl;
      product.tipoTalla = req.body.tipoTalla || product.tipoTalla;
      product.coloresDisponibles =
        req.body.coloresDisponibles || product.coloresDisponibles;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: "Producto no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Eliminar un producto
// @route   DELETE /api/v1/productos/:id
// @access  Private (Admin)
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    let product;

    // Buscar por _id de Mongo o por id personalizado
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(req.params.id);
    } else {
      product = await Product.findOne({ id: req.params.id });
    }

    if (product) {
      await product.deleteOne();
      res.json({ message: "Producto eliminado" });
    } else {
      res.status(404).json({ message: "Producto no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
