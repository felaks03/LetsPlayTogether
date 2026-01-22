import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app";

dotenv.config();

const port = process.env.PORT || 3000;
const mongoUri = "mongodb://localhost:27017/letplaytogether";

const connectDB = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log("MongoDB conectado correctamente");
  } catch (err) {
    console.error("Error conectando a MongoDB:", err);
    process.exit(1);
  }
};

connectDB();

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
