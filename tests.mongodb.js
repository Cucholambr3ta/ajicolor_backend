/* global use, db */
// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// 1️⃣ Select the database to use.
use('BDAjicolor');

// ==========================================
// 🧪 TEST SUITE: DATABASE VERIFICATION
// Run these blocks one by one (Select & Play)
// ==========================================

// 🔍 TEST 1: Verify Connection & Admin User
// Should return the Admin user document.
console.log("--- Checking Admin User ---");
db.users.find({ rol: 'ADMIN' });

// 🔍 TEST 2: Check Product Catalog
// Should return count of products and list first 5.
console.log("--- Checking Products ---");
const productCount = db.products.countDocuments();
console.log(`Total Products: ${productCount}`);
db.products.find().limit(5);

// 🔍 TEST 3: Check Orders
// Should return count of orders.
console.log("--- Checking Orders ---");
const orderCount = db.orders.countDocuments();
console.log(`Total Orders: ${orderCount}`);
db.orders.find().sort({ createdAt: -1 }).limit(5);

// ==========================================
// 🛠️ MANIPULATION TESTS (Use with Caution)
// ==========================================

/*
// ➕ TEST 4: Insert Test Product
db.products.insertOne({
    id: "TEST-001",
    nombre: "Polera de Prueba",
    descripcion: "Producto generado desde Playground",
    precio: NumberDecimal("9990"),
    categoria: "SERIGRAFIA",
    stock: 10,
    imagenUrl: "https://via.placeholder.com/150"
});
*/

/*
// ❌ TEST 5: Clean Test Product
db.products.deleteOne({ id: "TEST-001" });
*/

// 🔍 TEST 6: Aggregation - Sales by Category
// Useful to test performance of indexes
/*
db.products.aggregate([
  {
    $group: {
      _id: "$categoria",
      count: { $sum: 1 },
      avgPrice: { $avg: "$precio" }
    }
  }
]);
*/
