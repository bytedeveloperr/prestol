const postService = require("../../services/post");
const notificationService = require("../../services/notification");
const userService = require("../../services/user");

module.exports = {
	show: async (req, res) => {
		let post = await postService.getPost(req.params.id);
		let notifs = await notificationService.getNotifications(req.user._id);
		let usersToFollow = await userService.getUsersToFollow(req.user._id);

		if (post.data == null) {
			return res.send("post does not exist");
		} else {
			let data = {
				title: "Home",
				currentUser: req.user || null,
				csrf: req.csrfToken(),
				post: post.data,
				notifsCount: notifs.data ? notifs.data.length : 0,
				usersToFollow: usersToFollow.data,
			};

			return res.render("post/show", data);
		}
	},
};
