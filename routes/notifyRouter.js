const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middleware/validarCampos');
const { validarJWT } = require('../middleware/validarJWT');


const { getNotifys, updateAlertNotify } = require('../controllers/notifyController');


const router = Router();


router.get('/:id', [
    validarJWT,
    check('id', 'El id del usuario es obligatorio').not().isEmpty(),
    validarCampos
], getNotifys);


router.patch('/:id', [
    validarJWT,
    validarCampos
], updateAlertNotify)



module.exports = router;