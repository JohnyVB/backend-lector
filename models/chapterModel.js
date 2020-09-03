'use strict';

const mongoose = require('mongoose');

const ChapterSchema = new mongoose.Schema({

    //Numero del capitulo
    numcap: Number,
    //Titulo del capitulo
    titlecap: String,
    //Fecha en que se publica el capitulo
    datechapter: { type: Date, default: Date.now },
    //Archivo con las imagenes del capitulo en pdf
    imgpage: { type: String, default: "" }

});

module.exports = mongoose.model("Chapter", ChapterSchema);