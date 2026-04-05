/** Rutas válidas de avatar (coinciden con archivos en app-front/public/avatars) */
export const ALLOWED_AVATAR_PATHS = [
    "/avatars/2169.jpg",
    "/avatars/3be3a7c1-2d8d-4007-9e47-1a4b0ab4f83f.jpg",
    "/avatars/8300_8_03.jpg",
    "/avatars/descarga.jpg",
    "/avatars/descarga (1).jpg",
] as const;

export const DEFAULT_AVATAR_PATH = "/avatars/2169.jpg";

const UPLOAD_AVATAR_REGEX = /^\/uploads\/avatars\/[a-zA-Z0-9._-]+$/;

export function isAllowedUploadAvatarPath(foto: string): boolean {
    return UPLOAD_AVATAR_REGEX.test(foto);
}

export function normalizeAvatarPath(foto: unknown): string {
    if (typeof foto !== "string") return DEFAULT_AVATAR_PATH;
    if (ALLOWED_AVATAR_PATHS.includes(foto as any)) return foto;
    if (isAllowedUploadAvatarPath(foto)) return foto;
    return DEFAULT_AVATAR_PATH;
}
