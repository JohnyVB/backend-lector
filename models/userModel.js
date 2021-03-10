const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({

    //Nombres del usuario/autor
    name: String,
    //Apellidos del usuario/autor
    lastname: String,
    //Email del usuario/autor
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
    },
    //Contraseña del usuario/autor
    password: { type: String, required: true },
    //Imagen del usuario/autor
    image: { type: String, default: null},
    //Estado
    state: { type: Boolean, default: true },
    //Rol de usuario
    role: { type: String, default: "user-role" },
    //Preferencia de lectura opciones: paginada | cascada
    reader: { type: Boolean, default: false },
    //Fecha de registro del usuario/autor
    date: { type: Date, default: Date.now }
});

UsuarioSchema.methods.toJSON = function(){
    const { __v, password, _id, ...usuario } = this.toObject();
    return usuario;
}

module.exports = mongoose.model('User', UsuarioSchema);