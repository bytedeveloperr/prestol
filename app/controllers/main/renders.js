const postService = require("../../services/post");
const notificationService = require("../../services/notification");
const userService = require("../../services/user");
const { format } = require("timeago.js");

module.exports = {
	home: async (req, res) => {
		let feeds = await postService.getFeeds(req.user);
		let notifs = await notificationService.getNotifications(req.user._id);
		let usersToFollow = await userService.getUsersToFollow(req.user._id);

		let data = {
			title: "Home",
			currentUser: req.user,
			csrf: req.csrfToken(),
			posts: feeds.data.reverse(),
			notifsCount: notifs.data ? notifs.data.length : 0,
			usersToFollow: usersToFollow.data,
		};
		res.render("index", data);
	},

	notifs: async (req, res) => {
		let notifs = await notificationService.getNotifications(req.user._id);
		let usersToFollow = await userService.getUsersToFollow(req.user._id);

		let data = {
			title: "Notifications",
			currentUser: req.user,
			csrf: req.csrfToken(),
			notifs: notifs.data.reverse(),
			notifsCount: notifs ? notifs.data.length : 0,
			usersToFollow: usersToFollow.data,
		};
		res.render("notifs", data);
	},

	logout: (req, res) => {
		req.session.auth = null;
		req.session.user = null;
		res.redirect("/login");
	},
};
