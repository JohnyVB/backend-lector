"use strict";

//Imports generales para el funcionamiento
const express = require("express");
const ArticleController = require("../controllers/articleController");
const UserController = require("../controllers/userController");
const ChapterController = require("../controllers/chapterController");
const CommentController = require("../controllers/commentController");
const NotifyController = require("../controllers/notifyController");
const EmailController = require('../controllers/emailController');
const ListController = require('../controllers/listController');
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
router.delete("/delete-book/:id", autentication.ensureAuthenticated, ArticleController.deleteArticle);
router.post("/upload-coverpages/:id", md_uploadCoverPages.single('file0'), ArticleController.uploadCoverPages); //Subir imagen de portada
router.get("/get-coverimage/:image", ArticleController.getCoverImage); //Mostrar portada de la imagen
router.get("/get-defaultimage/:image", ArticleController.getDefaultImage);
router.get("/search/:search", ArticleController.search); //Buscar libro
router.get("/get-chapters-populate/:id/:reader", ArticleController.getChaptersPopulate);
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
router.get("/get-image-user/:image?", UserController.getCoverImageUser);
router.get("/get-user/:id", UserController.getUser);//Listar un usuario
router.put("/update-user/:id", autentication.ensureAuthenticated, UserController.updateUser);//Actualizar un usuario
router.delete("/delete-user/:id", autentication.ensureAuthenticated, UserController.deleteUser);//Eliminar usuario
router.get("/get-user-populate/:id", UserController.getArticlesPopulate);
router.get("/get-userxarticle/:id/:reader", UserController.getUserXArticle);
router.get("/get-userxemail/:email", UserController.getUserXEmail);

//Rutas de comentarios
router.get("/get-commentspopulate/:id/:reader", CommentController.getCommentsPopulate);
router.get("/get-comments", CommentController.getComments);
router.get("/get-comment/:id", CommentController.getComment);
router.post("/save-comment/:id/:reader", autentication.ensureAuthenticated, CommentController.saveComment);
router.put("/update-comment/:id", CommentController.updateComment);
router.get("/search-comment/:searchComment",CommentController.searchComment);
router.delete("/delete-comment/:id", CommentController.deleteComment);

//Rutas notificaciones
router.get("/get-notify/:id", NotifyController.getNotifyPopulate);
router.post("/save-notify/:id", autentication.ensureAuthenticated, NotifyController.saveNotify);
router.put("/update-alert-notify/:id", autentication.ensureAuthenticated, NotifyController.updateAlertNotify);

//Rutas de envio de correo
router.post("/send-email-user/:email", autentication.ensureAuthenticated, EmailController.sendEmailUser);

//Rutas de lista
router.get("/get-list/:id", autentication.ensureAuthenticated, ListController.getList);
router.post("/save-list/:id", autentication.ensureAuthenticated, ListController.saveList);
router.put("/add-book-list/:id", autentication.ensureAuthenticated, ListController.addBookToList);
router.put("/edit-list/:id", autentication.ensureAuthenticated, ListController.editList);
router.delete("/delete-list/:id", autentication.ensureAuthenticated, ListController.deleteList);
router.get("/delete-booklist/:id", autentication.ensureAuthenticated, ListController.deleteBookList);
router.get("/get-list-article/:id", autentication.ensureAuthenticated, ListController.getListArticle);
router.put("/update-user-list/:id", autentication.ensureAuthenticated, ListController.updateUserList);

// Rutas de autenticación y login
router.post("/save-user", UserController.saveUser); //Guardar usuario
router.post("/login", UserController.login);
router.get("/get-usertoken/:token", UserController.getUserToken);
router.get("/get-userxtoken/:token", UserController.getUserToken);

router.get("/error", CommentController.error);


module.exports = router;
