const userModel = require('../models/userModel');
const listModel = require('../models/listModel');
const controller = {

    getList: (req, res) => {
        const userid = req.params.id;

        if (!userid) {
            return res.status(404).send({
                status: 'error',
                message: 'No hay id de usuario'
            });
        }

        userModel.findOne({ _id: userid }).populate('list').exec((err, list) => {
            if (err) {
                return res.status(404).send({
                    status: 'error',
                    message: 'Error en la consulta'
                });
            }

            if (!list) {
                return res.status(200).send({
                    status: 'success',
                    message: 'No hay lista',
                    list
                });
            }

            return res.status(200).send({
                status: 'success',
                list
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

            userModel.findOneAndUpdate({ _id: userid }, update, { new: true }, (err, userUpdated) => { });
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

    }

};

module.exports = controller;