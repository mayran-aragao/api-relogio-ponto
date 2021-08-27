const Models = require('../models/User')

exports.home = async (req, res) => {
    try {
        let user = await Models.User.findOne({
            where: {
                hash: req.params.hash
            }
        })
        if (user) {

            user.valido = true,
            user.hash = "",
            await user.save()
            res.render('pages/page')
        } else {
            res.render('pages/erro')
        }



    } catch (e) {
        res.json({ error: "Falha na verificação dos dados" })
        res.render('pages/erro')
    }
    
}
