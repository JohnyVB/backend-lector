'use strict'

const mongoose = require('mongoose');
const app = require('./app');
const port = 3900;

mongoose.Promise = global.Promise;
mongoose.set('useFindAndModify', false);

mongoose
  .connect("mongodb://'root':''@ds125486.mlab.com:25486/heroku_rdjrb2g0", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(() => {
    console.log("La conexion a la base de datos se ha conectado correctamente!!!");

    //Crear servidor y escuchar peticiones HTTP
    app.listen(port, () => {
       console.log('Servidor corriendo en http://localhost:'+port);
        
    });
  });

