--
-- SQLiteStudio v3.4.17 ���ɵ��ļ������� 5�� 11 15:08:57 2025
--
-- ���õ��ı����룺System
--
PRAGMA foreign_keys = off;
BEGIN TRANSACTION;
INSERT INTO Usuarios (id, username, password, rol, nombre, nivel, reputacion, estado, fecha_registro, foto_perfil) VALUES (1, 'PRTS', '$2b$10$QCMN3UgIDT7eKzNhdYgfLe6FuQda5rGBB.cdntVMf.rVudrHsDZae', 'A', 'Priestess', 1, 0, 'ACTIVO', NULL, 4);
INSERT INTO Usuarios (id, username, password, rol, nombre, nivel, reputacion, estado, fecha_registro, foto_perfil) VALUES (2, 'ZOOT', '$2b$10$A42DoLc6Bd8TfxwQOwFr/ulM/RP8Z45spax6Y2cwwtS3dK8hdpSQ6', 'A', 'Zeroth', 1, 0, 'ACTIVO', NULL, 1);
INSERT INTO Usuarios (id, username, password, rol, nombre, nivel, reputacion, estado, fecha_registro, foto_perfil) VALUES (3, 'Amiya', '$2b$10$sVtcUUlRZfQ967CnlQcO/uzeXPP1dA7Jf3ZSWpAvz61/5AGOINMhe', 'U', 'AMIYA', 1, 0, 'ACTIVO', NULL, 1);
INSERT INTO Usuarios (id, username, password, rol, nombre, nivel, reputacion, estado, fecha_registro, foto_perfil) VALUES (4, 'Theresa', '$2b$10$UM0nBPj7WEPjxsJVO3fU.eXcyAxYhn9Q1PPdjE7i7kgau78ovtfIC', 'U', 'Theresa', 1, 0, 'ACTIVO', NULL, 1);


INSERT INTO Foros (id, titulo, descripcion, estado, username) VALUES (1, 'I will be watching you', 'Be careful', 'Activo', 'PRTS');

INSERT INTO Comentarios (id, id_foro, contenido, fecha, id_usuario, username) VALUES (2, 1, 'Doctor...', '2025-05-11T13:03:28.108Z', 1, 'PRTS');
INSERT INTO Comentarios (id, id_foro, contenido, fecha, id_usuario, username) VALUES (3, 1, 'Why?', '2025-05-11T13:03:39.438Z', 4, 'Theresa');


