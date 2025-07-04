import User from "../models/User.js"
import jwt from "jsonwebtoken";
import { CustomError } from "./error.js";

export const protectRoute =async(req,res,next)=>{
    try{
        // const token = req.headers.authorization?.split(" ")[1];
        const token = req.cookies.token;
        if(!token){
            // return res.status(401).json({error:"Unauthorized: No Token Provided"})
            throw new CustomError("Unauthorized: No Token Provided",401);
        }
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        if(!decoded){
            // return res.status(401).json({error:"Unauthorized: Invalid Token"});
            throw new CustomError("Unauthorized: Invalid Token",401);
        }
        const user = await User.findById(decoded.userId).select("-password");
        if(!user){
        //    return res.status(404).json({message:"User not found"});
        throw new CustomError("User not found",404);
        }
        req.user = user;
        next();
    }catch(err){
        next(err);
    }
 
}