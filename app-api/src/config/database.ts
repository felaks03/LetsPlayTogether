import mongoose from "mongoose";

const mongoUri = process.env.MONGO_URI;

export const connectDB = async () => {
  if (!mongoUri) {
    console.error("Falta MONGO_URI en el .env");
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri);
    console.log("MongoDB conectado correctamente");
  } catch (error) {
    console.error("Error conectando a MongoDB:", error);
    process.exit(1);
  }
};
