const fs = require('fs');
const path = require('path');

// Configuration
const KOTLIN_FILE_PATH = path.resolve(__dirname, '../../../app poleras/Polera_ecommerce/app/src/main/java/com/example/appajicolorgrupo4/data/CatalogoProductos.kt');
const OUTPUT_FILE = path.join(__dirname, 'products.json');

const extractData = () => {
    try {
        console.log(`📖 Reading Kotlin file: ${KOTLIN_FILE_PATH}`);
        if (!fs.existsSync(KOTLIN_FILE_PATH)) {
            throw new Error('Kotlin file not found!');
        }

        const content = fs.readFileSync(KOTLIN_FILE_PATH, 'utf-8');
        const products = [];

        // Regex to match Producto(...) blocks
        // This is a simplified parser assuming standard formatting in the file
        const productRegex = /val\s+\w+\s*=\s*Producto\s*\(([\s\S]*?)\)/g;
        let match;

        while ((match = productRegex.exec(content)) !== null) {
            const block = match[1];
            
            const idMatch = block.match(/id\s*=\s*"([^"]+)"/);
            const nombreMatch = block.match(/nombre\s*=\s*"([^"]+)"/);
            const descripcionMatch = block.match(/descripcion\s*=\s*"([^"]+)"/);
            const precioMatch = block.match(/precio\s*=\s*(\d+)/);
            const categoriaMatch = block.match(/categoria\s*=\s*CategoriaProducto\.(\w+)/);
            const imageMatch = block.match(/imagenResId\s*=\s*R\.drawable\.(\w+)/);
            const stockMatch = block.match(/stock\s*=\s*(\d+)/);

            if (idMatch && nombreMatch) {
                products.push({
                    id: idMatch[1],
                    nombre: nombreMatch[1],
                    descripcion: descripcionMatch ? descripcionMatch[1] : "",
                    precio: precioMatch ? parseInt(precioMatch[1]) : 0,
                    categoria: categoriaMatch ? categoriaMatch[1] : "OTROS",
                    imageFilename: imageMatch ? `${imageMatch[1]}.png` : null,
                    stock: stockMatch ? parseInt(stockMatch[1]) : 0
                });
            }
        }

        console.log(`✅ Extracted ${products.length} products.`);
        
        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(products, null, 2));
        console.log(`💾 Saved to ${OUTPUT_FILE}`);

    } catch (error) {
        console.error('❌ Extraction Failed:', error);
        process.exit(1);
    }
};

extractData();
