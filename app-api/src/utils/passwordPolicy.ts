// registro: mínimo 8, mayúscula, número y un carácter especial

const ESPECIALES = '!?@#$%^&*()_+-=[]{}|;:,.<>/\\·=`"';

function tieneCaracterEspecial(pw: string): boolean {
    for (const c of pw) {
        if (ESPECIALES.includes(c)) return true;
    }
    return false;
}

export function validatePassword(pw: string): string | null {
    if (!pw || pw.length < 8) {
        return "La contraseña debe tener al menos 8 caracteres.";
    }
    if (!/[A-ZÁÉÍÓÚÑÜ]/.test(pw)) {
        return "Te falta una letra mayúscula.";
    }
    if (!/\d/.test(pw)) {
        return "Te falta un número.";
    }
    if (!tieneCaracterEspecial(pw)) {
        return "Te falta un carácter especial (! ? = · $ @ #, etc.).";
    }
    return null;
}
