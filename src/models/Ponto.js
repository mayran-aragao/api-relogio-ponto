const { Sequelize, DataTypes } = require('sequelize');
const { Funcionario } = require('../models/User')
const sequelize = require('../instances/pg')

const Ponto = sequelize.define('pontorep', {
    cd_chave: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    cd_empresa: {
        type: DataTypes.STRING
    },
    nr_cgc: {
        type: DataTypes.STRING
    },
    nr_rep: {
        type: DataTypes.STRING
    },
    matricula: {
        type: DataTypes.INTEGER,
        
    },
    dt_ponto: {
        type: DataTypes.DATE
    },
    hr_ponto: {
        type: DataTypes.STRING
    },
    nsr: {
        type: DataTypes.STRING
    },
    nr_pis: {
        type: DataTypes.STRING
    },
    localizacao: {
        type: DataTypes.JSON
    },
    autorizante: {
        type: DataTypes.INTEGER
    }

}, {
    timestamps: false,
    tableName: "pontorep",
    schema:'srep'
})




module.exports = Ponto;
