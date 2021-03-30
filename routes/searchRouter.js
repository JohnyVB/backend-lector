const { Router } = require('express');
const { check } = require('express-validator');

const { getData } = require('../controllers/searchController');


const router = Router();


router.get('/:search', [
    check('search', 'El campo de busqueda es obligatorio').not().isEmpty()
], getData);



module.exports = router;