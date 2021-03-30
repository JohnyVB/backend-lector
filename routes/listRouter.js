const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middleware/validarCampos');
const { existeUsuarioPorId, existeArticuloPorId, existeListaPorId } = require('../helpers/db-validators');
const { validarJWT } = require('../middleware/validarJWT');
const { getLists, getListsPorArticle, saveList, addBookToList, editList, deleteList, deleteBookList } = require('../controllers/listController');


const router = Router();

router.get('/:id', [
    validarJWT,
    check('id', 'El id del usuario es obligatorio').not().isEmpty(),
    check('id', 'El id debe ser de MongoDB').isMongoId(),
    check('id').custom(existeUsuarioPorId) ,
    validarCampos
], getLists);

router.get('/article/:id/:article', [
    validarJWT,
    check('id', 'El id del usuario es obligatorio').not().isEmpty(),
    check('id', 'El id debe ser de MongoDB').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('article', 'El id del articulo es obligatorio').not().isEmpty(),
    check('article', 'El id debe ser de MongoDB').isMongoId(),
    check('article').custom(existeArticuloPorId),
    validarCampos
], getListsPorArticle);

router.post('/', [
    validarJWT,
    check('name', 'El nombre de la lista es obligatorio').not().isEmpty(),
    validarCampos
], saveList);

router.put('/:id', [
    validarJWT,
    check('id', 'El id debe ser de MongoDB').isMongoId(),
    check('id').custom(existeListaPorId),
    validarCampos
], addBookToList);

router.put('/editlist/:id', [
    validarJWT,
    check('id', 'El id debe ser de MongoDB').isMongoId(),
    check('id').custom(existeListaPorId),
    validarCampos
], editList);

router.patch('/:id', [
    validarJWT,
    check('id', 'El id debe ser de MongoDB').isMongoId(),
    check('id').custom(existeListaPorId),
    validarCampos
], deleteList);

router.patch('/deletebook/:id', [
    validarJWT,
    check('id', 'El id debe ser de MongoDB').isMongoId(),
    check('id').custom(existeListaPorId),
    validarCampos
], deleteBookList)


module.exports = router;