const comment = require("./comment");
const like = require("./like");
const notif = require("./notification");
const user = require("./user");

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
		socket.on("toggleLike", (data) => {
			like.toggleLike(data, { io, socket });
		});

		// listen to user follow
		socket.on("toggleFollow", (data) => {
			user.toggleFollow(data, { io, socket });
		});

		socket.on("markNotifAsRead", (id) => {
			notif.markNotifAsRead(id);
		});
	});
};
