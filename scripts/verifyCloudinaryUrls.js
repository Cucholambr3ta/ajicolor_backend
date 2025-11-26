require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const Product = require('../src/models/Product');

const verifyImages = async () => {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        
        console.log('🔍 Verifying Image URLs...');
        
        // Find products with images
        const products = await Product.find({ imagenUrl: { $ne: '' } }).limit(10);
        
        if (products.length === 0) {
            console.log('⚠️  No products with images found.');
        } else {
            products.forEach(p => {
                const isCloudinary = p.imagenUrl.includes('cloudinary.com');
                const status = isCloudinary ? '✅ CLOUDINARY' : '❌ LOCAL/OTHER';
                console.log(`[${status}] ${p.nombre}: ${p.imagenUrl}`);
            });
        }

        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

verifyImages();
