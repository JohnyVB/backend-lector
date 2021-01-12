const validator = require("validator");
const articleModel = require("../models/articleModel");
const userModel = require('../models/userModel');
const chapterModel = require('../models/chapterModel');
const fs = require('fs');
const path = require('path');
const { log } = require("console");


const controller = {

  //------------------------Articulos populate capitulos-------------------------------------------------------------
  getChaptersPopulate: (req, res) => {

    const articleId = req.params.id;
    const reader = req.params.reader;

    if (!articleId) {
      return res.status(404).send({
        status: "error",
        message: "Libro no encontrado!!",
      });
    }

    if (reader === 'true') {
      chapterModel.findOne({_id: articleId}).exec((err, article)=>{
        if (err) {
          return res.status(404).send({
            status: "error",
            message: "Error al traer el capitulo"
          });
        }

        if (!article) {
          return res.status(404).send({
            status: "error",
            message: "NO hay articulo..."
          });
        }

        return res.status(200).send({
          status: "success",
          article
        });
      });
    }else{
      articleModel.findOne({ _id: articleId }).populate({ path: 'chapter', options: { sort: { numcap: -1 } } }).exec((err, article) => {
        if (err) {
          return res.status(404).send({
            status: "error",
            message: "Error en la consulta populate",
            err
          });
        } else {
          return res.status(200).send({
            status: "success",
            article,
          });
        }
      });
    }
  },

  //------------------------Mostrar todos los libros por ultimo capitulo mas populate limit 12--------------------------------
  getArticlesPopulateLimit: (req, res) => {
    articleModel.find({}).populate('chapter').sort({ chapter: -1 }).limit(12).exec((err, articlesPopulate) => {
      if (err || !articlesPopulate) {
        return res.status(404).send({
          status: "error",
          message: 'Error al devolver los articulos',
          err

        });
      } else {
        return res.status(200).send({
          status: 'success',
          articlesPopulate
        });
      }
    });
  },

  //------------------------Mostrar todos los libros por ultimo capitulo mas populate limit lastchapters--------------------
  getArticlesPopulate: (req, res) => {
    articleModel.find({}).populate('chapter').sort({ chapter: -1 }).exec((err, articlesPopulate) => {
      if (err || !articlesPopulate) {
        return res.status(404).send({
          status: "error",
          message: 'Error al devolver los articulos',
          err

        });
      } else {
        return res.status(200).send({
          status: 'success',
          articlesPopulate
        });
      }

    });
  },

  //------------------------Guardar libros-------------------------------------------------------------
  saveArticle: (req, res) => {
    //Recoger parametros por post
    const { title, description, type, genders, state } = req.body;
    const userId = req.params.id;


    //Validar datos (validator)
    try {
      var validate_title = !validator.isEmpty(title);
      var validate_description = !validator.isEmpty(description);
      var validate_type = !validator.isEmpty(type);
    } catch (err) {
      return res.status(400).send({
        status: "error",
        message: "faltan datos por enviar !!!",
        err
      });
    }

    if (
      validate_title &&
      validate_description &&
      validate_type
    ) {
      //Crear el objeto a guardar
      var articleM = new articleModel();

      //Asignar valores
      articleM.title = title;
      articleM.description = description;
      articleM.type = type;
      articleM.genders = genders;
      articleM.state = state;

      //Guardar el articulo
      articleM.save((err, articleStored) => {
        if (err || !articleStored) {
          return res.status(404).send({
            status: "error",
            message: "Los datos no se han guardado correctamente !!!",
          });
        } else {

          let update = {
            $push: {
              article: articleStored._id
            }
          };

          userModel.findByIdAndUpdate({ _id: userId }, update, { new: true }, (err, userUpdated) => {
            if (err) {
              return res.status(400).send({
                status: "error",
                message: "Error al guardar el id del libro al usuario",
                error: err
              });
            }

            if (!userUpdated) {
              return res.status(401).send({
                status: "error",
                message: "Error, no existe el usuario con id:" + articleStored._id,
                user: userUpdated
              });
            }

            return res.status(200).send({
              status: "success",
              articleStored,
              userUpdated
            });
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

  //------------------------Listar todos los libros por orden alfabetico del titulo limit 12 home books---------------------------
  getArticlesLimit: (req, res) => {
    articleModel.find({}).sort({ date: -1 }).limit(12).exec((err, articles) => {
      if (err || !articles) {
        return res.status(404).send({
          status: "error",
          message: "Error al devolver los articulos",
        });
      } else {
        return res.status(200).send({
          status: "success",
          articles,
        });
      }
    });
  },

  //------------------------Listar todos los libros por ultimo añadido no limit lastbooks----------------------------------------------
  getArticlesUltimosArt: (req, res) => {
    articleModel
      .find({})
      .sort({ date: -1 })
      .exec((err, articles) => {
        if (err || !articles) {
          return res.status(404).send({
            status: "error",
            message: "Error al devolver los articulos",
          });
        } else {
          return res.status(200).send({
            status: "success",
            articles,
          });
        }
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
        } else {
          return res.status(200).send({
            status: "success",
            articles,
          });
        }
      });
  },

  //------------------------Listar un solo libro---------------------------------------------------
  getArticle: (req, res) => {

    const articleId = req.params.id;

    if (!articleId || articleId == null || articleId == undefined) {
      return res.status(404).send({
        status: "error",
        message: "Libro no encontrado!!",
      });
    } else {
      articleModel.findById(articleId, (err, article) => {
        if (err || !article) {
          return res.status(500).send({
            status: "error",
            message: "No se pudo cargar el libro!!",
          });
        } else {
          return res.status(200).send({
            status: "success",
            article
          });
        }
      });
    }


  },

  getArticleXchapter: (req, res) => {
    const chapterId = req.params.chapterId;

    if (!chapterId) {
      return res.status(404).send({
        status: 'error',
        message: 'ID del capitulo vacio'
      });
    } else {
      articleModel.findOne({ chapter: chapterId }).exec((err, article) => {
        if (err) {
          return res.status(404).send({
            status: 'error',
            message: 'Error en la consulta',
            err
          });
        }

        if (!article) {
          return res.status(404).send({
            status: 'error',
            message: 'No encontro ningun articulo que coincide',
            article
          });
        }

        return res.status(200).send({
          status: 'success',
          article
        });
      });
    }


  },

  //------------------------Borrar un libro------------------------------------------------------------------
  deleteArticle: (req, res) => {

    const articleId = req.params.id;

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

      if (articleRemoved.image != "" || articleRemoved.image != null || articleRemoved.image != undefined) {
        fs.unlink('./images/imgcoverpages/' + articleRemoved.image, (err) => {

          if (err) {
            return res.status(400).send({
              status: 'error',
              message: 'Error al eliminar la imagen de portada',
              err
            });
          }
        });
      }

      //Funcion eliminar lo capitulos del libro
      if (articleRemoved.chapter.length != 0 || articleRemoved.chapter != "" || articleRemoved.chapter != undefined || articleRemoved.chapter != null) {
        articleRemoved.chapter.forEach(chapter => {
          chapterModel.findOneAndDelete({ _id: chapter }, (err, chapterRemoded) => {
            if (err) {
              return res.status(400).send({
                status: "error",
                message: "Error al eliminar los capitulos",
                err
              });
            }

            if (!chapterRemoded) {
              return res.status(400).send({
                status: "error",
                message: "El capitulo ya no existe!!",
                chapterRemoded
              });
            }

            fs.unlink('./images/imgpages/' + chapterRemoded.imgpage, (err) => {
              if (err) {
                return res.status(400).send({
                  status: 'error',
                  message: 'Error al eliminar el archivo del capitulo',
                  err
                });
              }
            });
          });
        });
      }

      let updated = {
        $pull: {
          article: articleId
        }
      }

      userModel.findOneAndUpdate({ article: articleId }, updated, { new: true }, (err, userUpdated) => {
        if (err) {
          return res.status(404).send({
            status: 'error',
            message: 'Error al eliminar la referencia en usuario',
            err
          });
        }

        if (!userUpdated) {
          return res.status(404).send({
            status: 'error',
            message: 'Error al eliminar la referencia en usuario vacio',
            err
          });
        }

        return res.status(200).send({
          status: "success",
          message: "Libro eliminado con exito y su refenrecia en usuarios con sus respectivos capitulos asociados"
        });
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

  //------------------------Mostrar imagen de portada----------------------------------------------------------------
  getCoverImage: (req, res) => {

    const filename = req.params.image;
    const filepath = './images/imgcoverpages/' + filename;
    /*
    fs.exists(filepath, (exists) => {
      if (exists) {
        return res.sendFile(path.resolve(filepath));
      } else {
        return res.status(200).send({
          status: 'error',
          message: 'El archivo no existe...'
        });
      }
    });
  */
    fs.stat(filepath, (err) => {
      if (!err) {
        return res.sendFile(path.resolve(filepath));
      } else {
        return res.status(200).send({
          status: 'error',
          message: 'El archivo no existe...'
        });
      }
    });
  },

  getDefaultImage: (req, res) => {
    const filename = req.params.image;
    const filepath = "./images/" + filename;

    fs.stat(filepath, (err) => {
      if (!err) {
        return res.sendFile(path.resolve(filepath));
      } else {
        return res.status(200).send({
          status: 'error',
          message: 'El archivo no existe...'
        });
      }
    });
  },

  //------------------------Actualizar libro---------------------------------------------------------------------
  updateArticle: (req, res) => {

    const articleId = req.params.id;
    const params = req.body;

    articleModel.findOneAndUpdate({ _id: articleId }, params, { new: true }, (err, articleUpdated) => {

      if (err) {
        return res.status(404).send({
          status: "error",
          message: "Error al actualizar",
          err
        });
      }

      if (!articleUpdated) {
        return res.status(404).send({
          status: "error",
          message: "Error al actualizar vacio",
          articleUpdated
        });
      }

      return res.status(200).send({
        status: "success",
        articleUpdated
      });


    });
  },

  //------------------------Buscar libro-----------------------------------------------------------------------------
  search: (req, res) => {

    const seachString = req.params.search;

    articleModel.find({
      "$or": [
        { "title": { "$regex": seachString, "$options": "i" } },
        { "description": { "$regex": seachString, "$options": "i" } }
      ]
    }).sort([['date', 'descending']]).exec((err, articles) => {
      if (err) {
        return res.status(404).send({
          status: 'error',
          message: 'No hay libros con los parametros a buscar....'
        });
      } else {
        return res.status(200).send({
          status: 'success',
          articles
        });
      }
    });
  }

}; //final del controller

module.exports = controller;
