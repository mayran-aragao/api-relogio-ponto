const Models = require('../models/User')
const { Op } = require("sequelize");
const jwt = require('jsonwebtoken')
// require('dotenv').config();

module.exports = {

    signin: async (req, res) => {
        try {
            let user = await Models.User.findOne({
                where: {
                    matricula: req.body.matricula
                }
            })
            if (user.email != req.body.email) {
                res.json({ error: "Falha na autenticação" })
                return
            }
            if (user) {
                console.log(process.env.JWT_KEY)
                const token = jwt.sign({
                    cd_empresa: user.cd_empresa,
                    nome: user.nome,
                    matricula: user.matricula,
                    email: user.email
                },
                    process.env.JWT_KEY,
                    {
                        expiresIn: "1h"
                    })
                res.json({ error: '', token, user })

            }

        } catch (e) {
            res.json({ error: "Impossivel logar! Verifique os dados ou tente novamente mais tarte!" })
        }
    },
    signup: async (req, res) => {
        try {
            let verificacao = await Models.User.findOne({
                where: {
                    [Op.or]: [{ matricula: req.body.matricula }, { email: req.body.email }]
                }
            })
            if (verificacao) {
                res.json({ error: "Dados já cadastrado" })
                return
            }

            let ver_matricula = await Models.Funcionario.findOne({
                where: {
                    matricula: req.body.matricula
                }
            })
            if (ver_matricula) {
                let user = await Models.User.create({
                    nome:(ver_matricula.nome).trim(),
                    matricula: req.body.matricula,
                    cd_empresa:ver_matricula.cd_empresa,
                    email:req.body.email,
                })
                res.json({ error: '', success:'Enviamos uma confirmação para o e-mail!'})
            }
            res.json({ error: 'matricula nao encontrada' })

        } catch (e) {
            console.log({ error: "Impossivel cadastrar! Verifique os dados ou tente novamente mais tarte!" })
        }
    }
}