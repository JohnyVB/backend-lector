const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middleware/validarCampos');
const { validarJWT, esAdminRole } = require('../middleware/validarJWT');
const { emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');
const { getUser, getUserPorToken, getUsers, saveUser, putUser, patchUser } = require('../controllers/userController');

const router = Router();

router.get('/:id', [
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
], getUser);

router.get('/key/:token', [
    check('token', 'El token es obligatorio').not().isEmpty(),
    check('token', 'El token debe ser valido').isJWT(),
    validarCampos
], getUserPorToken);

router.get('/', getUsers);

router.post('/', [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('lastname', 'El apellido es obligatorio').not().isEmpty(),
    check('email', 'El correo no es valido').isEmail(),
    check('email').custom(emailExiste),
    check('password', 'El password debe ser mas de 6 digitos').isLength({ min: 6}),
    validarCampos
], saveUser);

router.put('/:id', [
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
], putUser);

router.patch('/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
], patchUser);

module.exports = router;