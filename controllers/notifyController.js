const { request, response } = require('express');


const notifyModel = require('../models/notifyModel');

const controller = {
    getNotifys: async (req = request, res = response) => {
        const { id } = req.params;

        const [notificacion, totalNews] = await Promise.all([
            notifyModel.find({ user: id })
                .sort({ date: -1 })
                .populate(['userPost', 'data.article', 'data.chapter']),
            notifyModel.countDocuments({ user: id, alert: true })
        ])

        res.status(200).send({
            notificacion,
            totalNews
        });
        
    },

    
    updateAlertNotify: async (req = request, res = response) => {
        const { id } = req.params;
        const update = req.body;

        const notificacion = await notifyModel.findOneAndUpdate({ _id: id }, update, { new: true });

        res.status(200).send({
            notificacion
        });

    }
};

module.exports = controller;