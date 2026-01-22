const mongoose = require("mongoose");
const Videojuego = require("./src/models/videojuego.model");

require("dotenv").config();

const mockData = [
  {
    titulo: "The Legend of Zelda: Breath of the Wild",
    genero: "Aventura",
    desarrollador: "Nintendo",
    fechaLanzamiento: new Date("2017-03-03"),
    plataformas: ["Nintendo Switch"],
    puntuacion: 9.5,
    multijugador: false,
  },
  {
    titulo: "Super Mario Odyssey",
    genero: "Plataformas",
    desarrollador: "Nintendo",
    fechaLanzamiento: new Date("2017-10-27"),
    plataformas: ["Nintendo Switch"],
    puntuacion: 9.2,
    multijugador: false,
  },
  {
    titulo: "FIFA 23",
    genero: "Deportes",
    desarrollador: "EA Sports",
    fechaLanzamiento: new Date("2022-09-30"),
    plataformas: ["PlayStation 5", "Xbox Series X", "PC"],
    puntuacion: 7.8,
    multijugador: true,
  },
  {
    titulo: "Minecraft",
    genero: "Sandbox",
    desarrollador: "Mojang",
    fechaLanzamiento: new Date("2011-11-18"),
    plataformas: ["PC", "PlayStation", "Xbox", "Nintendo Switch", "Mobile"],
    puntuacion: 9.0,
    multijugador: true,
  },
  {
    titulo: "The Witcher 3: Wild Hunt",
    genero: "RPG",
    desarrollador: "CD Projekt Red",
    fechaLanzamiento: new Date("2015-05-19"),
    plataformas: ["PC", "PlayStation 4", "Xbox One", "Nintendo Switch"],
    puntuacion: 9.7,
    multijugador: false,
  },
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Conectado a MongoDB");

    await Videojuego.deleteMany(); // Limpiar datos existentes
    console.log("Datos existentes eliminados");

    await Videojuego.insertMany(mockData);
    console.log("Datos mock insertados correctamente");

    mongoose.connection.close();
    console.log("Conexión cerrada");
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

seedDatabase();
