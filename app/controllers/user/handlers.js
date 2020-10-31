const service = require("../../services/user");

module.exports = {
	update: async (req, res) => {
		let data = {
			file: req.file,
			body: req.body,
			user: req.user,
		};
		let response = await service.update(data);
		if (response.error) {
			req.flash("error", response.msg);
			res.redirect(`/user/${req.params.id}`);
		} else {
			req.flash("success", response.msg);
			res.redirect(`/user/${req.params.id}`);
		}
	},
};
