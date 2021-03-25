const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);
const { response, request } = require('express');

const userModel = require('../models/userModel');
const articleModel = require('../models/articleModel');
const chapterMode = require('../models/chapterModel');


const controller = {
    actualizarImagenCloudinary: async (req = request, res = response) => {
        const { id, coleccion } = req.params;

        let modelo;

        switch (coleccion) {
            case 'users':
                modelo = await userModel.findById(id);
                if (!modelo) {
                    return res.status(400).send({
                        msg: `No existe un usuario con el id ${id}`
                    });
                }
                break;

            case 'articles':
                modelo = await articleModel.findById(id);
                if (!modelo) {
                    return res.status(400).send({
                        msg: `No existe un articulo con el id ${id}`
                    });
                }
                break;

            case 'chapters':
                modelo = await chapterMode.findById(id);
                if (!modelo) {
                    return res.status(400).send({
                        msg: `No existe un capitulo con el id ${id}`
                    });
                }
                break;

        }

        if (modelo.image) {
            const nombreArr = modelo.image.split('/');
            const nombreArchivo = nombreArr[nombreArr.length - 1];
            const [public_id] = nombreArchivo.split('.');
            cloudinary.uploader.destroy('backend-lector/'+ coleccion + '/' + public_id);
        }

        const { tempFilePath } = req.files.archivo;
        const { secure_url } = await cloudinary.uploader.upload(tempFilePath, { folder: 'backend-lector/' + coleccion});

        modelo.image = secure_url;
        modelo.save();

        res.status(200).send({
            modelo
        });
    }
};

module.exports = controller;