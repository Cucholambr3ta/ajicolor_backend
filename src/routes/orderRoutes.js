const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

const jwt = require('jsonwebtoken');

// Middleware para proteger rutas
const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
            req.user = decoded; // Agregar usuario decodificado a la request
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// @desc    Crear nuevo pedido
// @route   POST /api/v1/pedidos
// @access  Private
router.post('/', protect, async (req, res) => {
    const {
        numeroPedido,
        usuario,
        productos,
        subtotal,
        impuestos,
        costoEnvio,
        total,
        direccionEnvio,
        telefono,
        metodoPago
    } = req.body;

    if (productos && productos.length === 0) {
        return res.status(400).json({ message: 'No hay productos en el pedido' });
    } else {
        try {
            const order = new Order({
                numeroPedido,
                usuario,
                productos,
                subtotal,
                impuestos,
                costoEnvio,
                total,
                direccionEnvio,
                telefono,
                metodoPago
            });

            const createdOrder = await order.save();
            res.status(201).json(createdOrder);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
});

// @desc    Obtener pedido por ID
// @route   GET /api/v1/pedidos/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('usuario', 'nombre email');

        if (order) {
            res.json(order);
        } else {
            res.status(404).json({ message: 'Pedido no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Obtener pedidos por usuario
// @route   GET /api/v1/pedidos/usuario/:userId
// @access  Private
router.get('/usuario/:userId', protect, async (req, res) => {
    try {
        const orders = await Order.find({ usuario: req.params.userId }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Obtener todos los pedidos (Admin)
// @route   GET /api/v1/pedidos
// @access  Private (Admin)
router.get('/', protect, async (req, res) => {
    try {
        const orders = await Order.find({}).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Actualizar estado del pedido
// @route   PUT /api/v1/pedidos/:numeroPedido/estado
// @access  Private (Admin)
router.put('/:numeroPedido/estado', protect, async (req, res) => {
    const { estado } = req.body;

    try {
        const order = await Order.findOne({ numeroPedido: req.params.numeroPedido });

        if (order) {
            order.estado = estado;
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Pedido no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
