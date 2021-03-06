const { request, response } = require('express');

const articleModel = require("../models/articleModel");

const controller = {

  getArticle: async (req = request, res = response) => {

    const { id } = req.params;
    const articulo = await articleModel.findById(id).populate('user');

    res.status(200).send({
      articulo
    });
  },

  getArticles: async (req = request, res = response) => {

    const { fin = 10, inicio = 0 } = req.params;
    const query = { state: true };

    const [total, articulos] = await Promise.all([
      articleModel.countDocuments(query),
      articleModel.find(query)
        .populate('user')
        .skip(Number(inicio))
        .limit(Number(fin))
    ]);

    res.status(200).send({
      total,
      articulos
    });
  },

  getArticlesPorUser: async (req = request, res = response) => {

    const { id, fin = 10, inicio = 0 } = req.params;
    const query = { user: id, state: true };

    
    const [ total, articles] = await Promise.all([
      articleModel.countDocuments(query),
      articleModel.find(query)
        .skip(Number(inicio))
        .limit(Number(fin))
    ]);

    res.status(200).send({
      total,
      articles
    });

  },

  saveArticle: async (req = request, res = response) => {
    const { date, image, state, user, ...article} = req.body;

    const data = {
      ...article,
      user: req.usuario._id
    };

    const articulo = new articleModel(data);
    await articulo.save();

    res.status(200).send({
      articulo
    });
  },

  putArticle: async (req = request, res = response) => {

    const { id } = req.params;
    const { user, state, image, date, ...article} = req.body;

    const data = {
      ...article
    };

    const articulo = await articleModel.findByIdAndUpdate(id, data, { new: true });

    res.status(200).send({
      articulo
    });
  },

  patchArticle: async (req = request, res = response) => {

    const { id } = req.params;
    const query = { state: false };

    const articulo = await articleModel.findByIdAndUpdate(id, query, { new: true });

    res.status(200).send({
      articulo
    });
  }


}; //final del controller

module.exports = controller;
