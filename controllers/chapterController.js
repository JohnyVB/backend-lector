const { request, response } = require('express');

const chapterModel = require('../models/chapterModel');

const controller = {

    getChapter: async (req = request, res = response) => {

        const { id } = req.params;
        const capitulo = await chapterModel.findById(id).populate('article');

        res.status(200).send({
            capitulo
        });
    },

    getChapters: async (req = request, res = response) => {

        const { id, inicio = 0, fin = 10 } = req.params;
        const query = { state: true, article: id };

        const [ total, chapters ] = await Promise.all([
            chapterModel.countDocuments(query),
            chapterModel.find(query)
                .skip(Number(inicio))
                .limit(Number(fin))
        ]);

        res.status(200).send({
            total,
            chapters
        });
    },

    saveChapter: async (req = request, res = response) => {

        const { id } = req.params;
        const { state, date, image, article, user, ...chapter } = req.body;

        const data = {
            ...chapter,
            article: id,
            user: req.usuario._id
        };

        const capitulo = new chapterModel(data);
        await capitulo.save();

        res.status(200).send({
            capitulo
        });
    },

    putChapter: async (req = request, res = response) => {

        const { id } = req.params;
        const { state, date, image, article, ...chapter } = req.body;

        const data = {
            ...chapter
        };

        const capitulo = await chapterModel.findByIdAndUpdate(id, data, { new: true });

        res.status(200).send({
            capitulo
        });
    },

    patchChapter: async(req = request, res = response) => {

        const { id } = req.params;
        const query = { state: false };

        const capitulo = await chapterModel.findByIdAndUpdate(id, query, { new: true });

        res.status(200).send({
            capitulo
        });
    }

}

module.exports = controller;