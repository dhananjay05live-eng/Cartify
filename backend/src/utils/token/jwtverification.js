import jwt from "jsonwebtoken";

const verifyAccessToken = (req,res,next)=>{
try {
        const token = req.cookies?.accessToken;

        if(!token){
            return res
                    .status(401)
                    .json({
                        "message":"unauthorized request"
                    });
        }
    
        req.user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        next();
} catch (error) {
    console.log("verification failed!",error);

    return res
            .status(401)
            .json({
                "message":"invalid token"
            });
}
}

const verifyRefreshToken = (req,res,next)=>{
    try {
        const token = req.cookies?.refreshToken;
        if(!token){
            return res
                    .status(401)
                    .json({"message":"unauthorized request"})
        }
        req.user = jwt.verify(token,process.env.REFRESH_TOKEN_SECRET);
        next();
    } catch (error) {
        console.log("verification failed!",error);

        return res
                .status(401)
                .json({"message":"invalid token"});
    }
}

export {verifyAccessToken,verifyRefreshToken};