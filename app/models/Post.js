const { Schema, model } = require("mongoose");

const PostSchema = new Schema(
	{
		text: {
			type: String,
		},

		image: {
			type: String,
		},

		video: {
			type: String,
		},

		type: {
			type: String,
			default: "original",
		},

		original: {
			type: Schema.Types.ObjectId,
			ref: "Post",
		},

		user: {
			type: Schema.Types.ObjectId,
			ref: "User",
		},

		comments: [
			{
				type: Schema.Types.ObjectId,
				ref: "Comment",
			},
		],

		likers: [
			{
				type: Schema.Types.ObjectId,
				ref: "User",
			},
		],

		shares: [
			{
				type: Schema.Types.ObjectId,
				ref: "User",
			},
		],
	},
	{ timestamps: true }
);

module.exports = model("Post", PostSchema);
