const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../instances/pg')

const Loja = sequelize.define('loja',{
    
    sg_loja: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    nr_cgc: {
        type: DataTypes.STRING
    },

},{
    timestamps:false,
    tableName:"loja"
}
)

module.exports = Loja;