import express, { Request, Response } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

// Cargar variables de .env
dotenv.config();

// Crear instancia de Express
const app = express();
const port = process.env.PORT || 3000;
const mongoUri =
  process.env.MONGO_URI || "mongodb://localhost:27017/letplaytogether";

// Middleware
app.use(express.json());
app.use(cors());

// Función para conectar a MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log("MongoDB conectado correctamente");
  } catch (err) {
    console.error("Error conectando a MongoDB:", err);
    process.exit(1);
  }
};

// Conectar a la base de datos
connectDB();

// Rutas de prueba
app.get("/", (req: Request, res: Response) => {
  res.send("Backend funcionando");
});

// Arrancar servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
