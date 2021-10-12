const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../instances/pg')

const User = sequelize.define('funcionario_app', {
    matricula: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    nome: {
        type: DataTypes.STRING,
    },
    cd_empresa: {
        type: DataTypes.STRING,
    },
    email:
    {
        type: DataTypes.STRING,
    },
    valido:
    {
        type: DataTypes.BOOLEAN,
    },
    hash:
    {
        type: DataTypes.STRING
    },
    nr_pis: {
        type: DataTypes.STRING
    },
    cnpj: {
        type: DataTypes.STRING
    },
    foto: {
        type: DataTypes.JSON
    },
    no_funcao: {
        type: DataTypes.STRING
    }
}, {
    timestamps: false,
    tableName: "funcionario_app"
})

const Funcionario = sequelize.define('funcionario', {
    matricula: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    nome: {
        type: DataTypes.STRING,
    },
    cd_empresa: {
        type: DataTypes.STRING,
    },
    nr_pis: {
        type: DataTypes.STRING
    },
    dt_demissao: {
        type: DataTypes.DATE
    },
    no_funcao: {
        type: DataTypes.STRING
    },
    no_setor: {
        type: DataTypes.STRING
    }

}, {
    timestamps: false,
    tableName: "funcionario"
})




module.exports = { User, Funcionario };
