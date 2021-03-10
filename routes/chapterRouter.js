const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middleware/validarCampos');
const { validarJWT } = require('../middleware/validarJWT');
const { validarPropiedad } = require('../middleware/validarPropiedad');
const { getChapter, getChapters, saveChapter, putChapter, patchChapter } = require('../controllers/chapterController');
const { existeArticuloPorId, existeCapituloPorId } = require('../helpers/db-validators')


const router = Router();

router.get('/:id', [
    check('id', 'El ID es obligatorio').not().isEmpty(),
    check('id', 'El ID debe ser valido').isMongoId(),
    validarCampos
], getChapter)

router.get('/article/:id', [
    check('id', 'El ID es obligatorio').not().isEmpty(),
    check('id', 'El ID debe ser valido').isMongoId(),
    check('id').custom(existeArticuloPorId),
    validarCampos
], getChapters);

router.post('/:id', [
    validarJWT,
    check('id', 'El ID es obligatorio').not().isEmpty(),
    check('id', 'El ID debe ser valido').isMongoId(),
    check('id').custom(existeArticuloPorId),
    check('number', 'El numero del capitulo es obligatorio').not().isEmpty(),
    check('title', 'El titulo del capitulo es obligatorio').not().isEmpty(),
    validarPropiedad,
    validarCampos
], saveChapter);

router.put('/:id',[
    validarJWT,
    check('id', 'El ID es obligatorio').not().isEmpty(),
    check('id', 'El ID debe ser valido').isMongoId(),
    check('id').custom(existeCapituloPorId),
    validarPropiedad,
    validarCampos
], putChapter);

router.patch('/:id', [
    validarJWT,
    check('id', 'El ID es obligatorio').not().isEmpty(),
    check('id', 'El ID debe ser valido').isMongoId(),
    check('id').custom(existeCapituloPorId),
    validarPropiedad,
    validarCampos
], patchChapter);

module.exports = router;