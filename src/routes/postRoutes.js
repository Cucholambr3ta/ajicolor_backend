const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// @desc    Obtener todos los posts
// @route   GET /api/v1/posts
// @access  Public
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find({}).sort({ fechaCreacion: -1 });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Obtener un post por ID
// @route   GET /api/v1/posts/:id
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post) {
            res.json(post);
        } else {
            res.status(404).json({ message: 'Post no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
