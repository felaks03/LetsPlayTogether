import Sala from "../models/salas.model";
import User from "../models/user.model";
import Videojuego from "../models/videojuego.model";
import Chat from "../models/chat.model";
import { Types } from "mongoose";

const POPULATE_SALA = [
  { path: "videojuego", select: "titulo imagen" },
  { path: "host", select: "nick" },
  { path: "usuarios", select: "nick" },
];

/** Id estable para comparar ObjectId, string o subdocumento lean */
function rawId(x: unknown): string {
  if (x == null) return "";
  if (typeof x === "string") return x;
  if (typeof x === "object" && x !== null && "_id" in x) {
    const id = (x as { _id: unknown })._id;
    return id != null ? String(id) : "";
  }
  return String(x);
}

function sameId(a: unknown, b: unknown): boolean {
  return rawId(a) === rawId(b) && rawId(a) !== "";
}

/** OPEN ↔ FULL según cupo; no toca CLOSED ni IN_GAME */
function recalcularEstadoPorCapacidad(sala: {
  estado: string;
  usuarios: unknown[];
  maxUsuarios: number;
}) {
  if (sala.estado === "CLOSED" || sala.estado === "IN_GAME") return;
  sala.estado =
    sala.usuarios.length >= sala.maxUsuarios ? "FULL" : "OPEN";
}

async function normalizeSalaPayload(doc: unknown): Promise<Record<string, unknown>> {
  const base = doc as Record<string, unknown>;
  const out: Record<string, unknown> = { ...base };

  const vgRaw = out.videojuego;
  const vgId = rawId(vgRaw);
  if (
    vgRaw &&
    typeof vgRaw === "object" &&
    vgRaw !== null &&
    "titulo" in vgRaw &&
    (vgRaw as { titulo?: string }).titulo != null &&
    String((vgRaw as { titulo: string }).titulo).trim() !== ""
  ) {
    const vr = vgRaw as { titulo: string; imagen?: string };
    out.videojuego = {
      _id: vgId,
      titulo: String(vr.titulo),
      ...(vr.imagen != null && String(vr.imagen).trim() !== ""
        ? { imagen: String(vr.imagen) }
        : {}),
    };
  } else if (vgId && Types.ObjectId.isValid(vgId)) {
    const v = await Videojuego.findById(vgId).select("titulo imagen").lean();
    out.videojuego = v
      ? {
          _id: String(v._id),
          titulo: v.titulo,
          ...(v.imagen != null && String(v.imagen).trim() !== ""
            ? { imagen: String(v.imagen) }
            : {}),
        }
      : { _id: vgId, titulo: "" };
  } else {
    out.videojuego = { _id: vgId || "", titulo: "" };
  }

  const hostRaw = out.host;
  const hostId = rawId(hostRaw);
  if (
    hostRaw &&
    typeof hostRaw === "object" &&
    hostRaw !== null &&
    "nick" in hostRaw &&
    (hostRaw as { nick?: string }).nick != null
  ) {
    out.host = {
      _id: hostId,
      nick: String((hostRaw as { nick: string }).nick),
    };
  } else if (hostId && Types.ObjectId.isValid(hostId)) {
    const u = await User.findById(hostId).select("nick").lean();
    out.host = u
      ? { _id: String(u._id), nick: u.nick }
      : { _id: hostId, nick: "—" };
  } else {
    out.host = { _id: hostId, nick: "—" };
  }

  const arr = (out.usuarios as unknown[]) || [];
  const orderedIds: string[] = [];
  for (const item of arr) {
    const uid = rawId(item);
    if (uid && Types.ObjectId.isValid(uid)) orderedIds.push(uid);
  }
  const uniqueValid = [...new Set(orderedIds)];
  const userDocs =
    uniqueValid.length > 0
      ? await User.find({ _id: { $in: uniqueValid } })
          .select("nick")
          .lean()
      : [];
  const nickById = new Map(
    userDocs.map((u) => {
      const id = String(u._id);
      const n = u.nick != null ? String(u.nick).trim() : "";
      return [id, n !== "" ? n : ""] as const;
    })
  );

  const usuariosOut: { _id: string; nick: string }[] = [];
  for (const item of arr) {
    const uid = rawId(item);
    if (!uid) continue;
    if (!Types.ObjectId.isValid(uid)) {
      usuariosOut.push({ _id: uid, nick: "—" });
      continue;
    }
    const n = nickById.get(uid);
    usuariosOut.push({ _id: uid, nick: n && n !== "" ? n : "—" });
  }
  out.usuarios = usuariosOut;

  delete out.jugadoresListos;

  return out;
}

async function salaPopuladaPorId(id: Types.ObjectId | string) {
  const raw = await Sala.findById(id).populate(POPULATE_SALA).lean();
  if (!raw) return null;
  return normalizeSalaPayload(raw);
}

/**
 * Crear una sala
 */
interface CreateSalaData {
  nombre: string;
  videojuego: Types.ObjectId;
  host: Types.ObjectId;
  maxUsuarios?: number;
  expiraEn?: Date;
}

export async function createSala(data: CreateSalaData) {
  const usuarioConSala = await User.findById(data.host);

  if (usuarioConSala?.salaActual) {
    throw new Error("Ya estás en una sala activa");
  }

  const chat = await Chat.create({
    participante1: data.host,
    participante2: data.host,
  });

  const sala = new Sala({
    ...data,
    usuarios: [data.host],
    estado: "OPEN",
    chat: chat._id,
  });

  await sala.save();
  await User.findByIdAndUpdate(data.host, { salaActual: sala._id });

  return salaPopuladaPorId(sala._id);
}

