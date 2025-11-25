const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');
const connectDB = require('../config/db');

dotenv.config();

const products = [
    // Serigrafía
    {
        id: "prod_001",
        nombre: "Polera Beastie Boys",
        descripcion: "Polera diseño personalizado\n**Material:** Algodón",
        precio: 15000,
        categoria: "SERIGRAFIA",
        imagenUrl: "/images/polera_beastie_boys.png",
        tipoTalla: "ADULTO",
        coloresDisponibles: ["#000000", "#FFFFFF", "#FF0000", "#0000FF"],
        stock: 50
    },
    {
        id: "prod_002",
        nombre: "Polera Chancho En Piedra",
        descripcion: "Polera diseño personalizado\n**Material:** Algodón",
        precio: 15000,
        categoria: "SERIGRAFIA",
        imagenUrl: "/images/polera_chancho_en_piedra.png",
        tipoTalla: "ADULTO",
        coloresDisponibles: ["#000000", "#FFFFFF", "#FF0000", "#0000FF"],
        stock: 50
    },
    {
        id: "prod_003",
        nombre: "Polera Chancho En Piedra Voy Y Vuelvo",
        descripcion: "Polera diseño personalizado\n**Material:** Algodón",
        precio: 15000,
        categoria: "SERIGRAFIA",
        imagenUrl: "/images/polera_chancho_en_piedra_voy_y_vuelvo.png",
        tipoTalla: "ADULTO",
        coloresDisponibles: ["#000000", "#FFFFFF", "#FF0000", "#0000FF"],
        stock: 50
    },
    {
        id: "prod_004",
        nombre: "Polera Deftones",
        descripcion: "Polera diseño personalizado\n**Material:** Algodón",
        precio: 15000,
        categoria: "SERIGRAFIA",
        imagenUrl: "/images/polera_deftones.png",
        tipoTalla: "ADULTO",
        coloresDisponibles: ["#000000", "#FFFFFF", "#FF0000", "#0000FF"],
        stock: 50
    },
    {
        id: "prod_005",
        nombre: "Polera Faith No More",
        descripcion: "Polera diseño personalizado\n**Material:** Algodón",
        precio: 15000,
        categoria: "SERIGRAFIA",
        imagenUrl: "/images/polera_faith_no_more.png",
        tipoTalla: "ADULTO",
        coloresDisponibles: ["#000000", "#FFFFFF", "#FF0000", "#0000FF"],
        stock: 50
    },
    {
        id: "prod_006",
        nombre: "Polera Foo Fighters",
        descripcion: "Polera diseño personalizado\n**Material:** Algodón",
        precio: 15000,
        categoria: "SERIGRAFIA",
        imagenUrl: "/images/polera_foof_fighters.png",
        tipoTalla: "ADULTO",
        coloresDisponibles: ["#000000", "#FFFFFF", "#FF0000", "#0000FF"],
        stock: 50
    },
    {
        id: "prod_007",
        nombre: "Polera Idles",
        descripcion: "Polera diseño personalizado\n**Material:** Algodón",
        precio: 15000,
        categoria: "SERIGRAFIA",
        imagenUrl: "/images/polera_idles.png",
        tipoTalla: "ADULTO",
        coloresDisponibles: ["#000000", "#FFFFFF", "#FF0000", "#0000FF"],
        stock: 50
    },
    {
        id: "prod_008",
        nombre: "Polera Incubus",
        descripcion: "Polera diseño personalizado\n**Material:** Algodón",
        precio: 15000,
        categoria: "SERIGRAFIA",
        imagenUrl: "/images/polera_incubus.png",
        tipoTalla: "ADULTO",
        coloresDisponibles: ["#000000", "#FFFFFF", "#FF0000", "#0000FF"],
        stock: 50
    },
    {
        id: "prod_009",
        nombre: "Polera Jamiroquai",
        descripcion: "Polera diseño personalizado\n**Material:** Algodón",
        precio: 15000,
        categoria: "SERIGRAFIA",
        imagenUrl: "/images/polera_jamiroquai.png",
        tipoTalla: "ADULTO",
        coloresDisponibles: ["#000000", "#FFFFFF", "#FF0000", "#0000FF"],
        stock: 50
    },
    {
        id: "prod_010",
        nombre: "Polera Los Tetas",
        descripcion: "Polera diseño personalizado\n**Material:** Algodón",
        precio: 15000,
        categoria: "SERIGRAFIA",
        imagenUrl: "/images/polera_los_tetas.png",
        tipoTalla: "ADULTO",
        coloresDisponibles: ["#000000", "#FFFFFF", "#FF0000", "#0000FF"],
        stock: 50
    },
    {
        id: "prod_011",
        nombre: "Polera Makiza",
        descripcion: "Polera diseño personalizado\n**Material:** Algodón",
        precio: 15000,
        categoria: "SERIGRAFIA",
        imagenUrl: "/images/polera_makiza.png",
        tipoTalla: "ADULTO",
        coloresDisponibles: ["#000000", "#FFFFFF", "#FF0000", "#0000FF"],
        stock: 50
    },
    {
        id: "prod_012",
        nombre: "Polera Mr Bungle",
        descripcion: "Polera diseño personalizado\n**Material:** Algodón",
        precio: 15000,
        categoria: "SERIGRAFIA",
        imagenUrl: "/images/polera_mr_bungle.png",
        tipoTalla: "ADULTO",
        coloresDisponibles: ["#000000", "#FFFFFF", "#FF0000", "#0000FF"],
        stock: 50
    },
    {
        id: "prod_013",
        nombre: "Polera Prince",
        descripcion: "Polera diseño personalizado\n**Material:** Algodón",
        precio: 15000,
        categoria: "SERIGRAFIA",
        imagenUrl: "/images/polera_prince.png",
        tipoTalla: "ADULTO",
        coloresDisponibles: ["#000000", "#FFFFFF", "#FF0000", "#0000FF"],
        stock: 50
    },
    {
        id: "prod_014",
        nombre: "Polera Rage Against The Machine",
        descripcion: "Polera diseño personalizado\n**Material:** Algodón",
        precio: 15000,
        categoria: "SERIGRAFIA",
        imagenUrl: "/images/polera_rage_against_the_machine.png",
        tipoTalla: "ADULTO",
        coloresDisponibles: ["#000000", "#FFFFFF", "#FF0000", "#0000FF"],
        stock: 50
    },
    {
        id: "prod_015",
        nombre: "Polera Red Hot Chili Peppers",
        descripcion: "Polera diseño personalizado\n**Material:** Algodón",
        precio: 15000,
        categoria: "SERIGRAFIA",
        imagenUrl: "/images/polera_red_hot_chili_peppers.png",
        tipoTalla: "ADULTO",
        coloresDisponibles: ["#000000", "#FFFFFF", "#FF0000", "#0000FF"],
        stock: 50
    },
    {
        id: "prod_016",
        nombre: "Polera Silk Sonic",
        descripcion: "Polera diseño personalizado\n**Material:** Algodón",
        precio: 15000,
        categoria: "SERIGRAFIA",
        imagenUrl: "/images/polera_silk_sonic.png",
        tipoTalla: "ADULTO",
        coloresDisponibles: ["#000000", "#FFFFFF", "#FF0000", "#0000FF"],
        stock: 50
    },
    {
        id: "prod_017",
        nombre: "Polera System Of A Down",
        descripcion: "Polera diseño personalizado\n**Material:** Algodón",
        precio: 15000,
        categoria: "SERIGRAFIA",
        imagenUrl: "/images/polera_system_of_a_down.png",
        tipoTalla: "ADULTO",
        coloresDisponibles: ["#000000", "#FFFFFF", "#FF0000", "#0000FF"],
        stock: 50
    },
    {
        id: "prod_018",
        nombre: "Polera The Mars Volta",
        descripcion: "Polera diseño personalizado\n**Material:** Algodón",
        precio: 15000,
        categoria: "SERIGRAFIA",
        imagenUrl: "/images/polera_the_mars_volta.png",
        tipoTalla: "ADULTO",
        coloresDisponibles: ["#000000", "#FFFFFF", "#FF0000", "#0000FF"],
        stock: 50
    },
    {
        id: "prod_019",
        nombre: "Polera The Police",
        descripcion: "Polera diseño personalizado\n**Material:** Algodón",
        precio: 15000,
        categoria: "SERIGRAFIA",
        imagenUrl: "/images/polera_the_police.png",
        tipoTalla: "ADULTO",
        coloresDisponibles: ["#000000", "#FFFFFF", "#FF0000", "#0000FF"],
        stock: 50
    },
    {
        id: "prod_020",
        nombre: "Polera Tiro De Gracia",
        descripcion: "Polera diseño personalizado\n**Material:** Algodón",
        precio: 15000,
        categoria: "SERIGRAFIA",
        imagenUrl: "/images/polera_tiro_de_gracia.png",
        tipoTalla: "ADULTO",
        coloresDisponibles: ["#000000", "#FFFFFF", "#FF0000", "#0000FF"],
        stock: 50
    },
    {
        id: "prod_021",
        nombre: "Polera Tool",
        descripcion: "Polera diseño personalizado\n**Material:** Algodón",
        precio: 15000,
        categoria: "SERIGRAFIA",
        imagenUrl: "/images/polera_tool.png",
        tipoTalla: "ADULTO",
        coloresDisponibles: ["#000000", "#FFFFFF", "#FF0000", "#0000FF"],
        stock: 50
    },
    {
        id: "prod_022",
        nombre: "Polera Twenty One Pilots",
        descripcion: "Polera diseño personalizado\n**Material:** Algodón",
        precio: 15000,
        categoria: "SERIGRAFIA",
        imagenUrl: "/images/polera_twenty_one_pilots.png",
        tipoTalla: "ADULTO",
        coloresDisponibles: ["#000000", "#FFFFFF", "#FF0000", "#0000FF"],
        stock: 50
    },
    // DTF
    {
        id: "prod_dtf_001",
        nombre: "Polera DTF Beastie Boys",
        descripcion: "Polera con diseño personalizado en DTF\n**Material:** Algodón\n**Técnica:** Digital Transfer Film",
        precio: 18000,
        categoria: "DTF",
        imagenUrl: "/images/polera_beastie_boys.png",
        tipoTalla: "ADULTO",
        permiteTipoInfantil: true,
        coloresDisponibles: ["#000000", "#FFFFFF", "#FF0000", "#0000FF"],
        stock: 50
    },
    {
        id: "prod_dtf_002",
        nombre: "Polera DTF Chancho En Piedra",
        descripcion: "Polera con diseño personalizado en DTF\n**Material:** Algodón\n**Técnica:** Digital Transfer Film",
        precio: 18000,
        categoria: "DTF",
        imagenUrl: "/images/polera_chancho_en_piedra.png",
        tipoTalla: "ADULTO",
        permiteTipoInfantil: true,
        coloresDisponibles: ["#000000", "#FFFFFF", "#FF0000", "#0000FF"],
        stock: 50
    },
    {
        id: "prod_dtf_003",
        nombre: "Polera DTF Deftones",
        descripcion: "Polera con diseño personalizado en DTF\n**Material:** Algodón\n**Técnica:** Digital Transfer Film",
        precio: 18000,
        categoria: "DTF",
        imagenUrl: "/images/polera_deftones.png",
        tipoTalla: "ADULTO",
        permiteTipoInfantil: true,
        coloresDisponibles: ["#000000", "#FFFFFF", "#FF0000", "#0000FF"],
        stock: 50
    },
    {
        id: "prod_dtf_004",
        nombre: "Polera DTF Incubus",
        descripcion: "Polera con diseño personalizado en DTF\n**Material:** Algodón\n**Técnica:** Digital Transfer Film",
        precio: 18000,
        categoria: "DTF",
        imagenUrl: "/images/polera_incubus.png",
        tipoTalla: "ADULTO",
        permiteTipoInfantil: true,
        coloresDisponibles: ["#000000", "#FFFFFF", "#FF0000", "#0000FF"],
        stock: 50
    },
    {
        id: "prod_dtf_005",
        nombre: "Polera DTF Tool",
        descripcion: "Polera con diseño personalizado en DTF\n**Material:** Algodón\n**Técnica:** Digital Transfer Film",
        precio: 18000,
        categoria: "DTF",
        imagenUrl: "/images/polera_tool.png",
        tipoTalla: "ADULTO",
        permiteTipoInfantil: true,
        coloresDisponibles: ["#000000", "#FFFFFF", "#FF0000", "#0000FF"],
        stock: 50
    },
    // Accesorios
    {
        id: "prod_023",
        nombre: "Jockey Genérico",
        descripcion: "Jockey generico",
        precio: 8000,
        categoria: "ACCESORIOS",
        imagenUrl: "/images/jockey.png",
        coloresDisponibles: ["#000000", "#FFFFFF"],
        stock: 100
    }
];

const seedProducts = async () => {
    try {
        await connectDB();
        
        await Product.deleteMany({});
        console.log('Productos eliminados...');
        
        await Product.insertMany(products);
        console.log('Productos importados exitosamente!');
        
        process.exit();
    } catch (error) {
        console.error('Error importando productos:', error);
        process.exit(1);
    }
};

seedProducts();
