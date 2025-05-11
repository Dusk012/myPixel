BEGIN TRANSACTION;
DROP TABLE IF EXISTS "Comentarios";
CREATE TABLE "Comentarios" (
	"id"	INTEGER NOT NULL,
	"id_foro"	INTEGER NOT NULL,
	"contenido"	TEXT,
	"fecha"	TEXT,
	"id_usuario"	INTEGER NOT NULL,
	"username" TEXT,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("id_foro") REFERENCES "Foros"("id"),
	FOREIGN KEY("id_usuario") REFERENCES "Usuarios"("id"),
	FOREIGN KEY("username") REFERENCES "Usuarios"("username")
);
DROP TABLE IF EXISTS "Desafío";
CREATE TABLE "Desafío" (
	"puntos"	INTEGER NOT NULL DEFAULT (0),
	"puntuacionObjetivo"	INTEGER NOT NULL DEFAULT (0),
	"id"	INTEGER NOT NULL,
	"descripcion"	TEXT,
	"fecha"	TEXT NOT NULL,
	"id_usuario"	INTEGER,
	"tipo" INTEGER NOT NULL DEFAULT (0),
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("id_usuario") REFERENCES "Usuarios"("id")
);
DROP TABLE IF EXISTS "Productos";
CREATE TABLE IF NOT EXISTS "Productos" (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    descripcion TEXT,
    precio REAL NOT NULL,
    imagen TEXT,
    estado TEXT NOT NULL,
    usuario_id INTEGER NOT NULL,
    fecha_creacion TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(id)
);
DROP TABLE IF EXISTS "Foros";
CREATE TABLE "Foros" (
	"id"	INTEGER NOT NULL,
	"titulo"	INTEGER NOT NULL,
	"descripcion"	INTEGER,
	"estado"	TEXT,
	"username" TEXT,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("username") REFERENCES "Usuarios"("username")
);
DROP TABLE IF EXISTS "Fotos";
CREATE TABLE "Fotos" (
	"id"	INTEGER NOT NULL,
	"nombre"	TEXT NOT NULL,
	"descripcion"	TEXT,
	"fecha"	TEXT,
	"puntuacion"	INTEGER,
	"estado"	REAL,
	"id_usuario"	INTEGER,
	"id_foro"	INTEGER,
	"contenido"	TEXT NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("id_foro") REFERENCES "Foros"("id"),
	FOREIGN KEY("id_usuario") REFERENCES "Usuarios"("username")
);
DROP TABLE IF EXISTS "Usuarios";
CREATE TABLE "Usuarios" (
	"id"	INTEGER NOT NULL,
	"username"	TEXT NOT NULL UNIQUE,
	"password"	TEXT NOT NULL,
	"rol"	TEXT NOT NULL DEFAULT 'U' CHECK("rol" IN ('U', 'A')),
	"nombre"	TEXT NOT NULL,
	"nivel"	INTEGER NOT NULL DEFAULT (1),
	"reputacion"	INTEGER NOT NULL DEFAULT (0),
	"estado"	TEXT NOT NULL DEFAULT ACTIVO,
	"fecha_registro"	TEXT,
	"foto_perfil"	INTEGER NOT NULL DEFAULT (1),
	PRIMARY KEY("id" AUTOINCREMENT)
);
COMMIT;
