const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../instances/pg')

const User = sequelize.define('funcionario_app',{
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
     }
},{
    timestamps:false,
    tableName:"funcionario_app"
})

const Funcionario = sequelize.define('funcionario',{
    matricula: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    nome: {
        type: DataTypes.STRING,
    },
    cd_empresa: {
        type: DataTypes.STRING,
    }
    
},{
    timestamps:false,
    tableName:"funcionario"
})




module.exports = {User,Funcionario};
