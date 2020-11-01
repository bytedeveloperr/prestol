const comment = require("./comment");
const like = require("./like");
const notif = require("./notification");
const user = require("./user");
const post = require("./post");

module.exports = (io) => {
	io.on("connection", (socket) => {
		//initiate user and join channel
		socket.on("initiateUser", (userid) => {
			socket.join(userid);
		});

		// listen to create comment
		socket.on("createComment", (data) => {
			comment.create(data, { io, socket });
		});

		// listen to delete comment
		socket.on("deleteComment", (data) => {
			comment.delete(data, { io, socket });
		});

		// listen to post like
		socket.on("togglePostLike", (data) => {
			like.togglePostLike(data, { io, socket });
		});

		// listen to comment like
		socket.on("toggleCommentLike", (data) => {
			like.toggleCommentLike(data, { io, socket });
		});

		// listen to user follow
		socket.on("toggleFollow", (data) => {
			user.toggleFollow(data, { io, socket });
		});

		// listen to user follow
		socket.on("sharePost", (data) => {
			post.sharePost(data, { io, socket });
		});

		socket.on("markNotifAsRead", (id) => {
			notif.markNotifAsRead(id);
		});
	});
};
