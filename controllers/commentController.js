const { request, response } = require('express');

const commentModel = require('../models/commentModel');
const articleModel = require('../models/articleModel');
const chapterModel = require('../models/chapterModel');
const notifyModel = require('../models/notifyModel');

const { sendEmailNotification } = require('../helpers/emailHandler');

const controller = {

    getComments: async (req = request, res = response) => {

        const {id, coleccion, order = -1} = req.params;
        const {inicio = 0, fin = 10} = req.body;

        const query = {
            state: true
        }

        const queryOrder = {
            date: Number(order)
        }

        switch (coleccion) {
            case 'article':
                query.article = id;
                break;

            case 'chapter':
                query.chapter = id;
                break;

        }

        const [total, comentarios] = await Promise.all([
            commentModel.countDocuments(query),
            commentModel.find(query)
                .sort(queryOrder)
                .populate('user')
                .skip(Number(inicio))
                .limit(Number(fin)),
        ]);

        res.status(200).send({
            total,
            comentarios
        });

    },

    saveComment: async (req = request, res = response) => {

        const { id, coleccion } = req.params;
        const { chapter, article, user, state, date, text } = req.body;

        const data = {
            text,
            user: req.usuario._id,
            article,
            chapter
        };

        let model;

        switch (coleccion) {
            case 'article':
                data.article = id;
                model = await articleModel.findById(id).populate('user');
                break;

            case 'chapter':
                data.chapter = id;
                model = await chapterModel.findById(id).populate('user');
                break;

        }

        const comentario = new commentModel(data);
        await comentario.save();

        const dataNotify = {
            user: model.user._id,
            userPost: req.usuario._id,
            data: {

                title: (coleccion === 'article') 
                        ? 'ha publicado en el libro: ' 
                        : 'ha publicado en el capitulo',

                article: (coleccion === 'article')
                        ? id
                        : null,

                chapter: (coleccion === 'chapter')
                        ? id
                        : null

            }
        }

        const notificacion = new notifyModel(dataNotify);
        await notificacion.save();

        await sendEmailNotification(model.user.email, req.usuario.name, dataNotify.data.title ,model.title );

        res.status(200).send({
            comentario,
            notificacion
        });
    },

    putComment: async (req = request, res = response) => {

        const { id } = req.params;
        const { text } = req.body;

        const comentario = await commentModel.findByIdAndUpdate(id, { text }, { new: true });

        res.status(200).send({
            comentario
        });
    },

    patchComment: async (req = request, res = response) => {

        const { id } = req.params;
        const query = { state: false };

        const comentario = await commentModel.findByIdAndUpdate(id, query, { new: true });
        
        res.status(200).send({
            comentario
        });
    }
};

module.exports = controller;