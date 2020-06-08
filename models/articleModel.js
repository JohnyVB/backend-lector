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
  image: String,
  //Tipo de libro
  type: String,
  //Generos del libro
  genders: {type: Array, default: []},
  //Estado del libro
  state: String,
  //capitulos del libro
  chapters: [{
    _id: false,
    //Numero del capitulo
    numcap: String,
    //Titulo del capitulo
    titlecap: String,
    //fecha de publicacion del capitulo
    datechapter: { type: Date, default: Date.now },
    //Paginas
    imgpage: [{_id: false, imagep: String}]
  }],
});

module.exports = mongoose.model("Article", ArticleSchema);
