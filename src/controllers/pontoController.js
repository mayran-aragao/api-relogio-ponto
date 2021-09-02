const Ponto = require('../models/Ponto')
const { Op } = require("sequelize");

module.exports = {
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
                return res.json( pontos )
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
            console.log(req.body.cd_chave)
            let ponto = await Ponto.create({
                cd_chave: req.body.cd_chave,
                cd_empresa: req.body.cd_empresa,
                nr_cgc: req.body.nr_cgc,
                nr_rep: req.body.nr_rep,
                matricula: req.body.matricula,
                dt_ponto: req.body.dt_ponto,
                hr_ponto: req.body.hr_ponto,
                nsr: req.body.nsr,
                nr_pis: req.body.nr_pis,
                localizacao: req.body.location
            })
            if (ponto)
                return res.json({ error: '', success: 'Ponto registrado com sucesso', ponto })
            return res.json({ error: 'Aconteceu um erro ao registrar o ponto! Procure a TI. ' })
        } catch (e) {
            return res.json({ error: "Falha ao salvar batida, tente novamente! " + e })
        }
    }
}