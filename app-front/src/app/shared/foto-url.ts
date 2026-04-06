import { AVATAR_DEFAULT } from './avatar-presets';
import { API_ORIGIN } from './api-config';

// encodear nombre de archivo (espacios, paréntesis...)
function encodePublicAvatarPath(foto: string): string {
  if (!foto.startsWith('/avatars/')) return foto;
  const rest = foto.slice('/avatars/'.length);
  if (!rest) return foto;
  return '/avatars/' + rest.split('/').map(encodeURIComponent).join('/');
}

// devuelve la URL lista para poner en el src del avatar
export function urlFotoPerfil(foto?: string | null): string {
  if (!foto) return encodePublicAvatarPath(AVATAR_DEFAULT);
  if (foto.startsWith('/uploads/')) return `${API_ORIGIN}${foto}`;
  if (foto.startsWith('/avatars/')) return encodePublicAvatarPath(foto);
  if (foto.startsWith('http://') || foto.startsWith('https://')) return foto;
  return encodePublicAvatarPath(AVATAR_DEFAULT);
}
