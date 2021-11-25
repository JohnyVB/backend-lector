const { request, response } = require('express');
const bcrypt = require('bcryptjs');

const userModel = require('../models/userModel');
const { generarJWT } = require('../helpers/generarJWT');

const controller = {

    login: async(req = request, res = response) => {
        try {
            
            const { email, password } = req.body;  
            const usuario =  await userModel.findOne({email});

            if (!usuario) {
                return res.status(400).send({
                    msg: 'Usuario / Password no son correctos'
                });
            }
            
            if (!usuario.state && !usuario.validatorNumber) {
                return res.status(400).send({
                    msg: 'Usuario deshabilitado'
                });
            }

            const validarPassword = bcrypt.compareSync(password, usuario.password);
            if (!validarPassword) {
                return res.status(400).send({
                    msg: 'Usuario / Password no son correctos'
                });
            }

            const token = await generarJWT(usuario._id);

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

        try {

            const id = req.usuario._id;

            if (!id || id === '') {
                return res.status(401).send({
                    msg: 'Error al extraer el id del token'
                });
            }
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
    },

    activateUser: async (req = request, res = response) => {
        try {

            const {email, code} = req.body;
            const usuario = await userModel.findOne({email}).exec();

            if (usuario.validatorNumber === Number(code)) {

                usuario.validatorNumber = null;
                usuario.state = true;

                await usuario.save();
                const token = await generarJWT(usuario._id);

                return res.status(200).send({
                    usuario,
                    token
                });
            }

            return res.status(401).send({
                msg: 'Codigo de verificación invalido'
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
