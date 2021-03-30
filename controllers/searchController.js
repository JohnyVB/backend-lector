const { request, response } = require('express');

const articleModel = require('../models/articleModel');

const controller = {
    getData: async (req = request, res = response) => {

        const { search } = req.params;
        const regex = new RegExp(search, 'i');
        const data = await articleModel.find({ 
            $or: [
                { title: regex }, 
                { genders: regex },
                { type: regex },
                { progress: regex }
            ]
        });

        res.status(200).send({
            data
        });
    }
};

module.exports = controller