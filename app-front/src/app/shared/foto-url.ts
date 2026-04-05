import { AVATAR_DEFAULT } from './avatar-presets';
import { API_ORIGIN } from './api-config';

/** Codifica el nombre de archivo tras /avatars/ (espacios, paréntesis, etc.) */
function encodePublicAvatarPath(foto: string): string {
  if (!foto.startsWith('/avatars/')) return foto;
  const rest = foto.slice('/avatars/'.length);
  if (!rest) return foto;
  return '/avatars/' + rest.split('/').map(encodeURIComponent).join('/');
}

/** URL para mostrar avatar (local /avatars, subida /uploads o absoluta) */
export function urlFotoPerfil(foto?: string | null): string {
  if (!foto) return encodePublicAvatarPath(AVATAR_DEFAULT);
  if (foto.startsWith('/uploads/')) return `${API_ORIGIN}${foto}`;
  if (foto.startsWith('/avatars/')) return encodePublicAvatarPath(foto);
  if (foto.startsWith('http://') || foto.startsWith('https://')) return foto;
  return encodePublicAvatarPath(AVATAR_DEFAULT);
}
