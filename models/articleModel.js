'use strict';

const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
  //titulo del libro
  title: { type: String },
  //descripcion del libro
  description: { type: String, default: 'Por favor complete la descripción del libro'},
  //fecha de publicacion
  date: { type: Date, default: Date.now },
  //Imagen de portada
  image: { type: String, default: null },
  //Generos del libro
  genders: { type: Array, default: [] },
  //Estado del libro
  progress: { type: String, default: 'publicandose' },
  //Estado true or false
  state: { type: Boolean, default: true },
  //Autor
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", require: true },
  
});

module.exports = mongoose.model("Article", ArticleSchema);
