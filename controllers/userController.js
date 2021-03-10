const fs = require('fs');
const { response, request } = require('express');
const bcrypt = require('bcryptjs');
const path = require('path');

const userModel = require('../models/userModel');


const controller = {
    getUser: async(req = request, res = response) => {

        const { id } = req.params;

        const usuario = await userModel.findById(id);

        res.status(200).send({
            usuario
        });
    },

    getUsers: async (req = request, res = response) => {

        const { fin = 10, inicio = 0} = req.query;
        const query = { state: true };

        const [ total, usuarios ] = await Promise.all([
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

        const { name, lastname, email, password } = req.body;
        const usuario = new userModel({ name, lastname, email, password });

        const salts = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salts);

        await usuario.save()

        res.status(200).send({
            usuario
        });

    },

    putUser: async (req = request, res = response) => {
        const { id } = req.params;
        const { _id, password, email, ...user } = req.body;

        if (password) {
            const salts = bcrypt.genSaltSync();
            user.password = bcrypt.hashSync(password, salts);
        }

        const usuario = await userModel.findByIdAndUpdate(id, user, { new: true});

        res.status(200).send({
            usuario
        });
    },

    patchUser: async (req = request, res = response) => {
        const { id } = req.params;
        const usuario = await userModel.findByIdAndUpdate(id, { state: false}, { new: true });

        res.status(200).send({
            usuario
        });
    }


};

module.exports = controller;