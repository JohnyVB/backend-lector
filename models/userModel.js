const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({

    //Nombres del usuario/autor
    name: String,
    //Apellidos del usuario/autor
    lastname: String,
    //Biografia del usuario
    biography: { type: String, default: 'Acerca de mi' },
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
    state: { type: Boolean, default: false },
    //Rol de usuario
    role: { type: String, default: "user-role" },
    //Preferencia de lectura opciones: paginada | cascada
    reader: { type: Boolean, default: false },
    //Numero de validación para registro nuevo
    validatorNumber: { type: Number, default: null},
    //Fecha de registro del usuario/autor
    date: { type: Date, default: Date.now }
});

UsuarioSchema.methods.toJSON = function(){
    const { __v, password, ...usuario } = this.toObject();
    return usuario;
}

module.exports = mongoose.model('User', UsuarioSchema);