import { Usuario } from "./usuarios/usuarios.js";
import { Foto } from "./usuarios/imagenes.js";
import { Forum, ForumMessage } from "./mensajes/comentarios.js";

export function inicializaModelos(db) {
    Usuario.initStatements(db);
    Foto.initStatements(db);
    Forum.initStatements(db);
    ForumMessage.initStatements(db);
}