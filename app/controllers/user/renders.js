const notificationService = require("../../services/notification");
const userService = require("../../services/user");

module.exports = {
	profile: async (req, res) => {
		let notifs = await notificationService.getNotifications(req.user._id);
		let user = await userService.getUser(req.params.id);
		let usersToFollow = await userService.getUsersToFollow(req.user._id);

		let data = {
			title: user.data.fullname,
			currentUser: req.user,
			csrf: req.csrfToken(),
			user: user.data,
			notifsCount: notifs.data ? notifs.data.length : 0,
			usersToFollow: usersToFollow.data,
		};

		res.render("user/profile", data);
	},

	connections: async (req, res) => {
		let notifs = await notificationService.getNotifications(req.user._id);
		let users = await userService.getConnections(
			req.params.type,
			req.user._id
		);
		console.log(users);
		let usersToFollow = await userService.getUsersToFollow(req.user._id);

		let data = {
			title: req.params.type,
			currentUser: req.user,
			csrf: req.csrfToken(),
			users: users.data,
			notifsCount: notifs.data ? notifs.data.length : 0,
			usersToFollow: usersToFollow.data,
		};

		res.render("user/connections", data);
	},
};
