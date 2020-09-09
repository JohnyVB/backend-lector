"use strict";

//Imports generales para el funcionamiento
const express = require("express");
const ArticleController = require("../controllers/articleController");
const UserController = require("../controllers/userController");
const ChapterController = require("../controllers/chapterController");
const router = express.Router();
const multer = require('multer');
const path = require('path');
const autentication = require('../middleware/authentication');

//Configuracion para subir imagen de portada
let storage1 = multer.diskStorage({
    destination: (req, res, cb) =>{
        cb(null, './images/imgcoverpages');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
//Configuracion para subir imagenes del capitulo
let storage2 = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, './images/imgpages');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
//Configuracion para subir imagenes del usuario
let storage3 = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, './images/imgusers');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
//Url subir imagen de portada
const md_uploadCoverPages = multer({
    storage: storage1
});
//Url subir imagenes del capitulo
const md_uploadPages = multer({
    storage: storage2
});
//Url subir imagenes del usuario
const md_uploadUsers = multer({
    storage: storage3
});



//Rutas del libro
router.post("/save-book/:id", autentication.ensureAuthenticated, ArticleController.saveArticle); //Guardar libro
router.put("/update-article/:id", autentication.ensureAuthenticated, ArticleController.updateArticle); //Actualizar libro
router.get("/libraryHome", ArticleController.getArticlesLimit); //Mostrar todos los libros en general
router.get("/library", ArticleController.getArticlesUltimosArt); //Mostrar libros ordenados por el ultimo
router.get("/last-caps", ArticleController.getArticlesUltimosCaps); //Mostrar los libros por ultimo capitulo añadido
router.get("/book/:id", ArticleController.getArticle); //Mostrar un libro
router.delete("/delete-book/:id", autentication.ensureAuthenticated, ArticleController.deleteArticle);//Borrar un libro
router.post("/upload-coverpages/:id", md_uploadCoverPages.single('file0'), ArticleController.uploadCoverPages); //Subir imagen de portada
router.get("/get-coverimage/:image", ArticleController.getCoverImage); //Mostrar portada de la imagen
router.get("/search/:search", ArticleController.search); //Buscar libro
router.get("/get-chapters-populate/:id", ArticleController.getChaptersPopulate);
router.get("/get-article-populate", ArticleController.getArticlesPopulateLimit);
router.get("/get-articles-chapter", ArticleController.getArticlesPopulate);
router.get("/get-articlexchapter/:chapterId", ArticleController.getArticleXchapter);

//Rutas de las paginas
router.post("/save-chapter/:id", autentication.ensureAuthenticated, ChapterController.saveChapter); //Guardar capitulo con sus paginas
router.put("/upload-pages/:id", autentication.ensureAuthenticated, md_uploadPages.single('file0'), ChapterController.uploadPages);//Subir imagenes del capitulo en pdf
router.delete("/delete-chapter/:id", autentication.ensureAuthenticated, ChapterController.deleteChapter); //Borrar capitulo
router.put("/update-chapter/:id", autentication.ensureAuthenticated, ChapterController.updateChapter); //Actualizar capitulo
router.get("/get-chapter/:id", ChapterController.getChapter); //Obtener un capitulo
router.get("/get-imgpages/:image", ChapterController.getImgpage);

//Rutas usuario
router.post("/upload-user/:id", md_uploadUsers.single('file0'), UserController.uploadImage);//Subir y tambien actualizar imagen de usuario
router.get("/get-users", autentication.ensureAuthenticated, UserController.getUsers);//Listar usuarios
router.get("/get-image-user/:image", UserController.getCoverImageUser);
router.get("/get-user/:id", autentication.ensureAuthenticated, UserController.getUser);//Listar un usuario
router.put("/update-user/:id", autentication.ensureAuthenticated, UserController.updateUser);//Actualizar un usuario
router.delete("/delete-user/:id", autentication.ensureAuthenticated, UserController.deleteUser);//Eliminar usuario
router.get("/get-user-populate/:id", UserController.getArticlesPopulate);
router.get("/get-userxarticle/:id", UserController.getUserXArticle);


// Rutas de autenticación y login
router.post("/save-user", UserController.saveUser); //Guardar usuario
router.post("/login", UserController.login);
router.get("/get-usertoken/");
router.get("/get-usertoken/:token", UserController.getUserToken);
router.get("/get-userxtoken/:token", UserController.getUserToken);



module.exports = router;
