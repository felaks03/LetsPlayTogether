const { MongoClient, ObjectId } = require("mongodb");
const fs = require("fs");
const path = require("path");

require("dotenv").config();

/**
 * Convierte los { $oid: "..." } y { $date: "..." } del JSON extendido de Mongo
 * a ObjectId y Date nativos.
 */
function convertExtendedJSON(obj) {
  if (obj === null || typeof obj !== "object") return obj;
  if (obj.$oid) return new ObjectId(obj.$oid);
  if (obj.$date) return new Date(obj.$date);
  if (Array.isArray(obj)) return obj.map(convertExtendedJSON);
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    out[k] = convertExtendedJSON(v);
  }
  return out;
}

function loadJSON(file) {
  const raw = fs.readFileSync(path.join(__dirname, "../data/seed", file), "utf-8");
  return JSON.parse(raw).map(convertExtendedJSON);
}

// Usuario admin adicional con credenciales admin@gmail.com / admin
const adminUser = {
  _id: new ObjectId(),
  nick: "admin",
  email: "admin@gmail.com",
  password: "admin",
  edad: 35,
  foto: "/avatars/2169.jpg",
  redes: { twitter: "", discord: "", twitch: "" },
  favoritos: [],
  amigos: [],
  role: "admin",
  createdAt: new Date(),
  updatedAt: new Date(),
};

async function seedDatabase() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("MONGO_URI no definida en .env");
    process.exit(1);
  }

  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db();
    console.log("Conectado a MongoDB");

    // ── Videojuegos ──
    const videojuegos = loadJSON("videojuegos.json");
    await db.collection("videojuegos").deleteMany({});
    if (videojuegos.length) {
      await db.collection("videojuegos").insertMany(videojuegos);
    }
    console.log(`Insertados ${videojuegos.length} videojuegos`);

    // ── Usuarios ──
    const usuarios = loadJSON("usuarios.json");
    usuarios.push(adminUser);
    await db.collection("users").deleteMany({});
    await db.collection("users").insertMany(usuarios);
    console.log(`Insertados ${usuarios.length} usuarios (incluye admin/admin@gmail.com)`);

    console.log("\n✓ Seed completado");
    console.log("  Admin → email: admin@gmail.com  password: admin");
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  } finally {
    await client.close();
    console.log("Conexión cerrada");
  }
}

seedDatabase();
