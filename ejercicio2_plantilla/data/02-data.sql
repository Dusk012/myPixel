BEGIN TRANSACTION;
INSERT INTO "Fotos" ("id","nombre","descripcion","fecha","puntuacion","estado","id_usuario","id_foro","contenido") VALUES (1,'Daniel','primera imagen','2025-04-04T08:04:21.058Z',0,'Visible','user',NULL,'10afed8ace52bb89fbfc04eb96152f85');
INSERT INTO "Fotos" ("id","nombre","descripcion","fecha","puntuacion","estado","id_usuario","id_foro","contenido") VALUES (2,'Daniel','segunda imagen','2025-04-04T08:06:05.254Z',0,'Visible','admin',NULL,'256d2399cb21208ee57280cbd0d66aa9');
INSERT INTO "Usuarios" ("id","username","password","rol","nombre","nivel","reputacion","estado","fecha_registro","foto_perfil") VALUES (1,'user','$2b$10$JdCg8yL3rRkkr.hhx1rjqOe30F9lhBlqA1sjYJW6ymzYExvQFHyjy','U','Usuario',1,0,'ACTIVO',NULL,NULL);
INSERT INTO "Usuarios" ("id","username","password","rol","nombre","nivel","reputacion","estado","fecha_registro","foto_perfil") VALUES (2,'admin','$2b$10$Htah5iG9eKj8ItIItpzK6uvny3c5/QjdZaLwwmFy32RPrfVspNgYS','A','Administrador',1,0,'ACTIVO',NULL,NULL);
COMMIT;
