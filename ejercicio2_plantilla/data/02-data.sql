BEGIN TRANSACTION;
INSERT INTO "Comentarios" ("id","id_foro","contenido","fecha","id_usuario") VALUES (1,2,'Hola','2025-04-07T20:50:21.202Z',1);
INSERT INTO "Foros" ("id","titulo","descripcion","estado") VALUES (1,'Público','Es un foro para hablar de cosas.','Activo');
INSERT INTO "Foros" ("id","titulo","descripcion","estado") VALUES (2,'Principal','Este es el foro de la materia principal.','Activo');
INSERT INTO "Fotos" ("id","nombre","descripcion","fecha","puntuacion","estado","id_usuario","id_foro","contenido") VALUES (3,'Imagen 1','primera imagen','2025-04-07T21:44:27.678Z',0,'Visible','user',NULL,'8a0ce773f13a0752cf6c358af97c8188');
INSERT INTO "Fotos" ("id","nombre","descripcion","fecha","puntuacion","estado","id_usuario","id_foro","contenido") VALUES (4,'Imagen 2','segunda imagen','2025-04-07T21:44:48.984Z',0,'Visible','user',NULL,'e68a0156f550b13aa96e7273a121bdf8');
INSERT INTO "Fotos" ("id","nombre","descripcion","fecha","puntuacion","estado","id_usuario","id_foro","contenido") VALUES (5,'Imagen 3','tercera imagen','2025-04-07T21:45:00.764Z',0,'Visible','user',NULL,'1c69d10bd1736914234c95a44dee6fb1');
INSERT INTO "Usuarios" ("id","username","password","rol","nombre","nivel","reputacion","estado","fecha_registro","foto_perfil") VALUES (1,'user','$2b$10$JdCg8yL3rRkkr.hhx1rjqOe30F9lhBlqA1sjYJW6ymzYExvQFHyjy','U','Usuario',1,0,'ACTIVO',NULL,1);
INSERT INTO "Usuarios" ("id","username","password","rol","nombre","nivel","reputacion","estado","fecha_registro","foto_perfil") VALUES (2,'admin','$2b$10$Htah5iG9eKj8ItIItpzK6uvny3c5/QjdZaLwwmFy32RPrfVspNgYS','A','Administrador',1,0,'ACTIVO',NULL,2);
COMMIT;
