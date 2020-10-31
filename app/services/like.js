const UserModel = require("../models/User");
const CommentModel = require("../models/Comment");
const PostModel = require("../models/Post");
const { isEmpty, trim, escape } = require("validator");
const xss = require("xss");
const { notify } = require("./notification");

module.exports = {
	toggleLike: async (data, { io, socket }) => {
		try {
			let isLiked = await PostModel.findOne({
				_id: data.postId,
				likers: data.likerId,
			});
			if (isLiked) {
				let unlike = await PostModel.updateOne(
					{ _id: data.postId },
					{ $pull: { likers: data.likerId } }
				);
				if (unlike) {
					io.to(socket.id).emit("toggleLike", "unliked");
					// io.emit("gentoggleLike", "unliked");
				} else {
					io.to(socket.id).emit(
						"likeError",
						"An error occured, please try again"
					);
				}
			} else {
				let like = await PostModel.updateOne(
					{ _id: data.postId },
					{ $push: { likers: data.likerId } }
				);
				if (like) {
					io.to(socket.id).emit("toggleLike", "liked");
					let notif = await notify({
						receiver: data.userId,
						actor: data.likerId,
						type: "postLike",
						entity: { _id: data.postId },
						entityType: "post",
					});
					if (!notif.error) {
						io.to(data.userId).emit("newNotification", notif.data);
					}
				} else {
					io.to(socket.id).emit("toggleLike", "error");
				}
			}
		} catch (e) {
			io.to(socket.id).emit("toggleLike", "error");
		}
	},
};
