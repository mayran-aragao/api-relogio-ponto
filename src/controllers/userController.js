const Models = require('../models/User')
const Loja = require('../models/Loja')
const { UserDash, ClassesUser, LojasUser } = require('../models/UserDash')
const { Op } = require("sequelize");
const jwt = require('jsonwebtoken')
const emailController = require('../controllers/emailController')
// const md5 = require('md5')
const crypt = require("unix-crypt-td-js");
// const { json } = require('body-parser');
const moment = require('moment');

module.exports = {
    login: async (req, res) => {
        try {
            const password = req.body.password
            const pwd = ["ZXC", "QWE", "YTR", "PLM", "VGK", "XKI", "EFH", "TYK", "RFS", "LWM"].map(a => crypt(`${String(password).toUpperCase()}\n`, a));

            const user_res = await UserDash.findOne({
                where: {
                    no_codigo: {
                        [Op.in]: pwd
                    }
                }
            })
            if (!user_res) {
                return res.json({ error: "Usuário não cadastrado" })
            }
            const { no_usuariored: nome, cd_idreg, cd_matricula, cd_setor } = user_res;

            const classes = await ClassesUser.findAll({
                where: {
                    cd_idreg
                }
            });
            const lojas = await LojasUser.findAll({
                where: {
                    cd_idreg
                }
            })
            const setor = await Models.Funcionario.findOne({
                where: {
                    matricula: cd_matricula
                }
            })
            const classes_user = classes.map(a => a.cd_classe);
            const lojas_user = lojas.map(a => a.sg_loja)

            let user = { nome: nome.trim(), cd_idreg, no_setor: setor.no_setor.trim(), matricula: cd_matricula, cd_setor: setor.cd_setor };

            const token = jwt.sign({ nome, cd_idreg, lojas: lojas_user, classes: classes_user }, process.env.JWT_KEY, { expiresIn: "1h" });

            return res.json({ error: '', token, user });
        } catch (e) {
            return res.json({ error: e })
        }

    },
    signin: async (req, res) => {
        try {
            let verify = await Models.Funcionario.findOne({
                where: {
                    [Op.and]: [{ matricula: req.body.matricula }, { dt_demissao: null }]
                }
            })
            if (!verify) {
                return res.json({ error: 'Usuário não permitido' })
            }

            let user = await Models.User.findOne({
                where: {
                    [Op.and]: [{ matricula: req.body.matricula }, { email: req.body.email }, { valido: 1 }]
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
                return res.json({ error: '', token, user })

            }
            return res.json({ error: 'Usuário não cadastrado ou bloqueado!' })

        } catch (e) {
            res.json({ error: "Impossivel logar! Verifique os dados e tente novamente mais tarde!" + e })
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
                            [Op.and]: [{ matricula: req.body.matricula }, { dt_demissao: null }]
                        }
                    })

                    if (ver_matricula) {
                        // let secret = md5(req.body.matricula + ver_matricula.cd_empresa)
                        // emailController.send_email(req.body.email, secret)
                        let loja = await Loja.findOne({
                            where: {
                                sg_loja: ver_matricula.cd_empresa
                            }
                        })
                        let user = await Models.User.create({
                            nome: (ver_matricula.nome).trim(),
                            matricula: req.body.matricula,
                            cd_empresa: ver_matricula.cd_empresa,
                            email: req.body.email,
                            valido: 3,
                            // hash: secret,
                            nr_pis: ver_matricula.nr_pis,
                            cnpj: loja.nr_cgc,
                            no_funcao: ver_matricula.no_funcao
                        })

                        return res.json({ error: '', success: 'Bem-vindo! aguarde o administrador liberar o seu acesso.' })

                    }
                    return res.json({ error: 'Matricula não encontrada' })

                }
                return res.json({ error: 'E-mail invalido' })

            })

        } catch (e) {
            return res.json({ error: "Impossivel cadastrar! Verifique os dados ou tente novamente mais tarte! " + e })
        }
    },
    add_photo: async (req, res) => {
        try {
            let user = await Models.User.findOne({
                where: {
                    matricula: req.body.matricula
                }
            })
            if (user) {
                user.foto = req.body.photo
                await user.save()
                return res.json({ error: '', success: 'Imagem salva com sucesso!' })
            }
            return res.json({ error: 'Erro ao salvar imagem' })

        } catch (e) {
            return res.json({ error: "Erro ao salvar imagem! " + e })
        }
    },
    take_photo: async (req, res) => {
        try {
            let user = await Models.User.findOne({
                where: {
                    matricula: req.body.matricula
                }
            })
            if (user.foto) {
                return res.json(user.foto)
            }
            return res.json({ error: 'Erro ao buscar imagem' })

        } catch (e) {
            return res.json({ error: 'Erro ao buscar imagem! ' + e })
        }
    },
    buscar_funcionarios: async (req, res, next) => {
        try {

            let cd_setor = req.body.setor
            let ress = await Models.Funcionario.findAll({
                where: {
                    [Op.and]: [{ cd_setor }, { dt_demissao: null }]
                }
            })

            let matriculas = ress.map(a => a.matricula)

            let res_funci = await Models.Funcionario.findAll({
                where: {
                    [Op.and]: [{ cd_setor }, { dt_demissao: null }]
                },
                include: [{
                    model: Models.User,
                    // where:{
                    //     matricula: {
                    //         [Op.in]:matriculas
                    //     }
                    // }
                }]
            })
            if (res_funci.length > 0) {
                return res.json(res_funci)
            }
            return res.json({ error: 'Nenhum funcionário encontrado!' })

        } catch (e) {
            return res.json({ error: "error" + e })
        }
    },
    save_location: async (req, res, next) => {
        try {
            let matriculas = req.body.matriculas
            let coordenadas = req.body.coordenadas

            let user = await Models.User.findAll({
                where: {
                    matricula: {
                        [Op.in]: matriculas
                    }
                }
            })
            user.map(a => a.local_permitido = coordenadas)
            await user.map(a => a.save())
            return res.json({ success: 'Localização salva' })

        } catch (e) {
            return res.json({ error: "Erro " + e })
        }
    },
    get_location: async (req, res, next) => {
        try {
            let matriculas = req.body.matriculas

            if (matriculas == '')
                return

            let user = await Models.User.findAll({
                where: {
                    matricula: {
                        [Op.in]: matriculas
                    }
                }
            })
            if (user != '') {
                return res.json({ error: '', user: user[0].local_permitido })
            }
            return res.json({ error: 'Usuário não encontrado' })

        } catch (e) {
            return res.json({ error: "Erro " + e })
        }
    },
    bloquear: async (req, res, next) => {
        try {
            let matriculas = req.body.matriculas

            let user = await Models.User.findAll({
                where: {
                    matricula: {
                        [Op.in]: matriculas
                    }
                }
            })
            if (user.length < matriculas.length) {
                return res.json({ error: 'Usuário inativo selecionado' })
            }
            user.map(a => {
                a.valido = 2
                a.init_date = null
                a.end_date = null
            })
            await user.map(a => a.save())
            return res.json({ success: 'Bloqueado com sucesso' })

        } catch (e) {
            return res.json({ error: "Erro " + e })
        }
    },
    liberar: async (req, res, next) => {
        try {
            let initDate = moment(req.body.dates[0]).format('YYYY-MM-DD')
            let endDate = moment(req.body.dates[1]).format('YYYY-MM-DD')
            let matriculas = req.body.matriculas

            let user = await Models.User.findAll({
                where: {
                    matricula: {
                        [Op.in]: matriculas
                    }
                }
            })
            if (user.length < matriculas.length) {
                return res.json({ error: 'Usuário inativo selecionado' })
            }
            user.map(a => {
                a.valido = 1
                a.init_date = initDate
                a.end_date = endDate
            })
            await user.map(a => a.save())
            return res.json({ success: 'Liberado com sucesso' })

        } catch (e) {
            return res.json({ error: "Erro " + e })
        }
    }
}