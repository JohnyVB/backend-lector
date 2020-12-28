const commentModel = require('../models/CommentsModel');
const articleModel = require('../models/articleModel');
const chapterModel = require('../models/chapterModel');
const validator = require('validator');

const controller = {

    getCommentsPopulate: (req, res) => {
        const articleId = req.params.id;
        const reader = req.params.reader;

        if (!articleId) {
            return res.status(404).send({
                status: 'error',
                message: 'Id del libro no encontrado!!'
            });
        } 

        if (reader === 'true') {
            
            chapterModel.findOne({ _id: articleId }).populate({ path: 'comments', populate: { path: 'userid' } }).exec((err, article) => {
                if (!article || err) {
                    return res.status(200).send({
                        status: 'success',
                        message: 'No hay comentarios'
                    });
                }

                return res.status(200).send({
                    status: 'success',
                    article
                });
            });
        } else if(reader === 'false') {
            articleModel.findOne({ _id: articleId }).populate({ path: 'comments', populate: { path: 'userid' } }).exec((err, article) => {
                if (!article || err) {
                    return res.status(200).send({
                        status: 'warn',
                        message: 'No hay comentarios'
                    });
                }

                return res.status(200).send({
                    status: 'success',
                    article
                });
            });
        }

        
        
        
        
        
               
    },

    getComments: (req, res) => {
        commentModel.find({}).exec((err, comments) => {
            if (err || !comments) {
                return res.status(404).send({
                    status: 'error',
                    message: 'Error en la consulta getComments()'
                });
            }

            return res.status(200).send({
                status: 'success',
                comments
            });
        });
    },

    getComment: (req, res) => {
        const commentId = req.params.id;

        if (!commentId) {
            return res.status(404).send({
                status: 'error',
                message: 'No hay id para buscar su comentario....'
            });
        }

        commentModel.findOne({ _id: commentId }).exec((err, comment) => {
            if (err || !comment) {
                return res.status(404).send({
                    status: 'error',
                    message: 'Error en la consulta getComment()'
                });
            }
        });
    },

    saveComment: (req, res) => {
        const { text, userid } = req.body;
        const articleId = req.params.id;
        const reader = req.params.reader;

        if (!articleId || articleId === null || articleId === undefined) {
            return res.status(404).send({
                status: 'error',
                message: 'No se encuentra el id del articulo para asignar comentario'
            });
        }

        if (!text || !userid) {
            return res.status(404).send({
                status: 'error',
                message: 'Faltan datos del usuario'
            });
        }

        try {
            !validator.isEmpty(text);
        } catch (err) {
            return res.status(404).send({
                status: 'error',
                message: 'Comentario vacio, por favor ingrese su comentario....',
                err
            });
        }

        const commentmodelo = new commentModel();

        commentmodelo.text = text;
        commentmodelo.userid = userid;

        commentmodelo.save((err, commentStored) => {
            if (err || !commentStored) {
                return res.status(404).send({
                    status: 'error',
                    message: 'error al guardar el comentario...'
                });
            }

            let update = {
                $push: {
                    comments: commentStored._id
                }
            };

            
            if (reader === 'true') {
                chapterModel.findOneAndUpdate({ _id: articleId }, update, { new: true }, (err, articleStored) => {
                    if (err || !articleStored) {
                        return res.status(404).send({
                            status: 'error',
                            message: 'Error al actualizar el articulo con el comentario....'
                        });
                    }

                    return res.status(200).send({
                        status: 'success',
                        message: 'Se ha guardado todo correctamente....'
                    });
                });
            }else if (reader === 'false') {
                articleModel.findOneAndUpdate({ _id: articleId }, update, { new: true }, (err, articleStored) => {
                    if (err || !articleStored) {
                        return res.status(404).send({
                            status: 'error',
                            message: 'Error al actualizar el articulo con el comentario....'
                        });
                    }

                    return res.status(200).send({
                        status: 'success',
                        message: 'Se ha guardado todo correctamente....'
                    });
                });
            }
            
            
        });
    },

    updateComment: (req, res) => {

        const { text } = req.body;
        const commentId = req.params.id;

        if (!commentId) {
            return res.status(404).send({
                status: 'error',
                message: 'Id no ingresado'
            });
        }

        commentModel.findOneAndUpdate({ _id: commentId }, text, { new: true }, (err, commentUpdated) => {
            if (err || !commentUpdated) {
                return res.status(404).send({
                    status: 'error',
                    message: 'Error en la consulta UpdateComment()'
                });
            }

            return res.status(200).send({
                status: 'success',
                commentUpdated
            });
        });
    },

    searchComment: (req, res) => {
        const { searchComment } = req.params;

        if (!searchComment) {
            return res.status(404).send({
                status: 'error',
                message: 'No hay parametros a buscar....'
            });
        }

        commentModel.find({
            "$or": [
                { "title": { "$regex": searchComment, "$options": "i" } },
                { "description": { "$regex": searchComment, "$options": "i" } }
            ]
        }).sort([['date', 'descending']]).exec((err, comment) => {
            if (err) {
                return res.status(404).send({
                    status: 'error',
                    message: 'Error en la consulta searchComment()',
                    err
                });
            }

            if (!comment) {
                return res.send({
                    message: 'No se ha encontrado el comentario...'
                });
            }

            return res.status(200).send({
                status: 'success',
                comment
            });
        });
    },

    deleteComment: (req, res) => {

        const commentId = req.params.id;

        commentModel.findOneAndDelete({ _id: commentId }, (err, commentRemoved) => {
            if (err || !commentRemoved) {
                return res.status(404).send({
                    status: 'error',
                    message: 'Error al eliminar el comentario o el comentario ya no existe'
                });
            }

            return res.status(200).send({
                status: 'success',
                commentRemoved
            });
        });
    },

    error: (req, res) => {
        return res.status(200).send(false);
    }
};

module.exports = controller;