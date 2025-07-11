import User from "../models/User.js"
import jwt from "jsonwebtoken";
import { CustomError } from "./error.js";

export const protectRoute =async(req,res,next)=>{
    try{
        const token = req.cookies.token;
        if(!token){
            throw new CustomError("Unauthorized: No Token Provided",401);
        }
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        if(!decoded){
            throw new CustomError("Unauthorized: Invalid Token",401);
        }
        const user = await User.findById(decoded.userId).select("-password");
        if(!user){
        throw new CustomError("User not found",404);
        }
        req.user = user;
        next();
    }catch(err){
        console.error("Error in protectRoute middleware:", err);
        if (err instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ message: "Unauthorized: Invalid Token" });
        }
        if (err instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ message: "Unauthorized: Token Expired" });
        }
        if (err instanceof CustomError) {
            return res.status(err.status).json({ message: err.message });
        }
        next(err);
    }
 
}