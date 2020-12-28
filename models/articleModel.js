'use strict';

const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
  //titulo del libro
  title: String,
  //descripcion del libro
  description: String,
  //fecha de publicacion
  date: { type: Date, default: Date.now },
  //Imagen de portada
  image: { type: String, default: "" },
  //Tipo de libro
  type: String,
  //Generos del libro
  genders: { type: Array, default: [] },
  //Estado del libro
  state: String,
  //Autor
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  //Comentarios del capitulo
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment", default: null}],
  //capitulos del libro
  chapter: [{ type: mongoose.Schema.Types.ObjectId, ref: "Chapter", default: "" }],
});

module.exports = mongoose.model("Article", ArticleSchema);
