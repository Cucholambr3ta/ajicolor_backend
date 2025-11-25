const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true
    },
    contenido: {
        type: String,
        required: true
    },
    imagen: {
        type: String, // URL de la imagen
        required: false
    },
    fechaCreacion: {
        type: Date,
        default: Date.now
    }
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
