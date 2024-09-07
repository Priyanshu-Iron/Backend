import { v2 as cloudinary } from 'cloudinary';
import fs from fs;

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCLOUDINARY = async (localFilePath) => {
    try {
        if (!localFilePath) return null
            // Upload the file on Cloudinary
            const response = await cloudinary.uploader.upload(localFilePath,{
                resource_type : 'auto'
            })
            // File has been uploaded successfull
            console.log("File is uploaded on Cloudinary",response.url);
            return response;
            
    } catch (error) {
        fs.unlinkSync(localFilePath) //Remove the locally saved temporary Files as the upload operation got failed
        return null;
    }
}

// Upload an image
const uploadResult = await cloudinary.uploader
.upload(
    'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
        public_id: 'shoes',
    }
)
.catch((error) => {
    console.log(error);
});

console.log(uploadResult);