const mongoose = require('mongoose');
const validator = require('validator');

const UsuarioSchema = new mongoose.Schema({

    //Nombres del usuario/autor
    name: String,
    //Apellidos del usuario/autor
    lastname: String,
    //Imagen del usuario/autor
    image: { type: String, default: ""},
    //Libros publicados del usuario/autor
    article: [{ type: mongoose.Schema.Types.ObjectId, ref: "Article", default: ""}],
    //Email del usuario/autor
    email: { 
        type: String, 
        unique: true, 
        required: true,
        lowercase: true,
        validate: (value) => {
            if (!validator.isEmail(value)) {
                return status(400).send({
                    status: "error",
                    message: "Direccion email incorrecto"
                });
            }
        } 
    },
    //token
    token: {type: String, default: ""},
    //Rol de usuario
    role: {type: String, default: "user"},
    //Preferencia de lectura opciones: paginada | cascada
    prefreader: {type: String, default: "paginada"},
    //Fecha de registro del usuario/autor
    regdate: { type: Date, default: Date.now },
    //Nombre de usuario del usuario/autor
    user: { type: String, unique: true, required: true},
    //Contraseña del usuario/autor
    password: { type: String, required: true }
});



module.exports = mongoose.model('User', UsuarioSchema);