const notifyModel = require('../models/notifyModel');
const userModel = require('../models/userModel');

const controller = {
    getNotifyPopulate: (req, res) => {
        const userid = req.params.id;
        if (!userid) {
            return res.status(404).send({
                status: 'error',
                message: 'No hay id de usuario'
            });
        }

        userModel.findById({ _id: userid }).populate({ path: 'notify', options: { sort: { date: -1 }} }).exec((err, user)=> {
            if (err || !user) {
                return res.status(404).send({
                    status: 'error',
                    message: 'Error al traer los comentarios',
                    err
                });
            }

            return res.status(200).send({
                status: 'success',
                user
            });
        });
    },

    saveNotify: (req, res) => {
        const user = req.params.id;
        const params = req.body;
      
        if (!user || !params ) {
            return res.status(404).send({
                status: 'error',
                message: 'Faltan datos por enviar'
            });
        }

        const notifyM = new notifyModel();
        notifyM.userid = params.userid;
        notifyM.username = params.username;
        notifyM.articleid = params.articleid;
        notifyM.articletitle = params.articletitle;
        notifyM.message = params.message;
        notifyM.chapter = params.chapter;
        notifyM.alert = true;
    
        notifyM.save((err, notifyStored) => {
            if (err) {
                return res.status(404).send({
                    status: 'error',
                    message: 'Error al guardar la notificacion'
                });
            }

            if (!notifyStored) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay notificaciones'
                })
            }

            let params = {
                $push: {
                    notify: notifyStored._id
                }
            }
            userModel.findOneAndUpdate({ _id: user }, params, { new: true }).exec((err, userUpdated) => {
                
            });
            return res.status(200).send({
                status: 'success',
                notifyStored
            });
        });
    },

    updateAlertNotify: (req, res) => {
        const notifyid = req.params.id;
        const update = req.body;


        if (!notifyid) {
            return res.status(404).send({
                status: 'error',
                message: 'No se ha enviado el id de la notificación...'
            });
        }

        if (!update) {
            return res.status(404).send({
                status: 'error',
                message: 'No llega el dato para actuaalizar...'
            });
        }

        notifyModel.findOneAndUpdate({_id: notifyid}, update, { new: true }).exec((err, notifyUpdated)=>{
            if (err) {
                return res.status(404).send({
                    status: 'error',
                    message: 'Error al actualizar la notificación...'
                });
            }

            if (!notifyUpdated) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No devuelve la notificación actualizada...'
                });
            }

            return res.status(200).send({
                status: 'success',
                notifyUpdated
            });
        });
    }
};

module.exports = controller;