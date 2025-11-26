require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Product = require('../src/models/Product');
const { uploadImage } = require('../src/utils/cloudinary');

// CONFIGURATION
const PRODUCTS_FILE = path.join(__dirname, 'products.json');
const IMAGE_DIR = path.resolve(__dirname, '../../../app poleras/Polera_ecommerce/app/src/main/res/drawable');

const migrateProducts = async () => {
    try {
        // 1. Connect to MongoDB
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected.');

        // 2. Read Legacy Data
        if (!fs.existsSync(PRODUCTS_FILE)) {
            throw new Error(`Products file not found at: ${PRODUCTS_FILE}`);
        }
        
        const rawData = fs.readFileSync(PRODUCTS_FILE, 'utf-8');
        const products = JSON.parse(rawData);
        console.log(`📦 Found ${products.length} products to migrate.`);

        // 3. Migrate Each Product
        let successCount = 0;
        let skipCount = 0;
        let errorCount = 0;

        for (const item of products) {
            try {
                // Check for duplicates
                const exists = await Product.findOne({ id: item.id });
                if (exists) {
                    console.log(`⚠️  Skipping ${item.nombre} (Already exists)`);
                    skipCount++;
                    continue;
                }

                console.log(`🔄 Processing: ${item.nombre}...`);

                // Image Upload
                let imageUrl = '';
                if (item.imageFilename) {
                    const imagePath = path.join(IMAGE_DIR, item.imageFilename);
                    if (fs.existsSync(imagePath)) {
                        console.log(`   📤 Uploading image: ${item.imageFilename}`);
                        const uploadResult = await uploadImage(imagePath, 'ajicolor_products');
                        imageUrl = uploadResult.secure_url;
                    } else {
                        console.warn(`   ⚠️  Image file not found: ${imagePath}`);
                    }
                }

                // Create Product in MongoDB
                const newProduct = new Product({
                    id: item.id,
                    nombre: item.nombre,
                    categoria: item.categoria,
                    descripcion: item.descripcion,
                    precio: item.precio, // Mongoose will cast to Decimal128
                    stock: item.stock || 0,
                    imagenUrl: imageUrl,
                    // Map other fields as necessary
                });

                await newProduct.save();
                console.log(`   ✅ Saved with Image URL: ${imageUrl}`);
                successCount++;

            } catch (err) {
                console.error(`   ❌ Error processing ${item.nombre}:`, err.message);
                errorCount++;
            }
        }

        console.log('\n================================');
        console.log(`🎉 Migration Complete`);
        console.log(`✅ Success: ${successCount}`);
        console.log(`⚠️  Skipped: ${skipCount}`);
        console.log(`❌ Errors:  ${errorCount}`);
        console.log('================================\n');

        process.exit(0);

    } catch (error) {
        console.error('❌ Fatal Error:', error);
        process.exit(1);
    }
};

migrateProducts();
