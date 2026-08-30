import { v2 as cloudinary } from 'cloudinary'
import fs from "fs";

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
  });

  const uploadImageOnCloudinary = async (LocalimagePath) => {
  
      // Use the uploaded file's name as the asset's public ID and 
      // allow overwriting the asset with new versions
    
  
      try {
        // Upload the image
        const result = await cloudinary.uploader.upload(LocalimagePath);
        return {
          publicId: result.public_id,
          url: result.secure_url
      };
      } catch (error) {
        
        console.error("Cloudinary upload failed!");
        console.error("message:", error.message);
        console.error("http code:", error.http_code);
        console.error("name:", error.name);
        console.error("full error:", error);
        throw error
      }
      finally{
        if(fs.existsSync(LocalimagePath)){
          fs.unlinkSync(LocalimagePath);
        }
      }
  };

export {uploadImageOnCloudinary};