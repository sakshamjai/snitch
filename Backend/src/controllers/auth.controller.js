import userModel  from "../models/user.model.js";
import jwt from 'jsonwebtoken';
import { config } from "../config/config.js";
async function sendTokenResponse(user, res, message){
    const token = jwt.sign({id: user._id}, config.JWT_SECRET, {expiresIn: "7d"});
    res.cookie("token", token);
    return res.status(200).json({
        message,
        success: true,
        user: {
            id: user._id,
            email: user.email,
            fullname: user.fullname,
            contact: user.contact,
            role: user.role
        }
    })
}
export const registerUser = async (req, res) => {
    try {
        const {email, password, contact, fullname, isSeller} = req.body;
        const existingUser = await userModel.findOne({
            $or: [
                {email},
                {password}
            ]
        })
        if(existingUser){
            return res.status(400).json({message: "User already exists"});
        }
        const user = userModel.create({
            email,
            contact,
            password,
            fullname,
            role: isSeller ? "seller" : "buyer"
        })
        await sendTokenResponse(user, res, "User registered successfully");
    }catch(error){
        console.error(error);
        return res.status(500).json({message: "Internal server error"});
    }
}

export const loginUser = async (req, res) => {
    try{
        const {email, password} = req.body;
        const user = await userModel.findOne({
            email
        })
        if(!user){
            return res.status(404).json({message: "User not found."});
        }
        const isMatch = await user.comparePassword(password);
        if(!isMatch){
            return res.status(401).json({message: "Incorrect credentials"});
        }
        await sendTokenResponse(user, res, "User Logged in successfully");
    }catch(error){
        console.log(error);
        return res.status(500).json({message: "Internal server error"})
    }
}

export async function googleCallback(req, res) {
    console.log(req.user);
    res.redirect("http://localhost:5173");
}