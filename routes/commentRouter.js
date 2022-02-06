const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middleware/validarCampos');
const { validarJWT } = require('../middleware/validarJWT');
const { existeComentarioPorId } = require('../helpers/db-validators');
const { getComments, saveComment, putComment, patchComment } = require('../controllers/commentController');
const { coleccionesPermitidas } = require('../helpers/db-validators');
const { validarPropiedad } = require('../middleware/validarPropiedad');

const router = Router();

router.post('/:coleccion/:id/:order',[
    check('id', 'El ID de la entidad es obligatorio').not().isEmpty(),
    check('id', 'El ID de la entidad debe ser valido').isMongoId(),
    check('coleccion').custom(coleccion => coleccionesPermitidas(coleccion, ['article', 'chapter'])),
    validarCampos
], getComments)

router.post('/:coleccion/:id', [
    validarJWT,
    check ('id', 'El ID de la entidad es obligatorio').not().isEmpty(),
    check('id', 'El ID de la entidad debe ser valido').isMongoId(),
    check('coleccion').custom(coleccion => coleccionesPermitidas(coleccion, ['article', 'chapter'])),
    check('text', 'El texto del comentario es obligatorio').not().isEmpty(), 
    validarCampos
], saveComment);

router.put('/:id', [
    validarJWT,
    check('id', 'El ID de la entidad es obligatorio').not().isEmpty(),
    check('id', 'El ID de la entidad debe ser valido').isMongoId(),
    check('id').custom(existeComentarioPorId),
    check('text', 'El campo de texto es obligatorio').not().isEmpty(),
    validarPropiedad,
    validarCampos
], putComment);

router.patch('/:id', [
    validarJWT,
    check('id', 'El ID de la entidad es obligatorio').not().isEmpty(),
    check('id', 'El ID de la entidad debe ser valido').isMongoId(),
    check('id').custom(existeComentarioPorId),
    validarPropiedad,
    validarCampos
], patchComment);

module.exports = router;