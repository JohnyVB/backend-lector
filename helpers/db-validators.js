const userModel = require('../models/userModel');
const articleModel = require('../models/articleModel');
const chapterModel = require('../models/chapterModel');
const commentModel = require('../models/commentModel');
const listModel = require('../models/listModel');


const emailExiste = async (email = '') => {

    // Verificar si el correo existe
    const existeEmail = await userModel.findOne({ email });
    if (existeEmail) {
        throw new Error(`El correo: ${email}, ya está registrado`);
    }
}

const existeUsuarioPorId = async (id = '') => {

    const existeUsuario = await userModel.findById(id);
    if (!existeUsuario) {
        throw new Error('El usuario con ID: ' + id + ' no existe.')
    }
}

const existeArticuloPorId = async (id = '') => {

    const existeArticulo = await articleModel.findById(id);
    if (!existeArticulo) {
        throw new Error('El articulos con ID: ' + id + ' no existe.')
    }
}

const existeCapituloPorId = async (id = '') => {

    const existeCapitulo = await chapterModel.findById(id);
    if (!existeCapitulo) {
        throw new Error('El capitulo con el ID: ' + id + ' no existe');
    }
}

const existeComentarioPorId = async (id = '') => {

    const existeComentario = await commentModel.findById(id);
    if (!existeComentario) {
        throw new Error('El comentario con ID: ' + id + ' no existe');
    }
}

const existeListaPorId = async (id = '') =>{
    const existeLista = await listModel.findById(id);
    if (!existeLista) {
        throw new Error('La lista con ID: ' + id + ' no existe');
    }
}

const coleccionesPermitidas = async (coleccion = '', colecciones = []) => {
    const incluida = await colecciones.includes(coleccion);
    if (!incluida) {
        throw new Error('Colecciones permitidas: ' + colecciones);
    }
}


module.exports = {
    emailExiste,
    existeUsuarioPorId,
    existeArticuloPorId,
    existeCapituloPorId,
    existeComentarioPorId,
    existeListaPorId,
    coleccionesPermitidas
}