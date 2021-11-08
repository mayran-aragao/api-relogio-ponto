const Ponto = require('../models/Ponto')
const Models = require('../models/User')
const { Op } = require("sequelize");
var moment = require('moment');

module.exports = {
    buscar_todos: async (req, res, next) => {
        try {

            let cd_setor = req.body.setor
            let res_funci = await Models.Funcionario.findAll({
                where: {
                    [Op.and]: [{ cd_setor }, { dt_demissao: null }]
                }
            })
            let funcionarios = res_funci.map(a => a.matricula)
            let matriculas = funcionarios
            funcionarios = funcionarios.map(a => {
                a = ("00000000000000000" + a).slice(-17)
                return a
            })

            let registros = await Ponto.findAll({
                where: {
                    nr_rep: {
                        [Op.in]: funcionarios
                    }
                },
                include: [{
                    model: Models.Funcionario,
                    where: {
                        matricula: {
                            [Op.in]: matriculas
                        }
                    }
                }]
            })

            if (registros.length > 0) {
                return res.json(registros)
            }
            return res.json({ error: 'Nenhum registro encontrado!' })

        } catch (e) {
            return res.json({ error: "Registro não encontrado" })
        }
    },
    buscar_periodo: async (req, res, next) => {
        try {
            let pontos = await Ponto.findAll({
                where: {
                    matricula: req.body.matricula,
                    dt_ponto: {
                        [Op.between]: [req.body.startDate, req.body.endDate]
                    }
                }
            })
            if (pontos.length > 0) {
                return res.json(pontos)
            }
            return res.json({ error: 'Nenhum registro encontrado!' })

        } catch (e) {
            return res.json({ error: "Registro não encontrado" })
        }
    },
    buscar_nsr: async (req, res) => {
        try {
            let ponto = await Ponto.findOne({
                where: {
                    dt_ponto: {
                        [Op.lte]: req.body.dt_ponto,
                    },
                    nr_rep: req.body.nr_rep
                }
            })
            return res.json({ "nsr": ponto?.nsr || "0" })

        } catch (e) {
            return res.json({ error: "falha ao encontrar nsr contate a TI! " + e })
        }
    },
    salvar_ponto: async (req, res) => {
        try {
            let user = await Models.User.findOne({
                where: {
                    matricula: req.body.matricula
                }
            })

            let init_timestamp = new Date(user.init_date)
            let end_timestamp = new Date(user.end_date)
            let dt_ponto_timestamp = new Date(req.body.dt_ponto)

            if (dt_ponto_timestamp.getTime() >= init_timestamp.getTime() && dt_ponto_timestamp.getTime() <= end_timestamp.getTime()) {
                let ponto = await Ponto.create({
                    cd_empresa: req.body.cd_empresa,
                    nr_cgc: req.body.nr_cgc,
                    nr_rep: req.body.nr_rep,
                    matricula: req.body.matricula,
                    dt_ponto: req.body.dt_ponto,
                    hr_ponto: req.body.hr_ponto,
                    nsr: req.body.nsr,
                    nr_pis: req.body.nr_pis,
                    localizacao: req.body.location,
                    autorizante:req.body.autorizante
                })
                if (ponto)
                    return res.json({ error: '', success: 'Ponto registrado com sucesso', ponto })
            } else {
                return res.json({ error: 'Fora do período permitido!' })
            }
            return res.json({ error: 'Aconteceu um erro ao registrar o ponto! Procure a TI. ' })
        } catch (e) {
            return res.json({ error: "Falha ao salvar batida! " + e })
        }
    }
}