const jwt = require('jsonwebtoken')

module.exports = {

    validar: (req, res,next) => {
        try {
            const token = req.headers.authorization.split(' ')[1]
            const decode =jwt.verify(token,process.env.JWT_KEY)
            res.json({error:"",user: decode})

        } catch (e){
            res.json({ error: "Falha na autenticação", codigo:403 })
        }
    }
}