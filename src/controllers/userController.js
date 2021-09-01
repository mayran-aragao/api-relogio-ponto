const Models = require('../models/User')
const Loja = require('../models/Loja')
const { Op } = require("sequelize");
const jwt = require('jsonwebtoken')
const emailController = require('../controllers/emailController')
const md5 = require('md5')

module.exports = {

    signin: async (req, res) => {
        try {
            let user = await Models.User.findOne({
                where: {
                    [Op.and]: [{ matricula: req.body.matricula }, { email: req.body.email },{valido:true}]
                }
            })
            if (user) {
                
                const token = jwt.sign({
                    cd_empresa: user.cd_empresa,
                    nome: user.nome,
                    matricula: user.matricula,
                    email: user.email,
                    valido: user.valido,
                },
                    process.env.JWT_KEY,
                    {
                        expiresIn: "24h"
                    })
                return res.json({ error: '', token, user  })

            }
            return res.json({ error: 'Usuário nao cadastrado'})

        } catch (e) {
            res.json({ error: "Impossivel logar! Verifique os dados ou tente novamente mais tarte!" + e })
        }
    },
    signup: async (req, res) => {
        try {
            emailController.verificar_email(req.body.email, async (error, info) => {
                if (info.success == true) {

                    let verificacao = await Models.User.findOne({
                        where: {
                            [Op.or]: [{ matricula: req.body.matricula }, { email: req.body.email }]
                        }
                    })

                    if (verificacao) {
                        return res.json({ error: "Dados já cadastrado" })

                    }

                    let ver_matricula = await Models.Funcionario.findOne({
                        where: {
                            matricula: req.body.matricula
                        }
                    })

                    if (ver_matricula) {
                        let secret = md5(req.body.matricula + ver_matricula.cd_empresa)
                        emailController.send_email(req.body.email, secret)
                        let loja = await Loja.findOne({
                            where:{
                                sg_loja: ver_matricula.cd_empresa
                            }
                        })
                        let user = await Models.User.create({
                            nome: (ver_matricula.nome).trim(),
                            matricula: req.body.matricula,
                            cd_empresa: ver_matricula.cd_empresa,
                            email: req.body.email,
                            valido: false,
                            hash: secret,
                            nr_pis: ver_matricula.nr_pis,
                            cnpj: loja.nr_cgc
                        })

                        return res.json({ error: '', success: 'Enviamos uma confirmação para o e-mail!' })

                    }
                    return res.json({ error: 'Matricula não encontrada' })

                }
                return res.json({ error: 'E-mail invalido' })

            })

        } catch (e) {
            return res.json({ error: "Impossivel cadastrar! Verifique os dados ou tente novamente mais tarte! " + e })
        }
    }
}