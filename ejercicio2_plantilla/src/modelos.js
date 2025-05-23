import { Usuario } from "./usuarios/usuarios.js";
import { Foto } from "./imagenes/imagenes.js";
import { Forum, ForumMessage } from "./mensajes/comentarios.js";
import { Desafio } from "./contenido/desafios.js";
import { ShopProduct } from "./shop/shop.js"; 

export function inicializaModelos(db) {
    Usuario.initStatements(db);
    Foto.initStatements(db);
    Forum.initStatements(db);
    ForumMessage.initStatements(db);
    Desafio.initStatements(db);
    ShopProduct.initStatements(db);
}