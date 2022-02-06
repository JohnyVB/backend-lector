const { request, response } = require('express');

const articleModel = require('../models/articleModel');

const controller = {
    getData: async (req = request, res = response) => {

        try {
            const { search } = req.params;
            const regex = new RegExp(search, 'i');
            const articulos = await articleModel.find({
                state: true, 
                $or: [
                    { title: regex }, 
                    { genders: regex },
                    { type: regex },
                    { progress: regex }
                ] 
            });

            return res.status(200).send({
                total: articulos.length,
                articulos
            });
        } catch (error) {
            return res.status(401).send({
                msg: 'Error en getData',
                error
            });
        }   
    }
};

module.exports = controller