'use strict';

const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
  //titulo del libro
  title: { type: String, required: true },
  //descripcion del libro
  description: { type: String, default: 'Por favor complete la descripción del libro'},
  //Tipo
  type: { type: String, required: true},
  //fecha de publicacion
  date: { type: Date, default: Date.now },
  //Imagen de portada
  image: { type: String, default: null },
  //Generos del libro
  genders: { type: Array, required: true },
  //Estado del libro
  progress: { type: String, required: true },
  //Estado true or false
  state: { type: Boolean, default: true },
  //Autor
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", require: true },
  
});

module.exports = mongoose.model("Article", ArticleSchema);
