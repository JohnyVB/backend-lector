const { response, request } = require('express');
const jwt = require('jsonwebtoken');

const userModel = require('../models/userModel');


const validarJWT = async (req = request, res = response, next) => {

    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la petición'
        });
    }

    try {

        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        
        const usuario = await userModel.findById(uid);

        if (!usuario) {
            return res.status(401).json({
                msg: 'usuario no existe DB'
            })
        }

        if (!usuario.state) {
            return res.status(401).json({
                msg: 'usuario no existe DB'
            })
        }

        req.usuario = usuario;
        next();

    } catch (error) {

        console.log(error);
        res.status(401).json({
            msg: 'Token no válido'
        })
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