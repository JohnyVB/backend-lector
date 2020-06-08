const mongoose = require('mongoose');
const validator = require('validator');

const UsuarioSchema = new mongoose.Schema({

    name: { 
        type: String 
    },
    lastname: { 
        type: String 
    },
    image: { 
        type: String 
    },
    email: { 
        type: String, 
        unique: true, 
        required: true,
        lowercase: true,
        validate: value => {
            if (!validator.isEmail(value)) {
                throw new Error({ error: 'Invalid Email address' })
            }
        } 
    },
    regdate: { 
        type: Date, 
        default: Date.now 
    },
    user: { 
        type: String, 
        unique: true, 
        required: true 
    },
    password: { 
        type: String, 
        required: true 
    }
});



module.exports = mongoose.model('Users', UsuarioSchema);