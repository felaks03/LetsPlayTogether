import { Schema, model, Document } from "mongoose";

/**
 * Interface para tipado del documento Videojuego
 */
export interface IVideojuego extends Document {
  titulo: string;
  genero?: string;
  desarrollador?: string;
  fechaLanzamiento?: Date;
  plataformas: string[];
  puntuacion?: number;
  multijugador: boolean;
  creadoEn: Date;
}

const VideojuegoSchema = new Schema<IVideojuego>({
  titulo: { type: String, required: true },
  genero: { type: String },
  desarrollador: { type: String },
  fechaLanzamiento: { type: Date },
  plataformas: [{ type: String }],
  puntuacion: { type: Number, min: 0, max: 10 },
  multijugador: { type: Boolean, default: false },
  creadoEn: { type: Date, default: Date.now },
});

export default model<IVideojuego>("Videojuego", VideojuegoSchema);
