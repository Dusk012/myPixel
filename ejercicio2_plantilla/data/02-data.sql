BEGIN TRANSACTION;
INSERT INTO "Usuarios" ("id","username","password","rol","nombre","nivel","reputacion","estado","fecha_registro","foto_perfil") VALUES (1,'user','$2b$10$JdCg8yL3rRkkr.hhx1rjqOe30F9lhBlqA1sjYJW6ymzYExvQFHyjy','U','Usuario',1,0,'ACTIVO',NULL,NULL);
INSERT INTO "Usuarios" ("id","username","password","rol","nombre","nivel","reputacion","estado","fecha_registro","foto_perfil") VALUES (2,'admin','$2b$10$Htah5iG9eKj8ItIItpzK6uvny3c5/QjdZaLwwmFy32RPrfVspNgYS','A','Administrador',1,0,'ACTIVO',NULL,NULL);
INSERT INTO "Usuarios" ("id","username","password","rol","nombre","nivel","reputacion","estado","fecha_registro","foto_perfil") VALUES (7,'alexiito','$2b$10$ZDo6/TwJYjkE/H5eMMR5TuJvpms8gefQKgYT5hcqTo1YmKdeYeb.W','U','AlejandroGB',1,0,'ACTIVO',NULL,NULL);
INSERT INTO "Usuarios" ("id","username","password","rol","nombre","nivel","reputacion","estado","fecha_registro","foto_perfil") VALUES (8,'asdfgh','$2b$10$8meMcQYW.fUDvm7uGgoC4OtY/Rr99epSbYurlrWhjAJ8M3HWR9Pd2','U','asdfgh',1,0,'ACTIVO',NULL,NULL);
INSERT INTO "Usuarios" ("id","username","password","rol","nombre","nivel","reputacion","estado","fecha_registro","foto_perfil") VALUES (9,'11111','$2b$10$ghaXQt.s7OH.ryJ07cC7reoPbZUDJxLE6MoLl8j.ABqbR.HEAe1qW','U','11111',1,0,'ACTIVO',NULL,NULL);
INSERT INTO "Usuarios" ("id","username","password","rol","nombre","nivel","reputacion","estado","fecha_registro","foto_perfil") VALUES (11,'123456','$2b$10$rzuIv4rIf1NcHgq.dsn0DezMOjr0Lslf8JPUzTVGhmqaVO3UDgj8G','U','123456',1,0,'ACTIVO',NULL,NULL);
COMMIT;
