const jsonwebtoken = require("jsonwebtoken");

exports.checkAuth = async (req,res,next)=>{
    try {
        const token = req.headers.authorization;

        if(!token || !token.startsWith("Bearer ")){
            return res.status(401).json({
                success:false,
                message:"Token is Missing or Malformed!",
            })
        }

        const actualToken = token.split(" ")[1];
        const decoded = jsonwebtoken.verify(actualToken, process.env.JWT_SECRET);

        req.user = decoded;
        next();

    } catch (error) {
        console.log(error);
        return res.status(401).json({
            success:false,
            message:"Invalid or Expired Token!",
        })
    }
}