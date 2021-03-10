const { Router } = require('express');
const { check } = require('express-validator');

const { coleccionesPermitidas } = require('../helpers/db-validators')
const { validarCampos } = require('../middleware/validarCampos');
const { validarArchivo } = require('../middleware/validarArchivo');
const { actualizarImagenCloudinary } = require('../controllers/uploadsController');


const router = Router();

router.patch('/:coleccion/:id', [
    validarArchivo,
    check('id', 'El ID de la entidad es obligatoria').not().isEmpty(), 
    check('id', 'El ID debe ser de Mongo').isMongoId(),
    check('coleccion', 'La coleccion es obligatoria').not().isEmpty(),
    check('coleccion').custom(coleccion => coleccionesPermitidas(coleccion, ['users', 'articles', 'chapters'])),
    validarCampos
], actualizarImagenCloudinary);


module.exports = router;