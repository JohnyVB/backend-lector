const { response, request } = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userModel = require('../models/userModel');
const { sendEmailActivation } = require('../helpers/emailHandler');

const controller = {
    getUser: async (req = request, res = response) => {

        const { id } = req.params;

        const usuario = await userModel.findById(id);

        res.status(200).send({
            usuario
        });
    },

    getUserPorToken: async (req = request, res = response) => {

        const { token } = req.params;

        try {
            const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

            if (!uid) {
                return res.status(404).send({
                    msg: 'No existe token con el id'
                });
            }

            const usuario = await userModel.findById(uid);

            res.status(200).send({
                usuario
            });
        } catch (error) {
            res.status(500).send({
                error
            });
        }

    },

    getUserXarticle: async (req = request, res = response) => {
        const { id } = req.params;

        const usuario = await userModel.findOne({ article: id});

        res.status(200).send({
            usuario
        });
    },

    getUsers: async (req = request, res = response) => {

        const { fin = 10, inicio = 0 } = req.query;
        const query = { state: true };

        const [total, usuarios] = await Promise.all([
            userModel.countDocuments(query),
            userModel.find(query)
                .skip(Number(inicio))
                .limit(Number(fin))
        ]);

        res.status(200).send({
            total,
            usuarios
        });
    },

    saveUser: async (req = request, res = response) => {

        try {
            const { name, lastname, email, password } = req.body;
            const validatorNumber = Math.trunc(Math.floor(100000 + Math.random() * 900000));
            const usuario = new userModel({ name, lastname, email, password, validatorNumber });

            const salts = bcrypt.genSaltSync();
            usuario.password = bcrypt.hashSync(password, salts);

            await usuario.save();

            sendEmailActivation(email, validatorNumber);

            res.status(200).send({
                usuario
            });

        } catch (error) {
            return res.status(500).send({
                error
            });
        }

    },

    putUser: async (req = request, res = response) => {
        const { id } = req.params;
        const { _id, password, email, ...user } = req.body;

        if (password) {
            const salts = bcrypt.genSaltSync();
            user.password = bcrypt.hashSync(password, salts);
        }

        const usuario = await userModel.findByIdAndUpdate(id, user, { new: true });

        res.status(200).send({
            usuario
        });
    },

    patchUser: async (req = request, res = response) => {
        const { id } = req.params;
        const usuario = await userModel.findByIdAndUpdate(id, { state: false }, { new: true });

        res.status(200).send({
            usuario
        });
    }


};

module.exports = controller;