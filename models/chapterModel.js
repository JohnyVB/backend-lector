'use strict';

const mongoose = require('mongoose');

const ChapterSchema = new mongoose.Schema({

    //Numero del capitulo
    number: { type: Number },
    //Titulo del capitulo
    title: { type: String },
    //Estado
    state: { type: Boolean, default: true },
    //Fecha en que se publica el capitulo
    date: { type: Date, default: Date.now },
    //Archivo con las imagenes del capitulo en pdf
    image: { type: String, default: null },
    //Libro al que pertenece
    article: { type: mongoose.Schema.Types.ObjectId, ref: "Article", require: true },
    //Usuario al que pertenece
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", require: true }

});

module.exports = mongoose.model("Chapter", ChapterSchema);