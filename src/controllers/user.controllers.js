import { asyncHandler } from "../utils/asynHandler.js";
import { ApiError } from "../utils/apiError.js" 
import { User } from "../models/user.models.js"
import { uploadOnCLOUDINARY } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const registerUser = asyncHandler( async(req,res) => {
    
    const {fullname, email, username, password} = req.body
    console.log("email : ", email);
    console.log("password : ", password);

    if (
        [fullname,email,username,password].some(()=>
        fied?.trim() === "")
    ) {
        throw new ApiError(400, "All Fields are required")
    }

    const existedUser = User.findOne({
        $or : [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User With email or username already exists")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avtar file is required")
    }

    const avatar = await uploadOnCLOUDINARY(avatarLocalPath)
    const coverImage = await uploadOnCLOUDINARY(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avtar file is required")
    }

    const user = await User.create({
        fullname,
        avatar : avatar.url,
        coverImage : coverImage?.url || "",
        email,
        password,
        username : username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering user")
    }

    return res.status(201).json(
        new ApiResponse (200, createdUser, "User Registered Successfully")
    )

} )

export {registerUser}