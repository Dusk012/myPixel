import bcrypt from "bcryptjs";
import { ErrorDatos } from "../db.js";

export const RolesEnum = Object.freeze({
    USUARIO: 'U',
    ADMIN: 'A'
});

export class Usuario {
    static #getByUsernameStmt = null;
    static #insertStmt = null;
    static #updateStmt = null;

    static initStatements(db) {
        if (this.#getByUsernameStmt !== null) return;

        this.#getByUsernameStmt = db.prepare('SELECT * FROM Usuarios WHERE username = @username');
        this.#insertStmt = db.prepare('INSERT INTO Usuarios(username, password, nombre, rol, foto_perfil) VALUES (@username, @password, @nombre, @rol, @foto_perfil)');
        this.#updateStmt = db.prepare('UPDATE Usuarios SET username = @username, password = @password, rol = @rol, nombre = @nombre, foto_perfil = @foto_perfil WHERE id = @id');
    }

    static getUsuarioByUsername(username) {
        const usuario = this.#getByUsernameStmt.get({ username });
        if (usuario === undefined) throw new UsuarioNoEncontrado(username);

        const { password, rol, nombre, id, foto_perfil } = usuario;

        return new Usuario(username, password, nombre, rol, id, foto_perfil);
    }

    static #insert(usuario) {
        let result = null;
        try {
            const username = usuario.#username;
            const password = usuario.#password;
            const nombre = usuario.nombre;
            const rol = usuario.rol;
            const foto_perfil = usuario.foto_perfil;
            const datos = { username, password, nombre, rol, foto_perfil };

            result = this.#insertStmt.run(datos);

            usuario.#id = result.lastInsertRowid;
        } catch (e) {
            if (e.code === 'SQLITE_CONSTRAINT') {
                throw new UsuarioYaExiste(usuario.#username);
            }
            throw new ErrorDatos('No se ha insertado el usuario', { cause: e });
        }
        return usuario;
    }

    static #update(usuario) {
        const username = usuario.#username;
        const password = usuario.#password;
        const nombre = usuario.nombre;
        const rol = usuario.rol;
        const foto_perfil = usuario.foto_perfil;
        const datos = { username, password, nombre, rol, foto_perfil, id: usuario.#id };

        const result = this.#updateStmt.run(datos);
        if (result.changes === 0) throw new UsuarioNoEncontrado(username);

        return usuario;
    }

    static async login(username, password) {
        let usuario = null;
        try {
            usuario = this.getUsuarioByUsername(username);
        } catch (e) {
            throw new UsuarioOPasswordNoValido(username, { cause: e });
        }

        const passwordMatch = await bcrypt.compare(password, usuario.#password);
        if (!passwordMatch) throw new UsuarioOPasswordNoValido(username);

        return usuario;
    }

    #id;
    #username;
    #password;
    rol;
    nombre;
    foto_perfil;

    constructor(username, password, nombre, rol = RolesEnum.USUARIO, id = null, foto_perfil = 1) {
        this.#username = username;
        this.#password = password;
        this.nombre = nombre;
        this.rol = rol;
        this.#id = id;
        this.foto_perfil = foto_perfil ?? 1; // valor por defecto es 1
    }

    get id() {
        return this.#id;
    }

    async cambiaPassword(nuevoPassword) {
        this.#password = bcrypt.hashSync(nuevoPassword);
    }

    get username() {
        return this.#username;
    }

    persist() {
        if (this.#id === null) {
            return Usuario.#insert(this);
        }
    
        // Actualizamos en la base de datos
        const updatedUsuario = Usuario.#update(this);
    
        // Actualizamos el valor de foto_perfil en el objeto actual
        this.foto_perfil = updatedUsuario.foto_perfil;
    
        return updatedUsuario;
    }

    static registrar(username, password, confirmPassword, nombre, rol = RolesEnum.USUARIO) {
        if (password !== confirmPassword) {
            throw new Error('Las contraseñas no coinciden');
        }

        const hashedPassword = bcrypt.hashSync(password, 10);

        const usuario = this.#getByUsernameStmt.get({ username });
        if (usuario !== undefined) throw new UsuarioYaExiste(username);

        const id = null;
        const foto_perfil = 1; // Valor por defecto
        const nuevoUsuario = new Usuario(username, hashedPassword, nombre, rol, id, foto_perfil);

        return nuevoUsuario.persist();
    }
}

export class UsuarioNoEncontrado extends Error {
    /**
     * 
     * @param {string} username 
     * @param {ErrorOptions} [options]
     */
    constructor(username, options) {
        super(`Usuario no encontrado: ${username}`, options);
        this.name = 'UsuarioNoEncontrado';
    }
}

export class UsuarioOPasswordNoValido extends Error {
    /**
     * 
     * @param {string} username 
     * @param {ErrorOptions} [options]
     */
    constructor(username, options) {
        super(`Usuario o password no válido: ${username}`, options);
        this.name = 'UsuarioOPasswordNoValido';
    }
}


export class UsuarioYaExiste extends Error {
    /**
     * 
     * @param {string} username 
     * @param {ErrorOptions} [options]
     */
    constructor(username, options) {
        super(`Usuario ya existe: ${username}`, options);
        this.name = 'UsuarioYaExiste';
    }
}
