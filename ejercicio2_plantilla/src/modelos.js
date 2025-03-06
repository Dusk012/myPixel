import { Usuario } from "./usuarios/usuarios.js";

export function inicializaModelos(db) {
    Usuario.initStatements(db);
}