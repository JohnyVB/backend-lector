const { request, response } = require('express');

const commentModel = require('../models/commentModel');

const controller = {

    getComments: async (req = request, res = response) => {

        const { id, coleccion, order, inicio = 0, fin = 10 } = req.params;

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
        const iduser = req.usuario._id;

        const data = {
            text,
            user: iduser,
            article,
            chapter
        };

        switch (coleccion) {
            case 'article':
                data.article = id;
                break;

            case 'chapter':
                data.chapter = id;
                break;

        }

        const comentario = new commentModel(data);
        await comentario.save();

        res.status(200).send({
            comentario
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