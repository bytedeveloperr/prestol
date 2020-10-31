const service = require("../../services/auth");

module.exports = {
	signup: async (req, res) => {
		let response = await service.signup(req.body);
		if (response.error) {
			req.flash("error", response.msg);
			res.redirect("/signup");
		} else {
			req.session.auth = true;
			req.session.user = response.data;
			if (req.query.next) {
				res.redirect(req.query.next);
			} else {
				res.redirect(`/user/${response.data._id}`);
			}
		}
	},

	login: async (req, res) => {
		let response = await service.login(req.body);
		if (response.error) {
			req.flash("error", response.msg);
			res.redirect("/login");
		} else {
			req.session.auth = true;
			req.session.user = response.data;
			if (req.query.next) {
				res.redirect(req.query.next);
			} else {
				res.redirect("/");
			}
		}
	},
};
