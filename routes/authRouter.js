const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middleware/validarCampos');
const { login, renewToken } = require('../controllers/authController');
const { validarJWT } = require('../middleware/validarJWT');

const router = Router();

router.post('/login',[
    check('email', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
], login);

router.get('/renewtoken'[
    validarJWT
], renewToken);


module.exports = router;