INSERT INTO Desafio (puntos, puntuacionObjetivo, id, descripcion, fecha, id_usuario, tipo) VALUES (4, 10, 1, '?Da 10 likes!', '2025-05-11T12:47:59.605Z', 1, 0);
INSERT INTO Desafio (puntos, puntuacionObjetivo, id, descripcion, fecha, id_usuario, tipo) VALUES (4, 50, 2, '?Da 50 likes!', '2025-05-11T12:47:59.605Z', 1, 0);
INSERT INTO Desafio (puntos, puntuacionObjetivo, id, descripcion, fecha, id_usuario, tipo) VALUES (4, 100, 3, '?Da 100 likes!', '2025-05-11T12:47:59.605Z', 1, 0);
INSERT INTO Desafio (puntos, puntuacionObjetivo, id, descripcion, fecha, id_usuario, tipo) VALUES (1, 5, 4, '?Sube 5 fotos!', '2025-05-11T12:47:59.605Z', 1, 1);
INSERT INTO Desafio (puntos, puntuacionObjetivo, id, descripcion, fecha, id_usuario, tipo) VALUES (1, 10, 5, '?Sube 10 fotos!', '2025-05-11T12:47:59.605Z', 1, 1);
INSERT INTO Desafio (puntos, puntuacionObjetivo, id, descripcion, fecha, id_usuario, tipo) VALUES (1, 25, 6, '?Sube 25 fotos!', '2025-05-11T12:47:59.605Z', 1, 1);
INSERT INTO Desafio (puntos, puntuacionObjetivo, id, descripcion, fecha, id_usuario, tipo) VALUES (1, 5, 7, '?Escribe 5 comentarios!', '2025-05-11T12:47:59.605Z', 1, 2);
INSERT INTO Desafio (puntos, puntuacionObjetivo, id, descripcion, fecha, id_usuario, tipo) VALUES (1, 25, 8, '?Escribe 25 comentarios!', '2025-05-11T12:47:59.605Z', 1, 2);
INSERT INTO Desafio (puntos, puntuacionObjetivo, id, descripcion, fecha, id_usuario, tipo) VALUES (1, 50, 9, '?Escribe 50 comentarios!', '2025-05-11T12:47:59.605Z', 1, 2);
INSERT INTO Desafio (puntos, puntuacionObjetivo, id, descripcion, fecha, id_usuario, tipo) VALUES (0, 10, 10, '?Da 10 likes!', '2025-05-11T12:49:27.763Z', 2, 0);
INSERT INTO Desafio (puntos, puntuacionObjetivo, id, descripcion, fecha, id_usuario, tipo) VALUES (0, 50, 11, '?Da 50 likes!', '2025-05-11T12:49:27.763Z', 2, 0);
INSERT INTO Desafio (puntos, puntuacionObjetivo, id, descripcion, fecha, id_usuario, tipo) VALUES (0, 100, 12, '?Da 100 likes!', '2025-05-11T12:49:27.763Z', 2, 0);
INSERT INTO Desafio (puntos, puntuacionObjetivo, id, descripcion, fecha, id_usuario, tipo) VALUES (0, 5, 13, '?Sube 5 fotos!', '2025-05-11T12:49:27.763Z', 2, 1);
INSERT INTO Desafio (puntos, puntuacionObjetivo, id, descripcion, fecha, id_usuario, tipo) VALUES (0, 10, 14, '?Sube 10 fotos!', '2025-05-11T12:49:27.763Z', 2, 1);
INSERT INTO Desafio (puntos, puntuacionObjetivo, id, descripcion, fecha, id_usuario, tipo) VALUES (0, 25, 15, '?Sube 25 fotos!', '2025-05-11T12:49:27.763Z', 2, 1);
INSERT INTO Desafio (puntos, puntuacionObjetivo, id, descripcion, fecha, id_usuario, tipo) VALUES (0, 5, 16, '?Escribe 5 comentarios!', '2025-05-11T12:49:27.763Z', 2, 2);
INSERT INTO Desafio (puntos, puntuacionObjetivo, id, descripcion, fecha, id_usuario, tipo) VALUES (0, 25, 17, '?Escribe 25 comentarios!', '2025-05-11T12:49:27.763Z', 2, 2);
INSERT INTO Desafio (puntos, puntuacionObjetivo, id, descripcion, fecha, id_usuario, tipo) VALUES (0, 50, 18, '?Escribe 50 comentarios!', '2025-05-11T12:49:27.763Z', 2, 2);
INSERT INTO Desafio (puntos, puntuacionObjetivo, id, descripcion, fecha, id_usuario, tipo) VALUES (3, 10, 19, '?Da 10 likes!', '2025-05-11T12:50:03.466Z', 3, 0);
INSERT INTO Desafio (puntos, puntuacionObjetivo, id, descripcion, fecha, id_usuario, tipo) VALUES (3, 50, 20, '?Da 50 likes!', '2025-05-11T12:50:03.466Z', 3, 0);
INSERT INTO Desafio (puntos, puntuacionObjetivo, id, descripcion, fecha, id_usuario, tipo) VALUES (3, 100, 21, '?Da 100 likes!', '2025-05-11T12:50:03.466Z', 3, 0);
INSERT INTO Desafio (puntos, puntuacionObjetivo, id, descripcion, fecha, id_usuario, tipo) VALUES (0, 5, 22, '?Sube 5 fotos!', '2025-05-11T12:50:03.466Z', 3, 1);
INSERT INTO Desafio (puntos, puntuacionObjetivo, id, descripcion, fecha, id_usuario, tipo) VALUES (0, 10, 23, '?Sube 10 fotos!', '2025-05-11T12:50:03.466Z', 3, 1);
INSERT INTO Desafio (puntos, puntuacionObjetivo, id, descripcion, fecha, id_usuario, tipo) VALUES (0, 25, 24, '?Sube 25 fotos!', '2025-05-11T12:50:03.466Z', 3, 1);
INSERT INTO Desafio (puntos, puntuacionObjetivo, id, descripcion, fecha, id_usuario, tipo) VALUES (0, 5, 25, '?Escribe 5 comentarios!', '2025-05-11T12:50:03.466Z', 3, 2);
INSERT INTO Desafio (puntos, puntuacionObjetivo, id, descripcion, fecha, id_usuario, tipo) VALUES (0, 25, 26, '?Escribe 25 comentarios!', '2025-05-11T12:50:03.466Z', 3, 2);
INSERT INTO Desafio (puntos, puntuacionObjetivo, id, descripcion, fecha, id_usuario, tipo) VALUES (0, 50, 27, '?Escribe 50 comentarios!', '2025-05-11T12:50:03.466Z', 3, 2);
INSERT INTO Desafio (puntos, puntuacionObjetivo, id, descripcion, fecha, id_usuario, tipo) VALUES (3, 10, 28, '?Da 10 likes!', '2025-05-11T12:50:32.210Z', 4, 0);
INSERT INTO Desafio (puntos, puntuacionObjetivo, id, descripcion, fecha, id_usuario, tipo) VALUES (3, 50, 29, '?Da 50 likes!', '2025-05-11T12:50:32.210Z', 4, 0);
INSERT INTO Desafio (puntos, puntuacionObjetivo, id, descripcion, fecha, id_usuario, tipo) VALUES (3, 100, 30, '?Da 100 likes!', '2025-05-11T12:50:32.210Z', 4, 0);
INSERT INTO Desafio (puntos, puntuacionObjetivo, id, descripcion, fecha, id_usuario, tipo) VALUES (1, 5, 31, '?Sube 5 fotos!', '2025-05-11T12:50:32.210Z', 4, 1);
INSERT INTO Desafio (puntos, puntuacionObjetivo, id, descripcion, fecha, id_usuario, tipo) VALUES (1, 10, 32, '?Sube 10 fotos!', '2025-05-11T12:50:32.210Z', 4, 1);
INSERT INTO Desafio (puntos, puntuacionObjetivo, id, descripcion, fecha, id_usuario, tipo) VALUES (1, 25, 33, '?Sube 25 fotos!', '2025-05-11T12:50:32.210Z', 4, 1);
INSERT INTO Desafio (puntos, puntuacionObjetivo, id, descripcion, fecha, id_usuario, tipo) VALUES (2, 5, 34, '?Escribe 5 comentarios!', '2025-05-11T12:50:32.210Z', 4, 2);
INSERT INTO Desafio (puntos, puntuacionObjetivo, id, descripcion, fecha, id_usuario, tipo) VALUES (2, 25, 35, '?Escribe 25 comentarios!', '2025-05-11T12:50:32.210Z', 4, 2);
INSERT INTO Desafio (puntos, puntuacionObjetivo, id, descripcion, fecha, id_usuario, tipo) VALUES (2, 50, 36, '?Escribe 50 comentarios!', '2025-05-11T12:50:32.210Z', 4, 2);



