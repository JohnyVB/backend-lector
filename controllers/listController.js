const { request, response } = require('express');

const userModel = require('../models/userModel');
const listModel = require('../models/listModel');
const notifyModel = require('../models/notifyModel');


const controller = {

    getLists: async (req = request, res = response) => {
        const { id } = req.params;

        const listas = await listModel.find({ user: id, state: true }).populate('article');

        res.status(200).send({
            listas
        });
    },

    getListsPorArticle: async (req = request, res = response) => {
        const { id, article } = req.params;

        const lista = await listModel.findOne({ user: id, article, state: true });

        res.status(200).send({
            lista
        });
    },

    saveList: async (req = request, res = response) => {
        const { date, state, user, article, name } = req.body;

        const data = {
            name,
            user: req.usuario._id
        }

        try {
            const lista = new listModel(data);
            await lista.save();

            res.status(200).send({
                lista
            });
        } catch (error) {
            res.send({
                error
            });
        }

    },

    addBookToList: async (req = request, res = response) => {
        const { id } = req.params;
        const { article } = req.body;
        
        let update = {
            $push: {
                article
            }
        }

        let lista = await listModel.findOne({ _id: id });

        if (lista.article.includes(article)) {
            return res.status(401).send({
                msg: `El articulo: ${ article } ya se encuentra en esta lista...`
            });
        }

        lista = await listModel.findOneAndUpdate({ _id: id }, update, { new: true });

        res.status(200).send({
            lista
        });
    },

    editList: async (req = request, res = response) => {
        const { id } = req.params;
        const { name } = req.body;


        const lista = await listModel.findOneAndUpdate({ _id: id }, { name }, { new: true });

        res.status(200).send({
            lista
        });
    },

    deleteList: async (req = request, res = response) => {

        const { id } = req.params;
        const query = { state: false }
        
        const lista = await listModel.findByIdAndUpdate(id, query, { new: true});

        res.status(200).send({
            lista
        });
    },

    deleteBookList: async(req = request, res = response) => {
        const { id } = req.params;
        const { article } = req.body;

        let updated = {
            $pull: {
                article
            }
        }

        const lista = await listModel.findOneAndUpdate({ _id: id }, updated, { new: true });

        res.status(200).send({
            lista
        });
    }

};

module.exports = controller;