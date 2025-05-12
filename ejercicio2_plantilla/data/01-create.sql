--
-- SQLiteStudio v3.4.17 ���ɵ��ļ������� 5�� 11 15:21:08 2025
--
-- ���õ��ı����룺System
--
PRAGMA foreign_keys = off;
BEGIN TRANSACTION;

-- ����Comentarios
DROP TABLE IF EXISTS Comentarios;
CREATE TABLE IF NOT EXISTS "Comentarios" (
	"id"	INTEGER NOT NULL,
	"id_foro"	INTEGER NOT NULL,
	"contenido"	TEXT,
	"fecha"	TEXT,
	"id_usuario"	INTEGER NOT NULL,
	"username" TEXT,
	"editado" TEXT,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("id_foro") REFERENCES "Foros"("id"),
	FOREIGN KEY("id_usuario") REFERENCES "Usuarios"("id"),
	FOREIGN KEY("username") REFERENCES "Usuarios"("username")
);

-- ����Desafio
DROP TABLE IF EXISTS Desafio;
CREATE TABLE IF NOT EXISTS "Desafio" (
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

-- ����Foros
DROP TABLE IF EXISTS Foros;
CREATE TABLE IF NOT EXISTS "Foros" (
	"id"	INTEGER NOT NULL,
	"titulo"	INTEGER NOT NULL,
	"descripcion"	INTEGER,
	"estado"	TEXT,
	"username" TEXT,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("username") REFERENCES "Usuarios"("username")
);

-- ����Fotos
DROP TABLE IF EXISTS Fotos;
CREATE TABLE IF NOT EXISTS "Fotos" (
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

-- ����Productos
DROP TABLE IF EXISTS Productos;
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

-- ����Usuarios
DROP TABLE IF EXISTS Usuarios;
CREATE TABLE IF NOT EXISTS "Usuarios" (
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

COMMIT TRANSACTION;
PRAGMA foreign_keys = on;
