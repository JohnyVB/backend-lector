const { validationResult } = require('express-validator');
const { request, response} = require('express');

const validarCampos = ( req = request, res = response, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send(errors);
    }
    next();
}


module.exports = {
    validarCampos
};