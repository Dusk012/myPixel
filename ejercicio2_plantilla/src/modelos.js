import { Usuario } from "./usuarios/usuarios.js";
import { Foto } from "./usuarios/imagenes.js";

export function inicializaModelos(db) {
    Usuario.initStatements(db);
    Foto.initStatements(db);
}