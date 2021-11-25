const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middleware/validarCampos');
const { login, renewToken, activateUser } = require('../controllers/authController');
const { validarJWT } = require('../middleware/validarJWT');

const router = Router();

router.post('/login',[
    check('email', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
], login);

router.get('/renewtoken',[
    validarJWT
], renewToken);

router.put('/activateuser', [
    check('email', 'El correo es obligatorio').isEmail(),
    check('code', 'El codigo de verificación es obligatorio').not().isEmpty(),
    validarCampos
], activateUser)


module.exports = router;