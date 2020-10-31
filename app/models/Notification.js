const { Schema, model } = require("mongoose");

const NotificationSchema = new Schema(
	{
		content: {
			type: String,
			required: true,
		},

		receiver: {
			type: Schema.Types.ObjectId,
			ref: "User",
		},

		actor: {
			type: Schema.Types.ObjectId,
			ref: "User",
		},

		type: {
			type: String,
			required: true,
		},

		status: {
			type: String,
			default: "unread",
		},

		entity: {
			type: Schema.Types.ObjectId,
		},
		entityType: {
			type: String,
		},
	},
	{ timestamps: true }
);

module.exports = model("Notification", NotificationSchema);
