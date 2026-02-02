import Videojuego, { IVideojuego } from "../models/videojuego.model";

export async function videojuegoList(): Promise<IVideojuego[]> {
  return Videojuego.find().lean();
}

export async function videojuegoGetById(id: string): Promise<IVideojuego | null> {
  return Videojuego.findById(id).lean();
}

export async function videojuegoCreate(data: Partial<IVideojuego>): Promise<IVideojuego> {
  const m = new Videojuego(data);
  return m.save();
}

export async function videojuegoUpdate(
  id: string,
  data: Partial<IVideojuego>
): Promise<IVideojuego | null> {
  return Videojuego.findByIdAndUpdate(id, data, { new: true }).lean();
}

export async function videojuegoDelete(id: string): Promise<IVideojuego | null> {
  return Videojuego.findByIdAndDelete(id).lean();
}
