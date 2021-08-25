const jwt = require('jsonwebtoken')

module.exports = {

    validar: (req, res,next) => {
        try {
            const token = req.headers.authorization.split(' ')[1]
            console.log(`Aqui está o token: ${token}`)
            const decode =jwt.verify(token,process.env.JWT_KEY)
            console.log(`aqui está o decode: ${decode}`)
            res.json({error:"",decode})
            next();

        } catch (e){
            res.json({error:"Falha na autenticação"})
        }
    }
}