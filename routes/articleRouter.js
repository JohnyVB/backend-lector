const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middleware/validarCampos');
const { validarJWT } = require('../middleware/validarJWT');
const { validarPropiedad } = require('../middleware/validarPropiedad');
const { getArticle, getArticles, getArticlesPorUser, saveArticle, putArticle, patchArticle } = require('../controllers/articleController');
const { existeArticuloPorId } = require('../helpers/db-validators');

const router = Router();

router.get('/:id', [
    check('id', 'El ID es obligatorio').not().isEmpty(),
    check('id', 'El ID debe ser valido').isMongoId(),
    validarCampos
], getArticle);


router.post('/', getArticles);

router.get('/user/:id', [
    check('id', 'El ID es obligatorio').not().isEmpty(),
    check('id', 'El ID debe ser valido').isMongoId(),
    validarCampos
], getArticlesPorUser)

router.post('/', [
    validarJWT,
    check('title', 'El titulo es obligatorio').not().isEmpty(),
    check('type', 'El tipo del libro es obligatorio').not().isEmpty(),
    check('progress', 'El estado del libro es obligatorio').not().isEmpty(),
    check('genders', 'Ingrese por lo menos 1 genero').not().isEmpty(),
    validarCampos
], saveArticle);

router.put('/:id', [
    validarJWT,
    check('id', 'El ID es obligatorio').not().isEmpty(),
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeArticuloPorId),
    validarPropiedad,
    validarCampos
], putArticle);

router.patch('/:id', [
    validarJWT,
    check('id', 'El ID es obligatorio').not().isEmpty(),
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeArticuloPorId),
    validarPropiedad,
    validarCampos
], patchArticle)

module.exports = router;