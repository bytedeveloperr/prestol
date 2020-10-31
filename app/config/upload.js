const multer = require("multer");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

// const diskStorage = multer.diskStorage({
// 	filename: (req, file, callback) => {
// 		callback(null, `${Date.now()}-${file.originalname}`);
// 	},

// 	destination: (req, file, callback) => {
// 		let image = [".jpg", ".png", ".jpeg", ".gif"];
// 		let video = [".mp4"];
// 		if (image.includes(path.extname(file.originalname))) {
// 			callback(null, path.join(__dirname, "../../public/uploads/images"));
// 		} else {
// 			callback(null, path.join(__dirname, "../../public/uploads/videos"));
// 		}
// 	},
// });

const storage = new CloudinaryStorage({
	cloudinary: cloudinary,
	params: {
		folder: async (req, file, callback) => {
			let image = [".jpg", ".png", ".jpeg", ".gif"];
			let video = [".mp4"];
			if (image.includes(path.extname(file.originalname))) {
				return "prestol/images";
			} else {
				return "prestol/videos";
			}
		},
		// public_id: (req, file) => "computed-filename-using-request",
	},
});

module.exports = multer({ storage: storage });
