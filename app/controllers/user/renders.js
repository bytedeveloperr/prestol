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
};
