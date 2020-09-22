'use strict'

const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config');

mongoose.Promise = global.Promise;
mongoose.set('useFindAndModify', false);


//------------------mongodb local------------------------------//

/* 
mongoose.connect("mongodb://localhost:27017/api-rest-lector", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(() => {
    console.log("La conexion a la base de datos se ha conectado correctamente!!!");

    //Crear servidor y escuchar peticiones HTTP
    app.listen(config.PORT, () => {
       console.log('Servidor corriendo en http://localhost:'+config.PORT);
        
    });
  });

*/
//------------------mongodb atlas------------------------------//

mongoose.connect("mongodb+srv://root:root3517@cluster0.p9hkj.mongodb.net/api-rest-lector?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
})
  .then(() => {
    console.log("La conexion a la base de datos se ha conectado correctamente!!!");

    //Crear servidor y escuchar peticiones HTTP
    app.listen(config.PORT, () => {
      console.log('Servidor de BACKEND-LECTOR corriendo en el puerto: ' + config.PORT);

    });
  });
