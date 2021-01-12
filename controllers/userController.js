const validator = require('validator');
const userModel = require('../models/userModel');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const service = require('../services');
const path = require('path');
const chapterModel = require('../models/chapterModel');
const articleModel = require('../models/articleModel');


const controller = {
    //------------------------Mostrar articulos por usuario con populate---------------------------------
    getArticlesPopulate: (req, res) => {

        const userId = req.params.id;

        if (!userId || userId == null || userId == undefined) {
            return res.status(404).send({
                status: 'error',
                message: 'Usuario no existe'
            });
        }

        userModel.findOne({ _id: userId }).populate({ path: 'article', options: { sort: { date: -1 } } }).exec((err, user) => {
            if (err) {
                return res.status(404).send({
                    status: 'error',
                    message: 'Error en la consulta',
                    err
                });
            }

            return res.status(200).send({
                status: 'success',
                user
            });
        });
    },

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

            const userM = new userModel();

            //Numero de saltos para el hash
            const bcrypt_salts = 12;

            userM.name = params.name;
            userM.lastname = params.lastname;
            userM.email = params.email;
            userM.user = params.user;
            userM.password = params.password;
            userM.prefreader = params.prefreader;

            //Utilizamos la funcion hash() le pasamos el dato a encriptar y los saltos, la promesa nos devuelve el dato encriptado
            bcrypt.hash(userM.password, bcrypt_salts).then((hashedPassword) => {
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

        const filename = req.params.image;
        const filepath = './images/imgusers/' + filename;

        if (!filename || filename === null) {
            return res.status(200).send({
                status: 'success',
                message: 'el usuario no tiene imagen'
            });
        }

        fs.exists(filepath, (exists) => {
            if (exists) {
                return res.sendFile(path.resolve(filepath));
            } else {
                return res.status(200).send({
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

    //------------------------Listar usuario con token------------------------------------------------
    getUserToken: (req, res) => {
        const token = req.params.token;

        if (!token || token == undefined || token == null) {
            return res.status(404).send({
                status: 'error',
                message: 'Token no encontrado'
            });
        }

        userModel.findOne({ token: token }).populate({ path: 'notify'}).exec((err, user) => {
            if (err) {
                return res.status(404).send({
                    status: 'error',
                    message: 'Error en la consulta'
                });
            }

            if (!user || user == null || user == undefined) {
                return res.status(200).send({
                    message: 'No hay usuario logeado'
                });
            }

            return res.status(200).send({
                status: 'success',
                user
            });
        });
    },

    //------------------------Listar usuario----------------------------------------------------------
    getUser: (req, res) => {
        const userId = req.params.id;

        if (!userId || userId == null || userId == undefined) {
            return res.status(404).send({
                status: 'error',
                message: 'Usuario no encontrado'
            });
        }
        userModel.findOne({ _id: userId }, (err, user) => {
            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'No se ha podido cargar el usuario'
                });
            }
            if (!user) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay usuario'
                }); 
            }
            return res.status(200).send({
                status: 'success',
                user
            });

        });

    },

    //------------------------Listar usuario por libro------------------------------------------------
    getUserXArticle: (req, res) => {

        const articleId = req.params.id;
        const reader = req.params.reader;

        if (!articleId || articleId == null || articleId == undefined) {
            return res.status(404).send({
                status: 'error',
                message: 'Articulo no encontrado'
            });
        }

        if (reader === 'true') {
            articleModel.findOne({ chapter: articleId }).exec((err, article) => {

                if (err) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'Error en la consulta..'
                    })
                }

                if (!article) {
                    return res.status(200).send({
                        status: 'success',
                        message: 'No hay articulo con ese id...'
                    })
                }

                userModel.findOne({ article: article._id}).exec((err, user) => {
                    if (err) {
                        return res.status(404).send({
                            status: 'error',
                            message: 'Error en la consulta..'
                        })
                    }

                    if (!user) {
                        return res.status(200).send({
                            status: 'success',
                            message: 'No hay articulo con ese id...'
                        })
                    }

                    return res.status(200).send({
                        status: 'success',
                        user
                    });
                });
            });
        }else{
            userModel.findOne({ article: articleId }).exec((err, user) => {
                if (err) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'Error al realizar la consulta',
                        err
                    });
                }

                if (!user) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'No esta llegando usuario',
                        user
                    });
                }

                return res.status(200).send({
                    status: 'success',
                    user
                });
            });
        }

        
    },

    getUserXEmail: (req, res) => {
        const email = req.params.email;
        var emailOk = null;

        if (!email || email == null || email == undefined) {
            return res.status(404).send({
                status: 'error',
                message: 'No hay email para buscar'
            });
        }

        userModel.findOne({ email: email }).exec((err, user) => {
            if (err) {
                return res.status(400).send({
                    status: 'error',
                    message: 'Usuario no encontrado'
                });
            }

            if (!user || user == null || user == undefined) {
                emailOk = true;
                return res.status(200).send({
                    status: 'success',
                    emailOk
                });
            }
            emailOk = false;
            return res.status(200).send({
                status: 'success',
                emailOk
            });
        });
    },

    //------------------------Actualizar usuario---------------------------------------------------------
    updateUser: (req, res) => {
        
        const userId = req.params.id;
        const params = req.body;
    
        userModel.findOneAndUpdate({ _id: userId }, params, { new: true }, (err, userUpdated) => {
            if (err) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No se ha podido actualizar el usuario',
                    error: err
                });
            } else if (!userUpdated) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No devuelve usuario actualizado...'
                });
            }else{
                return res.status(200).send({
                    status: 'success',
                    user: userUpdated
                });
            }
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
            }

            if (userRemoved.image) {
                fs.unlink("./images/imgusers/" + userRemoved.image, (err) => {
                    if (err) {
                        return res.status(400).send({
                            status: 'error',
                            message: 'Error al eliminar la imagen del usuario',
                            err
                        });
                    }

                    return res.status(200).send({
                        status: 'success',
                        message: 'Usuario eliminado con su imagen',
                        user: userRemoved
                    });
                });
            } else {
                return res.status(200).send({
                    status: 'success',
                    message: 'Usuario eliminado',
                    user: userRemoved
                });
            }





        });
    },

    //------------------------Login-------------------------------------------------------------------
    login: (req, res) => {

        const userLoad = {};
        userModel.findOne({ email: req.body.email }, (err, userload) => {
            this.userLoad = userload;
            if (!userload) {
                return res.status(404).send({
                    status: 'Error',
                    message: 'El usuario no existe o email no encontrado!!'
                });
            } else if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al traer el email'
                });
            }


            bcrypt.compare(req.body.password, userload.password).then((samePassword) => {
                if (!samePassword) {
                    return res.status(403).send({
                        status: 'error',
                        message: 'La contraseña no coincide con la asociada con el email ingresado'
                    });
                } else {

                    const updated = {
                        $set: {
                            token: service.createToken(userLoad)
                        }
                    };

                    userModel.findOneAndUpdate({ email: req.body.email }, updated, { new: true }, (err, userUpdated) => {
                        if (err) {
                            return res.status(404).send({
                                status: 'error',
                                message: 'Error en la consulta de actualizar token'
                            });
                        }
                        if (!userUpdated || userUpdated == null || userUpdated == undefined) {
                            return res.status(404).send({
                                status: 'error',
                                message: 'El usuario actualizado con el token no llega'
                            });
                        }

                        return res.status(200).send({
                            status: 'success',
                            userUpdated
                        });
                    });

                }
            });
        });
    }

};

module.exports = controller;