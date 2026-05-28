import userModel from '../models/user.model.js';
import { config } from '../config/config.js';
import jwt from 'jsonwebtoken';

const authenticateSeller = async (req,res,next) => {
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({error: "Unauthorized"});
    }

    try{
        const decoded = jwt.verify(token, config.JWT_SECRET);

        const user = await userModel.findById(decoded.id);
        if(!user){
            return res.status(401).json({
                error: "Unauthorized"
            })
        }

        if(user.role != "seller"){
            return res.status(403).json({
                error: "Forbidden"
            })
        }
        req.user = user;
        next();
    }
    catch(error){
        return res.status(401).json({
            error: "Unauthorized"
        })
    }
}

export default authenticateSeller;