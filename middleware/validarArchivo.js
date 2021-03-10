const { response, request } = require('express');

const extensionesValidas = ['png', 'jpg', 'jpeg', 'pdf'];

const validarArchivo = (req = request, res = response, next) => {

    
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
        return res.status(400).send({
            msg: 'No hay archivos.'
        });
    }

    const { archivo } = req.files;
    const nombreSplit = archivo.name.split('.');
    const extension = nombreSplit[nombreSplit.length - 1];

    if (!extensionesValidas.includes(extension)) {
        return res.status(404).send({
            msg: `El archivo no tiene una extension valida, extensiones validas: ${extensionesValidas}`
        });
    }

    next();
}

module.exports = {
    validarArchivo
}