const { request, response } = require('express');

const chapterModel = require('../models/chapterModel');
const articleModel = require('../models/articleModel');


const controller = {

    getChapter: async (req = request, res = response) => {

        const { id } = req.params;
        const capitulo = await chapterModel.findById(id)
                            .populate('article')
                            .populate('user');

        res.status(200).send({
            capitulo
        });
    },

    getChaptersPorUnArticle: async (req = request, res = response) => {

        const { id, order, inicio = 0, fin = 10 } = req.params;
        const query = { state: true, article: id };
        const queryOrder = {
            date: Number(order)
        }

        const [total, capitulo ] = await Promise.all([
            chapterModel.countDocuments(query),
            chapterModel.find(query)
                .sort(queryOrder)
                .skip(Number(inicio))
                .limit(Number(fin))
        ]);

        res.status(200).send({
            total,
            capitulo
        });
    },

    getChapters: async (req = request, res = response) => {

        const { inicio = 0, cantidad = 10 } = req.params;
        const query = { state: true };

        const [total, capitulo] = await Promise.all([
            chapterModel.countDocuments(query),
            chapterModel.find(query)
                .populate('article')
                .sort({ date: -1})
                .skip(Number(inicio))
                .limit(Number(cantidad))
        ]);

        res.status(200).send({
            total,
            capitulo
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

        const update = {
            $push: {
                chapter: capitulo._id
            }
        }
        const articulo = await articleModel.findOneAndUpdate({ _id: id}, update, { new: true });

        res.status(200).send({
            capitulo,
            articulo
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
        const update = {
            $pull: {
                chapter: id
            }
        }

        const capitulo = await chapterModel.findByIdAndUpdate(id, query, { new: true });
        const articulo = await articleModel.findOneAndUpdate({chapter: id}, update, { new: true });

        res.status(200).send({
            capitulo,
            articulo
        });
    }

}

module.exports = controller;