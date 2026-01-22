const Videojuego = require("../models/videojuego.model");

export const listarVideojuegos = async () => Videojuego.find().lean();
export const obtenerVideojuego = async (id: string) =>
  Videojuego.findById(id).lean();
export const crearVideojuego = async (data: any) => new Videojuego(data).save();
export const actualizarVideojuego = async (id: string, data: any) =>
  Videojuego.findByIdAndUpdate(id, data, { new: true }).lean();
export const eliminarVideojuego = async (id: string) =>
  Videojuego.findByIdAndDelete(id).lean();
