'use strict';

const validator = require('validator');
const chapterModel = require('../models/chapterModel');
const articleModel = require('../models/articleModel');
const fs = require('fs');
const path = require('path');



const controller = {

    //------------------------Guardar capitulos en los libros--------------------------------------------------
    saveChapter: (req, res) => {

        //Recoger lo datos que llegan por post

        const { numcap, titlecap } = req.body;
        const articleId = req.params.id;


        //Validar los datos
        try {
            //var validator_numcap = !validator.isEmpty(numcap);
            var validator_titlecap = !validator.isEmpty(titlecap);
        } catch (err) {
            return res.status(404).send({
                status: "error",
                message: "Error faltan datos",
            });
        }

        if (validator_titlecap) {
            //Asignar valores
            const chapterM = new chapterModel();

            chapterM.numcap = numcap;
            chapterM.titlecap = titlecap;


            chapterM.save((err, chapterStored) => {
                if (err) {
                    return res.status(404).send({
                        status: "error",
                        message: "No se pudo guardar los datos",
                    });
                }

                if (!chapterStored) {
                    return res.status(404).send({
                        status: "error",
                        message: "No hay datos para mostrar",
                    });
                }
                //Funcion de enlasar el nuevo capitulo con el libro correspondiente
                const update = {
                    $push: {
                        chapter: chapterStored._id
                    }
                }
                articleModel.findByIdAndUpdate({ _id: articleId }, update, { new: true }, (err, articleUpdated) => {
                    if (err) {
                        return res.status(400).send({
                            status: "error",
                            message: "Error al guardar id de capitulo al libro",
                            err
                        });
                    }


                    if (!articleUpdated) {

                        return res.status(403).send({
                            status: "error",
                            message: "No hay libro no existe para este capitulo",

                        });

                    }

                    return res.status(200).send({
                        status: "success",
                        chapter: chapterStored,
                        article: articleUpdated
                    });
                });

            }
            );
        } else {
            //Devolver una respuesta
            return res.status(404).send({
                status: "error",
                message: "faltan datos",
            });
        }
    },

    //------------------------Guardar Paginas del capitulo del libro----------------------------------------------------
    uploadPages: (req, res) => {

        if (!req.file) {
            return res.status(404).send({
                status: 'error',
                message: 'Imagen no subida...'
            });
        }

        const { filename, path, originalname } = req.file;

        const name_split = originalname.split('.');
        const img_extens = name_split[1];

        if (img_extens != 'pdf') {
            fs.unlink(path, () => {
                return res.status(404).send({
                    status: 'error',
                    message: 'formato de archivo a subir no valido....',
                    format: img_extens
                });
            });
        } else {

            const chapterId = req.params.id;

            let update = {
                $set: {
                    imgpage: filename
                }
            };

            chapterModel.findOneAndUpdate({ _id: chapterId }, update, { new: true }, (err, chapterUpdated) => {
                if (err || !chapterUpdated) {
                    fs.unlink(path, (err) => {
                        return res.status(404).send({
                            status: 'error',
                            message: 'No se ha podido guardar el archivo',
                            chapterUpdated,
                            err
                        });
                    });

                } else {

                    return res.status(200).send({
                        status: 'success',
                        article: chapterUpdated
                    });
                }
            });

        }
    },

    //------------------------Eliminar capitulo------------------------------------------------------------------
    deleteChapter: (req, res) => {

        const chapterId = req.params.id;


        chapterModel.findOneAndDelete({ _id: chapterId }, (err, chapterRemoved) => {

            if (err) {
                return res.status(401).send({
                    status: "error",
                    message: "Error al eliminar el capitulo",
                    err
                });
            }

            if (!chapterRemoved) {
                return res.status(400).send({
                    status: "error",
                    message: "El capitulo no ha sido encontrado: " + chapterId,
                    chapterRemoved
                });
            }

            //----------------------------Eliminar el ObjectId del capitulo borrado en el articulo asociado----------------------------

            let update = {
                $pull: {
                    chapter: chapterId
                }
            }

            articleModel.findOneAndUpdate({ chapter: chapterId }, update, { new: true }, (err, articleUpdated, next) => {
                if (err) {
                    return res.status(400).send({
                        status: "error",
                        message: "Error al eliminar la referencia",
                        err
                    });
                }

                if (!articleUpdated) {
                    return res.status(400).send({
                        status: "error",
                        message: "El articulo llega vacio",
                        articleUpdated
                    });
                }

                return res.status(400).send({
                    status: "success",
                    message: "Se ha eliminado el capitulo y su referencia en Articles",
                    articleUpdated
                });

                next();
            });

            //-----------------------------Eliminar el archivo adjunto del capitulo eliminado------------------------------
            const file_path = "./images/imgpages/" + chapterRemoved.imgpage;
            fs.unlink(file_path, (err) => {
                if (err) {
                    return res.status(400).send({
                        status: "error",
                        message: "Error al eliminar el archivo del capitulo, posiblemente no existe",
                        err
                    });
                }
            });
        });
    },

    //------------------------Actualizar capitulo------------------------------------------------------------------
    updateChapter: (req, res) => {

        const chapterId = req.params.id;
        const {numcap, titlecap, imgpage} = req.body;

        let update = {
            $set: {
                titlecap: titlecap,
                numcap: numcap,
                imgpage: imgpage
            }
        }

        chapterModel.findOneAndUpdate({ _id: chapterId }, update, { new: true }, (err, chapterUpdated) => {

            if (err) {
                return res.status(400).send({
                    status: "error",
                    message: "Error al actualizar el capitulo",
                    error: err
                });
            }

            if (!chapterUpdated) {
                return res.status(400).send({
                    status: "error",
                    message: "Capitulo no encontrado",
                    chapter: chapterUpdated
                });
            }

            return res.status(200).send({
                status: 'success',
                message: 'Capitulo actualizado',
                chapter: chapterUpdated
            });
        });


    },

    //------------------------Obtener un capitulo---------------------------------------------------------------------------
    getChapter: (req, res) => {

        const chapterId = req.params.id;

        if (!chapterId || chapterId == null || chapterId == undefined) {
            return res.status(400).send({
                status: "error",
                message: "Capitulo no encontrado"
            });
        }

        chapterModel.findById(chapterId, (err, chapter) => {
            if (err) {
                return res.status(400).send({
                    status: "error",
                    message: "Error, no se pudo traer el capitulo",
                    err
                });
            }
            if (!chapter) {
                return res.status(400).send({
                    status: "error",
                    message: "No hay capitulo",
                    chapter
                });
            }

            return res.status(200).send({
                status: "success",
                chapter
            });
        });
    },

    //------------------------Obtener capitulos en orden decendente---------------------------------------------------------
    getChapters: (req, res) => {
        chapterModel.find({}).sort('-numcap').exec((err, chapters) => {
            if (err) {
                return res.status(400).send({
                    status: "error",
                    message: "Error al obtener los capitulos",
                    err
                });
            }

            if (!chapters) {
                return res.status(400).send({
                    status: "error",
                    message: "Error al obtener los capitulos vacios",
                    chapters
                });
            }

            return res.status(200).send({
                status: "success",
                err
            });
        });
    },

    getImgpage: (req, res) => {

        var filename = req.params.image;
        var filepath = './images/imgpages/' + filename;

        fs.exists(filepath, (exists) => {
            if (exists) {
                return res.sendFile(path.resolve(filepath));
            } else {
                return res.status(200).send({
                    status: 'error',
                    message: 'El archivo no existe...'
                });
            }
        });
    }

}

module.exports = controller;