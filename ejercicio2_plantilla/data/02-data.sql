BEGIN TRANSACTION;
INSERT INTO "Usuarios" ("id","username","password","rol","nombre","nivel","reputacion","estado","fecha_registro","foto_perfil") VALUES (1,'user','$2b$10$JdCg8yL3rRkkr.hhx1rjqOe30F9lhBlqA1sjYJW6ymzYExvQFHyjy','U','Usuario',1,0,'ACTIVO',NULL,1);
INSERT INTO "Usuarios" ("id","username","password","rol","nombre","nivel","reputacion","estado","fecha_registro","foto_perfil") VALUES (2,'admin','$2b$10$Htah5iG9eKj8ItIItpzK6uvny3c5/QjdZaLwwmFy32RPrfVspNgYS','A','Administrador',1,0,'ACTIVO',NULL,1);
COMMIT;
