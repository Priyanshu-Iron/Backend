const asyncHandler = (requestHandler)=>{
    (req,res,next)=>{
        Promise.resolve(req,res,next).catch((err)=>{err})
    }
}


export{asyncHandler}