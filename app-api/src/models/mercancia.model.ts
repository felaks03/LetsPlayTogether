import { Schema, model, Document } from "mongoose";

export interface IMercancia extends Document {
  descripcion: string;
  origen: string;
  destino: string;
  pesoKg: number;
  fechaEntregaEstimada?: Date;
  estado: string;
}

const MercanciaSchema = new Schema<IMercancia>({
  descripcion: { type: String, required: true },
  origen: { type: String, required: true },
  destino: { type: String, required: true },
  pesoKg: { type: Number, required: true },
  fechaEntregaEstimada: { type: Date },
  estado: { type: String, default: "pendiente" },
});

export const Mercancia = model<IMercancia>("Mercancia", MercanciaSchema);
