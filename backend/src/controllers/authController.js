const jwt = require("jsonwebtoken");

exports.login = async(req, res) => {
    const {email, password} = req.body;
    //verification utilisateur (MongoDb)
    const user =await User.findOne({email});
    if(!user) return res.status(401).json({message: "Erreur"});

    const token = jwt.sign(
        {userid: user._id},
        process.env.JWT_SECRET,
        {expiresIn:"Id"}
    );
    res.json({token});
}