/**
 * Obtener todas las salas
 */
export async function getSalas() {
  const rows = await Sala.find()
    .populate(POPULATE_SALA)
    .sort({ creadoEn: -1 })
    .lean();
  return Promise.all(
    rows.map((r) => normalizeSalaPayload(r))
  );
}

/**
 * Obtener una sala por ID
 */
export async function getSalaById(id: string) {
  if (!Types.ObjectId.isValid(id)) return null;
  const raw = await Sala.findById(id).populate(POPULATE_SALA).lean();
  if (!raw) return null;
  return normalizeSalaPayload(raw);
}

/**
 * Unirse a una sala
 */
export async function joinSala(salaId: string, userId: string) {
  if (!Types.ObjectId.isValid(salaId) || !Types.ObjectId.isValid(userId)) {
    throw new Error("IDs inválidos");
  }

  const usuario = await User.findById(userId);

  if (usuario?.salaActual && usuario.salaActual.toString() !== salaId) {
    throw new Error("Ya estás en una sala activa");
  }

  const sala = await Sala.findById(salaId);
  if (!sala) throw new Error("Sala no encontrada");

  if (sala.estado === "CLOSED") {
    throw new Error("La sala está cerrada");
  }

  const userObjectId = new Types.ObjectId(userId);

  if (sala.usuarios.some((u) => sameId(u, userId))) {
    return salaPopuladaPorId(sala._id);
  }

  if (sala.usuarios.length >= sala.maxUsuarios) {
    sala.estado = "FULL";
    await sala.save();
    throw new Error("La sala está llena");
  }

  sala.usuarios.push(userObjectId);

    await User.findByIdAndUpdate(userId, { salaActual: sala._id });

    if (sala.chat) {
      const chat = await Chat.findById(sala.chat);

      if (chat) {
        if (
          !chat.participante1.equals(userObjectId) &&
          !chat.participante2.equals(userObjectId)
        ) {
          chat.participante2 = userObjectId;
          await chat.save();
        }
      }
    }
  if (sala.usuarios.length >= sala.maxUsuarios) {
    sala.estado = "FULL";
  }

  sala.markModified("usuarios");
  await sala.save();
  return salaPopuladaPorId(sala._id);
}

/**
 * Salir de una sala
 */
export async function leaveSala(salaId: string, userId: string) {
  if (!Types.ObjectId.isValid(salaId) || !Types.ObjectId.isValid(userId)) {
    throw new Error("IDs inválidos");
  }

  const sala = await Sala.findById(salaId);
  if (!sala) throw new Error("Sala no encontrada");

  sala.usuarios = sala.usuarios.filter((u) => !sameId(u, userId));

  await User.findByIdAndUpdate(userId, { salaActual: null });

  recalcularEstadoPorCapacidad(sala);

  sala.markModified("usuarios");
  await sala.save();
  return salaPopuladaPorId(sala._id);
}

/**
 * El host expulsa a un usuario (no puede expulsarse a sí mismo ni "expulsar" al host).
 */
export async function kickUsuarioFromSala(
  salaId: string,
  hostUserId: string,
  targetUserId: string
) {
  if (
    !Types.ObjectId.isValid(salaId) ||
    !Types.ObjectId.isValid(hostUserId) ||
    !Types.ObjectId.isValid(targetUserId)
  ) {
    throw new Error("IDs inválidos");
  }

  if (sameId(hostUserId, targetUserId)) {
    throw new Error("Para salir tú de la sala usa «Salir»");
  }

  const sala = await Sala.findById(salaId);
  if (!sala) throw new Error("Sala no encontrada");

  if (!sameId(sala.host, hostUserId)) {
    throw new Error("Solo el host puede expulsar jugadores");
  }

  if (sameId(sala.host, targetUserId)) {
    throw new Error("No se puede expulsar al host");
  }

  if (!sala.usuarios.some((u) => sameId(u, targetUserId))) {
    throw new Error("Ese usuario no está en la sala");
  }

  sala.usuarios = sala.usuarios.filter((u) => !sameId(u, targetUserId));
  await User.findByIdAndUpdate(targetUserId, { salaActual: null });

  recalcularEstadoPorCapacidad(sala);

  sala.markModified("usuarios");
  await sala.save();
  return salaPopuladaPorId(sala._id);
}

/**
 * Actualizar el estado de una sala
 */
export async function updateEstadoSala(
  salaId: string,
  estado: "OPEN" | "IN_GAME" | "FULL" | "CLOSED"
) {
  if (!Types.ObjectId.isValid(salaId)) {
    throw new Error("ID inválido");
  }

  const sala = await Sala.findById(salaId);
  if (!sala) throw new Error("Sala no encontrada");

  sala.estado = estado;
  await sala.save();
  return salaPopuladaPorId(sala._id);
}

/**
 * Eliminar una sala y limpiar referencias de los usuarios
 */
export async function deleteSala(salaId: string) {
  if (!Types.ObjectId.isValid(salaId)) return null;

  const sala = await Sala.findById(salaId);
  if (!sala) return null;

  const ids = [
    sala.host.toString(),
    ...sala.usuarios.map((u) => u.toString()),
  ];
  const unique = [...new Set(ids)]
    .filter((id) => Types.ObjectId.isValid(id))
    .map((id) => new Types.ObjectId(id));

  await User.updateMany(
    { _id: { $in: unique } },
    { $set: { salaActual: null } }
  );

  await Sala.findByIdAndDelete(salaId);
  return sala;
}
