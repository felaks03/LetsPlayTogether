/** Rutas válidas de avatar (coinciden con archivos en app-front/public/avatars) */
export const ALLOWED_AVATAR_PATHS = [
    "/avatars/default.svg",
    "/avatars/avatar-1.svg",
    "/avatars/avatar-2.svg",
    "/avatars/avatar-3.svg",
    "/avatars/avatar-4.svg",
] as const;

export const DEFAULT_AVATAR_PATH = "/avatars/default.svg";

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
