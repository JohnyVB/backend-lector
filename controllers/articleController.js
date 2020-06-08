const validator = require("validator");
const articleModel = require("../models/articleModel");
const fs = require('fs');
const path = require('path');


const controller = {
  //------------------------Guardar libros-------------------------------------------------------------
  saveArticle: (req, res) => {
    //Recoger parametros por post
    var params = req.body;

    //Validar datos (validator)
    try {
      var validate_title = !validator.isEmpty(params.title);
      var validate_description = !validator.isEmpty(params.description);
      var validate_type = !validator.isEmpty(params.type);
      var validate_genders = !validator.isEmpty(params.genders);
      var validate_state = !validator.isEmpty(params.state);
    } catch (err) {
      return res.status(200).send({
        status: "error",
        message: "faltan datos por enviar !!!",
      });
    }

    if (
      validate_title &&
      validate_description &&
      validate_type &&
      validate_genders &&
      validate_state
    ) {
      //Crear el objeto a guardar
      var articleM = new articleModel();

      //Asignar valores
      articleM.title = params.title;
      articleM.description = params.description;
      articleM.image = '';
      articleM.type = params.type;
      articleM.genders = params.genders;
      articleM.state = params.state;

      //Guardar el articulo
      articleM.save((err, articleMStored) => {
        if (err || !articleMStored) {
          return res.status(404).send({
            status: "error",
            message: "Los datos no se han guardado correctamente !!!",
          });
        } else {
          //Devolver una respuesta
          return res.status(200).send({
            status: "success",
            articleM: articleMStored,
          });
        }
      });
    } else {
      return res.status(200).send({
        status: "error",
        message: "Los datos no son validos !!!",
      });
    }
  },
  
  //------------------------Guardar capitulos en los libros--------------------------------------------------
  saveChapter: (req, res) => {
    //Recoger el id del articulo por la url
    let articleId = req.params.id;

    //Recoger lo datos que llegan por put
    let params = req.body;

    //Validar los datos
    try {
      var validator_numcap = !validator.isEmpty(params.numcap);
      var validator_titlecap = !validator.isEmpty(params.titlecap);
      var validator_imagep = !validator.isEmpty(params.imagep);
    } catch (err) {
      return res.status(404).send({
        status: "error",
        message: "Error faltan datos",
      });
    }

    if (validator_numcap && validator_titlecap && validator_imagep) {
      //Asignar valores
      let update = {
        $push: {
          chapters: {
            numcap: params.numcap,
            titlecap: params.titlecap,
            imgpage: {
              imagep: params.imagep,
            },
          },
        },
      };

      articleModel.findOneAndUpdate(
        { _id: articleId },
        update,
        { new: true },
        (err, articleUpdated) => {
          if (err) {
            return res.status(404).send({
              status: "error",
              message: "No se pudo guardar los datos",
            });
          }

          if (!articleUpdated) {
            return res.status(404).send({
              status: "error",
              message: "No hay datos para mostrar",
            });
          }

          return res.status(200).send({
            status: "success",
            article: articleUpdated,
          });
        }
      );
    } else {
      //Devolver una respuesta
      return res.status(404).send({
        status: "error",
        message: "faltan datos",
      });
    }
  },

  //------------------------Listar todos los libros por orden alfabetico del titulo---------------------------
  getArticles: (req, res) => {
    articleModel.find({}).sort('title').exec((err, articles) => {
      if (err || !articles) {
        return res.status(404).send({
          status: "error",
          message: "Error al devolver los articulos",
        });
      }else{
        return res.status(200).send({
          status: "success",
          articles,
        });
      }
    });
  },

  //------------------------Listar todos los libros por ultimo añadido----------------------------------------------
  getArticlesUltimosArt: (req, res) => {
    articleModel
      .find({})
      .sort('-date')
      .exec((err, articles) => {
        if (err || !articles) {
          return res.status(404).send({
            status: "error",
            message: "Error al devolver los articulos",
          });
        }

        return res.status(200).send({
          status: "success",
          articles,
        });
      });
  },

  //------------------------Listar libros con nuevos capitulos-----------------------------------------
  getArticlesUltimosCaps: (req, res) => {
    articleModel
      .find({})
      .sort('chapters:{-numcap}')
      .exec((err, articles) => {
        if (err && !articles) {
          return res.status(404).send({
            status: "error",
            message: "Error al devolver los articulos",
          });
        }

        return res.status(200).send({
          status: "success",
          articles,
        });
      });
  },


  //------------------------Listar un solo libro---------------------------------------------------
  getArticle: (req, res) => {

    var articleId = req.params.id;

    if (!articleId || articleId == null || articleId == undefined) {
      return res.status(404).send({
        status: "error",
        message: "Libro no encontrado!!",
      });
    }

    articleModel.findById(articleId, (err, article) => {
      if (err || !article) {
        return res.status(500).send({
          status: "error",
          message: "No se pudo cargar el libro!!",
        });
      }

      return res.status(200).send({
        status: "success",
        article
      });
    });
  },

  //------------------------Borrar un libro------------------------------------------------------------------
  delete: (req, res) => {

    let articleId = req.params.id;

    articleModel.findOneAndDelete({ _id: articleId }, (err, articleRemoved) => {
      if (err) {
        return res.status(500).send({
          status: 'error',
          message: 'Error al eliminar los datos'
        });
      }

      if (!articleRemoved) {
        return res.status(404).send({
          status: 'error',
          message: 'No se ha podido borrar los datos, datos ya no existen'
        });
      }

      return res.status(200).send({
        status: 'success',
        article: articleRemoved
      });
    });
  },

  //------------------------Guardar imagen de portada del libro------------------------------------------------
  uploadCoverPages: (req, res) => {

    if (!req.file) {
      return res.status(404).send({
        status: 'error',
        message: 'Imagen no subida...'
      });
    }

    var file_name = req.file.filename;
    var file_path = req.file.path;
    var original_name = req.file.originalname;
    var name_split = original_name.split('.');
    var img_extens = name_split[1];

    if (img_extens != 'png' && img_extens != 'jpg' && img_extens != 'jpeg' && img_extens != 'gif') {

      fs.unlink(file_path, (err) => {
        return res.status(404).send({
          status: 'error',
          message: 'formato de imagen a subir no valido....',
          format: img_extens
        });
      });
    } else {

      var articleId = req.params.id;

      articleModel.findOneAndUpdate({ _id: articleId }, { image: file_name }, { new: true }, (err, articleUpdated) => {


        if (err || !articleUpdated) {
          return res.status(500).send({
            status: 'error',
            message: 'Error al guardar la imagen'
          });
        } else {
          return res.status(200).send({
            status: 'success',
            article: articleUpdated
          });
        }
      });
    }
  },

  //------------------------Guardar Paginas del capitulo del libro----------------------------------------------------
  uploadPages: (req, res) => {

    if (!req.file) {
      return res.status(404).send({
        status: 'error',
        message: 'Imagen no subida...'
      });
    }

    var file_name = req.file.filename;
    var file_path = req.file.path;
    var original_name = req.file.originalname;
    var name_split = original_name.split('.');
    var img_extens = name_split[1];

    if (img_extens != 'pdf') {
      fs.unlink(file_path, (err) => {
        return res.status(404).send({
          status: 'error',
          message: 'formato de imagen a subir no valido....',
          format: img_extens
        });
      });
    }else{

      var articleId = req.params.id;

      let update = {
       $push: {
         chapters: {
           imgpage: {
             imagep: file_name
           }
         }
       } 
      };

      articleModel.findOneAndUpdate({_id: articleId}, update, {new:true}, (err, articleUpdated)=>{
        if (err || !articleUpdated) {
          return res.status(404).send({
            status: 'error',
            message: 'No se ha podido guardar el archivo'
          });
        }else{
          return res.status(200).send({
            status: 'success',
            article: articleUpdated
          });
        }
      });
            
    }
  },

  //------------------------Mostrar imagen de portada----------------------------------------------------------------
  getCoverImage: (req, res) => {

    var filename = req.params.image;
    var filepath = './images/imgcoverpages/'+filename;

    fs.exists(filepath, (exists)=>{
      if (exists) {
        return res.sendFile(path.resolve(filepath));
      }else{
        return res.status(200).send({
          status: 'error',
          message: 'El archivo no existe...'
        });
      }
    });
  },

  //------------------------Buscar libro-----------------------------------------------------------------------------
  search: (req, res) => {

    var seachString = req.params.search;

    articleModel.find({
      "$or": [
        { "title": { "$regex": seachString, "$options": "i" }},
        { "description": { "$regex": seachString, "$options": "i" } }
      ]
    }).sort([['date', 'descending']]).exec((err, articles)=>{
      if (err) {
        return res.status(404).send({
          status: 'error',
          message: 'No hay libros con los parametros a buscar....'
        });
      }else{
        return res.status(200).send({
          status: 'success',
          articles
        });
      }
    });
  }

}; //final del controller

module.exports = controller;
