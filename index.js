'use strict'

const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config');

mongoose.Promise = global.Promise;
mongoose.set('useFindAndModify', false);

mongoose.connect(config.BDPROD, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(() => {

    console.log("La conexion a la base de datos se ha conectado correctamente!!!");

    //Crear servidor y escuchar peticiones HTTP
    app.listen(config.PORT, () => {
       console.log('http://localhost:' + config.PORT + ' de BACKEND-LECTOR con la BD MONGO LOCAL en pruebas');
        
    });
  });