INSERT INTO Fotos (id, nombre, descripcion, fecha, puntuacion, estado, id_usuario, id_foro, contenido) VALUES (1, 'Dusk', 'Why not', '2025-05-11T13:04:11.301Z', 4, 'Visible', 'PRTS', NULL, 'b5d5d43bd574db75558a0c45e8409c23');
INSERT INTO Fotos (id, nombre, descripcion, fecha, puntuacion, estado, id_usuario, id_foro, contenido) VALUES (2, 'Happy 6th anniversary', 'Ready for more', '2025-05-11T13:05:31.129Z', 3, 'Visible', 'Theresa', NULL, '345fa7ef6a26c5af7382a5f3536bf1d8');


INSERT INTO Productos (id, nombre, descripcion, precio, imagen, estado, usuario_id, fecha_creacion) VALUES (1, 'Last view', 'I will wait you until the end of the time', 100.0, '6b0844200828c817c80f3e3be2cb4205', 'S', 1, '2025-05-11 13:01:06');
INSERT INTO Productos (id, nombre, descripcion, precio, imagen, estado, usuario_id, fecha_creacion) VALUES (2, 'The last Texas', 'Texas x Lappland', 150.0, '7267c91f51bdb9b6a0522429cfd813d4', 'P', 4, '2025-05-11 13:01:45');



COMMIT TRANSACTION;
PRAGMA foreign_keys = on;