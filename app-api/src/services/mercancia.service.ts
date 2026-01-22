import { Mercancia, IMercancia } from "../models/mercancia.model";

export const obtenerTodos = async (): Promise<IMercancia[]> => {
  return Mercancia.find().lean();
};

export const crearMercancia = async (data: Partial<IMercancia>) => {
  const m = new Mercancia(data as any);
  return m.save();
};
