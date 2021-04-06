const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const { dbConnection } = require('../database/config');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.server = require('http').createServer(this.app);
        this.io = require('socket.io')(this.server);

        this.path = {
            auth: '/api/auth',
            users: '/api/users',
            uploads: '/api/uploads',
            articles: '/api/articles',
            chapters: '/api/chapters',
            comments: '/api/comments',
            searchs: '/api/searchs',
            lists: '/api/lists',
            notifys: '/api/notifys'
        }


        // Conectar a base de datos
        this.conectarDB();

        // Middlewares
        this.middlewares();

        // Rutas de mi aplicación
        this.routes();
    }

    async conectarDB() {
        await dbConnection();
    }


    middlewares() {

        // CORS
        this.app.use(cors());

        // Lectura y parseo del body
        this.app.use(express.json());

        // Directorio Público
        this.app.use(express.static('public'));

        //Carga de archivos
        this.app.use(fileUpload({
            useTempFiles: true,
            tempFileDir: '/tmp/',
            createParentPath: true
        }));

    }

    routes() {

        this.app.use(this.path.auth, require('../routes/authRouter'));
        this.app.use(this.path.users, require('../routes/userRouter'));
        this.app.use(this.path.uploads, require('../routes/uploadsRouter'));
        this.app.use(this.path.articles, require('../routes/articleRouter'));
        this.app.use(this.path.chapters, require('../routes/chapterRouter'));
        this.app.use(this.path.comments, require('../routes/commentRouter'));
        this.app.use(this.path.searchs, require('../routes/searchRouter'));
        this.app.use(this.path.lists, require('../routes/listRouter'));
        this.app.use(this.path.notifys, require('../routes/notifyRouter'));
    }

    listen() {
        this.server.listen(this.port, () => {
            console.log('Servidor corriendo en puerto', this.port);
        });
    }

}




module.exports = Server;