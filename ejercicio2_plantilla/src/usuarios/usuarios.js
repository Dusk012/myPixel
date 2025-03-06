import bcrypt from "bcryptjs";

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
        this.#insertStmt = db.prepare('INSERT INTO Usuarios(username, password, nombre, rol) VALUES (@username, @password, @nombre, @rol)');
        this.#updateStmt = db.prepare('UPDATE Usuarios SET username = @username, password = @password, rol = @rol, nombre = @nombre WHERE id = @id');
    }

    static getUsuarioByUsername(username) {
        const usuario = this.#getByUsernameStmt.get({ username });
        if (usuario === undefined) throw new UsuarioNoEncontrado(username);

        console.log("Creo un usuario (otra vez)");
        const { password, rol, nombre, id } = usuario;

        return new Usuario(username, password, nombre, rol, id);
    }

    static #insert(usuario) {
        console.log("insert entrado")
        let result = null;
        try {
            const username = usuario.#username;
            const password = usuario.#password;
            const nombre = usuario.nombre;
            const rol = usuario.rol;
            const datos = {username, password, nombre, rol};

            result = this.#insertStmt.run(datos);

            usuario.#id = result.lastInsertRowid;
        } catch(e) { // SqliteError: https://github.com/WiseLibs/better-sqlite3/blob/master/docs/api.md#class-sqliteerror
            if (e.code === 'SQLITE_CONSTRAINT') {
                throw new UsuarioYaExiste(usuario.#username);
            }
            throw new ErrorDatos('No se ha insertado el usuario', { cause: e });
        }
        return usuario;
    }

    static #update(usuario) {
        console.log("Update entrado")
        const username = usuario.#username;
        const password = usuario.#password;
        const nombre = usuario.nombre;
        const rol = usuario.rol;
        const datos = {username, password, nombre, rol};

        const result = this.#updateStmt.run(datos);
        if (result.changes === 0) throw new UsuarioNoEncontrado(username);

        return usuario;
    }


    static login(username, password) {
        console.log("Entro en login");
        let usuario = null;
        try {
            usuario = this.getUsuarioByUsername(username);
        } catch (e) {
            console.log("He cascado :(");
            console.log(e);
            throw new UsuarioOPasswordNoValido(username, { cause: e });
        }
        console.log("Todo ha ido bien de momento :D");
        // XXX: En el ej3 / P3 lo cambiaremos para usar async / await o Promises
        //if ( ! bcrypt.compareSync(password, usuario.#password) ) throw new UsuarioOPasswordNoValido(username);

        return usuario;
    }

    #id;
    #username;
    #password;
    rol;
    nombre;

    constructor(username, password, nombre, rol = RolesEnum.USUARIO, id = null) {
        this.#username = username;
        this.#password = password;
        this.nombre = nombre;
        this.rol = rol;
        this.#id = id;
    }

    get id() {
        return this.#id;
    }

    set password(nuevoPassword) {
        // XXX: En el ej3 / P3 lo cambiaremos para usar async / await o Promises
        this.#password = bcrypt.hashSync(nuevoPassword);
    }

    get username() {
        return this.#username;
    }

    persist() {
        console.log("Persist entrado")
        if (this.#id === null) return Usuario.#insert(this);
        return Usuario.#update(this);
    }

    static registrar(username, password, confirmPassword, nombre, rol = RolesEnum.USUARIO) {
        // Validar que las contraseñas coincida
        console.log("estoy en registrar")
        if (password !== confirmPassword) {
            throw new Error('Las contraseñas no coinciden');
        }
    
        // Encriptar la contraseña antes de guardarla
        const hashedPassword = bcrypt.hashSync(password, 10); // Usar un salt de 10
    
        const usuario = this.#getByUsernameStmt.get({ username });
        if (usuario !== undefined) throw new UsuarioYaExiste(username);
        console.log("No esta el usuario");
        const id = null;
        // Crear una nueva instancia de Usuario
        const nuevoUsuario = new Usuario(username, password, nombre, rol, id);
        console.log("He construido el usuario y llamare a persist.")
        // Persistir el usuario en la base de datos
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