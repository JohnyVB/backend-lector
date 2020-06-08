"use strict";

//Imports generales para el funcionamiento
const express = require("express");
const ArticleController = require("../controllers/articleController");
const UserController = require("../controllers/userController");
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
router.post("/save-book", autentication.ensureAuthenticated, ArticleController.saveArticle); //Guardar libro
router.put("/save-chapter/:id", autentication.ensureAuthenticated, ArticleController.saveChapter); //Guardar capitulo con sus paginas
router.get("/library", ArticleController.getArticles); //Mostrar todos los libros en general
router.get("/last-books", ArticleController.getArticlesUltimosArt); //Mostrar libros ordenados por el ultimo
router.get("/last-caps", ArticleController.getArticlesUltimosCaps); //Mostrar los libros por ultimo capitulo añadido
router.get("/book/:id", ArticleController.getArticle); //Mostrar un libro
router.delete("/delete-book/:id", autentication.ensureAuthenticated, ArticleController.delete);//Borrar un libro
router.post("/upload-coverpages/:id", md_uploadCoverPages.single('file0'), ArticleController.uploadCoverPages); //Subir imagen de portada
router.post("/upload-pages/:id", md_uploadPages.single('file0'), ArticleController.uploadPages);
router.get("/get-coverimage/:image", ArticleController.getCoverImage);
router.get("/search/:search", ArticleController.search);

//Rutas usuario
router.post("/upload-user/:id", md_uploadUsers.single('file0'), UserController.uploadImage);//Subir ya tambien actualizar imagen de usuario
router.get("/get-users", autentication.ensureAuthenticated, UserController.getUsers);//Listar usuarios
router.get("/get-image-user", autentication.ensureAuthenticated, UserController.getCoverImageUser);
router.get("/get-user/:id", autentication.ensureAuthenticated, UserController.getUser);//Listar un usuario
router.put("/update-user/:id", autentication.ensureAuthenticated, UserController.updateUser);//Actualizar un usuario
router.delete("/delete-user/:id", autentication.ensureAuthenticated, UserController.deleteUser);

// Rutas de autenticación y login
router.post("/save-user", UserController.saveUser); //Guardar usuario
router.post("/login", UserController.login);


module.exports = router;
