const { request, response } = require('express');

const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

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

    const {start = 0, end = 10} = req.body;
    const query = { state: true };

    const articulos = await articleModel.find(query)
      .populate('user')
      .populate({ path: 'chapter', options: { sort: { date: -1 }, limit: 6 }})
      .sort({chapter: -1 })
      .skip(Number(start))
      .limit(Number(end));

    res.status(200).send({
      total: articulos.length,
      articulos
    });
  },

  getArticlesPorUser: async (req = request, res = response) => {

    const { id, fin = 10, inicio = 0 } = req.params;
    const query = { user: id, state: true };


    const [total, articulos] = await Promise.all([
      articleModel.countDocuments(query),
      articleModel.find(query)
        .skip(Number(inicio))
        .limit(Number(fin))
    ]);

    res.status(200).send({
      total,
      articulos
    });

  },

  saveArticle: async (req = request, res = response) => {
    const { date, image, state, user, ...article } = req.body;

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
    const { user, state, image, date, ...article } = req.body;

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
    const query = { state: false, image: null };

    const articulo = await articleModel.findById(id);

    if (articulo.image) {

      const nombreArr = articulo.image.split('/');
      const nombreArchivo = nombreArr[nombreArr.length - 1];
      const [public_id] = nombreArchivo.split('.');
      const result = await cloudinary.uploader.destroy('backend-lector/articles/' + public_id);
      articulo.image = null;
      articulo.state = false;
      await articulo.save();

      return res.status(200).send({
        articulo,
        result
      });
    } else {

      const articulo = await articleModel.findByIdAndUpdate(id, query, { new: true });
      res.status(200).send({
        articulo
      });

    }
  }


}; //final del controller

module.exports = controller;
