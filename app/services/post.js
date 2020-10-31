const response = require("../utils/response");
const { isEmpty, trim, escape } = require("validator");
const PostModel = require("../models/Post");
const UserModel = require("../models/User");
const xss = require("xss");

module.exports = {
	create: async ({ files, body, user }) => {
		let text = xss(trim(escape(body.text)));
		if (!files.image && !files.video) {
			if (isEmpty(text)) {
				return response({
					msg: "Post content is required, if image is empty",
					data: null,
					error: true,
				});
			}
		}

		let image = files.image ? files.image[0].path : "";
		let video = files.video ? files.video[0].path : "";
		let Post = new PostModel({
			text,
			image,
			video,
			user: user._id,
		});
		try {
			let post = await Post.save();
			if (post) {
				if (
					await UserModel.updateOne(
						{ _id: user._id },
						{ $push: { posts: post._id } }
					)
				) {
					return response({
						msg: "Post successfully created.",
						data: null,
						error: false,
					});
				} else {
					return response({
						msg: "A server error occured, please try again",
						data: null,
						error: true,
					});
				}
			} else {
				return response({
					msg:
						"An error occured while creating post, please try again",
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

	getFeeds: async (user) => {
		try {
			let id = user._id;
			user = await UserModel.findOne({ _id: user._id });
			if (user) {
				ids = [id, ...user.followings, ...user.followers];
			}

			let feeds = await PostModel.find({ user: ids })
				.populate("user")
				.limit(10)
				.exec();
			return response({
				msg: "feeds fetched",
				data: feeds,
				error: true,
			});
		} catch (e) {
			return response({
				msg: "A server error occured, please try again ",
				data: null,
				error: true,
			});
		}
	},

	getPost: async (_id) => {
		try {
			let post = await PostModel.findOne({ _id })
				.populate("user")
				.populate({ path: "comments", populate: { path: "user" } })
				.exec();
			if (post) {
				return response({
					msg: "post fetched",
					data: post,
					error: true,
				});
			} else {
				return response({
					msg: "post fetched",
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

	update: async ({ body, user }) => {
		if (isEmpty(body.text)) {
			return response({
				msg: "Post content is required",
				data: null,
				error: true,
			});
		}

		try {
			let post = await PostModel.findOne({ _id: body.id });
			if (post) {
				if (post.user.toString() !== user._id.toString()) {
					return response({
						msg: "You don't have permission to edit this post",
						data: null,
						error: true,
					});
				} else {
					post = await PostModel.updateOne(
						{ _id: body.id, user: user._id },
						{ text: body.text }
					);
					if (post) {
						return response({
							msg: "Post successfully updated.",
							data: null,
							error: false,
						});
					} else {
						return response({
							msg:
								"An error occured while updating post, please try again",
							data: null,
							error: true,
						});
					}
				}
			} else {
				return response({
					msg: "The post you tried to edit may have been deleted",
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

	delete: async ({ postId, user }) => {
		try {
			let post = await PostModel.findOne({ _id: postId });
			if (post) {
				if (post.user.toString() !== user._id.toString()) {
					return response({
						msg: "You don't have permission to delete this post",
						data: null,
						error: true,
					});
				} else {
					post = await PostModel.deleteOne({
						_id: postId,
						user: user._id,
					});
					if (post) {
						return response({
							msg: "Post successfully deleted.",
							data: null,
							error: false,
						});
					} else {
						return response({
							msg:
								"An error occured while deleting post, please try again",
							data: null,
							error: true,
						});
					}
				}
			} else {
				return response({
					msg:
						"The post you tried to delete may have been deleted before",
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
