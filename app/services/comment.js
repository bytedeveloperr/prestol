const UserModel = require("../models/User");
const CommentModel = require("../models/Comment");
const PostModel = require("../models/Post");
const { isEmpty, trim, escape } = require("validator");
const xss = require("xss");
const { notify } = require("./notification");

module.exports = {
	create: async (data, { io, socket }) => {
		let text = xss(trim(escape(data.comment)));
		if (isEmpty(text)) {
			socket.emit("commentError", "Comment cannot be empty");
		} else {
			try {
				let Comment = new CommentModel({
					text,
					user: data.userId,
				});
				let comment = await Comment.save();
				if (comment) {
					let post = await PostModel.updateOne(
						{ _id: data.postId },
						{ $push: { comments: comment._id } }
					);
					if (post) {
						let user = await UserModel.updateOne(
							{ _id: data.userId },
							{ $push: { comments: comment._id } }
						);
						if (user) {
							comment = await CommentModel.findOne({
								_id: comment._id,
							})
								.populate("user")
								.exec();
							io.to(socket.id).emit(
								"commentSuccess",
								"Comment posted successfully"
							);
							io.emit("postComment", comment);
							let notif = await notify({
								receiver: data.posterId,
								actor: data.userId,
								type: "postComment",
								entity: { _id: data.postId },
								entityType: "post",
							});
							if (!notif.error) {
								io.to(data.userId).emit(
									"newNotification",
									notif.data
								);
							}
						} else {
							io.to(socket.id).emit(
								"commentError",
								"An error occured while posting your comment, please try again"
							);
						}
					} else {
						io.to(socket.id).emit(
							"commentError",
							"An error occured while posting your comment, please try again"
						);
					}
				} else {
					io.to(socket.id).emit(
						"commentError",
						"An error occured while posting your comment, please try again"
					);
				}
			} catch (e) {
				console.log(e);
				io.to(socket.id).emit(
					"commentError",
					"A server error occured, please try again"
				);
			}
		}
	},

	delete: async (data, { io, socket }) => {
		try {
			let comment = await CommentModel.findOne({ _id: data.commentId });
			if (comment) {
				if (comment.user._id.toString() === data.userId.toString()) {
					comment = await CommentModel.deleteOne({
						_id: data.commentId,
					});
					if (comment) {
						socket.emit("commentDeleteSuccess", comment);
						await UserModel.updateOne(
							{ _id: data.userId },
							{ $pull: { comments: data.commentId } }
						);
						await PostModel.updateOne(
							{ _id: data.postId },
							{ $pull: { comments: data.commentId } }
						);
					} else {
						io.to(socket.id).emit(
							"commentDeleteError",
							"An error occured while deleting comment, please try again"
						);
					}
				} else {
					io.to(socket.id).emit(
						"commentDeleteError",
						"You do not have permission to delete this comment"
					);
				}
			} else {
				io.to(socket.id).emit(
					"commentDeleteError",
					"An error occured while deleting comment, please try again"
				);
			}
		} catch (e) {
			io.to(socket.id).emit(
				"commentDeleteError",
				"An server error occured, please try again"
			);
		}
	},
};
