import { AVATAR_DEFAULT } from './avatar-presets';
import { API_ORIGIN } from './api-config';

/** URL para mostrar avatar (local /avatars, subida /uploads o absoluta) */
export function urlFotoPerfil(foto?: string | null): string {
  if (!foto) return AVATAR_DEFAULT;
  if (foto.startsWith('/uploads/')) return `${API_ORIGIN}${foto}`;
  if (foto.startsWith('/avatars/')) return foto;
  if (foto.startsWith('http://') || foto.startsWith('https://')) return foto;
  return AVATAR_DEFAULT;
}
