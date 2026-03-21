# Datos de ejemplo (seed) para MongoDB

Archivos en **Extended JSON** (formato que entiende MongoDB Compass y `mongoimport`).

## Orden de importación

1. **`videojuegos.json`** → colección `videojuegos`  
2. **`usuarios.json`** → colección `users`

Los `favoritos` y `amigos` de los usuarios apuntan a los `_id` definidos en esos archivos. Si cambias los `_id` de los juegos, actualiza también las referencias en `usuarios.json`.

## Contraseñas de prueba

Todas las cuentas de ejemplo usan la misma contraseña (válida según la política del proyecto):

- **`Prueba123!`**

Hay **10 usuarios**; todos usan **`Prueba123!`**. Solo **admin@ejemplo.com** tiene rol `admin`.

| Email              | Nick         |
|--------------------|--------------|
| luna@ejemplo.com   | LunaGamer    |
| kai@ejemplo.com    | KaiPro       |
| admin@ejemplo.com  | AdminDemo    |
| nox@ejemplo.com    | NoxFPS       |
| mika@ejemplo.com   | MikaRPG      |
| sole@ejemplo.com   | SoleCraft    |
| dani@ejemplo.com   | DaniCoop     |
| iris@ejemplo.com   | IrisIndie    |
| leo@ejemplo.com    | LeoSpeedrun  |
| rafa@ejemplo.com   | RafaCasual   |

> La API compara la contraseña en **texto plano** (según `auth.service.ts`). No hace falta hash para estos datos de desarrollo.

## MongoDB Compass

1. Conéctate a tu base de datos.
2. Crea las colecciones vacías `videojuegos` y `users` si no existen (o usa las que ya tenga Mongoose).
3. En cada colección: **Add data** → **Import JSON or CSV file** y elige el archivo correspondiente.
4. Si Compass pide un documento suelto en lugar de un array, puedes pegar los objetos uno a uno, o usar la terminal con `mongoimport` (abajo).

## Línea de comandos (`mongoimport`)

Desde la carpeta `app-api/data/seed` (ajusta URI y nombre de BD):

```bash
mongoimport --uri="mongodb://localhost:27017/NOMBRE_BD" --collection=videojuegos --jsonArray --file=videojuegos.json
mongoimport --uri="mongodb://localhost:27017/NOMBRE_BD" --collection=users --jsonArray --file=usuarios.json
```

## Evitar duplicados

Si ya hay documentos con los mismos `_id` o el mismo `email`, borra la colección o los documentos conflictivos antes de importar de nuevo.
