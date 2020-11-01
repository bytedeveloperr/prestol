const UserModel = require("../models/User");
const NotificationModel = require("../models/Notification");
const response = require("../utils/response");

module.exports = {
	notify: async (data) => {
		try {
			let actor = await UserModel.findOne({ _id: data.actor });

			if (actor._id.toString() !== data.receiver.toString()) {
				if (data.type == "postLike") {
					data.content = `${actor.fullname} liked your post.`;
				} else if (data.type == "userFollow") {
					data.content = `${actor.fullname} followed you`;
				} else if (data.type == "postShare") {
					data.content = `${actor.fullname} shared your post`;
				} else if (data.type == "postComment") {
					data.content = `${actor.fullname} commented your post`;
				} else if (data.type == "commentLike") {
					data.content = `${actor.fullname} liked your comment`;
				}

				let Notification = new NotificationModel(data);
				Notification = await Notification.save();
				if (Notification) {
					if (
						await UserModel.updateOne(
							{ _id: data.receiver },
							{ $push: { notifications: Notification._id } }
						)
					) {
						return response({
							msg: "User Notified",
							data: Notification,
							error: false,
						});
					} else {
						return response({
							msg: "Error, updating User Notified",
							data: Notification,
							error: true,
						});
					}
				} else {
					return response({
						msg: "An error occured",
						data: "",
						error: true,
					});
				}
			} else {
				return response({
					msg: "cannot notify an actor",
					data: "",
					error: true,
				});
			}
		} catch (e) {
			return response({
				msg: "A server error occured, please try again",
				data: "",
				error: true,
			});
		}
	},

	getNotifications: async (_id) => {
		try {
			let notifs = await NotificationModel.find({
				receiver: _id,
			}).populate("actor");
			return response({ msg: "", data: notifs, error: false });
		} catch (e) {
			return response({
				msg: "A server error occured, please try again",
				data: "",
				error: true,
			});
		}
	},
	markNotifAsRead: async (_id) => {
		try {
			let notifs = await NotificationModel.deleteOne({ _id });
			return response({ msg: "", data: notifs, error: false });
		} catch (e) {
			return response({
				msg: "A server error occured, please try again",
				data: "",
				error: true,
			});
		}
	},
};
