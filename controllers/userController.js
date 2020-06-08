const validator = require('validator');
const userModel = require('../models/userModel');
const fs = require('fs');
const bcrypt = require('bcrypt');
const service = require('../services');


const controller = {

    //------------------------Guardar usuario-----------------------------------------------------------
    saveUser: (req, res) => {

        let params = req.body;

        try {
            var validate_name = !validator.isEmpty(params.name);
            var validate_lastname = !validator.isEmpty(params.lastname);
            var validate_email = !validator.isEmpty(params.email);
            var validate_user = !validator.isEmpty(params.user);
            var validate_password = !validator.isEmpty(params.password);
        } catch (err) {
            return res.status(404).send({
                status: 'error',
                message: 'Faltan datos por enviar',
                error: err
            });
        }

        if (validate_name && validate_lastname && validate_email && validate_user && validate_password) {

            var userM = new userModel();
            var bcrypt_salts = 12;//Numero de saltos para el hash

            userM.name = params.name;
            userM.lastname = params.lastname;
            userM.image = '';
            userM.email = params.email;
            userM.user = params.user;
            userM.password = params.password;

            bcrypt.hash(userM.password, bcrypt_salts).then((hashedPassword) => {//Utilizamos la funcion hash() le pasamos el dato a encriptar y los saltos, la promesa nos devuelve el datos encriptado
                userM.password = hashedPassword;
                userM.save((err, userStored) => {

                    if (err || !userStored) {
                        return res.status(404).send({
                            status: 'error',
                            message: 'Error al guardar el usuario',
                            error: err
                        });
                    } else {
                        return res.status(200).send({
                            status: 'success',
                            userStored,
                            token: service.createToken(userStored)
                        });
                    }
                });
               
            }).catch((err) => {
                return res.status(404).send({
                    status: 'error',
                    message: 'Error al encriptar la contraseña del usuario',
                    err
                });
            })
        } else {
            return res.status(404).send({
                status: 'error',
                message: 'Datos no validos'

            });
        }
    },

    //------------------------Guardar imagen de usuario--------------------------------------------
    uploadImage: (req, res) => {

        if (!req.file) {
            return res.status(404).send({
                status: 'error',
                message: 'Imagen no subida...'
            });
        }

        var file_name = req.file.filename;
        var file_path = req.file.path;
        var original_name = req.file.originalname;
        var name_split = original_name.split('.');
        var img_extens = name_split[1];

        if (img_extens != 'png' && img_extens != 'jpg' && img_extens != 'jpeg' && img_extens != 'gif') {

            fs.unlink(file_path, (err) => {
                return res.status(404).send({
                    status: 'error',
                    message: 'formato de imagen a subir no valido....',
                    format: img_extens
                });
            });
        } else {

            var userId = req.params.id;

            userModel.findOneAndUpdate({ _id: userId }, { image: file_name }, { new: true }, (err, userUpdated) => {


                if (err || !userUpdated) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error al guardar la imagen'
                    });
                } else {
                    return res.status(200).send({
                        status: 'success',
                        article: userUpdated
                    });
                }
            });
        }
    },

    //------------------------Mostrar imagen de usuario------------------------------------------------
    getCoverImageUser: (req, res) => {

        var filename = req.params.image;
        var filepath = './images/imgusers/' + filename;

        fs.exists(filepath, (exists) => {
            if (exists) {
                return res.sendFile(path.resolve(filepath));
            } else {
                return res.status(200).send({
                    status: 'error',
                    message: 'El archivo no existe...'
                });
            }
        });
    },

    //------------------------Listar usuarios------------------------------------------------------
    getUsers: (req, res) => {
        userModel.find({}).sort('name').exec((err, users) => {
            if (err || !users) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error la devolver los usuarios',
                    err: err,
                    users: users
                });
            } else {
                return res.status(200).send({
                    status: 'success',
                    users: users
                });
            }
        });
    },

    //------------------------Listar usuario----------------------------------------------------------
    getUser: (req, res) => {
        var userId = req.params.id;

        if (!userId || userId == null || userId == undefined) {
            return res.status(404).send({
                status: 'error',
                message: 'Usuario no encontrado'
            });
        } else {
            userModel.findById(userId, (err, user) => {
                if (err || !user) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'No se ha podido cargar el usuario'
                    });
                } else {
                    return res.status(200).send({
                        status: 'success',
                        user: user
                    });
                }
            });
        }
    },

    //------------------------Actualizar usuario---------------------------------------------------------
    updateUser: (req, res) => {

        var userId = req.params.id;
        var params = req.body;
        var salts = 12;

        bcrypt.hash( params.password, salts).then((hashedPassword)=>{
            params.password = hashedPassword
            userModel.findOneAndUpdate({ _id: userId }, params, { new: true }, (err, userUpdated) => {
                if (err || !userUpdated) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'No se ha podido actualizar el usuario'
                    });
                } else {
                    return res.status(200).send({
                        status: 'success',
                        user: userUpdated
                    });
                }
            });
        }).catch((err)=>{
            return res.status(404).send({
                status: 'error',
                message: 'Error al encriptar la contraseña',
                err
            });
        });

        
    },

    //------------------------Eliminar usuario--------------------------------------------------------
    deleteUser: (req, res) => {
        var userId = req.params.id;

        userModel.findOneAndDelete({ _id: userId }, (err, userRemoved) => {
            if (err || !userRemoved) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No se ha podido borrar le usuario seleccionado'
                });
            } else {
                return res.status(200).send({
                    status: 'success',
                    user: userRemoved
                });
            }
        });
    },

    //------------------------Login-------------------------------------------------------------------
    login: (req, res) => {
    
        userModel.findOne({ email: req.body.email.toLowerCase()}, (err, userload)=>{

            if (!userload) {
                return res.status(404).send({
                    status: 'Error',
                    message: 'El usuario no existe o email no encontrado!!'
                });
            }else if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al traer el email'
                });
            }


            bcrypt.compare(req.body.password, userload.password).then((samePassword)=>{
                if (!samePassword) {
                    return res.status(403).send({
                        status: 'error',
                        message: 'La contraseña no coincide con la asociada con el email ingresado'
                    });
                }else{
                    return res.status(200).send({
                        status: 'success',
                        token: service.createToken(userload)
                    });
                }
            });
        });
    }

};

module.exports = controller;