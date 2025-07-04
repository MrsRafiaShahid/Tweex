const errorHandler =async(err,req,res,next)=>{
    console.error(err.stack);
    console.log(err);
    if(err instanceof CustomError){
        return res.status(err.status).json({message:err.message});
    }
    res.status(500).json({message:err.message});
}
class CustomError extends Error{
    constructor(message,status=500){
        super(message);
        this.name=this.constructor.name;
        this.status=status;
        Error.captureStackTrace(this,this.constructor);
    }
}
export {errorHandler,CustomError}; 