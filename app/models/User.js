const { Schema, model } = require("mongoose");

const UserSchema = new Schema(
	{
		fullname: {
			type: String,
			required: true,
		},

		email: {
			type: String,
			required: true,
		},

		password: {
			type: String,
			required: true,
		},

		gender: {
			type: String,
			required: true,
		},

		location: {
			type: String,
			required: false,
		},

		avatar: {
			type: String,
			default:
				"https://res.cloudinary.com/bytedeveloper/image/upload/v1604152094/prestol/images/default-avatar_fqt2bh.png",
		},

		dob: {
			type: String,
			required: false,
		},

		bio: {
			type: String,
			required: false,
		},

		notifications: [
			{
				type: Schema.Types.ObjectId,
				ref: "Notification",
			},
		],

		posts: [
			{
				type: Schema.Types.ObjectId,
				ref: "Post",
			},
		],

		comments: [
			{
				type: Schema.Types.ObjectId,
				ref: "Comment",
			},
		],

		followings: [
			{
				type: Schema.Types.ObjectId,
				ref: "User",
			},
		],

		followers: [
			{
				type: Schema.Types.ObjectId,
				ref: "User",
			},
		],
	},
	{ timestamps: true }
);

module.exports = model("User", UserSchema);
