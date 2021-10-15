const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../instances/pg');
const Ponto = require('./Ponto')

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
    },
    local_permitido: {
        type: DataTypes.JSON
    }
}, {
    timestamps: false,
    tableName: "funcionario_app",
    schema:'srep'
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
        type: DataTypes.STRING,
        trim: true
    },
    cd_setor: {
        type: DataTypes.STRING
    }

}, {
    timestamps: false,
    tableName: "funcionario",
    schema:'srep'
})


Ponto.sync()
Ponto.belongsTo(Funcionario, {
    foreignKey: {
        name: 'matricula',
    },
    targetKey:'matricula'
})

Funcionario.sync()
Funcionario.hasOne(User,{
    foreignKey: {
        name: 'matricula',
    },
    targetKey:'matricula'
})


module.exports = { User, Funcionario };
