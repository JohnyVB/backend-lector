const { response, request } = require('express');
const jwt = require('jsonwebtoken');

const userModel = require('../models/userModel');


const validarJWT = async (req = request, res = response, next) => {

    try {

        const token = req.header('x-token');

        if (!token) {
            return res.status(401).json({
                msg: 'No hay token en la petición'
            });
        }

        jwt.verify(token, process.env.SECRETORPRIVATEKEY, async(err) => {
            if(err?.message === 'jwt expired') {
                return res.status(401).send({
                    msg: err?.message
                });
            }

            if (err?.message === 'invalid token') {
                return res.status(401).json({
                    msg: err?.message
                });
            }

            const {uid} = jwt.decode(token);

            const usuario = await userModel.findById(uid);

            if (!usuario) {
                return res.status(401).json({
                    msg: 'usuario no existe DB'
                });
            }

            if (!usuario.state) {
                return res.status(401).json({
                    msg: 'usuario deshabilitado'
                });
            }

            req.usuario = usuario;
            next();
        });

    } catch (error) {
        
        return res.status(401).json({
            msg: 'Error al procesar el token'
        });
    }

}

const esAdminRole = (req = request, res = response, next) => {

    const { usuario } = req;

    if (usuario.role != 'admin-role') {
        return res.status(404).send({
            msg: 'No tiene el permiso para realizar esta acción'
        });
    }

    next();
}

module.exports = {
    validarJWT,
    esAdminRole
}