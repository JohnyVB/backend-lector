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
            console.log(error);
            return res.status(500).send({
                msg: 'Algo salio mal....'
            });
        }
    }

};

module.exports = controller;
