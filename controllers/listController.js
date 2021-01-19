const userModel = require('../models/userModel');
const listModel = require('../models/listModel');
const notifyModel = require('../models/notifyModel');
const controller = {

    getList: (req, res) => {
        const userid = req.params.id;

        if (!userid) {
            return res.status(404).send({
                status: 'error',
                message: 'No hay id de usuario'
            });
        }

        userModel.findOne({ _id: userid }).populate({ path: 'list', options: { populate: 'articleid' } }).exec((err, user) => {
            if (err) {
                return res.status(404).send({
                    status: 'error',
                    message: 'Error en la consulta'
                });
            }

            if (!user) {
                return res.status(200).send({
                    status: 'success',
                    message: 'No hay lista',
                    user
                });
            }

            return res.status(200).send({
                status: 'success',
                user
            });
        });
    },

    saveList: (req, res) => {
        const userid = req.params.id;
        const params = req.body;

        if (!userid) {
            return res.status(404).send({
                status: 'error',
                message: 'No hay id de usuario'
            });
        }

        if (!params) {
            return res.status(404).send({
                status: 'error',
                message: 'Faltan datos por enviar'
            });
        }

        const listM = new listModel();
        listM.name = params.name;

        listM.save((err, listSaved) => {
            if (err) {
                return res.status(404).send({
                    status: 'error',
                    message: 'Error al guardar la lista',
                    err
                });
            }

            if (!listSaved) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No devuelve la lista'
                });
            }

            let update = {
                $push: {
                    list: listSaved._id
                }
            }

            userModel.findOneAndUpdate({ _id: userid }, update, { new: true }, (err, userUpdated) => {
                if (err) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'Error al guardar la lista en el usuario',
                        err
                    });
                }

                if (!userUpdated) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'No devuelve el usuario actualizado con la lista'
                    });
                }

                return res.status(200).send({
                    status: 'success',
                    userUpdated,
                    listSaved
                });
            });

        });

    },

    addBookToList: (req, res) => {
        const listid = req.params.id;
        const params = req.body;
        if (!listid) {
            return res.status(404).send({
                status: 'error',
                message: 'No llega el id de la lista'
            });
        }

        if (!params) {
            return res.status(404).send({
                status: 'error',
                message: 'No llega los parametros a ingresar'
            });
        }
        let update = {
            $push: {
                articleid: params.articleid
            }
        }
        listModel.findOneAndUpdate({ _id: listid }, update, { new: true }, (err, listUpdated) => {
            if (err) {
                return res.status(404).send({
                    status: 'error',
                    message: 'Error en la consulta'
                });
            }

            if (!listUpdated) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No devuelve la lista actualizada'
                });
            }

            return res.status(200).send({
                status: 'success',
                listUpdated
            });
        });
    },

    editList: (req, res) => {
        const listid = req.params.id;
        const params = req.body;

        if (!params) {
            return res.status(404).send({
                status: 'error',
                message: 'No llega los parametros'
            });
        }

        if (!listid) {
            return res.status(404).send({
                status: 'error',
                message: 'No llega el id de la lista'
            });
        }

        listModel.findOneAndUpdate({ _id: listid }, params, { new: true }, (err, listUpdated) => {
            if (err) {
                return res.status(404).send({
                    status: 'error',
                    message: 'Error en la consulta'
                });
            }

            if (!listUpdated) {
                return res.status(404).send({
                    status: 'error',
                    message: 'no devuelve la lista actualizada'
                });
            }

            return res.status(200).send({
                status: 'success',
                listUpdated
            });
        });
    },

    deleteList: (req, res) => {
        const listid = req.params.id;

        if (!listid) {
            return res.status(404).send({
                status: 'error',
                message: 'No llega el id de la lista'
            });
        }

        listModel.findOneAndDelete({ _id: listid }, (err, listDeleted) => {
            if (err) {
                return res.status(404).send({
                    status: 'error',
                    message: 'Error en la consulta'
                }); 
            }

            if (!listDeleted) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No devuelve la lista eliminada'
                }); 
            } 
            
            return res.status(200).send({
                status: 'success',
                listDeleted
            }); 
        });
    },

    deleteBookList: (req, res) => {
        const articleid = req.params.id;

        let updated = {
            $pull: {
                articleid: articleid
            }
        }

        listModel.findOneAndUpdate({ articleid: articleid }, updated, { new: true }, (err, listUpdated) => {
            if (err) {
                return res.status(404).send({
                    status: 'error',
                    message: 'Error en la consulta'
                }); 
            }

            if (!listUpdated) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No devuelve la lista actualizada'
                });
            }

            return res.status(200).send({
                status: 'success',
                listUpdated
            });
        });
    },

    getListArticle: (req, res) => {
        const articleid = req.params.id;

        listModel.find({ articleid: articleid}).exec( (err, list) => {
            if (err) {
                return res.status(404).send({
                    status: 'error',
                    message: 'Error en la consulta'
                });
            }

            if (!list) {
               return res.status(200).send({
                    status: 'success',
                    message: 'Lista vacia'
               }); 
            }

            return res.status(200).send({
                status: 'success',
                list
            });
        });
    },

    updateUserList: (req, res) => {
        const listid = req.params.id;
        const params = req.body;

        let notifyM = new notifyModel()
        notifyM.userid = params.userid;
        notifyM.username = params.username;
        notifyM.articleid = params.articleid;
        notifyM.articletitle = params.articletitle;
        notifyM.message = params.message;
        notifyM.chapter = false;

        notifyM.save((err, notifySaved) =>{
            if (err) {
                return res.status(404).send({
                    status: 'error',
                    message: 'Error al guardar la notificacion'
                });
            }
            let update = {
                $push: {
                    notify: notifySaved._id
                }

            }
            userModel.findOneAndUpdate({ list: listid }, update, { new: true }, (err, userUpdated) => {
                if (err) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'Error en la consulta para añadir las notificaciones a los usuarios'
                    });
                }

                return res.status(200).send({
                    status: 'success',
                    notifySaved,
                    userUpdated
                });
            });

        });


        
    }

};

module.exports = controller;