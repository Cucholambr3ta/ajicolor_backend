const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

exports.login = async (req, res) => {
    // 1. Check for Validation Errors (from express-validator middleware)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // 2. Secondary Security Check (Redundant but safe)
    if (typeof email !== 'string' || typeof password !== 'string') {
        return res.status(400).json({ message: 'Invalid payload format' });
    }

    try {
        // 3. Safe Query
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                nombre: user.nombre,
                email: user.email,
                rol: user.rol,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Login Error:', error); // Log to internal logger
        res.status(500).json({ message: 'Server error' });
    }
};

exports.register = async (req, res) => {
    const { nombre, email, password, telefono, direccion } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
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
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error('Register Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
