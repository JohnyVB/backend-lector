const { response, request } = require('express');

const articleModel = require('../models/articleModel');
const chapterMode = require('../models/chapterModel');
const commentModel = require('../models/commentModel');

const validarPropiedad = async (req = request, res = response, next) => {

    const { id } = req.params;
    const iduser = req.usuario._id;

    let articulo;
    let capitulo;
    let comentario;
    

    if (articulo = await articleModel.findById(id)) {
        
        if (articulo.user.toString() !== iduser.toString()) {
            return res.status(404).send({
                msg: 'Tienes que ser el propietario del libro para realizar esta acción'
            });
        }

        next();
    } else if (capitulo = await chapterMode.findById(id)){
       
        if (capitulo.user.toString() !== iduser.toString()) {
            return res.status(404).send({
                msg: 'Tienes que ser el propietario del capitulo para realizar esta acción'
            });
        }

        next();
    }else{
        comentario = await commentModel.findById(id);

        if (comentario.user.toString() !== iduser.toString()) {
            return res.status(404).send({
                msg: 'Tienes que ser el propietario del capitulo para realizar esta acción'
            });
        }

        next();
    }

}

module.exports = {
    validarPropiedad
}