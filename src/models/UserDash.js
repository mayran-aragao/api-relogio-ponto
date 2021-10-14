const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../instances/pg')

const UserDash = sequelize.define('identifica', {
    no_codigo: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    cd_idreg: {
        type: DataTypes.INTEGER,
    },
    no_usuariored: {
        type: DataTypes.STRING,
    },
    cd_matricula:{
        type: DataTypes.INTEGER,
    },
    sg_loja:{
        type: DataTypes.STRING,
    },
}, {
    timestamps: false,
    tableName: "identifica"
})
const ClassesUser = sequelize.define('identifica_classe', {
    cd_idreg: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    cd_classe: {
        type: DataTypes.STRING,
    }

}, {
    timestamps: false,
    tableName: "identifica_classe"
})
const LojasUser = sequelize.define('identifica_loja', {
    cd_idreg: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    sg_loja: {
        type: DataTypes.STRING,
    }

}, {
    timestamps: false,
    tableName: "identifica_loja"
})




module.exports = { UserDash, ClassesUser,LojasUser };
