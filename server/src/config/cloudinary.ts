// Cloudinary api setup

import { type UploadApiResponse, v2 as cloudinary } from "cloudinary";
import { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_CLOUD_NAME } from "./config";

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (fileBuffer: Buffer, originalFilename: string): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          resource_type: "auto",
          filename_override: originalFilename,
        },
        (error, result) => {
          if (error) {
            console.error("Error uploading file to Cloudinary:", error);
            reject(error);
          } else if (result) {
            console.log("File uploaded to Cloudinary", result.url);
            resolve(result);
          } else {
            reject(new Error("Error uploading file to Cloudinary"));
          }
        },
      )
      .end(fileBuffer);
  });
};

export { uploadOnCloudinary };
