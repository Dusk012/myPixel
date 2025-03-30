import { Usuario } from "./usuarios/usuarios.js";
import { Foto } from "./usuarios/imagenes.js";
//import { Foro } from "./mensajes/mensajes.js";

export function inicializaModelos(db) {
    Usuario.initStatements(db);
    Foto.initStatements(db);
    //Foro.initStatements(db);
}