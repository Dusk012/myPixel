import { Usuario } from "./usuarios/usuarios.js";
import { Foto } from "./imagenes/imagenes.js";

export function inicializaModelos(db) {
    Usuario.initStatements(db);
    Foto.initStatements(db);
}