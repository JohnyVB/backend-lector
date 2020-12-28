'use strict';

const mongoose = require('mongoose');

const ChapterSchema = new mongoose.Schema({

    //Numero del capitulo
    numcap: { type: Number },
    //Titulo del capitulo
    titlecap: { type: String },
    //Fecha en que se publica el capitulo
    datechapter: { type: Date, default: Date.now },
    //Comentarios
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment", default: null }],
    //Archivo con las imagenes del capitulo en pdf
    imgpage: { type: String, default: "" }

});

module.exports = mongoose.model("Chapter", ChapterSchema);