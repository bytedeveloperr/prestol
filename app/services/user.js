const { notify } = require("./notification");
const UserModel = require("../models/User");
const response = require("../utils/response");
const { isEmpty, trim, escape } = require("validator");
const xss = require("xss");

module.exports = {
	toggleFollow: async (data, { io, socket }) => {
		try {
			let userToFollow = await UserModel.findOne({
				_id: data.userToFollow,
			});
			if (userToFollow) {
				let currentUser = await UserModel.findOne({
					_id: data.currentUser,
				});
				if (
					currentUser.followings.includes(data.userToFollow) &&
					userToFollow.followers.includes(data.currentUser)
				) {
					await UserModel.updateOne(
						{ _id: userToFollow },
						{ $pull: { followers: data.currentUser } }
					);
					await UserModel.updateOne(
						{ _id: currentUser },
						{ $pull: { followings: data.userToFollow } }
					);
					io.to(socket.id).emit("toggleFollow", "unfollowed");
				} else {
					await UserModel.updateOne(
						{ _id: userToFollow },
						{ $push: { followers: data.currentUser } }
					);
					await UserModel.updateOne(
						{ _id: currentUser },
						{ $push: { followings: data.userToFollow } }
					);
					io.to(socket.id).emit("toggleFollow", "followed");
					let notif = await notify({
						receiver: data.userToFollow,
						actor: data.currentUser,
						type: "userFollow",
						entity: { _id: data.currentUser },
						entityType: "user",
					});
					if (!notif.error) {
						io.to(data.userToFollow).emit(
							"newNotification",
							notif.data
						);
					}
				}
			} else {
			}
		} catch (e) {}
	},

	getUser: async (_id) => {
		try {
			let user = await UserModel.findOne({ _id })
				.populate({ path: "posts", populate: { path: "user" } })
				.exec();
			if (!user) {
				return response({
					msg: "User does not exist",
					data: "",
					error: true,
				});
			} else {
				return response({
					msg: "user fetched",
					data: user,
					error: false,
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

	getUsersToFollow: async (_id) => {
		try {
			let users = await UserModel.find({
				_id: { $ne: _id },
				followers: { $ne: _id },
			});
			return response({
				msg: "Users",
				data: users,
				error: false,
			});
		} catch (e) {
			return response({
				msg: "A server error occured, please try again " + e,
				data: "",
				error: true,
			});
		}
	},

	update: async ({ file, body, user }) => {
		let fullname = xss(trim(escape(body.fullname)));
		let bio = xss(trim(escape(body.bio)));
		let location = xss(trim(escape(body.location)));
		if (isEmpty(fullname)) {
			return response({
				msg: "Name cannot be empty",
				data: "",
				error: true,
			});
		}

		let User = {
			fullname,
			bio,
			location,
		};
		if (file) {
			User.avatar = file.path;
		}
		try {
			if (await UserModel.updateOne({ _id: user._id }, User)) {
				return response({
					msg: "User successfully updaated.",
					data: User,
					error: false,
				});
			} else {
				return response({
					msg: "A server error occured, please try again",
					data: null,
					error: true,
				});
			}
		} catch (e) {
			return response({
				msg: "A server error occured, please try again " + e,
				data: null,
				error: true,
			});
		}
	},
};
