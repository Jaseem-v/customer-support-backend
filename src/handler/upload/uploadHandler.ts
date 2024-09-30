import { GetObjectCommand, PutObjectCommand, PutObjectCommandOutput, S3 } from "@aws-sdk/client-s3";
import { ReadStream } from "fs";
import path from "path";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { uid } from "uid";
const multer = require("multer");
const multerS3 = require("multer-s3");
const { S3Client } = require("@aws-sdk/client-s3");

// create s3 instance using S3Client 
// (this is how we create s3 instance in v3)
const s3Client = new S3Client({
    credentials: {
        accessKeyId: process.env.S3_ACCESSKEY, // store it in .env file to keep it safe
        secretAccessKey: process.env.S3_SECRETKEY,
    },
    region: process.env.S3_BUCKET_REGION // this is the region that you select in AWS account
})




// const s3Storage = multerS3({
//     s3: s3, // s3 instance
//     bucket: "my-images", // change it as per your project requirement
//     acl: "public-read", // storage access type
//     metadata: (req, file, cb) => {
//         cb(null, { fieldname: file.fieldname })
//     },
//     key: (req, file, cb) => {
//         const fileName = Date.now() + "_" + file.fieldname + "_" + file.originalname;
//         cb(null, fileName);
//     }
// });


// // function to sanitize files and send error for unsupported files
// function sanitizeFile(file, cb) {
//     // Define the allowed extension
//     const fileExts = [".png", ".jpg", ".jpeg", ".gif"];

//     // Check allowed extensions
//     const isAllowedExt = fileExts.includes(
//         path.extname(file.originalname.toLowerCase())
//     );

//     // Mime type must be an image
//     const isAllowedMimeType = file.mimetype.startsWith("image/");

//     if (isAllowedExt && isAllowedMimeType) {
//         return cb(null, true); // no errors
//     } else {
//         // pass error msg to callback, which can be displaye in frontend
//         cb("Error: File type not allowed!");
//     }
// }

// // our middleware
// export const uploadImage = multer({
//     storage: s3Storage,
//     fileFilter: (req, file, callback) => {
//         sanitizeFile(file, callback)
//     },
//     limits: {
//         fileSize: 1024 * 1024 * 2 // 2mb file size
//     }
// })


function getFileExtension(filename: string) {
    const index = filename.lastIndexOf('.');
    if (index === -1) {
        return ''; // No extension found
    }
    return filename.substring(index + 1);
}




export const uploadFileToS3 = (
    file: Buffer | string | ReadStream,
    key: string,
    mimetype: string
) => {
    return new Promise<{ message: string; data: string }>(
        async (resolve, reject) => {
            try {

                const newkey = uid(32) + '.' + getFileExtension(key)
                const uploadParams = {
                    Bucket: process.env.S3_BUCKET_NAME,
                    Body: file,
                    Key: newkey,
                    ContentType: mimetype,
                };
                


                const s3 = new S3({
                    credentials: {
                        accessKeyId: process.env.S3_ACCESSKEY, // store it in .env file to keep it safe
                        secretAccessKey: process.env.S3_SECRETKEY,
                    },
                    region: process.env.S3_BUCKET_REGION // this is the region that you select in AWS account
                })


                const result = await s3.putObject(uploadParams);

                // const uploadResponse = await s3Client.send(
                //     new PutObjectCommand(uploadParams)
                // );


                const fileUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.S3_BUCKET_REGION}.amazonaws.com/${newkey}`;




                resolve({
                    message: "Image Uploaded Successfully",
                    data: fileUrl,
                });
            } catch (error: any) {
                console.log(error);
                return reject({
                    message: error.message || error.msg,
                    code: error.code || error.name,
                });
            }
        }
    );
};