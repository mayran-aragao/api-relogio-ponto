const Ponto = require('../models/Ponto')
const { Op } = require("sequelize");

module.exports = {
    buscar_ponto: async (req,res, next) => {
        try{
            let pontos = await Ponto.findOne({
                where: {
                    matricula: req.body.matricula,
                    dt_ponto: req.body.dt_ponto
                }
              } )
            res.json({error:'',pontos})
        }catch(e) {
            console.log({error:"Aconteceu um erro ao buscar ponto"})
        }
    },
    buscar_periodo: async (req,res,next) => {
        try {
            console.log("entrou aqui no controler do ponto")
            let pontos = await Ponto.findAll({
                where: {
                    matricula:req.body.matricula,
                    dt_ponto:{
                        [Op.between]:[req.body.startDate,req.body.endDate]
                    }
                }
            })
            if(pontos.length > 0){
               return res.json({error:'',pontos})
            }
            return res.json({error:'Nenhum registro encontrado!'})

        }catch(e) {
            return res.json({error:"Registro não encontrado"})
        }
    },
    registrar: async (req,res) => {
        
    }
}