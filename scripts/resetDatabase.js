require('dotenv').config({ path: '../.env' }); // Adjust path if running from scripts/ folder
const mongoose = require('mongoose');
const User = require('../src/models/User');
const Product = require('../src/models/Product');
const Order = require('../src/models/Order');

const resetDatabase = async () => {
  try {
    // 1. Connect to Database
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected.');

    // 2. Delete Orders
    console.log('🗑️  Deleting all Orders...');
    const orderResult = await Order.deleteMany({});
    console.log(`✅ Deleted ${orderResult.deletedCount} Orders.`);

    // 3. Delete Products
    console.log('🗑️  Deleting all Products...');
    const productResult = await Product.deleteMany({});
    console.log(`✅ Deleted ${productResult.deletedCount} Products.`);

    // 4. Delete Users (Except Admin)
    console.log('🗑️  Deleting Users (Preserving Admin)...');
    // IMPORTANT: If your schema uses 'isAdmin: true' instead of 'role: admin', change this query.
    // Based on User.js: rol: { type: String, enum: ["USER", "ADMIN"], default: "USER" }
    const userResult = await User.deleteMany({ rol: { $ne: 'ADMIN' } });
    console.log(`✅ Deleted ${userResult.deletedCount} Users.`);
    console.log('🛡️  Admin Account Preserved.');

    console.log('✨ Database Reset Complete.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error resetting database:', error);
    process.exit(1);
  }
};

resetDatabase();
