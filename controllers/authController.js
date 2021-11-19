const { request, response } = require('express');
const bcrypt = require('bcryptjs');

const userModel = require('../models/userModel');
const { generarJWT } = require('../helpers/generarJWT');

const controller = {

    login: async(req = request, res = response) => {
        const { email, password } = req.body;
        try {

            const usuario =  await userModel.findOne({email});
            if (!usuario) {
                return res.status(400).send({
                    msg: 'Usuario / Password no son correctos'
                });
            }
            
            if (!usuario.state) {
                return res.status(400).send({
                    msg: 'Usuario no existe'
                });
            }

            const validarPassword = bcrypt.compareSync(password, usuario.password);
            if (!validarPassword) {
                return res.status(400).send({
                    msg: 'Usuario / Password no son correctos'
                });
            }

            const token = await generarJWT(usuario.id);

            res.status(200).send({
                usuario,
                token
            });
            
        } catch (error) {
            return res.status(500).send({
                msg: 'Algo salio mal....',
                error
            });
        }
    },
    
    renewToken: async(req = request, res = response) => {

        const id = req.usuario._id;

        if (!id || id === '') {
            return res.status(401).send({
                msg: 'Error al extraer el id del token'
            });
        }

        try {
            const token = await generarJWT(req.usuario._id);
            res.status(200).send({
                usuario: req.usuario,
                token
            });
        } catch (error) {
            return res.status(500).send({
                msg: 'Algo salio mal....',
                error
            });
        }
    }

};

module.exports = controller;
