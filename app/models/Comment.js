const { Schema, model } = require("mongoose");

const CommentSchema = new Schema(
	{
		text: {
			type: String,
			required: true,
		},

		user: {
			type: Schema.Types.ObjectId,
			ref: "User",
		},

		replies: [
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
	},
	{ timestamps: true }
);

module.exports = model("Comment", CommentSchema);
