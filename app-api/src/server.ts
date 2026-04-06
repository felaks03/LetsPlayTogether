
import dotenv from "dotenv";
dotenv.config();
import app from "./app";
import { connectDB } from "./config/database";


const port = Number(process.env.PORT) || 3000;

async function start() {
  await connectDB();
  app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
  });
}

start();
